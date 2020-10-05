function KeyValue(key, value) {
    this.key = key;
    this.value = value;
}

KeyValue.prototype = {
    toString: function () {
        return encodeURIComponent(this.key) + '=' + encodeURIComponent(this.value);
    }
};

function sortParamsAlphabetically(requestParams) {
    let query = [];
    for (let key in requestParams) {
        if (requestParams.hasOwnProperty(key)) {
            query.push(new KeyValue(key, requestParams[key]));
        }
    }
    query.sort(function (a, b) {
        return a.key < b.key ? -1 : 1
    });
    return query.join('&');
}

Object.filter = (obj, predicate) =>
    Object.fromEntries(Object.entries(obj).filter(predicate));

function parameterFilter(params={}) {
    return Object.filter(params, ([key, val]) => val.length !== 0);
}

function sortParamsAlphabeticallyOmitEmpty(requestParams) {
    let query = [];
    for (let key in requestParams) {
        if (requestParams.hasOwnProperty(key)) {
            if(typeof requestParams[key] === "string" &&
                requestParams[key].length === 0){
                continue;
            }
            query.push(new KeyValue(key, requestParams[key]));
        }
    }
    query.sort(function (a, b) {
        return a.key < b.key ? -1 : 1
    });
    return "?" + query.join('&');
}


module.exports = {
    sortParamsAlphabetically,
    sortParamsAlphabeticallyOmitEmpty,
    parameterFilter
}