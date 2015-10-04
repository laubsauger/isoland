var arrayRotate = function (dir, arr) {
    var temp = cloneObj(arr),
        dirRight = (dir == 'r') ? 0 : 1;

    for (var j = 0; j < arr[0].length; j++) {
        for (var i = 0; i < arr.length; i++) {

            if(dirRight) {
                temp[j][i] = arr[i][arr.length - j - 1];
            } else {
                temp[j][i] = arr[arr.length - i - 1][j];
            }
        }
    }

    return temp;
};

var transposeArray = function(a) {
    // Calculate the width and height of the Array
    var w = a.length ? a.length : 0,
        h = a[0] instanceof Array ? a[0].length : 0;

    // In case it is a zero matrix, no transpose routine needed.
    if(h === 0 || w === 0) { return []; }

    /**
     * @var {Number} i Counter
     * @var {Number} j Counter
     * @var {Array} t Transposed data is stored in this array.
     */
    var i, j, t = [];

    // Loop through every item in the outer array (height)
    for(i=0; i<h; i++) {

        // Insert a new row (array)
        t[i] = [];

        // Loop through every item per item in outer array (width)
        for(j=0; j<w; j++) {

            // Save transposed data.
            t[i][j] = a[j][i];
        }
    }

    return t;
};

var cloneObj = function (obj) {
    var newObj = (obj instanceof Array) ? [] : {};
    for (var i in obj) {
        if (i == 'cloneObj') continue;
        if (obj[i] && typeof obj[i] == "object") {
            newObj[i] = cloneObj(obj[i]);
        } else newObj[i] = obj[i]
    }
    return newObj;
};
