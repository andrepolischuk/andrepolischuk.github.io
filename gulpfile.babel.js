import gulp from 'gulp'
import plumber from 'gulp-plumber'
import pug from 'gulp-pug'
import put from 'gulp-data'
import rename from 'gulp-rename'
import extract from 'article-data'
import del from 'del'
import RSS from 'rss'
import through from 'through2'
import deploy from 'gulp-gh-pages'
import remark from 'remark'
import textr from 'remark-textr'
import base from 'typographic-base'
import each from 'each-done'
import Koa from 'koa'
import statics from 'koa-static'
import {writeFile} from 'fs'
import {basename, extname} from 'path'
import {site} from './package'
import service from './service'

let sitePages = []
let storyPages = []

gulp.task('collect', () => {
  let pages = []
  sitePages = []
  storyPages = []

  return gulp.src(['pages/*.md', '!pages/_*'])
    .pipe((() => through.obj(
      (file, enc, next) => {
        const source = file.contents.toString()

        const article = remark()
          .use(textr, {
            plugins: [
              base
            ],
            options: {
              locale: site.language
            }
          })
          .processSync(source)
          .toString()

        pages.push(Object.assign(
          {
            filename: file.relative,
            url: `${basename(file.relative, extname(file.relative))}/`
          },
          extract(article, 'MMMM D, YYYY', 'en')
        ))

        pages.forEach(page => {
          page.content.html = page.content.html.replaceAll(
            /(<h\d>)(.+)(<\/h\d>)(\n|$)/g,
            (_, prefix, title, suffix) => {
              const anchor = title.toLowerCase().replaceAll(/[^A-Za-zА-ЯЁа-яё0-9]+/g, '-')
              return `${prefix}<a href="#${anchor}" aria-hidden="true">#</a>${title}${suffix}`
          })
        })

        next(null, false)
      },
      next => {
        sitePages = pages
          .filter(x => !x.date)
          .filter(x => !!x.title)
          .filter(x => !!x.desc)

        storyPages = pages
          .filter(x => !!x.date)
          .filter(x => !!x.title)
          .filter(x => !!x.desc)
          .sort((a, b) => b.date.unix - a.date.unix)

        next()
      }
    ))())
})

gulp.task('site pages', next => {
  each(sitePages, (page, i) => gulp.src('layouts/page.pug')
    .pipe(plumber())
    .pipe(put({
      site,
      page
    }))
    .pipe(pug({
      pretty: true
    }))
    .pipe(rename({
      dirname: page.url,
      basename: 'index'
    }))
    .pipe(gulp.dest('dist')), next)
})

gulp.task('story pages', next => {
  each(storyPages, (page, i) => gulp.src('layouts/page.pug')
    .pipe(plumber())
    .pipe(put({
      site,
      page
    }))
    .pipe(pug({
      pretty: true
    }))
    .pipe(rename({
      dirname: page.url,
      basename: 'index'
    }))
    .pipe(gulp.dest('dist')), next)
})

gulp.task('index', () =>
  gulp.src('layouts/index.pug')
    .pipe(plumber())
    .pipe(put({
      site,
      pages: storyPages
    }))
    .pipe(pug({
      pretty: true
    }))
    .pipe(rename({
      dirname: '/',
      basename: 'index'
    }))
    .pipe(gulp.dest('dist'))
)

gulp.task('service', next => {
  each(service, (page, i) => gulp.src('layouts/service.pug')
    .pipe(plumber())
    .pipe(put({
      site,
      page
    }))
    .pipe(pug({
      pretty: true
    }))
    .pipe(rename({
      dirname: '/',
      basename: page.basename
    }))
    .pipe(gulp.dest('dist')), next)
})

gulp.task('rss', next => {
  let feed = new RSS(site)

  storyPages.forEach(page => {
    feed.item({
      title: page.title.text,
      description: page.desc.text,
      url: site.site_url + page.url,
      author: site.author,
      date: page.date.text
    })
  })

  const xml = feed.xml({
    indent: true
  })

  writeFile('dist/rss.xml', xml, {encoding: 'utf-8'}, err => {
    if (err) {
      throw err
    }

    next()
  })
})

gulp.task('copy', () => gulp.src('{CNAME,gpg*,styles.css,index.js,sw.js}').pipe(gulp.dest('dist')))
gulp.task('clean', next => del(['dist'], next))

gulp.task('layout', gulp.series(
  'collect',
  gulp.parallel('site pages', 'story pages', 'index', 'service')
))

gulp.task('build', gulp.series(
  'clean',
  'layout',
  'rss',
  'copy'
))

gulp.task('deploy', gulp.series('build', () =>
  gulp.src('dist/**/*')
    .pipe(deploy({
      push: true,
      branch: 'master'
    }))
))

gulp.task('watch', () => {
  gulp.watch('**/*.{pug,md,json}', gulp.series('layout', 'rss'))
})

gulp.task('koa', () => {
  new Koa().use(statics('dist')).listen(3000)
})

gulp.task('default', gulp.series(
  'build',
  gulp.parallel('watch', 'koa')
))
