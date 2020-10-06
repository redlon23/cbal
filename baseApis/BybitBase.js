const axios = require("axios")
const {handleError} = require("./ErrorHandlers")
const {sortParamsAlphabeticallyOmitEmpty, sortParamsAlphabetically} = require("./util")


class BybitInverseAccess{
    constructor(publicKey, secretKey) {
        this.base = "https://api.bybit.com"
        this.publicKey = publicKey;
        this.secretKey = secretKey;
    }

    async getPriceTicker(symbol=""){
        let url = this.base + "/v2/public/tickers"
            + sortParamsAlphabeticallyOmitEmpty({symbol})
        let response;
        try{
            response = await axios.get(url);
        } catch (err) {
            let {status} = err.response;
            handleError(status, "SymbolPrice", url)
        }
        if(response.data.ret_code === 10001){
            handleError(400, "SymbolPrice", url)
        }
        return response.data.result;
    }
}

class BybitUsdtAccess {
    constructor(publicKey, secretKey) {
        this.base = "https://api.bybit.com"
        this.publicKey = publicKey;
        this.secretKey = secretKey;
    }

    async getPriceTicker(symbol="") {
        let url = this.base + "/v2/public/tickers"
            + sortParamsAlphabeticallyOmitEmpty({symbol})
        let response;
        try{
           response = await axios.get(url);
        } catch (err) {
            let {status} = err.response;
            handleError(status, "SymbolPrice", url)
        }
       if(response.data.ret_code === 10001){
           handleError(400, "SymbolPrice", url)
       }
        return response.data.result;
    }

    async getOrderBook(symbol) {
        let url = this.base + "/v2/public/orderBook/L2"
            + sortParamsAlphabeticallyOmitEmpty({symbol})
        let response;
        try{
            response = await axios.get(url);
        } catch (err) {
            let {status} = err.response;
            handleError(status, "OrderBook", url)
        }
        if(response.data.ret_code === 10001){
            handleError(400, "OrderBook", url)
        }
        return response.data.result;
    }

    async getKlineData(symbol, interval, from, limit) {
        let url = this.base + "/public/linear/kline"
            + sortParamsAlphabeticallyOmitEmpty({symbol, interval,
                from, limit})
        let response;
        try{
            response = await axios.get(url);
        } catch (err) {
            let {status} = err.response;
            handleError(status, "KlineData", url)
        }
        if(response.data.ret_code === 10001 || response.data.result === null){
            handleError(400, "KlineData", url)
        }
        return response.data.result;
    }
}

module.exports = {
    BybitUsdtAccess
}