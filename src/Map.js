var Map = function () {
    this.tiles = [];
    this.width = 0;
    this.height = 0;
};

Map.prototype.generate = function (width, height) {
    this.width = width;
    this.height = height;

    var openfor = Random.betweeni (0, 10);

    for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
            var index = y * width + x;
            var tile = TileType.OPEN_WATER;

            openfor -= 1;
            // pick a special tile.
            if (openfor == 0) {
                tile = TileType.PIRATES;
                openfor = Random.betweeni (0, 10);
            }

            this.tiles[index] = tile;
        }
    }
};

Map.prototype.draw = function () {
    for (var y = 0; y < this.height; y++) {
        for (var x = 0; x < this.width; x++) {
            var tile = this.tiles[y * this.width + x];
            var color = Map.getTileColor (tile);
            G.display.draw(x, y, tile, color);
        }
    }
};

Map.prototype.canMove = function (x, y) {
    var inBoundsX = (x >= 0 && x < this.width);
    var inBoundsY = (y >= 0 && y < this.height);
    return inBoundsX && inBoundsY;
};

Map.prototype.getTile = function (x, y) {
    return this.tiles [y * this.width + x];
};

var TileType = {
    OPEN_WATER : ".",
    TREASURE : "?",
    PIRATES : "P",
    STORM : "@"
};

Map.getTileColor = function (tile) {
    var color;
    switch (tile) {
        case TileType.OPEN_WATER:
            color = "white";
        break;
        case TileType.TREASURE:
            color = "yellow";
        break;
        case TileType.PIRATES:
            color = "red";
        break;
        case TileType.STORM:
            color = "blue";
        break;
        default:
            color = "white";
    }
    return color;
};
