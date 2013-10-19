var MultipleChoiceEncounter = function (x, y) {
    this._x = x;
    this._y = y;
    this.message = "Wasted!";
    this.options = [
        "Kill the Captain.",
        "Get more rum.",
        "Abadon ship.",
    ];
    this.character = "@";
    this.encountered = false;
};

MultipleChoiceEncounter.prototype.resolve = function (result) {
    switch (result) {
        case 0:
        break;
        case 1:
        break;
    }
};

MultipleChoiceEncounter.prototype.draw = function () {
    if (this.encountered) {
        G.display.drawText(0, 2, this.message, "red");
        for (var i = 0; i < this.options.length; i++) {
            var option = "{0}. {1}".format (i, this.options [i]);
            G.display.drawText(0, 2 + 1 + i, option, "red");
        }
    }
    G.display.draw(this._x, this._y, this.character);
};
