var Random = function () {

};

Random.sign = function () {
    return Math.pow(-1, Random.betweeni(0, 1));
};

Random.betweenf = function (min, max) {
    return Math.random() * (max - min) + min;
};

Random.betweeni = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

Random.fiftyfifty = function () {
    return Random.next() >= 0.5;
};

Random.next = function () {
    return Math.random();
};
