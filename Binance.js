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
            side:{
                buy: "BUY",
                sell: "SELL"
            },
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

    async getActiveOrders(symbol) {
        let data;
        let container = []
        try {
            data = await this.access.getOpenOrders(symbol);
        } catch (err) {
            console.log(err)
            return container;
        }
        for(let item of data) {
            container.push({
                symbol: item.symbol,
                orderId: item.orderId,
                price: parseFloat(item.price),
                side: item.side,
                status: item.status,
                time: item.time
            })
        }
        return container;
    }

    async getBalance() {
        let parsedBalances = []
        try {
            let {balances} = await this.access.getAccountInformation();
            for(let {asset, free, locked} of balances) {
                free = parseFloat(free);
                locked = parseFloat(locked);
                if(free !== 0 || locked !== 0){
                    parsedBalances.push({
                        asset,
                        availableBalance: free,
                        locked
                    })
                }
            }
        } catch (err) {
            console.log(err)
            return [];
        }
        return parsedBalances
    }

    async getOrderHistory(symbol){
        let data;
        let container = []
        try {
            data = await this.access.getAllOrders(symbol);
        } catch (err) {
            console.log(err)
            return container;
        }
        for(let item of data) {
            container.push({
                symbol: item.symbol,
                orderId: item.orderId,
                price: parseFloat(item.price),
                side: item.side,
                status: item.status,
                time: item.time
            })
        }
        return container;
    }
}

class BinanceFuturesApi extends BinanceBaseApi {
    constructor(publicKey, secretKey) {
        super();
        this.access = new BinanceFuturesAccess(publicKey, secretKey)
        this.enum = {
            side:{
                buy: "BUY",
                sell: "SELL"
            },
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

    async getPositions(symbol){
        let data;
        let container = []
        try {
            data = await this.access.getPositions(symbol);
        } catch (err) {
            console.log(err)
            return container;
        }
        for(let item of data) {
            let quantity = parseFloat(item.positionAmt)
            container.push({
                symbol: item.symbol,
                quantity,
                side: quantity < 0 ? this.enum.side.sell : this.enum.side.buy,
                entryPrice: parseFloat(item.entryPrice),
                leverage: parseFloat(item.leverage),
                unRelProfit: parseFloat(item.unRealizedProfit)
            })
        }
        return container;
    }

    async getBalance() {
        let data;
        let container = []
        try {
            data = await this.access.getAccountBalance();
        } catch (err) {
            console.log(err)
            return container;
        }
        for (let item of data) {
            container.push({
                asset: item.asset,
                availableBalance: parseFloat(item.availableBalance),
                locked: NaN
            })
        }
        return container;
    }

    async getActiveOrders(symbol) {
        let data;
        let container = []
        try {
            data = await this.access.getOpenOrders(symbol);
        } catch (err) {
            console.log(err)
            return container;
        }
        for(let item of data) {
            container.push({
                symbol: item.symbol,
                orderId: item.orderId,
                clOrderId: item.clientOrderId,
                price: parseFloat(item.price),
                side: item.side,
                quantity : parseFloat(item.origQty),
                status: item.status,
                time: item.time
            })
        }
        return container;
    }
}

module.exports = {
    BinanceSpotApi,
    BinanceFuturesApi
}