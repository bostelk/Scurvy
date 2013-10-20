var GameState = {
    TITLE: 0,
    PORT: 1,
    VOYAGE: 2,
    GAME_OVER: 4
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

    this.splash = new Splash (0, 0);

    this.switchState (GameState.TITLE);
};

Game.prototype.newGame = function() {
    this.map = new Map ();
    this.map.generate (80, 1);

    this.ship = new Ship (0, 0);
    this.splash = new Splash (0, 0);

    // the adventure starts: day, month, year.
    this.date = new Date (1700, 9, 1);
    this.voyages = [];
};

Game.prototype.newVoyage = function() {
    this.map.generate (80, 1);
    this.ship._x = 0;
    this.ship._y = 0;

    this.voyages.push ({});
    this.voyages [this.voyages.length - 1]["start"] = new Date (this.date);
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
                this.switchState (GameState.PORT);
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
        case GameState.PORT:
            this.display.clear ();
            this.drawLog();
            this.drawStatus();
            break;
        case GameState.VOYAGE:
            this.display.clear ();
            this.map.draw ();
            this.ship.draw ();
            this.drawLog();
            this.drawStatus();
            //normal maps go here yo!
            break;
        case GameState.GAME_OVER:
            this.display.clear ();
            this.drawLog();
            this.drawStatus();
            break;
    }
};

Game.prototype.drawStatus = function () {
    var info = "Ship:{0}   Hull:{1}/{2}   Crew:{3}/{4}   Date:{5}".format (
        this.ship,
        this.ship.health,
        this.ship.maxHealth,
        this.ship.crewMembers.length,
        this.ship.maxCrew,
        this.date.toDateString()
        //this.ship.getShipDamageString()
    );
    var moreinfo = "Doubloons:{0}  Food:{1}    Items:{2} CrewDetals:{3}".format (
        this.ship.doubloons,
        this.ship.food,
        this.ship.getItemString (),
        this.ship.crewInfo ()
    );
    this.display.drawText (0, 8, info);
    this.display.drawText (0, 9, moreinfo);
};

Game.prototype.drawLog = function () {
    for (var i = 0; i < this.messages.length; i++) {
        var message = this.messages [this.messages.length - 1- i];
        this.display.drawText (0, 7 - i, message);
    }
};

Game.prototype.enterState = function (state) {
    // hide all buttons.
    document.getElementById("port").style.display = "none";
    document.getElementById("title").style.display = "none";
    document.getElementById("voyage").style.display = "none";
    document.getElementById("game_over").style.display = "none";

    switch (this.state) {
        case GameState.TITLE:
            document.getElementById("title").style.display = "block";
            this.display.clear();
            this.newGame ();
            break;
        case GameState.PORT:
            document.getElementById("port").style.display = "block";
            this.display.clear();
            this.messages.clear();

            // the ship is built on the first voyage.
            if (this.voyages.length == 0) {
                this.log ("The %c{gold}{0}%c{} is built!".format (this.ship.toString()));
                for (var i = 0; i < this.ship.crewMembers.length; i++) {
                    var member = this.ship.crewMembers [i];
                    this.log ("%c{green}{0} joins%c{} your crew as {1}.".format (
                        member.name,
                        Crew.RankValues[member.rank]
                    ));
                }
            // back from the long voyage.
            } else {
                this.voyages [this.voyages.length - 1]["end"] = new Date (this.date);
                var voyage = this.voyages [this.voyages.length - 1];

                var days = (voyage.end - voyage.start) / (60 * 60 * 24 * 1000);
                G.log ("The {0} returns from being %c{teal}{1} days%c{} at sea.".format (
                    this.ship.toString (),
                    days
                ));

                // the crew works for 10 doublins/day, excluding the captain.
                var cost = (this.ship.crewMembers.length - 1 - 1) * days * 10;
                this.ship.doubloons -= cost;
                G.log ("The crew takes their share. %c{yellow}{0} doubloons%c{} lost.".format (
                    cost
                ));
            }

            this.newVoyage ();
            break;
        case GameState.VOYAGE:
            document.getElementById("voyage").style.display = "block";

            this.display.clear();
            this.messages.clear();

            G.log ("On %c{teal}{0}%c{} the %c{gold}{1}%c{} set sail for %c{teal}{2}%c{}.".format(
                this.date.toDateString(),
                this.ship.toString (),
                WordSmith.getPlace ()
            ));
            break;
        case GameState.GAME_OVER:
            this.voyages [this.voyages.length - 1]["end"] = new Date (this.date);
            document.getElementById("game_over").style.display = "block";
            this.display.clear ();
            this.messages.clear ();

            G.log ("%c{red}The {0} sinks to the bottom of the ocean.%c{}".format(this.ship.toString()));

            var totalPiratesSunk = 0;
            var totalDays = 0;
            for (var i = 0; i < this.voyages.length; i++) {
                var voyage = this.voyages[i];

                totalDays += (voyage.end - voyage.start) / (60 * 60 * 24 * 1000);
                if ("pirates_sunk" in voyage) {
                    totalPiratesSunk += voyage;
                }
            }

            G.log ("The {0} went on {1} {2}.".format (
                this.ship.toString (),
                this.voyages.length,
                this.voyages.length > 1 ? "voyages" : "voyage"
            ));

            G.log ("The {0} sunk {1} pirate ships.".format (
                this.ship.toString (),
                totalPiratesSunk
            ));

            G.log ("The {0} was at sea for a total of {1} {2}.".format (
                this.ship.toString (),
                totalDays,
                totalDays > 1 ? "days" : "day"
            ));
            break;
    }
};

Game.prototype.exitState = function (state) {
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
        G.log ("Bought %c{green}{0} bushels%c{} of food.".format(amount, cost));
    } else {
        G.log ("%c{red}We're broke dog.%c{}".format(amount));
    }
};

Game.prototype.sellFood = function (amount) {
    var value = amount * 0.9;
    if (this.ship.food - amount >= 0) {
        this.ship.food -= amount;
        this.ship.doubloons += value;
        G.log ("Sold %c{green}{0} bushels%c{} of food.".format(amount, value));
    } else {
        G.log ("%c{red}There's nothing left!%c{}".format(amount));
    }
};

Game.prototype.hireCrew = function (rank) {
    var cost = Crew.getCost (rank);
    if (this.ship.crewMembers.length >= this.ship.maxCrew) {
        G.log ("%c{red}The ship cannot hold another soul!%c{}");
    } else if (this.ship.doubloons - cost >= 0) {
        var member = new Crew();
        member.rank = rank;
        this.ship.doubloons -= cost;
        G.log ("Hired %c{orange}{0}%c{} as %c{purple}{1}%c{}.".format (
            member.name,
            Crew.RankValues[member.rank],
            cost
        ));
        this.ship.crewMembers.push (member);
    } else {
        G.log ("%c{red}We're broke dog.%c{}");
    }
};

Game.prototype.fireCrew = function () {
    if (this.ship.crewMembers.length > 1) {
        var member = this.ship.crewMembers.pop ();
        //var value = member.getValue () * 0.9;
        //this.ship.doubloons += value;
        G.log ("Fired %c{orange}{0}%c{}.".format (member.name));
    } else {
        G.log ("The captain stays.");
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
        G.log ("The %c{green}{1}%c{} is too much. Need %c{yellow}{0} more doubloons%c{}.".format(
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
