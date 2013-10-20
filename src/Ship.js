var ItemType = {
    Telescope: "Telescope",
    Cannon_1: "Cannon I",
    Cannon_2: "Cannon II",
    Cannon_3: "Cannon III",
};
var ItemCost = {
    "Telescope": 2000,
    "Cannon I": 2000,
    "Cannon II": 4000,
    "Cannon III": 6000,
};

var Ship = function(x, y) {
    this.maxHealth = 100;
    this.health = this.maxHealth;
    this.maxCrew = 20;
    this.sailSpeed = SailRate.HALF;
    this.doubloons = 1000;
    this.visibility = 3;
    this.crewMembers = [];
    this.food = 2000;

    this.has = {};

    // you start with just a captain.
    var captain = new Crew ();
    captain.rank = Crew.RankEnum.Captain;
    this.crewMembers.push (captain);

    this._x = x;
    this._y = y;

    Ship.TimesBuilt ++;
}

Ship.TimesBuilt = 0;
Ship.prototype.getSpeed = function() { return 100; }
Ship.prototype.getX = function() { return this._x; }
Ship.prototype.getY = function() { return this._y; }

var SailRate = {
    FULL : 0,
    HALF : 1,
};

Ship.prototype.sail = function (rate) {
    this.sailSpeed = rate;
    var crewEff = this.getCrewEff ();
    var shipEff = this.getShipEff ();

    if ( this.sailSpeed == SailRate.HALF ){
        this.move (this._x + 1, this._y);
    } else {
        // when we're close to the edge switch to moving one tile.
        if (!G.map.canMove (this._x + 2, this._y))
            this.move (this._x + 1, this._y);
        else
            this.move (this._x + 2, this._y);
    }

    // game over bro.
    if (this.crewMembers.length == 0 && this.health == 0) {
        G.switchState (GameState.GAME_OVER);
    }

    // voyage finished.
    if (G.map.isTheEnd (this._x, this._y)) {
        G.switchState (GameState.PORT);
    }

};

Ship.prototype.getCrewEff = function () {
    var activeCrew = this.crewMembers.length;
    for ( var i = 0; i < this.crewMembers.length; i++ ) {
        if ( this.crewMembers[i].morale == Crew.MoraleEnum.Mutinous ) {
         activeCrew--;
        }
    }
    return activeCrew / this.maxCrew;
};

Ship.prototype.getShipEff = function () {
    return this.health/this.maxHealth;
}

Ship.prototype.getRepairEff = function () {
    var bosunCrew = 0;
    for ( var i = 0; i < this.crewMembers.length; i++ ) {
        if ( this.crewMembers[i].rank == Crew.RankEnum.Bosun ) {
         bosunCrew++;
        }
    }
    return bosunCrew / 4;
};

Ship.prototype.wait = function () {
    G.spendDays (1);
    var success = this.fixShip();
    if (!success) {
        G.log ("Nothing interesting happens. %c{teal}{0} day%c{} goes by.".format(1));
    }
};

