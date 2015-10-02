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

    this.hovered = false;
    this.selected = false;

    //this.uuid = Math.random().toString().substring(3);

    this.elevate = elevateParam || new TileElevateParam(0, 0, 0, 0);
};

Tile.prototype.isHovered = function() {
    return this.hovered;
};

Tile.prototype.isSelected = function() {
    return this.selected;
};
