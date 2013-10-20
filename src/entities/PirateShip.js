var PirateShip = function(x, y) {
    this.name = PirateShip.generateName ();
    this.x = x;
    this.y = y;
    this.maxHealth = 100;
    this.health = this.maxHealth;
    this.removeNextUpdate = false;
};

PirateShip.prototype.getDamage = function () {
    return Random.betweeni (1, 5);
};

PirateShip.prototype.loseHealth = function (amount) {
    this.health = Math.clamp (this.health - amount, 0, this.maxHealth);
    if (this.health <= 0) {
        this.removeNextUpdate = true;
        G.log ("%c{purple}{0}%c{} sinks to the bottom of the ocean.".format (this.name));
    }
};

PirateShip.prototype.draw = function () {
    G.display.draw(this.x, this.y, "P", "red");
};

PirateShip.generateName = function () {
    var names = [
        "Buccaneer's Servant",
        "Dragon's Madness",
        "Killer's Damned Secret",
        "Night's Doom",
        "Sea's Serpent",
        "The Greedy Eel",
        "The Mad Knave",
        "The Vicious Demon",
        "The Angry Knave",
        "The Bloody Slave",
        "The Coral Doom of Hell",
        "The Coral Insanity",
        "The Cursed Sword",
        "The Dark Grail",
        "The Death of the South",
        "The Hate of the Pirate",
        "The Hell-born Howl",
        "The Horrible Raider of the South",
        "The Horrid Barnacle of the North",
        "The Horror of the North",
        "The Sad Servant",
        "The Screaming Knave",
        "The Shameful Grail",
        "The Shameful Scream",
        "The Vile Dagger",
    ];
    return names.random ();
};
