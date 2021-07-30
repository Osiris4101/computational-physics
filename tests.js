const Fraction =  require('./mathematics/fraction');
const m = require('./mathematics/simple-math');
const geometry =  require('./mathematics/geometry');


var frac1 = new Fraction(10, 156);
var frac1a = new Fraction(16, 2, 16);
var frac2 = frac1.divideBy("16 16/2");
console.log(frac2)
