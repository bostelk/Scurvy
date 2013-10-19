var Map = function () {
    this.characters = [];
    this.width = 0;
    this.height = 0;
};

Map.prototype.generate = function (width, height) {
    this.width = width;
    this.height = height;

    for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
            var index = y * width + x;
            this.characters[index] = ".";
        }
    }
};

Map.prototype.draw = function () {
    for (var y = 0; y < this.height; y++) {
        for (var x = 0; x < this.width; x++) {
            var character = this.characters[y * this.width + x];
            G.display.draw(x, y, character);
        }
    }
};

Map.prototype.canMove = function (x, y) {
    var inBoundsX = (x >= 0 && x < this.width);
    var inBoundsY = (y >= 0 && y < this.height);
    return inBoundsX && inBoundsY;
};

Map.prototype.characterAt = function (x, y) {
    return this.characters [y * this.width + x];
};
