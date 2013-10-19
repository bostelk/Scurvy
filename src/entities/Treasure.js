var Treasure = function (x, y) {
    this.x = x;
    this.y = y;
    this.removeNextUpdate = false;
};

Treasure.prototype.draw = function () {
    G.display.draw(this.x, this.y, "T", "yellow");
};
