var Ship = function(x, y) {
    this.maxHealth = 100;
    this.health = this.maxHealth;
    this.bosunIsAlive = true;

    this.crewMembers = [];

    for( var i = 0; i < Ship.CREW_SIZE; ++i ){
        this.crewMembers.push(new Crew());
    }
    // manage crew roles.
    this.crewMembers[0].rank = Crew.RankEnum.Captain;
    this.crewMembers[1].rank = Crew.RankEnum.FirstMate;
    this.crewMembers[3].rank = Crew.RankEnum.Bosun;
    this.crewMembers[4].rank = Crew.RankEnum.WatchLeader;
    this.crewMembers[5].rank = Crew.RankEnum.WatchLeader;
    this.crewMembers[6].rank = Crew.RankEnum.Cook;

    this._x = x;
    this._y = y;
}

Ship.CREW_SIZE = 20;

Ship.prototype.getSpeed = function() { return 100; }
Ship.prototype.getX = function() { return this._x; }
Ship.prototype.getY = function() { return this._y; }

Ship.prototype.act = function() {
    window.addEventListener("keydown", this);
};

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
};

var SailRate = {
    FULL : 0,
    HALF : 1,
};

Ship.prototype.sail = function (rate) {
    var eff = this.getSailEff ();

    this.move (this._x + 1, this._y);
};

Ship.prototype.getSailEff = function () {
    var members = this.crewMembers;
    var score = 0;

    for (var i = 0; i < members.length; i++) {
        score += 5;
    }

    return score / Ship.CREW_SIZE * 5;
};

Ship.prototype.wait = function () {
};

Ship.prototype.move = function (x, y) {
    if (!G.map.canMove (x, y))
        return;

    var tile = G.map.getTile (x, y);
    var entity = G.map.getEntity (x, y);

    if (entity instanceof PirateShip) {
        console.log ("fight pirates");
        var killed = this.fight (entity);
        if (!killed)
            x = x -1;
        else
            entity.removeNextUpdate = true;
    } else if (entity instanceof Treasure) {
        console.log ("find treasure");
        G.display.drawText(0, 9, "Find 10 coins.", "red");
    } else if (tile == TileType.OPEN_WATER ) {
        console.log ("Smooth sailing");
        this.openWaterUpdate();
    }

    this._x = x;
    this._y = y;

    window.removeEventListener("keydown", this);

    G.draw ();
}

Ship.prototype.draw = function() {
    G.display.draw(this._x, this._y, "b", "#00ffff");
}

Ship.prototype.displayCrew = function() {
    for ( var i = 0; i < this.crewMembers.length; ++i ) {
        var name = this.crewMembers[i].name;
        console.log(name);
    }
}

Ship.prototype.displayMorale = function() {
    //console.log( Crew.RankValues[4]);
    for ( var i = 0; i < this.crewMembers.length; ++i ) {
        var moraleIndex = this.crewMembers[i].morale;
        var moraleValue = Crew.MoraleValues[moraleIndex];
        var rankIndex = this.crewMembers[i].rank;
        var rankValue = Crew.RankValues[rankIndex];
        var hungerIndex = this.crewMembers[i].hunger;
        var hungerValue = Crew.HungerValues[hungerIndex];
        var line = this.crewMembers[i].name + "-" + moraleValue + "-" + rankValue + "-" + hungerValue;

        console.log(line);
    }
};

Ship.prototype.getDamage = function () {
    return Random.betweeni (10, 20);
};

Ship.prototype.fight = function (pirate) {
    var damage = this.getDamage ();
    var pirateDamage = pirate.getDamage ();

    if (pirateDamage <= this.health) {
        //kill off crew member.
        var killOff = Random.betweeni(0, this.crewMembers.length);
        var member = this.crewMembers[killOff];
        if ( member.rank == Crew.RankEnum.Bosun ) {
            this.bosunIsAlive = false;
        }
        console.log( "we just Lost " + member.name);
        this.crewMembers = this.crewMembers.splice(killOff);
    }

    this.health -= pirateDamage;
    pirate.health -= damage;

    console.log ("You: ({0}/{1}) / Pirate:({2}/{3})".format (
        this.health, this.maxHealth, pirate.health, pirate.maxHealth
    ));

    // did we kill the pirate?
    return pirate.health <= 0;
};

Ship.prototype.openWaterUpdate = function() {
    //check full sail.
    if ( this.bosunIsAlive == true ) {
        this.fixShip();
    }
};

Ship.prototype.fixShip = function() {
    returnedHealth = Random.betweeni(5, 20); 
    var prevHealth = this.health;
    if ( this.health > Ship.maxHealth ) {
        this.health = Ship.maxHealth;
    }
    var difference = this.health - prevHealth;
    if ( difference > 0 ) {
        console.log("Bosun repaired ship for " + difference);
    }
};


