function InvalidArgumentException(message) {
    return {
        name: "InvalidArgumentException",
        message: message || "invalid argument passed"
    }.toString();
}
