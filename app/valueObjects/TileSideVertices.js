/**
 * TileRightSideVertices VO
 * @param {Pos} topLeftVertexPos
 * @param {Pos} topRightVertexPos
 * @param {Pos} bottomRightVertexPos
 * @param {Pos} bottomLeftVertexPos
 * @constructor
 */
var TileRightSideVertices = function(topLeftVertexPos, topRightVertexPos, bottomRightVertexPos, bottomLeftVertexPos) {
    this.topLeft = topLeftVertexPos;
    this.topRight = topRightVertexPos;
    this.bottomRight = bottomRightVertexPos;
    this.bottomLeft = bottomLeftVertexPos;
};

/**
 * TileRightSideVertices VO
 * @param {Pos} topLeftVertexPos
 * @param {Pos} topRightVertexPos
 * @param {Pos} bottomRightVertexPos
 * @param {Pos} bottomLeftVertexPos
 * @constructor
 */
var TileLeftSideVertices = function(topLeftVertexPos, topRightVertexPos, bottomRightVertexPos, bottomLeftVertexPos) {
    this.topLeft = topLeftVertexPos;
    this.topRight = topRightVertexPos;
    this.bottomRight = bottomRightVertexPos;
    this.bottomLeft = bottomLeftVertexPos;
};
