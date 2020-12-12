const {BinanceSpotApi, BinanceFuturesApi} = require("./Binance")
const {KrakenApi} = require("./Kraken")
const {BybitUsdtApi, BybitInverseApi} = require("./Bybit")

const bs = new BinanceSpotApi("", "")
const bf = new BinanceFuturesApi("", "")
const k = new KrakenApi("", "")
const bu = new BybitUsdtApi("", "")
const bi = new BybitInverseApi("", "")

async function getPriceTest() {
    let data  = await bs.getPrice("BTCUSDT")
    let data1  = await bf.getPrice("BTCUSDT")
    let data2  = await k.getPrice("BTCUSDT")
    let data3  = await bu.getPrice("BTCUSDT")
    let data4  = await bi.getPrice("BTCUSDT")
    console.log("Binance spot:", data)
    console.log("Binance futures:", data1)
    console.log("Kraken:", data2)
    console.log("Bybit usdt:", data3)
    console.log("Bybit inverse:", data4)
}

async function getMultiplePriceTest() {
    let data  = await bs.getMultiplePrice(["BTCUSDT", "ETHUSDT"])
    let data1  = await bf.getMultiplePrice(["BTCUSDT", "ETHUSDT"])
    let data2  = await k.getMultiplePrice(["BTCUSDT", "ETHUSDT"])
    let data3  = await bu.getMultiplePrice(["BTCUSDT", "BTCUSD"])
    let data4  = await bi.getMultiplePrice(["BTCUSDT", "BTCUSD"])
    console.log("Binance spot:", data)
    console.log("Binance futures:", data1)
    console.log("Kraken:", data2)
    console.log("Bybit usdt:", data3)
    console.log("Bybit inverse:", data4)
}


async function getOrderBookTest() {
    let data  = await bs.getOrderBook("BTCUSDT")
    let data1  = await bf.getOrderBook("BTCUSDT")
    let data2  = await k.getOrderBook("BTCUSDT")
    let data3  = await bu.getOrderBook("BTCUSDT")
    let data4  = await bi.getOrderBook("BTCUSDT")
    console.log("Binance spot:", data)
    console.log("Binance futures:", data1)
    console.log("Kraken:", data2)
    console.log("Bybit usdt:", data3)
    console.log("Bybit inverse:", data4)
}

async function getKlineData() {
    let data  = await bs.getKlineData("BTCUSDT", bs.enum.interval.min1, "")
    let data1  = await bf.getKlineData("BTCUSDT", bf.enum.interval.min1, "")
    let data2  = await k.getKlineData("BTCUSDT", k.enum.interval.min1, "")
    let data3  = await bu.getKlineData("BTCUSDT", bu.enum.interval.min1, 1581231260)
    let data4  = await bi.getKlineData("BTCUSD", bi.enum.interval.min1, 1581231260)
    console.log("Binance spot:", data)
    console.log("Binance futures:", data1)
    console.log("Kraken:", data2)
    console.log("Bybit usdt:", data3)
    console.log("Bybit inverse:", data4)
}

async function main(){
    await getKlineData();
    // let bin = new BinanceFuturesApi("", "");
    // let startTime = Date.now() - (60 * 60 * 1000);
    // var start = new Date()
    // var hrstart = process.hrtime()
    // // 500 - 1000 ms
    // let data = await bin.getKlineData("BTCUSDT", bin.enum.interval.min1, startTime, 100)
    // var end = new Date() - start,
    //     hrend = process.hrtime(hrstart)
    //
    // console.info('Execution time: %dms', end)
    // console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)
    // console.log(data)
}

main()