Ship.prototype.move = function (x, y) {
    if (!G.map.canMove (x, y))
        return;

    var tile = G.map.getTile (x, y);
    var entity = G.map.getEntity (x, y);

    if (entity instanceof PirateShip) {
        console.log ("fight pirates");
        var killed = this.fight (entity);
        // don't pass go until the pirate is dead.
        if (!killed)
            x = x - 1;
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
            G.log ("{0} is seasick; %c{teal}{1} days%c{} are lost at sea.".format (
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
    } else if (tile == TileType.ROUGH_WATER ) {
        G.spendDays (2);
        var damage = Random.betweeni(1, 6);
        G.log ("Rough waters. The ship springs a leak {0}".format(damage));
    }

    this._x = x;
    this._y = y;

    G.draw ();
}

Ship.prototype.draw = function() {
    G.display.draw(this._x, this._y, "b", "#00ffff");
}

Ship.prototype.toString = function() {
    if (Ship.TimesBuilt == 1)
        return "Bluenose";
    else
        return "Bluenose " + romanize (Ship.TimesBuilt);
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

    if (this.crewMembers.length > 0 && pirateDamage >= this.health) {
        //kill off crew member.
        var index = Random.betweeni(0, this.crewMembers.length - 1);
        var killed = this.crewMembers[index];
        this.crewMembers.fastRemove (index);

        G.log("We just %c{red}lost {0}%c{}.".format(killed.name));

        // promote someone to captain.
        // I like how some random gets to become captain.
        if (this.crewMembers.length > 0) {
            if (killed.rank == Crew.RankEnum.Captain) {
                var index = Random.betweeni(0, this.crewMembers.length - 1);
                var promoted = this.crewMembers[index];

                G.log("%c{green}{0} is promoted%c{} from {1} to Captain.".format (
                    promoted.name,
                    Crew.RankValues[promoted.rank]
                ));

                promoted.rank = Crew.RankEnum.Captain;
                this.crewMembers[index] = promoted;
            }
        }
    }

    //Maybe factor in crew morale.
    //var crewEff = getCrewEff();
    // maybe ship effectiveness reduces damage.

    this.loseHealth (pirateDamage);
    pirate.loseHealth (damage);

    G.log ("Cannons hit us for %c{red}{0} damage%c{}.".format (pirateDamage));
    G.log ("Your Cannons Fire back for %c{yellow}{0} damage%c{}".format ( damage));

    // did we kill the pirate?
    return pirate.health <= 0;
};

Ship.prototype.loseHealth = function(amount) {
    this.health = Math.clamp (this.health - amount, 0, this.maxHealth);
};

Ship.prototype.gainHealth = function(amount) {
    this.health = Math.clamp (this.health + amount, 0, this.maxHealth);
};

Ship.prototype.openWaterUpdate = function() {
    /*
    if ( getCrewEff < 0.3f ) {
        //TODO don't move.
    }
    */
    this.fixShip();
};

Ship.prototype.fixShip = function() {
    // is there a bosun that can repair?
    var bosun = this.getMemberOfRank (Crew.RankEnum.Bosun);
    if (bosun == null)
        return;

    returnedHealth = Math.floor (Random.betweeni(5, 20) * this.getRepairEff () * this.getCrewEff ());
    var prevHealth = this.health;
    this.gainHealth (returnedHealth);
    var difference = this.health - prevHealth;
    if ( difference > 0 ) {
        G.log("{0} repaired the hull for %c{green}{1}%c{}.".format(
            bosun.name,
            difference
        ));
        return true;
    }
    return false;
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
        if ( (member.hunger <= Crew.HungerEnum.Hungry ) && this.food > 0 ) {
            this.food -= 1;
        }
        else {
            member.hunger -= (member.hunger == Crew.HungerEnum.Starving) ? 0 : 1;
            if (member.hunger == Crew.HungerEnum.Starving) {
                member.morale -= (member.morale == Crew.MoraleEnum.Mutinous) ? 0 : 1;
            }
        }
        console.log( member.name + " is now " + Crew.HungerValues[member.hunger]);
    }
};

Ship.prototype.storm = function() {
    if ( this.sailSpeed == SailRate.FULL ) {
        var damage = 30;
        this.loseHealth (damage);
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

Ship.prototype.getVisibility = function() {
    if ( this.has [ItemType.Telescope] ) {
        return 3;
    }else {
        return 2;
    }
};

Ship.prototype.getItemString = function() {
    var result = "";
    if (Object.keys (this.has) == 0)
        return "none";
    if (ItemType.Cannon_3 in this.has) {
        result += "Ⅲ";
    } else if (ItemType.Cannon_2 in this.has) {
        result += "Ⅱ";
    } else if (ItemType.Cannon_1 in this.has) {
        result += "Ⅰ";
    }
    if (ItemType.Telescope in this.has) {
        result += "⦿";
    }
    return result;
};

Ship.prototype.getShipDamageString = function() {
    var key = Math.floor(this.damage / 10);
    return ShipDamageDescriptors[key];
};

ShipDamageDescriptors  = {
    0 : "Actively Sinking",
    1 : "Maybe not",
    2 : "There was a fire it's out now",
    3 : "At least the crews ok?",
    4 : "The f'csle is flooded",
    5 : "Repairs required",
    6 : "She's seen better days",
    7 : "Couple of scratches",
    8 : "Sails are damaged",
    9 : "Looking great",
    10: "Never Been Better"
};
