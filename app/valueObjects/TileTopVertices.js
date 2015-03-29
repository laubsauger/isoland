/**
 * TileVertices VO
 * @param {Pos} topVertexPos
 * @param {Pos} rightVertexPos
 * @param {Pos} bottomVertexPos
 * @param {Pos} leftVertexPos
 * @constructor
 */
var TileTopVertices = function(topVertexPos, rightVertexPos, bottomVertexPos, leftVertexPos) {
    this.top = topVertexPos;
    this.right = rightVertexPos;
    this.bottom = bottomVertexPos;
    this.left = leftVertexPos;
};
