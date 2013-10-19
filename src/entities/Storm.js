var Storm = function (x, y) {
    this.x = x;
    this.y = y;
    this.removeNextUpdate = false;
};

Storm.prototype.draw = function () {
    G.display.draw(this.x, this.y, "@", "blue");
};
