var Browser = function () {
};

Browser.requestTick = (function() {
    var _request = window.webkitRequestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.oRequestAnimationFrame
    || window.msRequestAnimationFrame
    || function(callback, element) {
        window.setTimeout(callback, 1000 / 60);
    };
    return function(callback, period) {
        _request(callback);
    }
})();

Browser.cancelTick = function(id) {
    window.cancelAnimationFrame(id);
};

