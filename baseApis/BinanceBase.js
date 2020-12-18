const axios = require("axios")
const {handleError} = require("./ErrorHandlers")
const {
    sortParamsAlphabeticallyOmitEmpty, getSignature,
    sortParamsAlphabeticallyOmitEmptySignV
} = require("./util")

class BinanceSpotAccess {
    constructor(publicKey, secretKey) {
        this.base = "https://api.binance.com"
        this.publicKey = publicKey;
        this.secretKey = secretKey;
    }

    async getSymbolPriceTicker(symbol = "") {
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


    async getOrderBook(symbol, limit = "") {
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

    async getAccountInformation(){
        const endPoint = "/api/v3/account";
        const params = sortParamsAlphabeticallyOmitEmptySignV({timestamp: Date.now() });
        const signature = getSignature(params, this.secretKey);
        let url = `${this.base}${endPoint}?${params}&signature=${signature}`;
        const requestOptions = {
            headers: { 'X-MBX-APIKEY': this.publicKey },
            url,
            method: "GET"
        };
        let response;
        try {
            response = await axios(requestOptions);
        } catch (e) {
            console.log(e)
            let {status} = e.response;
            handleError(status, "Balance", url)
        }
        return response.data
    }



    async getOpenOrders(symbol){
        const endPoint = "/api/v3/openOrders";
        const params = sortParamsAlphabeticallyOmitEmptySignV({symbol, timestamp: Date.now() });
        const signature = getSignature(params, this.secretKey);
        let url = `${this.base}${endPoint}?${params}&signature=${signature}`;
        const requestOptions = {
            headers: { 'X-MBX-APIKEY': this.publicKey },
            url,
            method: "GET"
        };
        let response;
        try {
            response = await axios(requestOptions);
        } catch (e) {
            console.log(e)
            let {status} = e.response;
            handleError(status, "OpenOrders", url)
        }
        return response.data
    }

    async getAllOrders(symbol){
        const endPoint = "/api/v3/allOrders";
        const params = sortParamsAlphabeticallyOmitEmptySignV({symbol, timestamp: Date.now() });
        const signature = getSignature(params, this.secretKey);
        let url = `${this.base}${endPoint}?${params}&signature=${signature}`;
        const requestOptions = {
            headers: { 'X-MBX-APIKEY': this.publicKey },
            url,
            method: "GET"
        };
        let response;
        try {
            response = await axios(requestOptions);
        } catch (e) {
            console.log(e)
            let {status} = e.response;
            handleError(status, "AllOrders", url)
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

    async getSymbolPriceTicker(symbol = "") {
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

    async getOrderBook(symbol, limit = 100) {
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

    async getPositions(symbol) {
        const endPoint = "/fapi/v2/positionRisk";
        const params = sortParamsAlphabeticallyOmitEmptySignV({symbol, timestamp: Date.now()});
        const signature = getSignature(params, this.secretKey);
        let url = `${this.base}${endPoint}?${params}&signature=${signature}`;
        const requestOptions = {
            headers: {'X-MBX-APIKEY': this.publicKey},
            url,
            method: "GET"
        };

        let response;
        try {
            response = await axios(requestOptions);
        } catch (e) {
            console.log(e)
            let {status} = e.response;
            handleError(status, "Positions", url)
        }
        return response.data
    }
    async getAccountBalance(){
        const endPoint = "/fapi/v2/balance";
        const params = sortParamsAlphabeticallyOmitEmptySignV({timestamp: Date.now() });
        const signature = getSignature(params, this.secretKey);
        let url = `${this.base}${endPoint}?${params}&signature=${signature}`;
        const requestOptions = {
            headers: { 'X-MBX-APIKEY': this.publicKey },
            url,
            method: "GET"
        };
        let response;
        try {
            response = await axios(requestOptions);
        } catch (e) {
            console.log(e)
            let {status} = e.response;
            handleError(status, "Balance", url)
        }
        return response.data
    }


    async getOpenOrders(symbol){
        const endPoint = "/fapi/v1/openOrders";
        const params = sortParamsAlphabeticallyOmitEmptySignV({symbol, timestamp: Date.now() });
        const signature = getSignature(params, this.secretKey);
        let url = `${this.base}${endPoint}?${params}&signature=${signature}`;
        const requestOptions = {
            headers: { 'X-MBX-APIKEY': this.publicKey },
            url,
            method: "GET"
        };
        let response;
        try {
            response = await axios(requestOptions);
        } catch (e) {
            console.log(e)
            let {status} = e.response;
            handleError(status, "OpenOrders", url)
        }
        return response.data
    }


    async getAllOrders(symbol){
        const endPoint = "/fapi/v1/allOrders";
        const params = sortParamsAlphabeticallyOmitEmptySignV({symbol, timestamp: Date.now() });
        const signature = getSignature(params, this.secretKey);
        let url = `${this.base}${endPoint}?${params}&signature=${signature}`;
        const requestOptions = {
            headers: { 'X-MBX-APIKEY': this.publicKey },
            url,
            method: "GET"
        };
        let response;
        try {
            response = await axios(requestOptions);
        } catch (e) {
            console.log(e)
            let {status} = e.response;
            handleError(status, "AllOrders", url)
        }
        return response.data
    }

    async getIncomeHistory(symbol='', incomeType='', startTime='', endTime='', limit=''){
        const endPoint = "/fapi/v1/income";
        const params = sortParamsAlphabetically({symbol,
            timestamp: Date.now(), incomeType, startTime, endTime, limit });
        const signature = getSignature(params, this.secretKey);

        let url = `${this.base}${endPoint}?${params}&signature=${signature}`;
        const requestOptions = {
            headers: { 'X-MBX-APIKEY': this.public },
            url,
            method: "GET"
        };

        let response = await axios(requestOptions);
        return response.data
    }

    async getAllLiquidationOrders(symbol='', startTime='', endTime='', limit=''){
        const endPoint = "/fapi/v1/allForceOrders"
        const params = sortParamsAlphabetically({symbol
            , startTime, endTime, limit });

        let url = `${this.base}${endPoint}?${params}`;
        const requestOptions = {
            url,
            method: "GET"
        };

        let response = await axios(requestOptions);
        return response.data
    }

    async cancelAllOpenOrders(symbol){
        const endPoint = "/fapi/v1/allOpenOrders";
        const params = sortParamsAlphabetically({ symbol, timestamp: Date.now() });
        const signature = getSignature(params, this.secretKey);

        let url = `${this.base}${endPoint}?${params}&signature=${signature}`;
        const requestOptions = {
            headers: { 'X-MBX-APIKEY': this.public },
            url,
            method: "DELETE"
        };

        let response = await axios(requestOptions);
        return response.data
    }



}

module.exports = {BinanceSpotAccess, BinanceFuturesAccess}