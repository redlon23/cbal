class CBALInterface {
    constructor() {}

    // ============= Market Endpoints =================
    /**
     * Gets the given symbols latest price
     * @throws {ParameterError | NotFoundError}
     * @param symbol {string}
     * @return {Promise<number>}
     */
    async getPrice(symbol) {
        throw new Error("Must implement interface method!")
    }

    /**
     * Gets all the given symbol prices
     * @throws {ParameterError | NotFoundError}
     * @param symbols{array<string>}
     * @return array<{symbol: string, price: number}>
     */
    async getMultiplePrice(symbols) {
        throw new Error("Must implement interface method!")
    }

    /**
     * Gets the given symbols order book data
     * @param symbol {string}
     * @throws {ParameterError | NotFoundError}
     * @return {Promise<{asks: array<{price: number, quantity: number}>,bids: array<{price: number, quantity: number}>}>}
     */
    async getOrderBook(symbol){
        throw new Error("Must implement interface method!")
    }

    /**
     * Gets given symbols kline data, if start
     * is not given, it will return most recent data.
     * @param symbol {string}
     * @param interval {enum} interval
     * @param startTime {number | string} timestamp optional
     * @throws {ParameterError | NotFoundError}
     * @return {array<{openTime: number, open: number, high: number, low:number, close:number, volume: number}>}
     */
    async getKlineData(symbol, interval, startTime){
        throw new Error("Must implement interface method!")
    }


    // =============== User Data Endpoints ==================
    /**
     * Gets all open positions of given symbol
     * @param symbol {string}
     * @return {Promise<array<object>>}
     */
    async getPositions(symbol){
        throw new Error("Must implement interface method!")
    }
    /**
     * Gets all active orders of given symbol
     * @param symbol {string}
     * @return {Promise<array<object>>}
     */
    async getActiveOrders(symbol){
        throw new Error("Must implement interface method!")
    }

    /**
     * Collects all the assets that user owns.
     * @return {Promise<array<object>>}
     */
    async getBalance(){
        throw new Error("Must implement interface method!")
    }

    /**
     * Todo
     * @return {Promise<void>}
     */
    async getOrderHistory(){
        throw new Error("Must implement interface method!")
    }
}

module.exports = CBALInterface