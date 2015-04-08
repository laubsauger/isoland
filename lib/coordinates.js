/**
 * converts 2d grid position of a tile to iso space coordinates
 *
 * @param {Pos} tileGridPos
 * @param {Number} tileHeight
 * @param {Number} tileWidth
 * @returns {Pos}
 */
function fromGridIndexToIsoPos(tileGridPos, tileHeight, tileWidth) {
    var x2d = tileGridPos.x * tileWidth / 2,
        y2d = tileGridPos.y * tileHeight;

    return new Pos(
        x2d - y2d,
        (x2d + y2d) / 2
    );
}

function fromIsoTo2D (x, y) {
    var coords2D = {};
    coords2D.x = (2 * y + x) / 2;
    coords2D.y = (2 * y - x) / 2;
    return coords2D;
}
function getTileCoordinates(x, y, tileHeight, tileWidth) {
    var tileCoords= {};
    tileCoords.x = Math.floor(x / tileHeight);
    tileCoords.y = Math.floor(y / tileHeight);
    return(tileCoords);
}
