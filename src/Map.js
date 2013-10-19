var Map = function () {
    this.tiles = [];
    this.entities = [];
    this.days = 80;

    this.width = 0;
    this.height = 0;
    this.distance = 1000;
};

Map.prototype.generate = function (width, height) {
    this.width = width;
    this.height = height;

    for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
            var index = y * width + x;
            var tile = TileType.OPEN_WATER;
            var entity = null;
            rand = Random.betweeni(1, 3);
            //rand = x;
            if (rand == 1) {
                entity = new PirateShip (x, y);
            } else if (rand == 2) {
                entity = new Treasure (x, y);
            } else if (rand == 3) {
                entity = new Storm (x, y);
            }

            this.tiles[index] = tile;
            this.entities[index] = entity;
        }
    }
};

Map.prototype.draw = function () {
    for (var i = 0; i < this.entities.length; i++) {
        var entity = this.entities [i];
        if (entity == null)
            continue;
        if (entity.removeNextUpdate) {
            this.entities.fastRemove (i);
            continue;
        }
    }

    for (var y = 0; y < this.height; y++) {
        for (var x = 0; x < this.width; x++) {
            var distance = Math.abs (x - G.ship._x);
            var isVisible = distance < G.ship.getVisibility;
            if (isVisible) {
                var tile = this.tiles[y * this.width + x];
                var color = Map.getTileColor (tile);
                G.display.draw(x, y, tile, color);

                var entity = this.entities [y * this.width +x];
                if (entity != null)
                    entity.draw();
            } else {
                G.display.draw(x, y, "?", "white", "grey");
            }
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

Map.shift = function () {
    for ( var i = 0; i < this.entities.length; ++i) {
        entities[i].x -= 1;
        days -= 1;
    }
}
