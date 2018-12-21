# Commenting a code

_December 10, 2018_

Last year I wrote [the note](/code-without-comments/) about waste comments in code. But now it seems to me that this explanation is not fully right. I was supporting a lot of apps, widgets with externalized API and shareable modules this year. And I found two specific case where comments can be useful.

First, comments can help explain why did you write a code in this way.

Second, comments can help generate documentation of any module API for engineers who use it.

## Explanation

You write the error fix over a module with bug. Or you wait some feature in it. Clarify what do you fix. Attach link to issue on tracker to clarify.

You create a module that somebody can not understand without knowledge of relations with other parts of system. Give more info how they interact here.

You increase performance and write unreadable code with binary operations. Write why do you use it. Add link to algorithm do you apply in this case.

```js
const ns = '2f1acc6c3a606b082e5eef5e54414ffb'
if (global[ns] == null) global[ns] = 0

// Bundle may contain multiple JSS versions at the same time. In order to identify
// the current version with just one short number and use it for classes generation
// we use a counter. Also it is more accurate, because user can manually reevaluate
// the module.
export default global[ns]++
```

Anyway, write a comment to tell something for users who will work with your code.

## Documentation

API description in code is not user-friendly approach. But it’s a good start to setup auto-generated docs for systems.

```js
/**
 * Initialize a new `Command`.
 *
 * @param {String} name
 * @api public
 */

function Command(name) {
  this.commands = [];
  this.options = [];
  this._execs = {};
  this._allowUnknownOption = false;
  this._args = [];
  this._name = name || '';
}
```

You can write about all functions or methods of API manually in readme. Or you can describe each methods in its code. Choose `jsdoc` format for your comments and start.

Then add precommit hook to transform comments from code to any human-readable format of docs. Thanks to community, there are great tools to generate docs: [jsdoc-to-markdown](https://github.com/jsdoc2md/jsdoc-to-markdown), [documentation.js](https://github.com/documentationjs/documentation), [react styleguidist](https://github.com/styleguidist/react-styleguidist).

## ***

That’s all. Write comments. With their help you’ll explain ambiguous approaches or automate documenting. But you should purge the rest comments from your code.
