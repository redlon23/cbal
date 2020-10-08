const axios = require("axios")
const {handleError} = require("./ErrorHandlers")
const {sortParamsAlphabeticallyOmitEmpty, sortParamsAlphabetically} = require("./util")

class BinanceSpotAccess {
    constructor(publicKey, secretKey) {
        this.base = "https://api.binance.com"
        this.publicKey = publicKey;
        this.secretKey = secretKey;
    }

    async getSymbolPriceTicker(symbol= "") {
        let url = this.base + "/api/v3/ticker/price"
            + sortParamsAlphabeticallyOmitEmpty({symbol});
        let response;
        try {
            response = await axios.get(url)
        } catch (e) {
            let {status} = e.response;
            handleError(status, "SymbolPrice", url)
        }
        return response.data
    }


    async getOrderBook(symbol, limit= "") {
        let url = this.base + "/api/v3/depth"
            + sortParamsAlphabeticallyOmitEmpty({symbol, limit});
        let response;
        try {
            response = await axios.get(url)
        } catch (e) {
            let {status} = e.response;
            handleError(status, "OrderBook", url)
        }
        return response.data
    }


    async getKlineData(symbol, interval, startTime, limit) {
        let url = this.base + "/api/v3/klines"
            + sortParamsAlphabeticallyOmitEmpty({symbol, interval, startTime, limit});
        let response;
        try {
            response = await axios.get(url)
        } catch (e) {
            let {status} = e.response;
            handleError(status, "KlineData", url)
        }
        return response.data
    }

}

class BinanceFuturesAccess {
    constructor(publicKey, secretKey) {
        this.base = "https://fapi.binance.com"
        this.publicKey = publicKey;
        this.secretKey = secretKey;
    }

    async getSymbolPriceTicker(symbol= "") {
        let url = this.base + "/fapi/v1/ticker/price"
            + sortParamsAlphabeticallyOmitEmpty({symbol});
        let response;
        try {
            response = await axios.get(url)
        } catch (e) {
            let {status} = e.response;
            handleError(status, "SymbolPrice", url)
        }
        return response.data
    }

    async getOrderBook(symbol, limit= 100) {
        let url = this.base + "/fapi/v1/depth"
            + sortParamsAlphabeticallyOmitEmpty({symbol, limit});
        let response;
        try {
            response = await axios.get(url)
        } catch (e) {
            let {status} = e.response;
            handleError(status, "OrderBook", url)
        }
        return response.data
    }


    async getKlineData(symbol, interval, startTime, limit) {
        let url = this.base + "/fapi/v1/klines"
            + sortParamsAlphabeticallyOmitEmpty({symbol, interval, startTime, limit});
        let response;
        try {
            response = await axios.get(url)
        } catch (e) {
            let {status} = e.response;
            handleError(status, "KlineData", url)
        }
        return response.data
    }

}

module.exports = { BinanceSpotAccess, BinanceFuturesAccess }