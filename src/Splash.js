var Splash = function(x, y) {
    var tempName = WordSmith.getCrewName ();
    this._x = x;
    this._y = y;
    this.texts = [
        "--------------------0000000000000---------------",
        "--------------------0000000000000---------------",
        "-----------------------SCUVRY--------------------",
        "-------------By:" + tempName + "-------------------",
        "--------------------0000000000000---------------",
    ];
    this.finised = false;
}

Splash.prototype.tick = function() {
    this._y += 1 * G._deltaSeconds;
    this.finished = this._y >= 10;
};

Splash.prototype.draw = function() {
    for (var i = 0; i < this.texts.length; i++) {
        var text = this.texts [i];
        G.display.drawText(this._x, this._y + i, text, "red");
    }
};

