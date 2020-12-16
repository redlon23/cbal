const crypto = require("crypto")


/**
 * Api Access represents standardized way of of interacting with
 * exchange api.
 * This Abstract class only displays required functionality.
 * All api implementations must implement its methods.
 */
class ApiAccess{
    constructor(publicKey, secretKey){
        this.public = publicKey;
        this.secret = secretKey
    }
    _getSignature(requestParams) {
        return crypto.createHmac('sha256', this.secret).update(requestParams, "utf8").digest('hex')
    }

    setApiKeys(publicKey, secretKey){
        this.public = publicKey;
        this.secret = secretKey
    }
    // === Check Price =====

    async getOrderBook(symbol){throw new Error("Abstract method!");}

    async getSymbolPriceTicker(symbol){throw new Error("Abstract method!");}

    // === Check Position ===

    async getPositions(){throw new Error("Abstract method!");}

    //  ===== Place Order ===

    async placeLimitOrder(){throw new Error("Abstract method!");}

    async placeMarketOrder(){throw new Error("Abstract method!");}

    // ==== Cancel Order ====

    async cancelSingleOrder(){throw new Error("Abstract method!");}

    async cancelAllOrders(){throw new Error("Abstract method!");}

    // === Historic Data ===

    async getKlineData(){throw new Error("Abstract method!");}

}

module.exports = ApiAccess;