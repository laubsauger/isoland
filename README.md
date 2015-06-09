# isoland
[![Build Status](https://travis-ci.org/laubsauger/isoland.svg?branch=master)](https://travis-ci.org/laubsauger/isoland)

canvas based isometric engine

[Demo](http://laubsauger.github.io/isoland "Demo")

## Features
### Done
- rendering
    - iso renderer (now supports 'slopes' or 'lifted vertices')
    - zoomable minimap (2d renderer)
- offscreen prerendering for all tile variations
- basic input processing
    - mouse hover

### Todo
- user modifiable terrain (see legacy code)
- pregenerate terrain with perlin noise (see legacy code)

### Setup test environment
    npm install

### Run tests
    karma start
