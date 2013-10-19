var Splash = function(x, y) {
    this._x = x;
    this._y = y;
    this.texts = [
        "--------------------0000000000000---------------",
        "--------------------0000000000000---------------",
        "-----------------------SCURY--------------------",
        "--------------------0000000000000---------------",
    ];
}

Splash.prototype.tick = function() {
    this._y += 1;
};

Splash.prototype.draw = function() {
    for (var i = 0; i < this.texts.length; i++) {
        var text = this.texts [i];
        G.display.drawText(this._x, this._y + i, text, "red");
    }
};

