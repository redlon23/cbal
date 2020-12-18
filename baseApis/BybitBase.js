const axios = require("axios")
const {handleError} = require("./ErrorHandlers")
const {sortParamsAlphabeticallyOmitEmpty, getSignature,
sortParamsAlphabeticallyOmitEmptySignV} = require("./util")


class BybitInverseAccess{
    constructor(publicKey, secretKey) {
        this.base = "https://api.bybit.com"
        this.publicKey = publicKey;
        this.secretKey = secretKey;
    }

    // Currently both Inverse and USDT market shares the ticker endpoint but its subject to change
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

    // Currently both Inverse and USDT market shares the order book endpoint but its subject to change
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

    async getKlineData(symbol, interval, from, limit="") {
        let url = this.base + "/v2/public/kline/list"
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

    async getPositions(symbol) {
        const endPoint = "/v2/private/position/list";
        const params = sortParamsAlphabeticallyOmitEmptySignV({ symbol, api_key: this.publicKey, timestamp: Date.now() });
        const sign = getSignature(params, this.secretKey);
        const url = `${this.base}${endPoint}?${params}&sign=${sign}`;
        const requestOptions = {
            url,
            method: "GET"
        };

        let response = await axios(requestOptions);
        return response.data
    }

    async getBalance(){
        const endPoint = "/v2/private/wallet/balance"
        const params = sortParamsAlphabeticallyOmitEmptySignV({ api_key: this.publicKey, timestamp: Date.now() });
        const sign = getSignature(params, this.secretKey);
        const url = `${this.base}${endPoint}?${params}&sign=${sign}`;
        const requestOptions = {
            url,
            method: "GET"
        };

        let response = await axios(requestOptions);
        return response.data
    }

    async getActiveOrders(symbol) {
        const endPoint = "/open-api/order/list"
        const params = sortParamsAlphabeticallyOmitEmptySignV({order_status: "New", symbol, api_key: this.publicKey, timestamp: Date.now() });
        const sign = getSignature(params, this.secretKey);
        const url = `${this.base}${endPoint}?${params}&sign=${sign}`;
        const requestOptions = {
            url,
            method: "GET"
        };

        let response = await axios(requestOptions);
        return response.data
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

    async getKlineData(symbol, interval, from, limit="") {
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

    async getPositions(symbol){
        const endPoint = "/private/linear/position/list";
        const params = sortParamsAlphabeticallyOmitEmptySignV({ symbol, api_key: this.publicKey, timestamp: Date.now() });
        const sign = getSignature(params, this.secretKey);
        const url = `${this.base}${endPoint}?${params}&sign=${sign}`;
        const requestOptions = {
            url,
            method: "GET"
        };

        let response = await axios(requestOptions);
        return response.data
    }

    async getBalance(){
        const endPoint = "/v2/private/wallet/balance"
        const params = sortParamsAlphabeticallyOmitEmptySignV({ api_key: this.publicKey, timestamp: Date.now() });
        const sign = getSignature(params, this.secretKey);
        const url = `${this.base}${endPoint}?${params}&sign=${sign}`;
        const requestOptions = {
            url,
            method: "GET"
        };

        let response = await axios(requestOptions);
        return response.data
    }

    async getActiveOrders(symbol) {
        const endPoint = "/private/linear/order/list"
        const params = sortParamsAlphabeticallyOmitEmptySignV({order_status: "New", symbol, api_key: this.publicKey, timestamp: Date.now() });
        const sign = getSignature(params, this.secretKey);
        const url = `${this.base}${endPoint}?${params}&sign=${sign}`;
        const requestOptions = {
            url,
            method: "GET"
        };

        let response = await axios(requestOptions);
        return response.data
    }

    async cancelAllOpenOrders(symbol){
        const endPoint = "/private/linear/order/cancel-all";
        const params = sortParamsAlphabeticallyOmitEmptySignV({ symbol, api_key: this.publicKey ,timestamp: Date.now() });
        const sign = getSignature(params, this.secretKey);
        const url = `${this.base}${endPoint}?${params}&sign=${sign}`;
        const requestOptions = {
            url,
            method: "POST"
        };

        let response = await axios(requestOptions);
        return response.data
    }


    async placeConditionalMarketOrder(symbol, side, qty, base_price, stop_px, trigger_by = '', time_in_force = '', reduce_only = '', close_on_trigger = ''){
        const endPoint = "/private/linear/stop-order/create";
        const params = sortParamsAlphabeticallyOmitEmptySignV({ symbol, side, qty, base_price, stop_px, trigger_by, time_in_force, order_type: "Market", reduce_only, api_key: this.public, close_on_trigger ,timestamp: Date.now() });
        const sign = getSignature(params, this.secretKey);
        const url = `${this.base}${endPoint}?${params}&sign=${sign}`;
        const requestOptions = {
            url,
            method: "POST"
        };

        let response = await axios(requestOptions);
        return response.data
    }

}


module.exports = {
    BybitUsdtAccess,
    BybitInverseAccess
}