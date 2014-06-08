function InvalidArgumentException(value, object, method) {
    this.value = value;
    this.message = " - provided for " + object + '.' + method;
    this.toString = function() {
        return 'InvalidArgumentException: ' + this.value + this.message
    };
}