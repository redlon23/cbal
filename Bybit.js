const {BybitUsdtAccess} = require("./baseApis/BybitBase")
const CBALInterface = require("./CBALInterface")

class BybitUsdtApi extends CBALInterface {
    constructor(publicKey, secretKey) {
        super();
        this.access = new BybitUsdtAccess(publicKey, secretKey);
        this.enum = {
            interval: {
                min1:   "1",
                min3:   "3",
                min5:   "5",
                min15:  "15",
                min30:  "30",
                hour1:  "60",
                hour2:  "120",
                hour4:  "240",
                hour6:  "360",
                hour12: "720",
                day1:   "D",
                month1: "M",
                week1: "W",
                year: "Y"
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
            let data = await this.access.getPriceTicker(symbol)
            return parseFloat(data[0].last_price)
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
            data = await this.access.getPriceTicker()
            console.log(data)
        } catch (err) {
            console.log(err)
            return container;
        }
        for(let symbol of symbols) {
            let idx = data.findIndex(item => item.symbol === symbol);
            let parsedPrice = parseFloat(data[idx].last_price)
            container.push({symbol, price: parsedPrice})
        }
        return container;
    }

    /**
     * Gets the given symbols order book data
     * @param symbol {string}
     * @return {Promise<object{asks: array<object{price: number, quantity: number}>,
     * bids: array<object{price: number, quantity: number}>}>}
     */
    async getOrderBook(symbol) {
        let parsedBids = [], parsedAsks = []
        try{
            let bookArr = await this.access.getOrderBook(symbol)
            console.log(bookArr)
            for(let item of bookArr){
                if(item.side === "Buy"){
                    parsedBids.push({
                        price: parseFloat(item.price), quantity: item.size
                    })
                } else if(item.side === "Sell") {
                    parsedAsks.push({
                        price: parseFloat(item.price), quantity: item.size
                    })
                }
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
     * @param startTime {number} timestamp in seconds
     * @param limit {number | string} optional
     * @return {array<object{openTime: number, open: number, high: number, low:number, close:number, volume: number}>}
     */
    async getKlineData(symbol, interval, startTime, limit=""){
        let data;
        let container = []
        try{
            data = await this.access.getKlineData(symbol, interval, startTime, limit);
            console.log(data)
        } catch (err){
            console.log(err)
            return container;
        }
        for(let item of data) {
            container.push({
                openTime: item.open_time,
                open: item.open,
                high: item.high,
                low: item.low,
                close: item.close,
                volume: item.volume
            })
        }
        return container
    }
}

module.exports = {
    BybitUsdtApi
}