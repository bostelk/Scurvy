var Map = function () {
    this.tiles = [];
    this.entities = [];

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
            var entity = null;

            openfor -= 1;
            // pick a special tile.
            if (openfor == 0) {
                var roll = Random.betweeni (0, 2);
                if (roll == 0) {
                    entity = new PirateShip (x, y);
                } else if (roll == 1) {
                    entity = new Treasure (x, y);
                } else if (roll == 2) {
                    entity = new Storm (x, y);
                }

                openfor = Random.betweeni (0, 10);
            }

            this.tiles[index] = tile;
            this.entities[index] = entity;
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

    for (var i = 0; i < this.entities.length; i++) {
        var entity = this.entities [i];
        if (entity == null)
            continue;
        if (entity.removeNextUpdate) {
            this.entities.fastRemove (i);
            continue;
        }
        entity.draw ();
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

Map.prototype.getEntity = function (x, y) {
    return this.entities [y * this.width + x];
};

var TileType = {
    OPEN_WATER : ".",
    ROUGH_WATER : ".",
};

Map.getTileColor = function (tile) {
    var color;
    switch (tile) {
        case TileType.OPEN_WATER:
            color = "white";
        break;
        case TileType.ROUGH_WATER:
            color = "blue";
        break;
        default:
            color = "white";
    }
    return color;
};
