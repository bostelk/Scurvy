var Splash = function(x, y) {
    var imgToShow =0;
    var tempName = WordSmith.getCrewName();
    this._x = x;
    this._y = y;
    var variableLength = tempName.length + 3;
    var middleLine = "";
    var dashes = "";
    var zeros = "";
    console.log( variableLength );

    if ( variableLength % 2 == 0 ) {
        var dashCount = (80 - tempName.length) / 2;
        var dashes = "";
        for ( var i = 0; i < dashCount; i++ ) {
            dashes += "-";
        }
        middleLine = dashes + "By:" + tempName + dashes;
    } else {
        var dashCount = ((80 - tempName.length) - 1) / 2;
        var dashes = "";
        for ( var i = 0; i < dashCount; i++ ) {
            dashes += "-";
        }
        middleLine = dashes + "By:" + tempName + dashes;
    }

    for ( var i = 1; i <= variableLength; ++i ) {
        zeros += "0";
    }

    this.texts = [
        dashes + zeros + dashes,
        dashes + zeros + dashes,
        "--------------------------------------SCURVY-------------------------------------",
        middleLine,
        dashes + zeros + dashes,
        dashes + zeros + dashes,
    ];
    this.finised = false;
};



Splash.prototype.tick = function() {
    this._y += 1 * G._deltaSeconds;
    this.finished = this._y >= 10;
};

Splash.prototype.draw = function() {
    for (var i = 0; i < this.texts.length; i++) {
        var text = this.texts [i];
        G.display.drawText(this._x, this._y + i, text, "red");
    }
};

