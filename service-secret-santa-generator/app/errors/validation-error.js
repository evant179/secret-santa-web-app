function ValidationError(message) {
    this.name = "ValidationError";
    this.message = (message || "");
}

ValidationError.prototype = new Error();
ValidationError.prototype.constructor = ValidationError;

module.exports = ValidationError;