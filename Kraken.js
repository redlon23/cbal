const KrakenAccess = require("./baseApis/KrakenBase")
const CBALInterface = require("./CBALInterface")

class KrakenApi extends CBALInterface {
    constructor(publicKey, secretKey) {
        super();
        this.access = new KrakenAccess(publicKey, secretKey);
        this.enum = {
            interval: {
                min1:   "1",
                min5:   "5",
                min15:  "15",
                min30:  "30",
                hour1:  "60",
                hour4:  "240",
                hour24: "1440",
                week1:  "10080",
                day15: "21600"
            }
        }
    }

    /**
     * Gets the given symbols latest price
     * in case of error returns -1
     * @param symbol {string}
     * @return {Promise<number>}
     */
    async getPrice(symbol){
        let data;
        try{
            data = await this.access.getTicker(symbol)
        } catch (err){
            console.log(err)
            return -1;
        }
        return parseFloat(data[Object.keys(data)[0]].c[0]);
    }

    /**
     * Gets all the given symbol prices
     * in case of error returns empty array
     * @param symbols{array<string>}
     * @return {array<object{symbol: string, price: number}>}
     */
    async getMultiplePrice(symbols) {
        let container = []
        let data;
        try{
            data = await this.access.getTicker(symbols);
        } catch (err) {
            console.log(err)
            return container;
        }
        for(let [k, v] of Object.entries(data)) {
            container.push({
                symbol: k,
                price: parseFloat(v.c[0])
            })
        }
        return container;
    }

    /**
     * Gets the given symbols order book data
     * @param symbol {string}
     * @param limit {number | string} optional
     * @return {Promise<object{asks: array<object{price: number, quantity: number}>,
     * bids: array<object{price: number, quantity: number}>}>}
     */
    async getOrderBook(symbol, limit=""){
        let data;
        try{
            data = await this.access.getOrderBook(symbol, limit);
        } catch (err) {
            console.log(err);
            return {}
        }
        let bad = data[Object.keys(data)];
        let parsedBids = [], parsedAsks = []
        for(let item of bad.asks){
            parsedAsks.push({
                price: parseFloat(item[0]), quantity: parseFloat(item[1])
            })
        }
        for(let item of bad.bids){
            parsedBids.push({
                price: parseFloat(item[0]), quantity: parseFloat(item[1])
            })
        }
        return {bids: parsedBids, asks: parsedAsks}
    }

    /**
     * Gets given symbols kline data, if start & end time
     * is not given, it will return most recent data.
     * Data is in ascending order (oldest/earliest first)
     * in order to skip parameters, just use empty string
     * In case of error returns empty array
     * @param symbol {string}
     * @param interval {enum} interval
     * @param startTime {number | string} timestamp in nanoseconds, optional
     * @return {array<object{openTime: number, open: number, high: number, low:number, close:number, volume: number}>}
     */
    async getKlineData(symbol, interval, startTime=""){
        let container = []
        let data;
        try{
            data = await this.access.getOHLCData(symbol, interval, startTime)
        } catch (err) {
            console.log(err);
            return container
        }
        let ohlcArray = data[Object.keys(data)[0]];
        console.log(ohlcArray)
        for(let item of ohlcArray) {
            container.push({
                openTime: item[0],
                open: parseFloat(item[1]),
                high: parseFloat(item[2]),
                low: parseFloat(item[3]),
                close: parseFloat(item[4]),
                volume: parseFloat(item[6])
            })
        }
        return container;
    }
}