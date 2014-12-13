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