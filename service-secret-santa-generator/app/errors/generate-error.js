function GenerateError(message) {
    this.name = "GenerateError";
    this.message = (message || "");
}

GenerateError.prototype = new Error();
GenerateError.prototype.constructor = GenerateError;

module.exports = GenerateError;