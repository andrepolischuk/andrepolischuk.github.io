# Why I use Vim?

_July 31, 2017_

Vim is amazing. I use it to writing code, text notes, check lists. I use it to
write this article. I use Vim everytime and everywhere. It's best editor I ever
used to use.

Previously I was happy with Sublime and Atom. They were perfect until I firstly
tried Vim in December 2015. The whole week I effort to use it for all my needs.
I could not get used to them features and I came back to Atom. But I continued
to use Vim sometimes for edit configs, for things over ssh.

I removed Atom and moved to Vim completely in April 2016. And I do not want
back absolutely.

1. I try to use less entities in all. Vim allows me to use terminal things
  and text editing in one place.

2. I use one enviroment configuration on all platforms. One Vim, zsh, aliases
  on laptop, virtual servers, anywhere.

3. Vim is a modal and have reach [shortkeys](https://vim.rtorr.com)
  mostly without `ctrl`/`alt` prefix. I glad every time using `ya{` combination
  to copy JavaScript object with surrounding curly braces.

4. Vim use less resources than Atom or most other editors.

5. Fully customizable by [plugins](http://vimawesome.com): syntax highlighting, color schemes, tools.

## My setup for frontend

I do not use custom key bingings. I think the built-in ones are good. I prefer
a simple configuration, but use some plugins for increase productivity:

* [YAJS](https://github.com/othree/yajs.vim), [ES.NEXT syntax](https://github.com/othree/es.next.syntax.vim) for latest JavaScript features
* [JSX plugin](https://github.com/mxw/vim-jsx)
* [Preview colors](https://github.com/ap/vim-css-color) in css
* [GitHub flavored markdown](https://github.com/rhysd/vim-gfm-syntax) plugin
* [Asynchronous Lint Engine](https://github.com/w0rp/ale) for linting
* [EditorConfig](https://github.com/editorconfig/editorconfig-vim)
* [GitGutter](https://github.com/airblade/vim-gitgutter) for view changes in editor
* [Airline](https://github.com/vim-airline/vim-airline)
* [Ag](https://github.com/rking/ag.vim) for searching and [ctrlp](https://github.com/ctrlpvim/ctrlp.vim) for file browsing
* [Light Atom One](https://github.com/rakr/vim-one) color scheme

...and few others tools and plugins. You can find my full
Vim [configuration](https://github.com/andrepolischuk/dotfiles/blob/master/.vimrc)
in [dotfiles repo](https://github.com/andrepolischuk/dotfiles) on GitHub.
