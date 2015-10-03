/**
 * TileSlopeParam VO
 * @param {int} top
 * @param {int} right
 * @param {int} bottom
 * @param {int} left
 * @constructor
 */
var TileSlopeParam = function(top, right, bottom, left) {
    this.top = top;
    this.right = right;
    this.bottom = bottom;
    this.left = left;
};

/**
 * @returns {string}
 */
TileSlopeParam.prototype.toString = function() {
    return this.top + "," + this.right + "," + this.bottom + "," + this.left;
};
