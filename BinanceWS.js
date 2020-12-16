const WebSocket = require("ws");
const ApiAccess = require("./ApiAccess");
const {sortParamsAlphabetically} = require("./util");
const axios = require('axios');
const Mutex = require('async-mutex').Mutex;

class BinanceFuturesWebSocket extends ApiAccess {
    constructor(publicKey, secretKey) {
        super(publicKey, secretKey);
        this.ws = null;
        // this.base = " https://testnet.binancefuture.com"
        this.base = "https://fapi.binance.com"
        this.urlBaseWs = "wss://fstream.binance.com/ws/";
        // this.urlBaseWs = "wss://stream.binancefuture.com/ws/";
        this.mutex = new Mutex();
    }

    async getListenKey(){
        const endPoint = "/fapi/v1/listenKey";
        let url = `${this.base}${endPoint}`;
        const requestOptions = {
            headers: { 'X-MBX-APIKEY': this.public },
            url,
            method: "POST"
        };
        try{
            let data = await axios(requestOptions);
            return data.data;
        } catch (err) {
            console.log(err)
        }
    }


    async updateListenKey() {
        const endPoint = "/api/v3/userDataStream";
        const params = sortParamsAlphabetically({timestamp: Date.now()});
        const signature = this._getSignature(params);

        let url = `${this.base}${endPoint}?${params}&signature=${signature}`;
        const requestOptions = {
            headers: { 'X-MBX-APIKEY': this.public },
            url,
            method: "PUT"
        };

        return axios(requestOptions);
    }

    async attachListeners(symbol, priceCallback, executionCallback, balanceCallback){
        this.ws.on("ping", (msg)=>{ // Ping - Pong
            console.log("Ping Received", msg.toString());
            this.ws.pong();
        })

        this.ws.onclose = async (data)=>{
            console.log("ON CLOSE:", data)
            console.log("Websocket closed!")
            let {listenKey} = await this.getListenKey()
            await this.setupConnection(listenKey, symbol, priceCallback, executionCallback)
        }
        this.ws.onerror = async (err) => {
            console.log("Error has occured!")
            console.log(err)
            let {listenKey} = await this.getListenKey()
            await this.setupConnection(listenKey)
        }

        this.ws.onopen = ()=>{
            console.log("Web socket is now open!");
            this.subscribeToMiniTicker(symbol)
        }

        this.ws.onmessage = async (message) =>{
            let {data}  = message;
            data = JSON.parse(data)
            if(data.e !== undefined && data.e === "ORDER_TRADE_UPDATE") {
                await executionCallback(data)
            } else if(data.e !== undefined && data.e === "ACCOUNT_UPDATE"){
                balanceCallback(data)
            } else if(data.u !== undefined){
                if(this.mutex.isLocked()){
                    return;
                }
                let release = await this.mutex.acquire();
                await priceCallback(parseFloat(data.b),parseFloat(data.a), release)
            }
        }
    }

    async setupConnection(key='', symbol, priceCallback, orderCallback, balanceCallback){
        this.ws = null;
        this.ws = new WebSocket(`${this.urlBaseWs}${key}`);
        this.ws.binaryType = "arraybuffer"; // better performance
        await this.attachListeners(symbol, priceCallback, orderCallback, balanceCallback);
    }

    subscribeToMiniTicker(symbol){
        this.ws.send(`{
                "method": "SUBSCRIBE",
                "params":
                    [
                        "${symbol}@bookTicker"
                    ],
                "id": 1
            }`)
    }

    async testSetup(key ='', symbol){
        this.ws = null;
        this.ws = new WebSocket(`${this.urlBaseWs}${key}`);
        this.ws.binaryType = "arraybuffer"; // better performance
        await this.attachTest(symbol);
    }


