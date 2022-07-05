const express = require('express');
const Binance = require('binance-api-node').default
const { PORT, API_KEY, API_SECRET } = require('./config');
const app = express()

const { databaseConnection } = require('./database');
const expressApp = require('./express-app');

//takes in 3 params
const client = Binance({
    apiKey: API_KEY,
    apiSecret: API_SECRET
  })
//global level - going to be runb before any other requests.
//middleware runs in order it's defined
// app.use(binancePriceLookUp)
// app.use(orderLookUp)

app.get('/cryptoprice', orderLookUp, binancePriceLookUp, async (req, res)  => {
    console.log(req.cryptoQtyAvailable)
    console.log(req.cryptoPriceInUSDT)
    return res.send(req.cryptoQtyAvailable)
});

app.get('/cryptobuy', binanceBuyInUSDT, async (req, res)  => {
    const coinCurrency = 'BTCUSDT'
    const cryptoPriceInUSDT = await client.prices({symbol: coinCurrency})
    const buyPrice =  parseFloat(cryptoPriceInUSDT.BTCUSDT); 
    let buyQty = 20 / buyPrice
    buyQty = buyQty.toFixed(6)

    
    const buyCrypto = await client.order({
      
        symbol: coinCurrency,
        side: 'BUY',
        quantity: String(buyQty),
        price: String(buyPrice),
      })
    res.send(buyCrypto)
});

app.get('/cryptosell', orderLookUp, binancePriceLookUp, async (req, res)  => {
    const coinCurrency = 'BTCUSDT'
    const cryptoPriceInUSDT = await client.prices({symbol: "BTCUSDT"})
    console.log('Crpyto Sell',cryptoPriceInUSDT)
    const binanceOrderLookUpByCrypto =  await client.accountInfo({ })
    let crypto = 'BTC'
    let binanceWallet =  binanceOrderLookUpByCrypto.balances.find(element => element.asset === crypto)
    const crpytoAvailableToSell = binanceWallet.free
    console.log('Crpyto Sell',crpytoAvailableToSell)
    
    
    const sellPrice =  parseFloat(cryptoPriceInUSDT.BTCUSDT); 
    let sellQty = parseFloat(crpytoAvailableToSell)
    sellQty = sellQty.toFixed(6)

    
    const sellCrypto = await client.order({
      
        symbol: coinCurrency,
        side: 'SELL',
        quantity: String(sellQty),
        price: String(sellPrice),
      })
    res.send(sellCrypto)
});


async function binancePriceLookUp(req, res, next){
    const cryptoPriceInUSDT =  await client.prices({symbol: "BTCUSDT"})
    req.cryptoPriceInUSDT = cryptoPriceInUSDT;
    next()
}

async function binanceBuyInUSDT(req, res, next){
    const cryptoPriceInUSDT =  await client.prices({symbol: "BTCUSDT"})
    req.cryptoPriceInUSDT = cryptoPriceInUSDT;
    next()
}
async function binanceSellInUSDT(req, res, next){
    const cryptoPriceInUSDT =  await client.prices({symbol: "BTCUSDT"})

    next()
}

async function binanceSellInUSDT(req, res, next){
    const cryptoPriceInUSDT =  await client.prices({symbol: "BTCUSDT"})

    next()
}


async function orderLookUp(req, res, next){
    const binanceOrderLookUpByCrypto =  await client.accountInfo({ })
    let crypto = 'USDT'
    let cryptoQtyAvailable = binanceOrderLookUpByCrypto.balances.find(element => element.asset === crypto)
    req.cryptoQtyAvailable = cryptoQtyAvailable;
    next()
}

  function contactBinance(){
    client.time().then(time => console.log(time))
}


app.listen(contactBinance)

app.listen(PORT, () => {
    console.log(`listening to port ${PORT}`);
})

// const StartServer = async() => {

//     const app = express();
           
//     await expressApp(app);
//     const PORT = 8000
    
//     app.listen(PORT, () => {
//         console.log(`listening to port ${PORT}`);
//     })
//     .on('error', (err) => {
//         console.log(err);
//         process.exit();
//     })
// }

// StartServer();