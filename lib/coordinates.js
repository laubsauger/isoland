function fromIsoTo2D (x,y) {
    var coords2D = {};

    coords2D.x = (2 * y + x) / 2;
    coords2D.y = (2 * y - x) / 2;

    return coords2D;
}

function from2DtoIso(x,y) {
    var coordsIso= {};

    coordsIso.x = x - y;
    coordsIso.y = (x + y) / 2;

    return coordsIso;
}