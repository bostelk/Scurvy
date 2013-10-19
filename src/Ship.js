var Ship = function(x, y) {
    this.maxHealth = 100;
    this.health = this.maxHealth;
    this.sailSpeed = SailRate.HALF;
    this.doubloons = 0;
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
    G.spendDays (1);
    this.fixShip();
    this.consumeFood();
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
        this.doubloons += entity.value;
        entity.removeNextUpdate = true;
        G.log (entity);
        G.spendDays (1);
    } else if (entity instanceof Storm) {
        console.log ("Surprise Storm");
        entity.removeNextUpdate = true;
        this.storm();
        G.spendDays (2);
    } else if (tile == TileType.OPEN_WATER ) {
        var roll = Random.next();
        if (roll < 0.05) {
            var captain = this.getMemberOfRank (Crew.RankEnum.Captain);
            var days = Random.betweeni (1, 7);
            G.spendDays (days);
            G.log ("{0} is seasick; %c{red}{1} days%c{} are lost at sea.".format (
                captain.name,
                days
            ));
            x = x -1;
            return;
        } else {
            G.log ("Smooth sailing.");
            this.openWaterUpdate();
            G.spendDays (1);
        }
    }

    this._x = x;
    this._y = y;

    G.draw ();
}

Ship.prototype.draw = function() {
    G.display.draw(this._x, this._y, "b", "#00ffff");
}

Ship.prototype.toString = function() {
    return "Bluenose";
};

Ship.prototype.displayCrew = function() {
    for ( var i = 0; i < this.crewMembers.length; ++i ) {
        var name = this.crewMembers[i].name;
        console.log(name);
    }
}

Ship.prototype.displayMorale = function() {
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

    if (pirateDamage >= this.health) {
        //kill off crew member.
        var index = Random.betweeni(0, this.crewMembers.length - 1);
        this.crewMembers.fastRemove (index);
        var killed = this.crewMembers[index];

        G.log("We just lost " + killed.name);

        // promote someone to captain.
        if (killed.rank == Crew.RankEnum.Captain) {
            var index = Random.betweeni(0, this.crewMembers.length - 1);
            var promoted = this.crewMembers[index];

            G.log("{0} is promoted from {1} to Captain.".format (
                promoted.name,
                promoted.rank
            ));

            promoted.rank = Crew.RankEnum.Captain;
            this.crewMembers[index] = promoted;
        }
    }

    this.health -= pirateDamage;
    pirate.health -= damage;

    G.log ("Cannons hit us for %c{red}{0} damage%c{}.".format (pirateDamage));

    // did we kill the pirate?
    return pirate.health <= 0;
};

Ship.prototype.openWaterUpdate = function() {
    this.fixShip();
};

Ship.prototype.fixShip = function() {
    // is there a bosun that can repair?
    var bosun = this.getMemberOfRank (Crew.RankEnum.Bosun);
    if (bosun == null)
        return;

    returnedHealth = Random.betweeni(5, 20); 
    var prevHealth = this.health;
    this.health += returnedHealth;
    if ( this.health > this.maxHealth ) {
        this.health = this.maxHealth;
    }
    var difference = this.health - prevHealth;
    if ( difference > 0 ) {
        G.log("{0} repaired ship for %c{green}{1}%c{}.".format(
            bosun.name,
            difference
        ));
    }
};

Ship.prototype.getMemberOfRank = function(rank) {
    for (var i = 0; i < this.crewMembers.length; i++) {
        var member = this.crewMembers [i];
        if (member.rank == rank)
            return member;
    }
    return null;
};

Ship.prototype.consumeFood = function() {
    for ( var i = 0; i < this.crewMembers.length; i++ ) {
        var member = this.crewMembers[i];
        member.hunger -= 1;
        console.log( member.name + " is now " + Crew.HungerValues[member.hunger]);
    }
};

Ship.prototype.storm = function() {
    if ( this.sailSpeed == SailRate.FULL ) {
        var damage = 30;
        this.health -= damage;
        this.DropMorale();
        G.log ("Lightning hits us for %c{red}{0} damage%c{}.".format (damage));
    } else {
        G.log ("Successfully navigated through the storm.");
    }
};

Ship.prototype.dropMorale = function() {
    for( var i = 0; i < this.crewMembers.length; ++i ){
        var member = crewMembers[i];
        member.morale -= 1;
        console.log( member.name + " is now " + Crew.MoraleValues[member.morale]);
    }
};

