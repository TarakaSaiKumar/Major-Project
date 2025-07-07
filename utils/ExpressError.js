class ExpressError extends Error {
    constructor(statusCode, message) {
        super(message); // sets the message in the Error base class
        this.statusCode = statusCode;
    }
}

module.exports = ExpressError;
