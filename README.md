# interactive-uk-cartogram-2015 
UK cartogram for 2015 general election: constituency explorer and seat change mapper

## Getting started
If you haven't already installed the following requirements:

* [nodejs](http://nodejs.org/download/)
* [grunt-cli](http://gruntjs.com/getting-started) 
* [bower](http://bower.io/)
* [ruby](https://www.ruby-lang.org/en/documentation/installation/)
* [sass](http://sass-lang.com/install)


Next, install all the dependency packages and start the app:
```bash
> npm install
> bower install
> grunt
```

You can now view the example project running at [http://localhost:9000/]

## Project structure
The interactive template comes with a sample project that loads a template HTML
file, local JSON and remote JSON. Modify, replace or delete whatever you need
for your project.

The template uses requireJS to namespace, concatenate and minify the final output
code, it also allows the simplified inclusion of third-party libraries via
bower. Therefore, it would be preferable if you write your code as AMD modules.

```
/build (grunt build output folder)
/src
    - boot.js (the main boot.js for inline loading, see Loading interactives)
    - index.html (used for local testing of boot.js)
    /embed
        - index.html (used for iframe embed loading)
        - boot.js (used for iframe embed loading)
    /js
        - main.js (the starting point for the whole interactive)
        - require.js (requireJS config paths to third-party libraries)
        /data (sample local data)
        /templates (sample template HTML)
    /imgs
    /css
        - main.scss (the main interactive's SASS CSS styles)
        /modules (additional SASS CSS modules)
```


## Loading interactives
There are two methods of running an interactive on a Guardian page, first is the
`boot.js` which allows for JavaScript injection of assets directly into the page.
The other method is via an `iframe`.

By default the interactive template supports both of these methods, it's up to 
you to decide which is most appropriate for the type of interactive being built.

### 1. In-line loading via `boot.js` 
If you want to run inside scope of Guardian page and not within an iframe you'll
need to choose the `boot.js` method. All assets including HTML will need to be
dynamically loaded. The example project included in this template compiles
HTML files into a single JavaScript file. However, you are free to load assets
in anyway you see fit.

Notes on `boot.js`:

* Full access to page DOM
* Running in Guardian page's scope
* Access to user's details via Identity
* Reduced performance overhead
* No need for iframe-messenger
* Requires an AMD `boot.js` boot loader file

### 2. Embed loading via `<iframe>`
A simpler option is to load the interactive via an `<iframe>`, this allows you to 
use standard HTML pages and `<script> <link>` tags to load resources. It can be
useful when working with third-party code. However, the interactive will be
running from the `interactive.guim.co.uk` domain and therefore will not have
access to the Guardian page or user details via identity.

**NOTE**  You must use a URL with the `/embed/` path for it to be iframed.

Iframes are useful when the interactive is intended to be embedded in multiple 
articles, such as story package navigation or widget.

Notes on `<iframe>`:

* Self-contained scope
* Simpler development
* No need to write AMD modules
* Requires iframe-messenger for resizing
* Embeddable in multiple pages (and external sites)
* No access to Guardian DOM or scope
* No access to user's details or Identity


## Pathing to assets
When you want to path to an asset, eg `imgs/cat.gif` you will need to prefix
the path with `@@assetPath@@`, this will be replaced with the absolute path.

An absolute path is required because interactives running via `boot.js` 
are on the guardian.com domain. Therefore, any relative URLs will resolve to
guardian.com instead of interactive.guim.co.uk or localhost.

## Installing additional libraries
If you need to use any additional libraries such as D3 or jquery then use:

`bower install d3 --save`

That will update the `bower.json` dependency file and allow requirejs to bundle
the library into the main js.

You can then require the library directly into your code via the define function:

```javascript
define(['d3', function(d3) {
  var chart = d3.box();
});
```

## Deploying to S3
Once you ready to deploy to S3 you can use grunt to upload your files.

First you'll need to specify where the files are to be uploaded, this
is done in the `package.json` file. This path should have been specified
during the project setup but it can be changed at any time.

In the `package.json` there is a section for `config` which contains
the path to the S3 folder that the deploy task will upload to.

```json
  "config": {
    "s3_folder": "embed/testing/path/"
  },
```

You will also need to export your AWS credentials into your ENV variables.
Add the following to your `~/.bashrc` or `~/.bash_profile`:

```bash
export AWS_ACCESS_KEY_ID=xxxxxxxx
export AWS_SECRET_ACCESS_KEY=xxxxxx
```

Next you'll want to simulate the upload to ensure it's going to do what
you think it will.
```bash
> grunt deploy --test
```

Once you're happy everything looks good, deploy for real.
```bash
> grunt deploy
```

## Embedded iframe link target
The embed `index.html` includes a [`<base>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base) tag in the `<head>` with a `target` attribute of `_top`. This will force links
to load in the parent page.

```html
<!-- HTML page that is being embedded in the iframe -->
<head>
    ...
    <base target="_top" />
    ...
</head>
```
