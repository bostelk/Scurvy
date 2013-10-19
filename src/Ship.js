var Ship = function(x, y) {
    this._x = x;
    this._y = y;
}

Ship.prototype.getSpeed = function() { return 100; }
Ship.prototype.getX = function() { return this._x; }
Ship.prototype.getY = function() { return this._y; }

Ship.prototype.act = function() {
    G.engine.lock();
    window.addEventListener("keydown", this);
}

Ship.prototype.handleEvent = function(e) {
    var code = e.keyCode;
    if (code == 13 || code == 32) {
        this._checkBox();
        return;
    }

    var keyMap = {};
    keyMap[38] = 0;
    keyMap[33] = 1;
    keyMap[39] = 2;
    keyMap[34] = 3;
    keyMap[40] = 4;
    keyMap[35] = 5;
    keyMap[37] = 6;
    keyMap[36] = 7;

    /* one of numpad directions? */
    if (!(code in keyMap)) { return; }

    /* is there a free space? */
    var dir = ROT.DIRS[8][keyMap[code]];
    var newX = this._x + dir[0];
    var newY = this._y + dir[1];

    this.move (newX, newY);
}

Ship.prototype.onwards = function () {
    this.move (this._x + 1, this._y);
};

Ship.prototype.move = function (x, y) {
    if (!G.map.canMove (x, y))
        return;
    if (x == 3) {
        G.encounter.encountered = true;
    }

    this._x = x;
    this._y = y;

    window.removeEventListener("keydown", this);
    G.engine.unlock();

    G.draw ();
}

Ship.prototype.draw = function() {
    G.display.draw(this._x, this._y, "b", "#00ffff");
}
