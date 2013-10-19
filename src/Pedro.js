var Pedro = function(x, y) {
    this._x = x;
    this._y = y;
}

Pedro.prototype.getSpeed = function() { return 100; }

Pedro.prototype.act = function() {

};

Pedro.prototype.draw = function() {
    G.display.draw(this._x, this._y, "P", "red");
};
