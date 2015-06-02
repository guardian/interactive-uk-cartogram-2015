# interactive-election2015-uk-cartogram
UK cartogram for constituency explorer and seat change mapper:

[what did the opinion polls say about your seat?](http://www.theguardian.com/politics/ng-interactive/2015/apr/20/election-2015-constituency-map)

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

