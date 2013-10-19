var GameState = {
    TITLE: 0,
    DISCOVERY: 1,
    FINISHED: 2
};

var Game = function () {
    this.MILLI_TO_SECONDS = 1 / 1000;

    this._lastTickTime = 0;
    this._lastFrameTime = 0;
    this._deltaSeconds = 0;
    this._totalSeconds = 0;

    this._tickId = null;
    this.display = null;
    this.map = null;
    this.ship = null;
    this.messages = [];
    this.state = GameState.DISCOVERY;

    this.date = null;
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

    // the adventure starts: day, month, year.
    this.date = new Date (1700, 9, 1);
};

Game.prototype.start = function() {
    this._tickId = Browser.requestTick(this.internalTick.bind(this));

    this.draw ();
};

Game.prototype.internalTick = function () {
    var now = Date.now ();
    if (this._lastFrameTime == 0)
        this._lastFrameTime = now;

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
    switch (this.state) {
        case GameState.TITLE:
            this.display.clear ();
            this.splash.tick ();
            this.splash.draw ();
            if (this.splash.finished)
                this.switchState (GameState.DISCOVERY);
            break;
        case GameState.DISCOVERY:
            this.draw ();
            break;
        case GameState.FINISHED:
            break;
    }
};

Game.prototype.log = function (message) {
    console.log (message.toString ());
    this.messages.push (message.toString ());
};

Game.prototype.switchState = function (state) {
    this.state = state;
};

Game.prototype.spendDays = function (amount) {
    this.date.setTime(G.date.getTime() + 60 * 60 * 24 * 1000 * amount);
};

Game.prototype.draw =function () {
    this.display.clear ();

    this.map.draw ();
    this.ship.draw ();

    //normal maps go here yo!

    var info = "Ship:{0}   Hp:{1}/{2}   Crew:{3}/{4}   Date:{5}".format (
        this.ship,
        this.ship.health,
        this.ship.maxHealth,
        this.ship.crewMembers.length,
        Ship.CREW_SIZE,
        this.date.toDateString()
    );
    this.display.drawText (0, 9, info);

    if (this.messages.length > 0) {
        var message = this.messages.pop ();
        this.display.drawText (0, 8, message);
    }
};

Game.main = function () {
    var game = new Game ();
    game.init ();
    return game;
};
