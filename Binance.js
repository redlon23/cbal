const {BinanceSpotAccess, BinanceFuturesAccess} = require("./baseApis/BinanceBase")
const CBALInterface = require("./CBALInterface")
class BinanceSpotApi extends CBALInterface{
    constructor(publicKey, secretKey) {
        super();
        this.access = new BinanceSpotAccess(publicKey, secretKey)
        this.enum = {
            interval: {
                min1:   "1m",
                min3:   "3m",
                min5:   "5m",
                min15:  "15m",
                min30:  "30m",
                hour1:  "1h",
                hour2:  "2h",
                hour4:  "4h",
                hour6:  "6h",
                hour8:  "8h",
                hour12: "12h",
                day1:   "1d",
                day3:   "3d",
                week1:  "1w",
                month1: "1M"
            }
        }
    }

    /**
     * Gets the given symbols latest price
     * in case of error returns -1
     * @param symbol {string}
     * @return {Promise<number>}
     */
    async getPrice(symbol) {
        try{
            let {price} = await this.access.getSymbolPriceTicker(symbol)
            return parseFloat(price)
        } catch (err) {
            console.log(err)
            return -1;
        }
    }

    /**
     * Gets all the given symbol prices
     * in case of error returns empty array
     * @param symbols{array<string>}
     * @return {array<object{symbol: string, price: number}>}
     */
    async getMultiplePrice(symbols) {
        let data;
        let container = []
        try {
            data = await this.access.getSymbolPriceTicker()
        } catch (err) {
            console.log(err)
            return container;
        }
        for(let symbol of symbols) {
            let idx = data.findIndex(item => item.symbol === symbol);
            data[idx].price = parseFloat(data[idx].price)
            container.push(data[idx])
        }
        return container;
    }

    /**
     * Gets the given symbols order book data
     * @param symbol {string}
     * @param limit {number} optional
     * @return {Promise<object{asks: array<object{price: number, quantity: number}>,
     * bids: array<object{price: number, quantity: number}>}>}
     */
    async getOrderBook(symbol, limit=100) {
        let parsedBids = [], parsedAsks = []
        try{
            let {bids: unParsedBids, asks: unparsedAsks} =
                await this.access.getOrderBook(symbol, limit)
            for(let item of unParsedBids){
                parsedBids.push({
                    price: parseFloat(item[0]), quantity: parseFloat(item[1])
                })
            }
            for(let item of unparsedAsks){
                parsedAsks.push({
                    price: parseFloat(item[0]), quantity: parseFloat(item[1])
                })
            }
            return {bids: parsedBids, asks: parsedAsks}
        } catch (err){
            console.log(err);
            return {}
        }
    }

    /**
     * Gets given symbols kline data, if start & end time
     * is not given, it will return most recent data.
     * Data is in ascending order (oldest/earliest first)
     * in order to skip parameters, just use empty string
     * In case of error returns empty array
     * @param symbol {string}
     * @param interval {enum} interval
     * @param startTime {number | string} timestamp optional
     * @param endTime{number | string} timestamp optional
     * @param limit {number} optional
     * @return {array<object{openTime: number, open: number, high: number, low:number, close:number, volume: number}>}
     */
    async getKlineData(symbol, interval, startTime, endTime, limit =500){
        let data;
        let container = []
        try{
            data = await this.access.getKlineData(symbol, interval, startTime, endTime, limit);
        } catch (err){
            console.log(err)
            return container;
        }
        for(let item of data) {
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

class BinanceFuturesApi extends CBALInterface{
    constructor(publicKey, secretKey) {
        super();
        this.access = new BinanceFuturesAccess(publicKey, secretKey)
        this.enum = {
            interval: {
                min1:   "1m",
                min3:   "3m",
                min5:   "5m",
                min15:  "15m",
                min30:  "30m",
                hour1:  "1h",
                hour2:  "2h",
                hour4:  "4h",
                hour6:  "6h",
                hour8:  "8h",
                hour12: "12h",
                day1:   "1d",
                day3:   "3d",
                week1:  "1w",
                month1: "1M"
            }
        }
    }

    /**
     * Gets the given symbols latest price
     * in case of error returns -1
     * @param symbol {string}
     * @return {Promise<number>}
     */
    async getPrice(symbol) {
        try{
            let {price} = await this.access.getSymbolPriceTicker(symbol)
            return parseFloat(price)
        } catch (err) {
            console.log(err)
            return -1;
        }
    }

    /**
     * Gets all the given symbol prices
     * in case of error returns empty array
     * @param symbols{array<string>}
     * @return {array<object{symbol: string, price: number}>}
     */
    async getMultiplePrice(symbols) {
        let data;
        let container = []
        try {
            data = await this.access.getSymbolPriceTicker()
        } catch (err) {
            console.log(err)
            return container;
        }
        for(let symbol of symbols) {
            let idx = data.findIndex(item => item.symbol === symbol);
            data[idx].price = parseFloat(data[idx].price)
            container.push(data[idx])
        }
        return container;
    }

    /**
     * Gets the given symbols order book data
     * @param symbol {string}
     * @param limit {number} optional
     * @return {Promise<object{asks: array<object{price: number, quantity: number}>,
     * bids: array<object{price: number, quantity: number}>}>}
     */
    async getOrderBook(symbol, limit=100) {
        let parsedBids = [], parsedAsks = []
        try{
            let {bids: unParsedBids, asks: unparsedAsks} =
                await this.access.getOrderBook(symbol, limit)
            for(let item of unParsedBids){
                parsedBids.push({
                    price: parseFloat(item[0]), quantity: parseFloat(item[1])
                })
            }
            for(let item of unparsedAsks){
                parsedAsks.push({
                    price: parseFloat(item[0]), quantity: parseFloat(item[1])
                })
            }
            return {bids: parsedBids, asks: parsedAsks}
        } catch (err){
            console.log(err);
            return {}
        }
    }

    /**
     * Gets given symbols kline data, if start & end time
     * is not given, it will return most recent data.
     * Data is in ascending order (oldest/earliest first)
     * in order to skip parameters, just use empty string
     * In case of error returns empty array
     * @param symbol {string}
     * @param interval {enum} interval
     * @param startTime {number | string} timestamp optional
     * @param endTime{number | string} timestamp optional
     * @param limit {number} optional
     * @return {array<object{openTime: number, open: number, high: number, low:number, close:number, volume: number}>}
     */
    async getKlineData(symbol, interval, startTime, endTime, limit =500){
        let data;
        let container = []
        try{
            data = await this.access.getKlineData(symbol, interval, startTime, endTime, limit);
        } catch (err){
            console.log(err)
            return container;
        }
        for(let item of data) {
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

module.exports = {
    BinanceSpotApi,
    BinanceFuturesApi
}