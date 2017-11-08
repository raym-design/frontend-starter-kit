フロントエンド開発用のスターターキットです。

***

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
- Pleeease
- CSScomb
- CSS Sprite
- CSSLint

### JavaScript
- BabelJS
- ESLint(eslint-config-airbnb)
- jQuery
- imagesloaded

### Fonts
- font-awesome

### Images
- imagemin-pngquant（70-80%）

### Style Guide
- fractal

***

## Requirements

- `node` >= 5.12
- `gulp` >= 3.9.1
- `sass` >= 3.4

***

## Getting Started


```
# clone
$ git clone git@github.com:regret/frontend-starter-kit.git
$ cd frontend-starter-kit

# Install Dependencies
$ yarn install

# Install library
$ yarn run build

# Run the Application
$ yarn run start

# Deploy for production
$ yarn run dist
```

***

## Directory Structure

```
./
├── README.md
├── dist -> client-side public
├── docs -> fractal components guide
├── fractal.config.js
├── gulpfile.js
├── package.json
├── src
│   ├── docs
│   │   ├── components
│   │   │   ├── _preview.hbs.html
│   │   │   └── headings.hbs
│   │   └── index.md
│   ├── fonts
│   ├── img
│   │   ├── site
│   │   ├── page
│   │   └── sprite
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
│       ├── foundation
│       │   ├── _variables.scss
│       │   ├── base
│       │   │   ├── _default.scss
│       │   │   └── _normalize.scss
│       │   ├── functions
│       │   │   ├── _font-size.scss
│       │   │   └── _z-index.scss
│       │   └── mixins
│       │       ├── _clearfix.scss
│       │       ├── _media-queries-only.scss
│       │       ├── _media-queries.scss
│       │       ├── _placeholder.scss
│       │       ├── _responsive_iframe.scss
│       │       ├── _sprite-image-replace.scss
│       │       └── _sprite.scss
│       ├── layout
│       │   ├── _container.scss
│       │   ├── _footer.scss
│       │   ├── _header.scss
│       │   └── _sidebar.scss
│       └── object
│           ├── component
│           ├── project
│           ├── utility
│           ├── vender-extensions
│           └── venderes
├── webpack.config.js
└── yarn.lock
```



