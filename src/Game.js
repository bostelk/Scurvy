var Game = function () {
    this.MILLI_TO_SECONDS = 1 / 1000;

    this._lastTickTime = 0;
    this._lastFrameTime = 0;
    this._deltaSeconds = 0;
    this._totalSeconds = 0;

    this._tickId = null;
    this.display = null;
    this.map = null;
    this.engine = null;
    this.ship = null;
};

Game.prototype.init = function() {
    this.display = new ROT.Display ({
        width: 80,
        height: 10,
        spacing:1.1
    });

    var screen = document.getElementById ("screen");
    screen.appendChild(this.display.getContainer());

    this.map = new Map ();
    this.map.generate (80, 1);

    this.ship = new Ship (0, 0);
    this.splash = new Splash (0, 0);
};

Game.prototype.start = function() {
    this._tickId = Browser.requestTick(this.internalTick.bind(this));

    this.draw ();
};

Game.prototype.internalTick = function () {
    var now = Date.now ();
    this._deltaSeconds = (now - this._lastFrameTime) * this.MILLI_TO_SECONDS;
    this._totalSeconds += this._deltaSeconds;

    if (this._totalSeconds > this._lastTickTime + 1) {
        this._lastTickTime = this._totalSeconds;
        this.tick ();
    }

    this._lastFrameTime = now;
    this._tickId = Browser.requestTick(this.internalTick.bind(this));
};

Game.prototype.tick = function () {
    this.splash.tick ();
    this.draw ();
};

Game.prototype.draw =function () {
    this.display.clear ();

    this.map.draw ();
    this.ship.draw ();

    this.display.drawText (0, 1, "Your ship: Bluenose ", 50);

    this.splash.draw ();
};

Game.main = function () {
    var game = new Game ();
    game.init ();
    return game;
};
