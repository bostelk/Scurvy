var Ship = function(x, y) {
    this.hitPoints = 100;
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

Ship.prototype.move = function (x, y) {
    if (!G.map.canMove (x, y))
        return;
    if (x == 3) {
        G.encounter.encountered = true;
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

Ship.prototype.fight(var pirate) {

    if ( pirate.damage > ship.health ) {
        //kill off crew member.
        var killOff = Random.betweeni(0, crewMembers.length);
        console.log( "we just Lost " + crewMembers(killOff);
        this.crewMembers = this.crewMembers.splice(killOff);
    }

    this.health - pirate.damage;
    pirate.health -= 20;
    return pirate;
    //Damage ship
    //kill/injure members.
}

Ship.prototype.endOfTurnUpdate() = function() {

    for( var i = 0; i < 
}


