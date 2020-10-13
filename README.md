# Crypto Bot Api Library
Crypto Bot Api Library is a wrapper for crypto exchange apis. It provides easy to use methods to build bots quickly.
It has standardized responses for each exchange.

## Main motivation behind this library
The aim is being able to swap exchanges without worrying about
return types and parameters.
* I found my self writing the **same api calls** for most of my projects.
* Standardize the responses so that don't have to write **multiple variants** of the **same bot**.

## Features
This library is all about tools to creating bots and reducing amount of code written
to make your bot compatible with other exchanges.  

There are 3 main categories that CBAL library tries to cover:
   1. Access to market data
        * Price
        * Order book
        * Candlestick
   2. Access to users data
        * Active Orders
        * Balance
        * Positions
   3. Trade actions
        * Place Orders
        * Cancel orders  
        
   For all 3 main categories, CBAL tries to offer standardized responses.
   However, there are some exceptions where some apis don't provide same functionality as others.

   Every api call is fully documented so that user can read the differences and make their 
   own decisions.
   
   Signed / private endpoints will be covered in the library.  

## Documentation
CBAL offers documentation for each method including parameters and return types.  
Briefly, here are the unified methods.  
Market Data:
* `getPrice(symbol)` returns price
* `getMultiplePrice(symbols)` returns array of prices with symbols
* `getOrderBook(symbol)` returns array of order book data.
* `getKlineData(symbol, interval, startTime)` returns ohlc as well as volume and open time

User Data:
* `getBalance()` returns array of asset symbol pair
* `getActiveOrders(symbol)` returns array of active orders
* `getPosition(symbol)` returns position object (except Binance spot) 
## Upcoming Features
 Currently, working on user data api calls
 - [x] Binance spot
 - [x] Binance futures
 - [x]  Bybit Inverse
 - [x]  Bybit USDT
 - [ ]  Kraken  
 
 
 ## Finished
Market data api calls
  - [x] Binance spot
  - [x] Binance futures
  - [x]  Bybit Inverse
  - [x]  Bybit USDT
  - [x]  Kraken  


## Contributions, Bug report, Missing feature
 I am actively working on this library and adding new features as I need them.
 if you would like to see more features please let me know.  
 Feel free to **file a new issue**. 