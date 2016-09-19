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
- interaction
    - tile hover
    - tile selection
    - rotate viewport cw/ccw

### Todo
- user modifiable terrain (see legacy code)
- pregenerate terrain with perlin noise (see legacy code)

### Setup test environment
    npm install

### Run tests
    karma start

#### Bugs
    - hover works on tiles that are not in the viewport
    - hover has to be cleared on rotation (same behaviour as selection before fix)

#### Next up
    - move viewport across map (controls: N,E,S,W + between e.g. NE, SW, SE etc)
    - refactor select/hover effects to be rendered after the terrain to avoid occlusion