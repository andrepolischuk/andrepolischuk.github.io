# Why do I use Vim?

_August 1, 2017_

![This article in vim](https://i.imgur.com/3X4YTeg.png)  
Vim is amazing. I use it to write code, text notes, check lists. I use it to
write this article. I use Vim everytime and everywhere.

Previously I was happy using Sublime and Atom. They were perfect until I have
tried Vim in December 2015. I effort to use it for all my needs for a whole
week. I couldn't get used to its ideas and came back to Atom. But I didn't like
it anymore. At the same time I continued to use Vim for small tasks: edit
configs, things over ssh.

I removed Atom and moved to Vim completely in April 2016. And now I don't want
back absolutely. Vim is the best editor I have ever used.

1. It allows me to use terminal things and edit text in one place.

2. It allows me to use one enviroment configuration on all platforms.
  One Vim, zsh, aliases on laptop, virtual servers, anywhere.

3. It's open sourced and regularly updated.

4. It's a modal and have reach [shortkeys](https://vim.rtorr.com)
  mostly without `ctrl`/`alt` prefix. I am glad every time using `ya{` combination
  to copy JavaScript object with surrounding curly braces.

5. It starts extremely fast and uses less resources than Atom or most other editors and IDE.

6. It's customizable by [plugins](http://vimawesome.com): syntax highlighting, color schemes, tools.

## My setup

I don't use custom key bingings. I think the built-in ones are good. I prefer
a simple configuration, but use some plugins for increase productivity:

* [YAJS](https://github.com/othree/yajs.vim), [ES.NEXT syntax](https://github.com/othree/es.next.syntax.vim) for latest JavaScript features
* [JSX plugin](https://github.com/mxw/vim-jsx) for highlight JSX syntax
* [Preview colors](https://github.com/ap/vim-css-color) in css
* [GitHub flavored markdown](https://github.com/rhysd/vim-gfm-syntax) plugin for editing docs
* [Asynchronous Lint Engine](https://github.com/w0rp/ale) for linting
* [EditorConfig](https://github.com/editorconfig/editorconfig-vim)
* [GitGutter](https://github.com/airblade/vim-gitgutter) for view changes in editor
* [Airline](https://github.com/vim-airline/vim-airline) for awesome statusline
* [Ag](https://github.com/rking/ag.vim) for searching and [ctrlp](https://github.com/ctrlpvim/ctrlp.vim) for file browsing
* [Light Atom One](https://github.com/rakr/vim-one) color scheme

...and few others tools and plugins. You can find my full
Vim [configuration](https://github.com/andrepolischuk/dotfiles/blob/master/.vimrc)
in [dotfiles repo](https://github.com/andrepolischuk/dotfiles) on GitHub.
