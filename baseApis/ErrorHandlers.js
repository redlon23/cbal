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

class UnauthorizedError extends ApiCallError {
    constructor(method, url) {
        super(`Occurred in Method ${method}, Please control your api keys!`);
        this.data = { method, url };
    }
}

function handleError(err, func, url){
    switch (err) {
        case 404:
            throw new NotFoundError(func, url)
        case 401:
            throw new UnauthorizedError(func, url)
        case 400:
            throw new ParameterError(func, url)
    }
}

module.exports = {
    handleError
}