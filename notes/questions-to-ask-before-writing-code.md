# Questions to ask before writing code

_October 19, 2017_

Do you everyday solve problems by writing code at your work?
New features, bugs.
Good, this questions for you.

What am I talking about?
Some developers love to reinvent the wheel in all cases.
It's not good.
If we don't pay attention for it, our projects will eventually increase.
As a result we get a hard-to-maintaining vast code base.
Each of our projects has a magic `utils` folder with things written many times before.

<blockquote class="twitter-tweet tw-align-center" data-lang="en"><p lang="en" dir="ltr">Instead of a `utils` folder, have a `to-publish` folder in your project, with modules that you&#39;ll put in npm soon.</p>&mdash; André Staltz (@andrestaltz) <a href="https://twitter.com/andrestaltz/status/853552718836899840?ref_src=twsrc%5Etfw">April 16, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

Fortunately I have an approach for you to prevent this.

In frontend we have a great open-source community.
Only one npm registry hosts a million various packages.
Most of them are maintained by awesome OSS enthusiasts.
With their help these libraries are always fixed and up-to-date.
You should try to reuse them before you create a new one.

## Ask yourself first

- Can we do nothing?
- Can we solve our problem with existing library, tool, pattern?
- Can we fix or improve founded for our case?
- Can we tackle our issue in another way or change expected result with this solutions?

If only you've answered "no" to all questions, you can make your own implementation.
Also you should publish it, as other developers can face ever the same problem.

There is another case where you should write it yourself.
It's experiment.
This is the best method to try and understand something.
But anyway don't forget publish it for others.

And that's it.
Now you've learned how to think more about code reusing and keep your code easy to support by asking few simple questions.
Don't forget about community.
Use open-source, publish it and help to improve.
