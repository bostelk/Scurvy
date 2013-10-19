var Treasure = function (x, y) {
    this.x = x;
    this.y = y;
    this.removeNextUpdate = false;
};

Treasure.prototype.draw = function () {
    G.display.draw(this.x, this.y, "T", "yellow");
};

Treasure.prototype.toString = function () {
    return "A fistfull of quarters (40 points)";
};
