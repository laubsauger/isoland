/**
 * Tile VO
 * @param {Number} x
 * @param {Number} y
 * @param {Number} level
 * @param {TileElevateParam} [elevateParam]
 * @constructor
 */
var Tile = function(x, y, level, elevateParam) {
    this.x = x;
    this.y = y;
    this.level = level;
    this.elevate = elevateParam || new TileElevateParam(0, 0, 0, 0);
    this.hasFocus = false;
};
