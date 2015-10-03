/**
 * Tile VO
 * @param {Number} x
 * @param {Number} y
 * @param {Number} level
 * @param {TileSlopeParam} [slopeParam]
 * @constructor
 */
var Tile = function(x, y, level, slopeParam) {
    this.x = x;
    this.y = y;
    this.level = level;

    this.hovered = false;
    this.selected = false;

    //this.uuid = Math.random().toString().substring(3);

    this.slope = slopeParam || new TileSlopeParam(0, 0, 0, 0);
};

Tile.prototype.isHovered = function() {
    return this.hovered;
};

Tile.prototype.isSelected = function() {
    return this.selected;
};
