# Questions to ask before writing code

<!-- _October 18, 2017_ -->

Do you everyday solve problems at your work by writing code?
New features, bugs.
Good, this questions for you.

What am I talking about?
Some developers love to write your own bicycles in all cases.
It's not good.
If we don't pay attention to it, our projects eventually encrease.
As a result we get a hard-to-mantaining vast code base.
Each our project has a magic `utils` folder with things written many times before.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Instead of a `utils` folder, have a `to-publish` folder in your project, with modules that you&#39;ll put in npm soon.</p>&mdash; André Staltz (@andrestaltz) <a href="https://twitter.com/andrestaltz/status/853552718836899840?ref_src=twsrc%5Etfw">April 16, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

I have an apporoach for you to prevent this.

In frontend we have a great open-source community.
One only npm hosts a million various packages.
Most of them are maintained by oss enthusiasts.
With the help of the community these solutions are always fixed and up-to-date.
You should try to reuse them before you write a new one.

## Ask yourself before

- Can we do nothing?
- Can we solve our problem with existing solution?
- Can we fix or improve existing solution for our case?
- Can we tackle our issue in another way or change expected result with existing solution?

Only you've answered no to all questions, you can write your own bicycle.
Also you should publish it, as other developers will can face ever the same problem.

There is another case where you should write your own thing.
It's experiments.
This is the best method to try and understand something.
But anyway don't forget publish it for others.

That's all.
You've now learned how to think more about code reusing and keep you code easy to maintain by asking few simple questions.
Don't forget about community.
Use open-source, publish it and help improve.
