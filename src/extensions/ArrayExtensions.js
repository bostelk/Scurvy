Array.prototype.fastRemove = function(index) {
    var old = this[index];
    this[index] = this[this.length - 1];
    this[this.length - 1]  = old;
    return this.pop();
};

Array.prototype.clear = function() {
    this.length = 0;
};

