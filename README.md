[![Build Status](https://travis-ci.org/laubsauger/isoland.svg?branch=master)](https://travis-ci.org/laubsauger/isoland)
# isoland
canvas based isometric engine


## Features
### Done
- basic rendering
    - iso renderer
    - zoomable minimap (2d renderer)
    
- basic input processing
    - mouse hover

### Todo
- offscreen prerendering for all tile variations
- user modifiable terrain (see legacy code)
- pregenerate terrain with perlin noise (see legacy code)


## Test environment
- node.js
  - phantomjs
  - karma
    - karma-jasmine
    - karma-phantomjs-launcher
    - karma-coverage
  
### Setup test environment
    npm install

### Run tests
    karma start
