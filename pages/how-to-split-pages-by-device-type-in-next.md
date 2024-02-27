# How to split pages by device type in Next.js

_February 27, 2024_

We work with complex applications that use different content layouts for mobile and desktop devices. Some desktop components also differ from mobile ones and vice versa, so it would be great to avoid including components for one device type in the bundle for another. How can we separate pages for mobile devices, desktop, etc., but still open them with the same URLs?

In a Next.js application, you can achieve this using [middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware), request headers, and [rewrites](https://nextjs.org/docs/app/api-reference/next-config-js/rewrites). The principle of operation is that the user's request enters the middleware, where determined from which device they came from, and after exiting the middleware, the application returns the necessary page.

First, create the structure of the page files within the [app directory](https://nextjs.org/docs/app/building-your-application/routing). Store pages for each device type in a folder with the corresponding name.

```raw
├─ app/
│  │
│  ├─ desktop/
│  │  ├─ profile/
│  │  │  └─ page.tsx
│  │  └─ page.tsx
│  │
│  ├─ mobile/
│  │  ├─ profile/
│  │  │  └─ page.tsx
│  │  └─ page.tsx
│  │
│  └─ layout.tsx
│
├─ middleware.ts
├─ next.config.js
```

A user who comes to the main page of the application from a mobile device should get `app/mobile/page.tsx`, and the other one who comes from a laptop should get `app/desktop/page.tsx`.

## Option #1 – Rewrite in middleware

Determine the device type and rewrite request in the middleware, as Next.js execute the middleware on every request before call the page.

```ts
import {NextResponse} from 'next/server'
import type {NextRequest} from 'next/server'
import {getDeviceType} from 'utils/device'

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
}

export function middleware(request: NextRequest): NextResponse {
  const deviceType = getDeviceType(request)
  const {pathname} = new URL(request.url)

  return NextResponse.rewrite(new URL(`/${deviceType}${pathname}`, request.url))
}
```

The example above is quite simple and limited by the specified matcher to ignore API and static file requests in the middleware. If you plan to use the middleware for all requests, you will need to wrap rewrites in some amount of conditions, which will complicate the logic.

## Options #2 – Rewrite in `next.config.js`

Another way is to define rewrites in Next.js configuration file. Detect the device type in the middleware, then add the type to the request headers.

```ts
import {NextResponse} from 'next/server'
import type {NextRequest} from 'next/server'
import {getDeviceType} from 'utils/device'

export function middleware(request: NextRequest): NextResponse {
  const deviceType = getDeviceType(request)
  const headers = new Headers(request.headers)

  headers.set('device-type', deviceType)

  return NextResponse.next({
    request: {
      headers
    }
  })
}
```

Next, configure rewrites based on the device type header. If a request with the correct header reaches the rewrites, the router will deliver the page from the type folder, not from the root of the app directory.

```ts
module.exports = {
  async rewrites() {
    return [
      ...['desktop', 'mobile'].map((deviceType) => ({
        source: '/:path*',
        destination: `/${deviceType}/:path*`,
        has: [
          {
            type: 'header',
            key: 'device-type',
            value: deviceType
          }
        ]
      }))
    ]
  }
}
```

In the same way, you can separate pages in a Next.js application by any other parameter.
