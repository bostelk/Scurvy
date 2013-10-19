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
            this.display.clear ();
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
        this.date.toDateString()
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
            this.display.clear();
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

Game.prototype.buyFood = function (amount) {
    var cost = amount * 1;
    if (this.ship.doubloons - cost >= 0) {
        this.ship.doubloons -= cost;
        this.ship.food += amount;
        G.log ("Bought %c{green}{0} bushels%c{} of food for {0} %c{yellow}doubloons%c{}.".format(amount, cost));
    } else {
        G.log ("%c{red}We're broke dog.%c{}".format(amount));
    }
};

Game.prototype.sellFood = function (amount) {
    var value = amount * 0.9;
    if (this.ship.food - amount >= 0) {
        this.ship.food -= amount;
        this.ship.doubloons += value;
        G.log ("Sold %c{green}{0} bushels%c{} of food for %c{yellow}{1} doubloons%c{}.".format(amount, value));
    } else {
        G.log ("%c{red}There's nothing left!%c{}".format(amount));
    }
};

Game.prototype.buyCrew = function (amount) {
    if (this.ship.crewMembers.length < Ship.CREW_SIZE) {
        var member = new Crew();
        var value = member.getValue ();
        this.ship.doubloons -= value;
        G.log ("Recruited %c{orange}{0}%c{} as %c{purple}{1}%c{} for %c{yellow}{2}%c{}.".format (
            member.name,
            Crew.RankValues[member.rank],
            value
        ));
        this.ship.crewMembers.push (member);
    } else {
        G.log ("%c{red}We're full!%c{}");
    }
};

Game.prototype.sellCrew = function (amount) {
    if (this.ship.crewMembers.length > 6) {
        var member = this.ship.crewMembers.pop ();
        //var value = member.getValue () * 0.9;
        //this.ship.doubloons += value;
        G.log ("Fired %c{orange}{0}%c{}.".format (member.name));
    } else {
        G.log ("The elite six stick around.");
    }
};

Game.prototype.buyItem = function (type) {
    var cost = 100;
    if (type in this.ship.has) {
        G.log ("The %c{green}{0}%c{} has already been bought.".format(type));
    } else if (this.ship.doubloons >= cost) {
        this.ship.doubloons -= cost;
        this.ship.has [type] = true;
        G.log ("%c{green}{0}%c{} Git!".format(type));
    } else {
        G.log ("Not enough Booty for the %c{green}{0}%c{}.".format(type));
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
