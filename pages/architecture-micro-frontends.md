# Architecture: Micro frontends

_April 5, 2024_

Micro frontends architecture is an approach to web application development that involves breaking down the frontend (client-side) into independent modules or components (for example, sidebar, footer, widget). Each of these modules can be developed, deployed, and scaled independently from the rest of the application.

Micro frontends are similar to another software architecture – [microservices](https://en.wikipedia.org/wiki/Microservices). Both approaches aim for modularity and independence of system components. They also allow development teams to work on different parts of the application in parallel, using various technologies and frameworks, which increases flexibility and development speed. Micro frontends and microservices provide independence and isolation of components, simplifying scaling and support of complex systems.

## Prerequisites for Micro Frontends

After defining what micro frontends are, let's look at the prerequisites that led to the emergence and development of this approach. This will help in understanding why micro frontends have become a relevant solution for modern web developers.

### Application Complexity Growth

User needs constantly increase requirements for speed, security, user interface convenience, and web application functionality, leading to the need for their continuous improvement and updating.

Browser developers regularly introduce new APIs that expand the capabilities of web applications, including performance improvements, access to device hardware features, etc.

Web application functionality gradually moves to the client side, driven by the desire to improve user experience and reduce server load. This includes:

* Using Ajax for asynchronous server requests without the need to reload the entire page.
* Implementing client-side routing to manage navigation without server interaction.
* Dynamically generating HTML markup on the client-side for more flexible content management.
* Moving business logic from the backend to the frontend for a quick response to user actions.
* Developing caching mechanisms on the client-side to speed up resource loading and save traffic.
* Implementing offline mode for web applications to ensure availability in unstable internet connections or its absence.

### Technology Stack Update

Implementing new logic in the client-side of applications leads to new technical problems and challenges that require the development of new approaches to solve them.

Developers constantly seek and implement new design patterns, frameworks, and libraries to address issues arising from changes in the technological landscape and business requirements.

To keep web applications up-to-date, meeting modern standards and user requirements, it is necessary to regularly update the technologies and development tools used.

Updating the monolithic codebase of a web application instantly is fraught with significant time and resource costs and can lead to difficulties in ensuring the stability of the application and its individual components.

### Team Work

The growth of codebase and functionality requires an increase in the number of engineers to support it, more careful resource planning, and coordination between team members to ensure uninterrupted development and support of the project.

The larger the number of engineers, the more complex the team's communication. Engineers cannot act independently and must negotiate with each other about the impact of one part on others, implying the presence of clear interfaces between system modules and components, as well as regular joint meetings and code review sessions to ensure architectural decisions consistency and avoid conflicts during the integration of different parts of the project.

### Maintenance

Having a large and cohesive codebase dependent on one technology stack complicates the process of making changes and requires more testing and enhanced support during operation due to the high degree of interconnection between system components and modules.

Changes made in one part of a monolithic web application can unpredictably affect the operation of its other parts, which increases the risk of errors and failures in the application as a whole and requires developers to pay more attention to quality control and testing issues.

The lack of modularity and high degree of interdependence between monolithic application components lead to the need for extensive and time-consuming testing of the entire application with each change, which slows down the development process and delivery of new functional features to users.

### Code Duplication

If a business owns many products, there may be a need to use similar functionality in several products.

In monolithic web applications, this will lead to functional duplication and increased development costs, as it will be necessary to spend time and resources on the implementation, testing, and support of the same code in different places, which increases the likelihood of errors and complicates the introduction of changes and updates.

## Advantages of Micro Frontends

### Independent Code Bases

Reducing the overall amount of code simplifies its understanding, support, and updating.

Small independent code bases allow encapsulating data and business logic, thus hiding the implementation details of a certain set of functionalities within a separate service. This eliminates or minimizes inappropriate dependencies between different parts of the system, ensuring simpler modernization and updating.

A smaller amount of code makes testing easer, as it requires checking a smaller set of functionalities, which reduces development time and improves test quality.

### Independent Deployment

Independent deployment reduces the risks of introducing updates to individual system components since updates are distributed atomically and do not affect the operation of the entire system, minimizing the likelihood of errors.

The independence of deployment processes for individual system elements from the general application release cycles speeds up the delivery of new features and improvements to the end user, increasing responsiveness and development flexibility.

### Independent Technologies

Each part of the system can be developed using individually selected technologies and architectural solutions, allowing for maximum efficiency and optimization of each specific module.

Adopting architectural and technological decisions for each component separately ensures the convenience of updating and scaling each of them without risking disrupting the functionality or performance of other parts of the system. Thus, modifying one module does not entail the need to make changes in other modules, significantly simplifying the process of supporting and developing the application.

### Independent Teams

Small teams formed around specific business functionalities have the opportunity to deeply immerse themselves in the specifics of the developed product, ensuring a high level of responsibility for the final result of their work and stimulating the search for the best ways to achieve the goal.

Communication within small teams and between different teams plays a key role in the successful development of a product, and independent teams have significant advantages here, for example flexibility of communication processes. Interaction within a team and with other groups becomes more efficient and focused, speeding up decision-making, improving coordination, and solving emerging problems faster.

The possibility of choosing the methodology best suited for working on a specific project or its part allows teams to approach the development process as flexibly as possible. Each team can individually select and combine the most effective project management practices and tools, based on their own experience, task specificity, and preferences, which in total increases the overall productivity and quality of developed products.

## Architecture Types

### Vertical Architecture

Vertical architecture of micro frontends implies dividing an application into several independent sections, each of which is developed, tested, and deployed independently. This approach allows teams to work on separate functional blocks or pages of the application.

![Vertical Architecture](https://i.imgur.com/LroPaWw.png)

### Horizontal Architecture

Horizontal architecture of micro frontends is an approach to web application development where functional elements (widgets) are developed, tested, and deployed independently of each other and can be displayed on the same page. This allows different teams to work on one page in parallel.

![Horizontal Architecture](https://i.imgur.com/6tNXtlR.png)

## Integration Types

Integrating micro frontends into a common system is possible at the following lifecycle stages:

* During application build.
* Client-side during runtime.
* Server-side during runtime.

### Client-side

#### Embedding via iframe

The micro application is embedded into the host application via iframe.

```html
<html>
  <head>
    <title>Main page</title>
  </head>
  <body>
    <header>...</header>
    <iframe src="https://currency.example.app/widget"></iframe>
    <iframe src="https://weather.example.app/widget"></iframe>
    <footer>...</footer>
  </body>
</html>
```

Features of working with iframe:

* Provides isolation out of the box, there's no need for style isolation, the host application does not have access to data and DOM inside the iframe.
* It's possible to set strict rules for content sources, scripts, and other resources inside the iframe (e.g., [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)) to protect against attacks like XSS and injections.
* Complex communication between the host and the embedded application through [`postMessage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage).
* Content loaded inside an iframe is usually not indexed by search engines, which can negatively affect SEO.

#### Embedding via JavaScript

The micro application's script is loaded separately and embedded through its JavaScript interface.

```html
<html>
  <head>
    <title>Main page</title>
  </head>
  <body>
    <header>...</header>
    <main>...</main>
    <div id="currency"></div>
    <footer>...</footer>
    <script src="https://currency.example.app/widget.js"></script>
    <script>
      const widget = new Currency({
        element: document.querySelector('#currency')
      })
      // widget ready to use
    </script>
  </body>
</html>
```

Similarly, it is possible to embed this universal micro application anywhere, for example, in a React application client-side.

```tsx
import React, {useRef, useEffect} from 'react'
import {Header, Footer} from 'components'

const commentsPromise = cache(() => import('https://comments.example.app/widget.js'))

export function MainPage() {
  const commentsRoot = useRef()

  useEffect(() => {
    commentsPromise.then((Comments) => {
      const widget = new Comments({
        element: commentsRoot.current,
        appId: 123
      })
      // widget ready to use
    })
  }, [])

  return (
    <>
      <Header />
      <main>...</main>
      <div ref={commentsRoot} />
      <Footer />
    </>
  )
}
```

In a more specific stack, the micro application itself can be written in React (federated React component) and embedded in another React application.

```tsx
import React, {lazy} from 'react'
import {Header, Footer} from 'components'

const Comments = lazy(() => import('https://comments.example.app/widget.js'))

export function MainPage() {
  return (
    <>
      <Header />
      <main>...</main>
      <Comments appId={123} />
      <Footer />
    </>
  )
}
```

Features of embedding through JavaScript:

* Scripts and styles run in the host application environment.
* Style isolation is necessary.
* Any scripts from the host application can access the content and data of the micro-application, which may lead to user data leakage.
* It's difficult to set up security policies because the host application and micro-applications run in the same context.
* Simple communication through events and JavaScript interface.

#### Combined Embedding

The previous embedding methods each have their advantages and drawbacks. To mitigate these drawbacks a bit, you can combine the two methods - using the JavaScript interface for direct embedding, which internally embeds the micro-application via an iframe.

```html
<html>
  <head>
    <title>Main page</title>
  </head>
  <body>
    <header>...</header>
    <main>...</main>
    <div id="comments">
      <!-- dynamically added when creating a Comments instance -->
      <div class="comments-container">
        <iframe src="https://comments.example.app/widget/iframe?appId=123"></iframe>
      </div>
      <!-- / -->
    </div>
    <footer>...</footer>
    <script src="https://comments.example.app/widget.js"></script>
    <script>
      const widget = new Comments({
        element: document.querySelector('#comments'),
        appId: 123
      })
      // widget ready to use
    </script>
  </body>
</html>
```

Features of the combined method:

* The internal iframe provides style and script isolation, preventing the service from accessing the content and data of the micro-application and vice versa.
* It's possible to set strict security policies for the content inside the iframe
* The external JavaScript interface allows encapsulating the transport between contexts, simplifying the communication of the host application with the micro-application inside the iframe, the host application doesn't need to know anything about the internal implementation.

#### Custom Elements

This method is similar to embedding through a JavaScript interface, but it is performed through native [Custom Elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_Components/Using_custom_elements).

```html
<html>
  <head>
    <title>Main page</title>
  </head>
  <body>
    <header>...</header>
    <currency-widget></currency-widget>
    <weather-widget></weather-widget>
    <footer>...</footer>
    <script src="https://currency.example.app/widget.js"></script>
    <script src="https://weather.example.app/widget.js"></script>
  </body>
</html>
```

Features of working with Custom Elements:

* They provide style and script isolation, preventing conflicts and simplifying integration.
* Communication between custom elements and the host application can be challenging, as events are the only method available.
* Content dynamically generated by custom elements might not be fully indexed by search engines.

### During Build

#### NPM and other Artifact Repositories

The micro-application is integrated through a JavaScript interface, but instead of downloading an external script, it uses installed modules from artifact repositories.

```tsx
import React, {useRef, useEffect} from 'react'
import {Header, Footer} from 'components'
import {Comments} from '@widgets/comments'

export function MainPage() {
  const commentsRoot = useRef()

  useEffect(() => {
    const widget = new Comments({
      element: commentsRoot.current,
      appId: 123
    })
    // widget ready to use
  }, [])

  return (
    <>
      <Header />
      <main>...</main>
      <div ref={commentsRoot} />
      <Footer />
    </>
  )
}
```

The micro-application can use the same stack as the host application.

```tsx
import React from 'react'
import {Header, Footer} from 'components'
import {Currency} from '@widgets/currency'
import {Weather} from '@widgets/weather'

export function MainPage() {
  return (
    <>
      <Header />
      <Currency />
      <Weather />
      <Footer />
    </>
  )
}
```

Features of embedding during build:

* It's impossible to update micro-applications on the fly; a new release of the host application is necessary to update the connected modules.
* The module's code is essentially included in the build of the host application, which increases its size and may impair performance.

### On the Server

#### During Routing

On the server, several micro-applications are combined by locations.

```nginx
server {
  ...

  location /search {
    proxy_pass https://search.example.app;
  }

  location /order {
    proxy_pass https://order.example.app;
  }

  ...
}
```

This is only suitable for a vertical architecture, where different sections of the web application are micro frontends.

#### During Server-side Rendering

The micro-application's markup is embedded in the host application's page code during server-side template rendering using [Server Side Includes](https://en.wikipedia.org/wiki/Server_Side_Includes).

```html
<html>
  <head>
    <title>Main page</title>
  </head>
  <body>
    <header>...</header>
    <!--# include file="https://currency.example.app" -->
    <!--# include file="https://weather.example.app" -->
    <footer>...</footer>
  </body>
</html>
```

It is also possible to embed markup using any stack, for example, in React server components.

```tsx
import React from 'react'
import {Header, Footer} from 'components'

export async function MainPage() {
  const commentsMarkup = await fetchMarkup('https://comments.example.app/ssr?appId=123')
  return (
    <>
      <Header />
      <main>...</main>
      <div dangerouslySetInnerHTML={{__html: commentsMarkup}} />
      <Footer />
    </>
  )
}
```

And the micro-application can have the same stack as the host application.

```tsx
import React from 'react'
import {Header, Footer} from 'components'

export async function MainPage() {
  const Comments = await cache(() => import('https://comments.example.app/widget.js'))
  return (
    <>
      <Header />
      <main>...</main>
      <Comments appId={123} />
      <Footer />
    </>
  )
}
```

Features of embedding during server-side markup generation:

* Markup is prepared on the server and indexed by search engines.
* Scripts and styles run in the host application environment, so style isolation is needed.
* Any scripts from the host application can access the content and data of the micro-application, which could lead to user data leakage.

## Communication

Communication between micro-applications has several specific features and limitations:

* Micro frontends should be designed to be as isolated from each other as possible, which means they should not use a shared state.
* However, this also means that any communication between micro frontends must happen through an existing data exchange contract. It's important to focus on creating a reliable and scalable API for interaction between different components.

### URL GET Parameters

The data needed for initialization is passed as GET parameters in the URL of the micro-application. This approach is usually used when embedding through an iframe.

```html
<html>
  <head>
    <title>Main page</title>
  </head>
  <body>
    <header>...</header>
    <main>...</main>
    <iframe src="https://comments.example.app/widget?appId=123"></iframe>
    <footer>...</footer>
  </body>
</html>
```

### Messages

Micro-applications communicate through [`MessageEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MessageEvent), send data via [`postMessage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) and listen for the [`message`](https://developer.mozilla.org/en-US/docs/Web/API/Window/message_event) event to receive data. This is also used when embedding through an iframe.

```html
<html>
  <head>
    <title>Main page</title>
  </head>
  <body>
    <header>...</header>
    <main>...</main>
    <iframe id="comments" src="https://comments.example.app/widget"></iframe>
    <footer>...</footer>
    <script>
      const {contentWindow} = document.querySelector('#comments')
      window.addEventListener('message', (event) => {
        if (event.data.type === 'ready') {
          // widget ready to use
        }
      })
      contentWindow.postMessage({type: 'init', appId: 123}, '*')
    </script>
  </body>
</html>
```

### JavaScript Interface

The embedded micro-application provides an external JavaScript interface, which the host application calls to synchronize data. The external JavaScript interface simplifies the host application's communication with the micro-application, as the host application doesn't know about its internal implementation.

```html
<html>
  <head>
    <title>Main page</title>
  </head>
  <body>
    <header>...</header>
    <main>...</main>
    <div id="comments"></div>
    <footer>...</footer>
    <script src="https://comments.example.app/widget.js"></script>
    <script>
      const widget = new Comments({
        element: document.querySelector('#comments')
      })
      widget.init({appId: 123})
    </script>
  </body>
</html>
```

### Event Bus

The embedded micro-application provides an external JavaScript interface, which inherits from the abstract [EventEmitter](https://nodejs.org/api/events.html#class-eventemitter). It's possible to use an event bus along with the JavaScript interface's own methods to simplify communication, for example, calling methods to pass data to the micro-application and listening for events to track state changes.

```html
<html>
  <head>
    <title>Main page</title>
  </head>
  <body>
    <header>...</header>
    <main>...</main>
    <div id="comments"></div>
    <footer>...</footer>
    <script src="https://comments.example.app/widget.js"></script>
    <script>
      const widget = new Comments({
        element: document.querySelector('#comments')
      })
      widget.on('ready', () => {
        // widget ready to use
      })
      widget.emit('init', {appId: 123})
    </script>
  </body>
</html>
```

### Custom Events

This method is similar to the event bus but is implemented through the built-in [`CustomEvent` API](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent). This is the only method of communication when embedding a micro-application through Custom Elements along with HTML element attributes.

```html
<html>
  <head>
    <title>Main page</title>
  </head>
  <body>
    <header>...</header>
    <main>...</main>
    <comments-widget></comments-widget>
    <footer>...</footer>
    <script src="https://comments.example.app/widget.js"></script>
    <script>
      const commentsRoot = document.querySelector('comments-widget')
      commentsRoot.addEventListener('ready', () => {
        // widget ready to use
      })
      commentsRoot.dispatchEvent(
        new CustomEvent('init', {detail: {appId: 123}})
      )
    </script>
  </body>
</html>
```

## Possible Issues of Micro Frontends

In addition to the advantages and features listed above, the micro frontend architecture has problematic issues that need consideration both when choosing the architecture of a particular solution and in the further implementation of this architecture.

### UI Compatibility

Ensure consistency in appearance and behavior of UI across micro frontends to maintain visual integration between micro-applications.

#### Solution

Extract common functionality into UI component libraries and auxiliary utilities that can be used by all micro-applications to minimize code duplication, as well as simplify support and update interfaces.

### Data Synchronization

It is impossible to use a shared state to isolate micro-applications from each other as much as possible.

#### Solution

Design scalable APIs for interaction between different micro-applications according to documented contracts.

### CSS Styles Isolation

Micro-applications in a horizontal architecture often work within the context of one browser page, so the global visibility of CSS styles can violate encapsulation and modularity, leading to conflicts and unpredictable errors in display.

#### Solution

Use methodologies such as BEM, and technologies including [CSS modules](https://github.com/css-modules/css-modules), [CSS-in-JS](https://en.wikipedia.org/wiki/CSS-in-JS), and [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM) to isolate the styles of each micro-application and prevent conflicts, thus ensuring reliable encapsulation and modularity.

### JavaScript Isolation

JavaScript scripts executed in the context of the host application can interact with the content and data of micro-applications, causing security vulnerabilities and the possibility of user data leaks.

#### Solution

Use iframes or vertical architecture for integrating micro-applications with sensitive data to ensure complete isolation, preventing access to DOM elements and preventing execution of host application scripts in the context of micro-applications, thus enhancing security interaction.

### Data Isolation

Third-party cookies and storage are limited in cross-domain iframes due to browser restrictions, for example, [Intelligent Tracking Prevention](https://webkit.org/blog/9521/intelligent-tracking-prevention-2-3/).

#### Solution

Explicitly check and request user permission for access to third-party data through the [Storage Access API](https://developer.mozilla.org/en-US/docs/Web/API/Storage_Access_API). It is also possible to store data in cookies and storages within the context of the host application, which is possible in combined embedding through a JavaScript interface with an iframe inside.

### Increasing the Number of Dependencies and Duplication

Using the same framework by micro-applications may result in framework code duplication, and each micro frontend adds additional HTTP requests to load its resources, which may affect the performance of the application.

#### Solution

Use asynchronous loading ([Lazy Loading](https://developer.mozilla.org/en-US/docs/Web/Performance/Lazy_loading)) of micro-applications and extract common code into remote modules ([Module Federation](https://webpack.js.org/concepts/module-federation/)) so that users can access the main content faster, while additional features load in the background.

### Infrastructure Complexity

Splitting monoliths into many small micro-applications leads to an increase in the number of repositories, delivery pipelines, infrastructure that needs support.

#### Solution

Implement automation of operations and development, testing, and delivery processes to manage and support the additional necessary infrastructure.

### Stack and Processes Complexity

The autonomy of development within micro frontends allows teams to make decisions independently, which can lead to an increase in the number of technologies, tools, and methodologies used.

#### Solution

Develop common standards and practices, including coding style, architectural patterns, and technology stacks, to help ease the integration of micro-applications and simplify teamwork.

### Increasing the Bus Factor

Dividing employees into many small teams, as well as a variety of approaches and tools, may increase the risks associated with the concept of "bus factor" (project vulnerability related to the loss of key employees) and complicate the interchangeability of developers.

#### Solution

Maintain a high level of documentation and ensure cross-review of code. Create cross-functional teams where members from different teams can be involved in other projects and be aware of key aspects of various micro-applications, promoting flexibility and resilience of teams.

## Conclusion

The growth complexity of applications and the need for rapid and high-quality development have led to the development of micro frontends as a way of managing large projects, makes updates, support, and scaling easer.

Micro frontend architecture allows breaking down web applications into independent components, promoting modularity, flexibility, and parallel work of teams. There are also problems, such as an increase in the number of resources and dependencies loaded, application isolation, and some management difficulties.

Nevertheless, micro frontends represent an important stage in the evolution of web application development, allowing companies to scale their projects and teams more effectively. Despite the complexities, this approach promises greater flexibility and speed of development, as well as simplifying support and updating products.

For further reading, check the following additional materials:

* [Curated list of resources about Micro frontends](https://github.com/billyjov/microfrontend-resources)
* [Micro Frontends by Michael Geers](https://micro-frontends.org)
* [Top 10 Micro Frontend Anti-Patterns](https://dev.to/florianrappl/top-10-micro-frontend-anti-patterns-3809)
