const axios = require("axios")
const {handleError} = require("./ErrorHandlers")
const {sortParamsAlphabeticallyOmitEmpty, sortParamsAlphabetically} = require("./util")

class KrakenAccess {
    constructor(publicKey, secretKey) {
        this.base = "https://api.kraken.com"
        this.publicKey = publicKey;
        this.secretKey = secretKey;
    }

    async getAssetInfo(asset="") {
        let data;
        let url = this.base + "/0/public/Assets?";
        if(asset.length !== 0){
            url += "asset="
            if(typeof asset === "object"){
                for(let i = 0; i < asset.length -1; i++){
                    url += asset[i] + ","
                }
                url += asset[asset.length-1]
            } else {url += asset}
        }
        data = await axios.get(url);
        console.log(data.data.result)
    }

    async getTicker(asset="") {
        let url = this.base + "/0/public/Ticker?";
        if(asset.length !== 0){
            url += "pair="
            if(typeof asset === "object"){
                for(let i = 0; i < asset.length -1; i++){
                    url += asset[i] + ","
                }
                url += asset[asset.length-1]
            } else {url += asset}
        }
        let {data} = await axios.get(url);
        if(data.error.length !== 0){
            handleError(400, "SymbolPrice", url)
        }
        return data.result;
    }

    async getOrderBook(pair, count="") {
        let url = this.base + "/0/public/Depth"
            + sortParamsAlphabeticallyOmitEmpty({pair, count});
        let {data} = await axios.get(url);
        if(data.error.length !== 0){
            handleError(400, "OrderBook", url)
        }
        return data.result;
    }
    // Trick put 0 for since to get all the historic data
    // dumb thing uses nanoseconds
    async getOHLCData(pair, interval, since="") {
        let url = this.base + "/0/public/OHLC"
            + sortParamsAlphabeticallyOmitEmpty({pair, interval, since})
        let {data} = await axios.get(url);
        if(data.error.length !== 0){
            handleError(400, "KlineData", url)
        }
        return data.result
    }
}

module.exports = KrakenAccess