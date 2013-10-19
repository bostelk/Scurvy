
Math.sqr = function(x) {
    return x * x;
};

Math.clamp = function(value, min, max) {
    if (value < min) {
        return min;
    } else if (value > max) {
        return max;
    } else {
        return value;
    }
};

Math.saturate = function(value) {
    if (value < 0) {
        return 0;
    } else if (value <= 1) {
        return value;
    }
    return 1;
};
