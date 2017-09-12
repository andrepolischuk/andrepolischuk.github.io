# Protect the frontend

_August 31, 2017_

Modern web application uses a lot of resources: own scripts, styles, requests,
url queries, external analytics, fonts and other stuff receiving from cdns.
And each of them may be malicious under certain conditions.

Application runs in an unpredictable browser environment with possibly malware
extensions. And all documents, scripts, requests transmit over potentially unsecured networks.

Every day we improve ui, accessibility, perfomance. But what about security?
As frontend engineers we should always think about all aspects of development
including security of users using our products.

## Possible attacks

Web applications have some vulnerabilities which enable the following attacks:

### [XSS](https://www.owasp.org/index.php/Cross-site_Scripting_(XSS)) <small>(Cross-site Scripting)</small>

* Injection an unsafe code to html from db, for example in forum comments,
  [stored XSS](https://www.owasp.org/index.php/Testing_for_Stored_Cross_site_scripting_(OTG-INPVAL-002)).

  For example, you have template where you passes values from api response:

  ```html
  <header>
    <h1>{{user.name}}</h1>
    <p>{{user.description}}</p>
  </header>
  ```

  But after compiling the template you will have extraneous script in DOM:

  ```html
  <header>
    <h1>Unicorn</h1>
    <p>
      <script>alert("your password has been stolen")</script>
    </p>
  </header>
  ```

* Injection to url params, redirect url substitution,
  [reflected XSS](https://www.owasp.org/index.php/Testing_for_Reflected_Cross_site_scripting_(OTG-INPVAL-001)).

  For example, you received email with link to site that you use:

  ```
  Hi,

  Go to the link and win
  https://awesome.app/login?redirect_uri=javascript:alert("your password has been stolen")
  ```

* Injection a malicious code to requesting scripts, styles, stealing session
  identifier from request headers,
  [Man-in-the-middle attack](https://www.veracode.com/security/man-middle-attack).

  For example, your server serve following script to your application:

  ```js
  const element = document.querySelector('app')

  function render () {
    // ...
  }

  element.appendChild(render())
  ```

  But browser will get it modified:

  ```js
  const element = document.querySelector('app')

  function render () {
    // ...
  }

  element.appendChild(render())

  // ha-ha
  alert("your password has been stolen")
  ```

Each of them can result in opening and executing a malicious resource in application.
Users may lose them data or access to account. Or may be taken away to external site.

### [Clickjacking](https://www.owasp.org/index.php/Clickjacking)

* Application is opened in iframe on a malicious site under the hidden form
* All resources of application are proxied by external host

In these ways users may lose credentials when type their in hidden inputs placed
over real application or when try to authorize on proxied page.

## Defense

So we explored possible categories of attacks. And now we should find ways to
protect users from losing their sensitive data such as credentials or session ids.

There are several techniques to protect apps against attacks:

* Use HTTPS everywhere with [HSTS](https://www.owasp.org/index.php/HTTP_Strict_Transport_Security_Cheat_Sheet)
  (HTTP Strict Transport Security) for all pages, scripts and others. HTTPS
  prevents XSS and Man-in-the-middle attack: appending unsafe code to styles,
  scripts or replace them, and reading credentials or session id from headers.

* Use [HttpOnly cookie](https://www.owasp.org/index.php/HttpOnly)
  for session identifier to disallow external scripts access to it.

* Validate and escape url query parameters and data received from api before
  inserting their into html to prevent XSS with executing dangerous scripts.

* Validate format of redirect url and check it by the list of allowed recources.
  In this way we can prevent redirect to external site and execute a malicious
  code by redirecting to it.

* Validate application origin and origin of site that embeded your application
  by the allowed list to detect possible clickjacking. If origin isn't allowed
  we should hide input fields and show warning for user.

* Forbid embed application into iframe by send
  [`X-FRAME-OPTIONS`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options)
  header in response.

  ```
  X-Frame-Options: DENY
  X-Frame-Options: SAMEORIGIN
  X-Frame-Options: ALLOW-FROM https://awesome.app/
  ```

* Use the [Content Security Policy](https://content-security-policy.com).
  With it we can define some rules for browser to control loading
  and behavior of scripts, images, requests and other sources by send
  `Content-Security-Policy` header.

  ```
  # default policy allows only self sources over HTTPS
  default-src 'self' https:

  # allows self sources of JavaScript and one external domain
  script-src 'self' https://www.google-analytics.com

  # allows self stylesheets and also inline styles
  style-src 'self' 'unsafe-inline'

  # allows self images and Base64 encoded
  img-src 'self' data:

  # allows self urls for XMLHttpRequest, WebSocket
  connect-src 'self'

  # prevent audio and video loading
  media-src 'none'

  # prevent opening frames on current page
  child-src 'none'
  ```

## Summary

That's all. I hope my little review of attacks and defend methods helps you to
protect applications you creating. Also you can get more information by
following the links referred in the article.
