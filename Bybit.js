const {BybitUsdtAccess, BybitInverseAccess} = require("./baseApis/BybitBase")
const CBALInterface = require("./CBALInterface")


class BybitBaseApi extends CBALInterface {
    constructor() {
        super();
    }

    async getPrice(symbol) {
        let data = await this.access.getPriceTicker(symbol)
        return parseFloat(data[0].last_price)
    }

    async getMultiplePrice(symbols) {
        let data;
        let container = []
        data = await this.access.getPriceTicker()

        for (let symbol of symbols) {
            let idx = data.findIndex(item => item.symbol === symbol);
            let parsedPrice = parseFloat(data[idx].last_price)
            container.push({symbol, price: parsedPrice})
        }
        return container;
    }

    /**
     * Gets the given symbols order book data
     * @throws {ParameterError | NotFoundError}
     * @param symbol {string}
     * @return {Promise<object{asks: array<object{price: number, quantity: number}>,
     * bids: array<object{price: number, quantity: number}>}>}
     */
    async getOrderBook(symbol) {
        let parsedBids = [], parsedAsks = []

        let bookArr = await this.access.getOrderBook(symbol)
        for (let item of bookArr) {
            if (item.side === "Buy") {
                parsedBids.push({
                    price: parseFloat(item.price), quantity: item.size
                })
            } else if (item.side === "Sell") {
                parsedAsks.push({
                    price: parseFloat(item.price), quantity: item.size
                })
            }
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
     * @param startTime {number} timestamp in seconds, required
     * @return {array<{openTime: number, open: number, high: number, low:number, close:number, volume: number}>}
     */
    async getKlineData(symbol, interval, startTime) {
        let container = []
        let data = await this.access.getKlineData(symbol, interval, startTime);
        for (let item of data) {
            container.push({
                openTime: item.open_time,
                open: parseFloat(item.open),
                high: parseFloat(item.high),
                low: parseFloat(item.low),
                close: parseFloat(item.close),
                volume: parseFloat(item.volume)
            })
        }
        return container
    }
}

class BybitUsdtApi extends BybitBaseApi {
    constructor(publicKey, secretKey) {
        super();
        this.access = new BybitUsdtAccess(publicKey, secretKey);
        this.enum = {
            side:{
                buy: "Buy",
                sell: "Sell"
            },
            interval: {
                min1: "1",
                min3: "3",
                min5: "5",
                min15: "15",
                min30: "30",
                hour1: "60",
                hour2: "120",
                hour4: "240",
                hour6: "360",
                hour12: "720",
                day1: "D",
                month1: "M",
                week1: "W",
                year: "Y"
            }
        }
    }

    async getPositions(symbol) {
        let data;
        let container = []
        try {
            data = await this.access.getPositions(symbol)
        }catch (e){
            console.log(e)
            return container;
        }
        for(let item of data.result) {
            container.push({
                symbol: item.symbol,
                quantity: item.size,
                side: item.side,
                entryPrice: item.entry_price,
                leverage: item.leverage,
                unRelProfit: 0
            })
        }
        return container;
    }

    async getBalance() {
        let data;
        let container = []
        try{
            data = await this.access.getBalance();
        } catch (e) {
            console.log(e);
            return container
        }
        for(let [k,v] of Object.entries(data.result)){
            container.push({
                asset: k,
                availableBalance: parseFloat(v.available_balance),
                locked: parseFloat(v.used_margin)
            })
        }
        return container;
    }

    async getActiveOrders(symbol){
        let data;
        let container = []
        try{
            data = await this.access.getActiveOrders(symbol);
        } catch (e) {
            console.log(e);
            return container
        }
        for(let item of data.result.data){
            container.push({
                symbol: item.symbol,
                orderId: item.order_id,
                clOrderId: "",
                price: parseFloat(item.price),
                side: item.side,
                quantity : parseFloat(item.qty),
                status: item.order_status,
                time: item.created_time
            })
        }
        return container;
    }
}

class BybitInverseApi extends BybitBaseApi {
    constructor(publicKey, secretKey) {
        super();
        this.access = new BybitInverseAccess(publicKey, secretKey);
        this.enum = {
            side:{
                buy: "Buy",
                sell: "Sell"
            },
            interval: {
                min1: "1",
                min3: "3",
                min5: "5",
                min15: "15",
                min30: "30",
                hour1: "60",
                hour2: "120",
                hour4: "240",
                hour6: "360",
                hour12: "720",
                day1: "D",
                month1: "M",
                week1: "W",
                year: "Y"
            }
        }
    }

    async getPositions(symbol) {
        let data;
        try {
            data = await this.access.getPositions(symbol)
        }catch (e){
            console.log(e)
            return container;
        }
        return {
            symbol: data.result.symbol,
            quantity: data.result.size,
            side: data.result.side,
            entryPrice: parseFloat(data.result.entry_price),
            leverage: parseFloat(data.result.leverage),
            unRelProfit: 0

        }
    }

    async getBalance() {
        let data;
        let container = []
        try{
            data = await this.access.getBalance();
        } catch (e) {
            console.log(e);
            return container
        }
        for(let [k,v] of Object.entries(data.result)){
            container.push({
                asset: k,
                availableBalance: parseFloat(v.available_balance),
                locked: parseFloat(v.used_margin)
            })
        }
    }

    async getActiveOrders(symbol){
        let data;
        let container = []
        try{
            data = await this.access.getActiveOrders(symbol);
        } catch (e) {
            console.log(e);
            return container
        }
        for(let item of data.result.data){
            container.push({
                symbol: item.symbol,
                orderId: item.order_id,
                clOrderId: "",
                price: parseFloat(item.price),
                side: item.side,
                quantity : parseFloat(item.qty),
                status: item.order_status,
                time: item.created_time
            })
        }
        return container;
    }
}

module.exports = {
    BybitUsdtApi,
    BybitInverseApi
}