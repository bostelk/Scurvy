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
    this.date = null;
};

Game.MAX_LOG_ENTRIES = 6;

Game.prototype.init = function() {
    this.display = new ROT.Display ({
        width: 80,
        height: 10,
        fontFamily: "monospace",
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

    this.voyages = [];

    this.switchState (GameState.START_VOYAGE);
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

    this.tick ();

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
        case GameState.END_GAME:
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
        this.ship.maxCrew,
        this.date.toDateString()
        //this.ship.getShipDamageString()
    );
    var moreinfo = "Doubloons:{0} Food:{1} Items:{2}".format (
        this.ship.doubloons,
        this.ship.food,
        this.ship.getItemString ()
    );
    this.display.drawText (0, 8, info);
    this.display.drawText (0, 9, moreinfo);

    for (var i = 0; i < this.messages.length; i++) {
        var message = this.messages [this.messages.length - 1- i];
        this.display.drawText (0, 7 - i, message);
    }
};

Game.prototype.enterState = function (state) {
    switch (this.state) {
        case GameState.TITLE:
            document.getElementById("title").style.display = "block";
            document.getElementById("start_voyage").style.display = "none";
            document.getElementById("voyage").style.display = "none";
            break;
        case GameState.START_VOYAGE:
            document.getElementById("start_voyage").style.display = "block";
            document.getElementById("title").style.display = "none";
            document.getElementById("voyage").style.display = "none";

            this.log ("The {0} is built!".format (this.ship.toString()));
            for (var i = 0; i < this.ship.crewMembers.length; i++) {
                var member = this.ship.crewMembers [i];
                this.log ("%c{green}{0} joins%c{} your crew as {1}.".format (
                    member.name,
                    Crew.RankValues[member.rank]
                ));
            }

            this.voyages.push ({});
            this.voyages [this.voyages.length - 1]["start"] = new Date (this.date);
            //G.log ("Gather supplies for your voyage.");
            break;
        case GameState.VOYAGE:
            this.display.clear();
            this.messages.clear();
            document.getElementById("voyage").style.display = "block";
            document.getElementById("title").style.display = "none";
            document.getElementById("start_voyage").style.display = "none";

            G.log ("%c{gold}{0}%c{} marks the start of your long voyage.".format(this.date.toDateString()));
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

    if (this.messages.length > Game.MAX_LOG_ENTRIES) {
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

Game.prototype.hireCrew = function () {
    var cost = 100;
    if (this.ship.doubloons - cost >= 0 && this.ship.crewMembers.length < this.ship.maxCrew) {
        var member = new Crew();
        this.ship.doubloons -= cost;
        G.log ("Recruited %c{orange}{0}%c{} as %c{purple}{1}%c{} for %c{yellow}{2}%c{} doubloons.".format (
            member.name,
            Crew.RankValues[member.rank],
            cost
        ));
        this.ship.crewMembers.push (member);
    } else {
        G.log ("%c{red}We're full!%c{}");
    }
};

Game.prototype.fireCrew = function () {
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
    var cost = ItemCost[type];
    if (type in this.ship.has) {
        G.log ("The %c{green}{0}%c{} has already been bought.".format(type));
    } else if (this.ship.doubloons >= cost) {
        this.ship.doubloons -= cost;
        this.ship.has [type] = 1;
        G.log ("%c{green}{0}%c{} Git!".format(type));
    } else {
        var need = cost - this.ship.doubloons;
        G.log ("Need %c{yellow}{0} more doubloons%c{} for the %c{green}{1}%c{}.".format(
            need,
            type
        ));
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

// @src http://blog.stevenlevithan.com/archives/javascript-roman-numeral-converter
function romanize (num) {
    if (!+num)
        return false;
    var digits = String(+num).split(""),
        key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
               "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
               "","I","II","III","IV","V","VI","VII","VIII","IX"],
        roman = "",
        i = 3;
    while (i--)
        roman = (key[+digits.pop() + (i * 10)] || "") + roman;
    return Array(+digits.join("") + 1).join("M") + roman;
};
