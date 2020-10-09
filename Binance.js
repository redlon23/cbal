const {BinanceSpotAccess, BinanceFuturesAccess} = require("./baseApis/BinanceBase")
const CBALInterface = require("./CBALInterface")

class BinanceBaseApi extends CBALInterface {
    constructor() {
        super();
    }

    async getPrice(symbol) {
        let {price} = await this.access.getSymbolPriceTicker(symbol)
        return parseFloat(price)
    }

    async getMultiplePrice(symbols) {
        let container = []
        let data = await this.access.getSymbolPriceTicker()
        for (let symbol of symbols) {
            let idx = data.findIndex(item => item.symbol === symbol);
            data[idx].price = parseFloat(data[idx].price)
            container.push({symbol: data[idx].symbol, price: data[idx].price})
        }
        return container;
    }

    async getOrderBook(symbol) {
        let parsedBids = [], parsedAsks = []
        let {bids: unParsedBids, asks: unparsedAsks} = await this.access.getOrderBook(symbol)
        for (let item of unParsedBids) {
            parsedBids.push({
                price: parseFloat(item[0]), quantity: parseFloat(item[1])
            })
        }
        for (let item of unparsedAsks) {
            parsedAsks.push({
                price: parseFloat(item[0]), quantity: parseFloat(item[1])
            })
        }
        return {bids: parsedBids, asks: parsedAsks}
    }

    /**
     * Gets given symbols kline data, if start
     * is not given, it will return most recent data.
     * @param symbol {string}
     * @param interval {enum} interval
     * @param startTime {number | string} timestamp optional
     * @return {array<{openTime: number, open: number, high: number, low:number, close:number, volume: number}>}
     */
    async getKlineData(symbol, interval, startTime) {
        let data;
        let container = []
        try {
            data = await this.access.getKlineData(symbol, interval, startTime, "");
        } catch (err) {
            console.log(err)
            return container;
        }
        for (let item of data) {
            container.push({
                openTime: item[0],
                open: parseFloat(item[1]),
                high: parseFloat(item[2]),
                low: parseFloat(item[3]),
                close: parseFloat(item[4]),
                volume: parseFloat(item[5])
            })
        }
        return container
    }

}

class BinanceSpotApi extends BinanceBaseApi {
    constructor(publicKey, secretKey) {
        super();
        this.access = new BinanceSpotAccess(publicKey, secretKey)
        this.enum = {
            interval: {
                min1: "1m",
                min3: "3m",
                min5: "5m",
                min15: "15m",
                min30: "30m",
                hour1: "1h",
                hour2: "2h",
                hour4: "4h",
                hour6: "6h",
                hour8: "8h",
                hour12: "12h",
                day1: "1d",
                day3: "3d",
                week1: "1w",
                month1: "1M"
            }
        }
    }
}

class BinanceFuturesApi extends BinanceBaseApi {
    constructor(publicKey, secretKey) {
        super();
        this.access = new BinanceFuturesAccess(publicKey, secretKey)
        this.enum = {
            interval: {
                min1: "1m",
                min3: "3m",
                min5: "5m",
                min15: "15m",
                min30: "30m",
                hour1: "1h",
                hour2: "2h",
                hour4: "4h",
                hour6: "6h",
                hour8: "8h",
                hour12: "12h",
                day1: "1d",
                day3: "3d",
                week1: "1w",
                month1: "1M"
            }
        }
    }
}

module.exports = {
    BinanceSpotApi,
    BinanceFuturesApi
}