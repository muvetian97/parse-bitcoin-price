var Koa = require('koa');
var Router = require('koa-router');
const request = require('request');
var cheerio = require('cheerio');
var app = new Koa();
var router = new Router();

// Function to get the current price of Bitcoin
getBitcoinPrice = function(){
    return new Promise((resolve,reject)=>{ request.get('https://coinmarketcap.com/currencies/bitcoin/', (error,response,body)=>{
        $ = cheerio.load(body); // parse the html using cheerio
        var price = $('span[class=cmc-details-panel-price__price]').html();
        resolve(price); 
        return price;
        }).on('error',reject);

    });
}

// Set up the router for price
router.get('/price',(ctx, next) => {
    // Await for the asynchronous function getBitcoinPrice to finish to return the result
    return getBitcoinPrice().then(function(price){
        const now = new Date(); // Get the current time
        ctx.body = {btc:price,timestamp:now.valueOf()}; // Render the response in a JSON form
    })
    .catch(function(err){
        console.log('Encountered an error.');
    });
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000);