function InvalidArgumentException(value, object, method, param) {
    this.value = value;
    this.message = " - provided for " + object + '.' + method + ' : ' + (param||"-");
    this.toString = function() {
        return 'InvalidArgumentException: ' + this.value + this.message
    };
}