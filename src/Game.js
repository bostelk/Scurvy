var GameState = {
    TITLE: 0,
    START_VOYAGE: 1,
    VOYAGE: 2,
    END_VOYAGE: 3,
    FINISHED: 4
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

    this.state = null;
    this.switchState (GameState.START_VOYAGE);

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

    if (this._totalSeconds >= this._lastTickTime + 1) {
        this._lastTickTime = this._totalSeconds;
        this.tick ();
    }

    this._lastFrameTime = now;
    this._tickId = Browser.requestTick(this.internalTick.bind(this));
};

Game.prototype.tick = function () {
    switch (this.state) {
        case GameState.TITLE:
            this.splash.tick ();
            if (this.splash.finished)
                this.switchState (GameState.VOYAGE);
            break;
        case GameState.START_VOYAGE:
            break;
        case GameState.VOYAGE:
            break;
        case GameState.END_VOYAGE:
            break;
        case GameState.FINISHED:
            break;
    }

    this.draw ();
};

Game.prototype.draw = function () {
    switch (this.state) {
        case GameState.TITLE:
            this.display.clear ();
            this.splash.draw ();
            break;
        case GameState.START_VOYAGE:
            this.drawStatus();
            break;
        case GameState.VOYAGE:
            this.display.clear ();
            this.map.draw ();
            this.ship.draw ();
            this.drawStatus();
            //normal maps go here yo!
            break;
        case GameState.END_VOYAGE:
            break;
        case GameState.FINISHED:
            break;
    }
};

Game.prototype.drawStatus = function () {
    var info = "Ship:{0}   Hp:{1}/{2}   Crew:{3}/{4}   Date:{5}".format (
        this.ship,
        this.ship.health,
        this.ship.maxHealth,
        this.ship.crewMembers.length,
        Ship.CREW_SIZE,
        this.date.toDateString(),
        //this.ship.getShipDamageString()
    );
    this.display.drawText (0, 8, info);

    var moreinfo = "Booty: {0} Food: {1}".format (this.ship.doubloons, this.ship.food);
    this.display.drawText (0, 9, moreinfo);

    for (var i = 0; i < this.messages.length; i++) {
        var message = this.messages [this.messages.length - 1- i];
        this.display.drawText (0, 7 - i, message);
    }
};

Game.prototype.enterState = function (state) {
    switch (this.state) {
        case GameState.TITLE:
            break;
        case GameState.START_VOYAGE:
            document.getElementById("start_voyage").style.display = "block";
            document.getElementById("voyage").style.display = "none";
            break;
        case GameState.VOYAGE:
            document.getElementById("start_voyage").style.display = "none";
            document.getElementById("voyage").style.display = "block";
            break;
        case GameState.END_VOYAGE:
            break;
        case GameState.FINISHED:
            break;
    }
};

Game.prototype.exitState = function (state) {
    switch (this.state) {
        case GameState.TITLE:
            break;
        case GameState.START_VOYAGE:
            break;
        case GameState.VOYAGE:
            break;
        case GameState.END_VOYAGE:
            break;
        case GameState.FINISHED:
            break;
    }
};

Game.prototype.switchState = function (state) {
    if (this.state != null)
        this.exitState (this.state);
    this.state = state;
    this.enterState (this.state);
};

Game.prototype.log = function (message) {
    message = message.toString ();
    console.log (message);

    if (this.messages.length > 4) {
        this.messages.shift ();
        this.messages.push (message);
    } else {
        this.messages.push (message);
    }
};

Game.prototype.spendDays = function (amount) {
    //fun
    for ( var i = 0; i < amount; ++i) {
        this.ship.consumeFood();
    }
    this.date.setTime(G.date.getTime() + 60 * 60 * 24 * 1000 * amount);
};

Game.main = function () {
    var game = new Game ();
    game.init ();
    return game;
};
