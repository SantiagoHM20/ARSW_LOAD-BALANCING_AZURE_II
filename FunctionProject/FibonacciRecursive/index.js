var bigInt = require("big-integer");

const memoCache = {};

function fibonacciRecursive(n, cache) {
    if (n === 0) return bigInt.zero;
    if (n === 1) return bigInt.one;
    
    if (cache[n]) {
        return cache[n];
    }
    
    cache[n] = fibonacciRecursive(n - 1, cache).add(fibonacciRecursive(n - 2, cache));
    return cache[n];
}

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request (Recursive with Memoization).');

    let nth = req.body.nth;

    if (nth < 0) {
        context.res = {
            status: 400,
            body: "nth must be greater than or equal to 0"
        };
        return;
    }

    const cacheSize = Object.keys(memoCache).length;
    context.log(`Cache size before calculation: ${cacheSize}`);
    context.log(`Calculating Fibonacci(${nth})`);

    try {
        let answer = fibonacciRecursive(nth, memoCache);
        
        const newCacheSize = Object.keys(memoCache).length;
        context.log(`Cache size after calculation: ${newCacheSize}`);
        context.log(`Cache hit benefit: ${cacheSize > 0 ? 'YES' : 'NO'}`);

        context.res = {
            body: answer.toString()
        };
    } catch (error) {
        context.log.error('Error calculating Fibonacci:', error);
        context.res = {
            status: 500,
            body: `Error: ${error.message}`
        };
    }
}