    async attachTest(symbol){
        this.ws.on("ping", (msg)=>{ // Ping - Pong
            console.log("Ping Received", msg.toString());
            this.ws.pong();
        })

        this.ws.onclose = async (data)=>{
            console.log("ON CLOSE:", data)
            console.log("Websocket closed!")
            let {listenKey} = await this.getListenKey()
            await this.setupConnection(listenKey)
        }
        this.ws.onerror = async (err) => {
            console.log("Error has occured!")
            console.log(err)
            let {listenKey} = await this.getListenKey()
            await this.setupConnection(listenKey)
        }

        this.ws.onopen = ()=>{
            console.log("Web socket is now open!");
            this.subscribeToMiniTicker(symbol)
        }

        this.ws.onmessage = async (message) =>{
            let {data}  = message;
            data = JSON.parse(data)
            if(data.e !== undefined && data.e === "ORDER_TRADE_UPDATE") {
                console.log(data)
            }
        }
    }
}

class BinanceSpotWebSocket extends ApiAccess {
    constructor(publicKey, secretKey) {
        super(publicKey, secretKey);
        this.ws = null;
        this.base = "https://api.binance.com"
        this.urlBaseWs = "wss://stream.binance.com:9443/ws/";
        this.mutex = new Mutex();
    }

    async getListenKey(){
        const endPoint = "/api/v3/userDataStream";
        let url = `${this.base}${endPoint}`;
        const requestOptions = {
            headers: { 'X-MBX-APIKEY': this.public },
            url,
            method: "POST"
        };
        try{
            let data = await axios(requestOptions);
            return data.data;
        } catch (err) {
            console.log(err)
        }
    }

    async updateListenKey() {
        const endPoint = "/api/v3/userDataStream";
        const params = sortParamsAlphabetically({timestamp: Date.now()});
        const signature = this._getSignature(params);

        let url = `${this.base}${endPoint}?${params}&signature=${signature}`;
        const requestOptions = {
            headers: { 'X-MBX-APIKEY': this.public },
            url,
            method: "PUT"
        };

        return axios(requestOptions);
    }

    async attachListeners(symbol, priceCallback, executionCallback, balanceCallback){
        this.ws.on("ping", (msg)=>{ // Ping - Pong
            console.log("Ping Received", msg.toString());
            this.ws.pong();
        })

        this.ws.onclose = async (data)=>{
            console.log("ON CLOSE:", data)
            console.log("Websocket closed!")
            let {listenKey} = await this.getListenKey()
            await this.setupConnection(listenKey, symbol, priceCallback, executionCallback)
        }
        this.ws.onerror = async (err) => {
            console.log("Error has occured!")
            console.log(err)
            let {listenKey} = await this.getListenKey()
            await this.setupConnection(listenKey)
        }

        this.ws.onopen = ()=>{
            console.log("Web socket is now open!");
            this.subscribeToMiniTicker(symbol)
        }

        this.ws.onmessage = async (message) =>{
            let {data}  = message;
            data = JSON.parse(data)
            if(data.e !== undefined && data.e === "executionReport") {
                await executionCallback(data)
            } else if(data.e !== undefined && data.e === "outboundAccountPosition"){
                balanceCallback(data)
            } else if(data.u !== undefined && data.e !== "outboundAccountInfo"){
                if(this.mutex.isLocked()){
                    return;
                }
                let release = await this.mutex.acquire();
                await priceCallback(parseFloat(data.b),parseFloat(data.a), release)
            }
        }
    }

    async setupConnection(key='', symbol, priceCallback, orderCallback, balanceCallback){
        this.ws = null;
        this.ws = new WebSocket(`${this.urlBaseWs}${key}`);
        this.ws.binaryType = "arraybuffer"; // better performance
        await this.attachListeners(symbol, priceCallback, orderCallback, balanceCallback);
    }

    subscribeToMiniTicker(symbol){
        this.ws.send(`{
                "method": "SUBSCRIBE",
                "params":
                    [
                        "${symbol}@bookTicker"
                    ],
                "id": 1
            }`)
    }
}

module.exports = {BinanceFuturesWebSocket, BinanceSpotWebSocket}
