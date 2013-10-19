var Treasure = function (x, y) {
    this.x = x;
    this.y = y;
    this.removeNextUpdate = false;
    this.value = Random.betweeni (10, 5000);
};

Treasure.prototype.draw = function () {
    G.display.draw(this.x, this.y, "T", "yellow");
};

Treasure.prototype.toString = function () {
    var verb = Treasure.Verbs.random();
    var noun = Treasure.Nouns.random();
    var value = this.value + " doubloons";
    var result = "{0} {1} worth %c{yellow}{2}%c{}.".format (
        verb,
        noun,
        value
    );
    return result;
};

Treasure.Verbs = [
    "Found",
    "Plundered",
    "Scavenged",
];

Treasure.Nouns = [
    "a fistfull of quarters",
    "a pirate's booty",
    "a handfull of diamonds",
    "a tiny amount of rubies",
];
