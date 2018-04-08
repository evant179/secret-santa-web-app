function BadRequestError(message) {
    this.name = "BadRequestError";
    this.message = (message || "");
}

BadRequestError.prototype = new Error();
BadRequestError.prototype.constructor = BadRequestError;

module.exports = BadRequestError;