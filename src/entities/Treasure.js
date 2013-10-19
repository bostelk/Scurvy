var Treasure = function (x, y) {
    this.x = x;
    this.y = y;
    this.removeNextUpdate = false;
};

Treasure.prototype.draw = function () {
    G.display.draw(this.x, this.y, "T", "yellow");
};

Treasure.prototype.toString = function () {
    return "Found a fistfull of quarters %c{yellow}worth {0} gold%c{}.".format (50);
};
