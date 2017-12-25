Starter kit for front end development.

## Features

### Automation
- Gulp
- Webpack
- Browsersync（html/ssi/php）

### HTML
- Pug
    - pug-linter

### CSS
- normalize.css
- Sass（node-sass）
    - sass-bulk-import
    - node-sass-package-importer
    - sourcemaps
    - csso
    - postcss
        - autoprefixer
        - css-mqpacker
- Sprite(png/svg)

### JavaScript
- BabelJS
- ESLint(eslint-config-airbnb)

### Images
- imagemin
    - pngquant
    - mozjpeg
    - svgo
    - optipng
    - gifsicle

### Component Guide
- fractal

***

## Requirements

- `node` >= 9.3.0
- `gulp` >= 3.9.1
- `sass` >= 3.4.24

***

## Getting Started

```
# clone
$ git clone git@github.com:raym-design/frontend-starter-kit.git
$ cd frontend-starter-kit

# Install Dependencies
$ yarn install

# Run the Application
$ yarn run start

# Deploy for production
$ yarn run dist
```

***

## Directory Structure

```
.
├── .babelrc
├── .browserslist
├── .eslintrc
├── .gitignore
├── .sprite-png-template
├── .sprite-svg-template
├── fractal.config.js
├── gulpfile.js
├── package.json
├── README.md
├── dist -> client-side public
├── docs -> fractal components guide
├── src
│   ├── docs
│   │   ├── components
│   │   │   ├── _preview.hbs.html
│   │   │   └── headings.hbs
│   │   └── index.md
│   ├── img
│   │   └── sprite
│   │       ├── png
│   │       └── svg
│   ├── js
│   │   └── app.js
│   ├── pug
│   │   ├── inc
│   │   │   ├── core
│   │   │   │   ├── _base.pug
│   │   │   │   ├── _config.pug
│   │   │   │   └── _mixin.pug
│   │   │   ├── layout
│   │   │   │   ├── _footer.pug
│   │   │   │   └── _header.pug
│   │   │   └── module
│   │   ├── index.pug
│   │   └── setting.json
│   └── scss
│       ├── app.scss
│       ├── components
│       ├── foundation
│       │   ├── base
│       │   │   └── _default.scss
│       │   ├── functions
│       │   │   ├── _rem.scss
│       │   │   ├── _sprite.scss
│       │   │   └── _z-index.scss
│       │   ├── mixins
│       │   │   ├── _clearfix.scss
│       │   │   ├── _media-queries-only.scss
│       │   │   ├── _media-queries.scss
│       │   │   ├── _placeholder.scss
│       │   │   ├── _responsive-iframe.scss
│       │   │   └── _sprite-image-replace.scss
│       │   └── variables
│       │       └── _variables.scss
│       ├── layout
│       │   ├── _container.scss
│       │   ├── _footer.scss
│       │   ├── _header.scss
│       │   └── _sidebar.scss
│       ├── utility
│       └── venders
├── webpack.common.js
├── webpack.dev.js
├── webpack.prod.js
└── yarn.lock
```
