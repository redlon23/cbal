class CBALInterface {
    constructor() {}

    async getPrice(symbol) {
        throw new Error("Must implement interface method!")
    }

    async getMultiplePrice(symbols) {
        throw new Error("Must implement interface method!")
    }

    async getOrderBook(symbol, limit){
        throw new Error("Must implement interface method!")
    }

    async getKlineData(symbol, interval, startTime, endTime, limit){
        throw new Error("Must implement interface method!")
    }

}

module.exports = CBALInterface