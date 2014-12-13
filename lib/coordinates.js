function fromIsoTo2D (x, y) {
    var coords2D = {};
    coords2D.x = (2 * y + x) / 2;
    coords2D.y = (2 * y - x) / 2;
    return coords2D;
}

/**
 * converts 2d grid position of a tile to iso space coordinates
 *
 * @param {Number} tilePosX
 * @param {Number} tilePosY
 * @param {Number} tileHeight
 * @param {Number} tileWidth
 * @returns {{x: number, y: number}}
 */
function fromGridToIso(tilePosX, tilePosY, tileHeight, tileWidth) {
    var x2d = tilePosX * tileWidth / 2,
        y2d = tilePosY * tileHeight;

    return {
        x: x2d - y2d,
        y: (x2d + y2d) / 2
    };
}

function getTileCoordinates(x, y, tileHeight, tileWidth) {
    var tileCoords= {};
    tileCoords.x = Math.floor(x / tileHeight);
    tileCoords.y = Math.floor(y / tileHeight);
    return(tileCoords);
}
