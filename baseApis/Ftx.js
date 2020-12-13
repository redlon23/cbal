const axios = require('axios');
const ApiAccess = require("./ApiAccess")
const {sortParamsAlphabetically, parameterFilter} = require("./util")


class FtxFuturesAccess extends ApiAccess {
    constructor(publicKey, secretKey) {
        super(publicKey, secretKey);
        this.base = " https://ftx.com/api";
    }

    async getMarket(symbol){
        const endPoint = `/markets/${symbol}`;
        let response = await axios.get(`${this.base}${endPoint}`)
        return response.data
    }

    async getOrderBook(symbol, depth=20){
        const endPoint = `/markets/${symbol}/orderbook?depth=${depth}`;
        let response = await axios.get(`${this.base}${endPoint}`)
        return response.data
    }

    async getHistoricalPrices(symbol, resolution, limit='', start_time='', end_time=''){
        const endPoint = `/markets/${symbol}/candles`;
        const filteredParams = parameterFilter({limit, start_time, end_time})
        const params = sortParamsAlphabetically({resolution, ...filteredParams});
        let response = await axios.get(`${this.base}${endPoint}?${params}`)
        return response.data
    }

    async getOpenOrders(symbol){
        const endPoint = `/orders?market=${symbol}`
        let url = `${this.base}${endPoint}`
        let ts = Date.now()
        const signature = this._getSignature(`${ts}GET/api${endPoint}`);
        const requestOptions = {
            headers: {'FTX-KEY': this.public, 'FTX-TS': ts, 'FTX-SIGN': signature},
            url,
            method: "GET"
        };

        let response = await axios(requestOptions)
        return response.data
    }

    async getAccountInformation(){
        const endPoint = "/account";
        let ts = Date.now();
        const signature = this._getSignature(`${ts}GET/api${endPoint}`)
        let url = `${this.base}${endPoint}`
        console.log(url, `${ts}GET/api${endPoint}`)
        const requestOptions = {
            headers: {'FTX-KEY': this.public, 'FTX-TS': ts, 'FTX-SIGN': signature},
            url,
            method: "GET"
        };
        let response = await axios(requestOptions)
        return response.data
    }

    async setAccountLeverage(leverage){
        const endPoint = "/account/leverage"
        let ts = Date.now();
        const signature = this._getSignature(`${ts}POST/api${endPoint}{"leverage":`+leverage+"}");
        let url = `${this.base}${endPoint}`;
        const requestOptions = {
            headers: {'FTX-KEY': this.public, 'FTX-TS': ts, 'FTX-SIGN': signature},
            url,
            method: "POST",
            data: {"leverage": 10}
        };
        try{
            let response = await axios(requestOptions);
            return response.data;
        } catch (e) {
            console.log(e)
        }
    }

    async cancelAllOrders(symbol){
        const endPoint = "/orders"
        let ts = Date.now();
        let signature = this._getSignature(`${ts}DELETE/api/orders{"market":"${symbol}"}`)
        let url = `${this.base}${endPoint}`;
        console.log(url, `${ts}DELETE/api/orders{"market" : "${symbol}"}`)
        const requestOptions = {
            headers: {'FTX-KEY': this.public, 'FTX-TS': ts, 'FTX-SIGN': signature},
            url,
            method: "DELETE",
            data: {"market": symbol}
        };
        let response = await axios(requestOptions);
        return response.data;
    }

    async getPosition(showAvgPrice=true){
        const endPoint = "/positions?showAvgPrice=" + showAvgPrice;
        let ts = Date.now();
        let signature = this._getSignature(`${ts}GET/api${endPoint}`)
        let url = `${this.base}${endPoint}`;
        const requestOptions = {
            headers: {'FTX-KEY': this.public, 'FTX-TS': ts, 'FTX-SIGN': signature},
            url,
            method: "GET"
        };
        let response = await axios(requestOptions);
        return response.data;
    }
}