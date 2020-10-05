class ApiCallError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

class NotFoundError extends ApiCallError {
    constructor(method, url) {
        super(`Occurred in Method ${method}, Url used ${url}`);
        this.data = { method, url };
    }
}

class ParameterError extends ApiCallError {
    constructor(method, url) {
        super(`Occurred in Method ${method}, Url used ${url}`);
        this.data = { method, url };
    }
}

module.exports = {
    NotFoundError,
    ParameterError
}