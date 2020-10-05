const axios = require("axios")
const {NotFoundError, ParameterError} = require("./ErrorHandlers")
const {sortParamsAlphabeticallyOmitEmpty, sortParamsAlphabetically} = require("./util")

class BinanceSpotAccess {
    constructor(publicKey, secretKey) {
        this.base = "https://api.binance.com"
        this.publicKey = publicKey;
        this.secretKey = secretKey;
    }

    handleError(err, func, url){
        switch (err) {
            case 404:
                throw new NotFoundError(func, url)
            case 400:
                throw new ParameterError(func, url)
        }
    }

    async getSymbolPriceTicker(symbol= "") {
        let url = this.base + "/api/v3/ticker/price"
            + sortParamsAlphabeticallyOmitEmpty({symbol});
        let response;
        try {
            response = await axios.get(url)
        } catch (e) {
            let {status} = e.response;
            this.handleError(status, "SymbolPrice", url)
        }
        return response.data
    }


    async getOrderBook(symbol, limit= 100) {
        let url = this.base + "/api/v3/depth"
            + sortParamsAlphabeticallyOmitEmpty({symbol, limit});
        let response;
        try {
            response = await axios.get(url)
        } catch (e) {
            let {status} = e.response;
            this.handleError(status, "OrderBook", url)
        }
        return response.data
    }


    async getKlineData(symbol, interval, startTime, endTime, limit) {
        let url = this.base + "/api/v3/klines"
            + sortParamsAlphabeticallyOmitEmpty({symbol, interval, startTime, endTime, limit});
        let response;
        try {
            response = await axios.get(url)
        } catch (e) {
            let {status} = e.response;
            this.handleError(status, "KlineData", url)
        }
        return response.data
    }

}

class BinanceFuturesAccess {
    constructor() {
        this.base = "https://fapi.binance.com"
    }

}
function testtt(symbol, interval, limit) {
    sortParamsAlphabeticallyOmitEmpty({symbol, interval, limit})
}

async function main() {
    var start = new Date()
    var hrstart = process.hrtime()
    let d = new BinanceSpotAccess();
    try {
        let dd = await d.getKlineData("BTCUSDT",5)
    } catch (e) {
        console.log(e)
    }
    // console.log(dd)
    var end = new Date() - start,
        hrend = process.hrtime(hrstart)

    console.info('Execution time: %dms', end)
    console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)

}
// main()


module.exports = { BinanceSpotAccess, BinanceFuturesAccess }