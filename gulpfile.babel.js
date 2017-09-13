import gulp from 'gulp'
import plumber from 'gulp-plumber'
import pug from 'gulp-pug'
import put from 'gulp-data'
import rename from 'gulp-rename'
import extract from 'article-data'
import getLinks from 'get-md-links'
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
import postcss from 'gulp-postcss'
import autoprefixer from 'autoprefixer'
import customProperties from 'postcss-custom-properties'
import {writeFile} from 'fs'
import {basename, extname} from 'path'
import {site} from './package'

const getAllLinks = notes => notes
  .reduce((acc, note) => acc.concat(note.links), [])
  .map(({href}) => href)
  .filter(link => link.match(/^https?:\/\/(localhost|awesome\.app|andrepolischuk\.com)/) === null)
  .sort()

let notes = []

gulp.task('collect', () => {
  notes = []

  return gulp.src(['notes/*.md', '!notes/_*'])
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

        notes.push(Object.assign(
          {
            filename: file.relative,
            links: getLinks(article),
            url: `${basename(file.relative, extname(file.relative))}/`
          },
          extract(article, 'MMMM D, YYYY', 'en')
        ))

        next(null, false)
      },
      next => {
        notes = notes
          .filter(x => !!x.date)
          .filter(x => !!x.title)
          .filter(x => !!x.desc)
          .sort((a, b) => b.date.unix - a.date.unix)

        next()
      }
    ))())
})

gulp.task('notes', next => {
  each(notes, (note, i) => gulp.src('layouts/note.pug')
    .pipe(plumber())
    .pipe(put({
      site,
      note,
      prevNote: notes[i + 1],
      nextNote: notes[i - 1]
    }))
    .pipe(pug({
      pretty: true
    }))
    .pipe(rename({
      dirname: note.url,
      basename: 'index'
    }))
    .pipe(gulp.dest('dist')), next)
})

gulp.task('index', () =>
  gulp.src('layouts/index.pug')
    .pipe(plumber())
    .pipe(put({
      site,
      notes
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

gulp.task('links', () =>
  gulp.src('layouts/links.pug')
    .pipe(plumber())
    .pipe(put({
      site,
      links: getAllLinks(notes)
    }))
    .pipe(pug({
      pretty: true
    }))
    .pipe(rename({
      dirname: '/links/',
      basename: 'index'
    }))
    .pipe(gulp.dest('dist'))
)

gulp.task('offline', () =>
  gulp.src('layouts/offline.pug')
    .pipe(plumber())
    .pipe(put({
      site
    }))
    .pipe(pug({
      pretty: true
    }))
    .pipe(rename({
      dirname: '/',
      basename: 'offline'
    }))
    .pipe(gulp.dest('dist'))
)

gulp.task('styles', () =>
  gulp.src('styles.css')
    .pipe(plumber())
    .pipe(postcss([
      customProperties(),
      autoprefixer()
    ]))
    .pipe(gulp.dest('dist'))
)

gulp.task('rss', next => {
  let feed = new RSS(site)

  notes.forEach(note => {
    feed.item({
      title: note.title.text,
      description: note.desc.text,
      url: site.site_url + note.url,
      author: site.author,
      date: note.date.text
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

gulp.task('copy', () => gulp.src('{CNAME,favicon*,manifest*,index.js,sw.js}').pipe(gulp.dest('dist')))
gulp.task('clean', next => del(['dist'], next))

gulp.task('layout', gulp.series(
  'collect',
  gulp.parallel('notes', 'index', 'links', 'offline')
))

gulp.task('build', gulp.series(
  'clean',
  'layout',
  'rss',
  gulp.parallel('styles', 'copy')
))

gulp.task('deploy', gulp.series('build', () =>
  gulp.src('dist/**/*')
    .pipe(deploy({
      push: true,
      branch: 'master'
    }))
))

gulp.task('watch', () => {
  gulp.watch('styles.css', gulp.series('styles'))
  gulp.watch('**/*.{pug,md,json}', gulp.series('layout', 'rss'))
})

gulp.task('koa', () => {
  new Koa().use(statics('dist')).listen(3000)
})

gulp.task('default', gulp.series(
  'build',
  gulp.parallel('watch', 'koa')
))
