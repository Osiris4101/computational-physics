/*************************************************************************
 * July 28th, 2021                                          M. Adil Umer * 
 *                                                                       *
 * FRACTIONS...                                      License: GNU GPL v3 * 
 *                                                                       *
**************************************************************************/

// Constants
const ERR_NUMBER_EXPECTED = "ERR_NUMBER_EXPECTED";
const ERR_DIVIDE_BY_ZERO = "ERR_DIVIDE_BY_ZERO";

const FRAC_TYPE_MIXED = "MIXED";
const FRAC_TYPE_PROPER = "PROPER";
const FRAC_TYPE_IMPROPER = "IMPROPER";
const FRAC_TYPE_UNKNOWN = "UNKNOWN";

// A couple of mathematical functions, no need to import a whole lot for just these two... 
if (!Math.gcd){
  Math.gcd = function(x, y){
    if(y == 0) return Math.abs(x);
    return Math.gcd (y, x % y);
  }
}

if(!Math.lcm){
  Math.lcm = function(x, y){
    return (x * y) / Math.gcd(x,y);
  }
}

// Class Definition
class Fraction{
  
  // var example = Fraction.fromDeacimal('14.112');
  // returns fraction in simplified form, without any decimals.
  static fromDecimal(dec){
    if (isNaN(dec)){
      throw new TypeError(ERR_NUMBER_EXPECTED);
    }
    if(dec % 1 == 0){
      return new Fraction(dec, 1, 0);
    }
    var s = String(dec);
    var p = s.indexOf(".");
    var dLen = s.substring(p).length - 1;
    var m = Math.pow(10, dLen);
    var x = m * dec;
    var frac = new Fraction(x, m, 0);
    frac.simplify();
    return frac;
  }

  // var example = new Fraction(14, 11);
  constructor(_nmrOrStr, _denominator, _whole){
    if (_nmrOrStr && (typeof _denominator == 'undefined')){
      if (_nmrOrStr instanceof Fraction){
        this.numerator = _nmrOrStr.numerator;
        this.denominator = _nmrOrStr.denominator;
        this.whole = _nmrOrStr.whole;
      }else if(typeof(_nmrOrStr) === 'number' || (_nmrOrStr instanceof Number)){
        this.numerator = _nmrOrStr;
        this.denominator = 0;
        this.whole = 0;
      }else if(typeof(_nmrOrStr) === 'string' || (_nmrOrStr instanceof String)){
        var w, n, d;
        var splitWhole = _nmrOrStr.split(' ');
        
        // If there is no space, e.g. 16/7, splitWhole array would have only one element => the whole part should be 0.
        w = splitWhole.length > 1 ? (splitWhole.shift() || 0) : 0;

        var splitFrac = splitWhole[0].split('/');
        [n, d] = splitFrac;
        if (!d) d = 1;

        return new Fraction(n, d, w);
      }

    }else if (isNaN(_nmrOrStr) || isNaN(_denominator) || _denominator == 0 || (_whole && isNaN(_whole))){
      throw new TypeError(_denominator == 0 ? ERR_DIVIDE_BY_ZERO : ERR_NUMBER_EXPECTED);
    }else{
      this.numerator = Number(_nmrOrStr);
      this.denominator = Number(_denominator);
      this.whole = Number(_whole || 0);
    }
  }

  get rationals(){
    var x = this.numerator;
    var y = this.denominator;
    if (this.whole) x = x + (this.whole * y);
    return [x, y];
  }

  // Returns simplified form of this fraction, without normalizing/changing the object itself.
  get simplified(){
    var [x, y] = this.rationals;
    var s1 = String(x);
    var p1 = s1.indexOf(".");
    var s2 = String(y);
    var p2 = s2.indexOf(".");
    
    if (p1 != -1 || p2 != -1){
      var d1 = s1.substring(p1);
      var d2 = s2.substring(p2);
      var dLen = p1 != -1 ? (p2 != -1 ? Math.max(d1.length > d2.length) : d1.length) : d2.length;
      var m = Math.pow(10, dLen - 1);
      x = x * m;
      y = y * m;
    }

    var gcd = Math.gcd(x, y);
    if (y < 0){
      y = -y;
      x = -x;
    }

    return new Fraction(x/gcd, y/gcd, 0);
  }

  // Returns numerical value of the fraction.
  get decimal(){
    var [x, y] = this.rationals;
    return x/y;
  }

  // Returns the multiplicative inverse of the fraction.
  get reciprocal(){
    var [x, y] = this.rationals;
    return new Fraction(y, x, 0);
  }

  // Returns the percentage represented by the fraction.
  get percentage(){
    return this.decimal*100;
  }

  // Returns the "type" of the fraction, as taught in elementary mathematics.
  get type(){
    if(this.whole){
      return FRAC_TYPE_MIXED;
    }

    if (this.numerator < this.denominator){
      return FRAC_TYPE_PROPER
    }

    if (this.numerator >= this.denominator){
      return FRAC_TYPE_IMPROPER
    }

    return FRAC_TYPE_UNKNOWN;
  }

  // Stringify the object for printing/logging.
  // ex. var exString = String(new Fraction(1, 2, 0)) // "1/2"
  toString(){
    var w = this.whole ? String(this.whole) + " " : "";
    return `${w}${this.numerator}/${this.denominator}`
  }
  
  // Numerical value of the fraction. 
  // Specifically put apart from Fraction.decimal for use with standard JS Number class.
  // ex. var exNumber = Number(new Fraction(1, 2, 0)) // 0.5
  valueOf(){
    return this.decimal;
  }

  // Compares the denominators with another fraction. 
  isLike(otherFraction){
    if(!(otherFraction instanceof Fraction)){
      _frac = new Fraction(_frac); // try to cast input into fraction
    }
    return otherFraction.denominator == this.denominator;
  }

  // Compares the numerical value with another fraction.
  isEquivalent(otherFraction){
    if(!(otherFraction instanceof Fraction)){
      _frac = new Fraction(_frac); // try to cast input into fraction
    }
    return otherFraction.decimal == this.decimal;
  }
  
  // DESTRUCTIVELY scales the fraction by a certain factor.
  scale(factor){
    var [x, y] = this.rationals;
    this.numerator = x * factor;
    this.denominator = y * factor;
  }

  //DESTRUCTIVELY normalizes the fraction.
  simplify(){
    var clone = this.simplified;
    this.numerator = clone.numerator;
    this.denominator = clone.denominator;
  }

  //DESTRUCTIVELY limits the denominator of the fraction to a maximum, 
  //simplifying it within the given accuracy of a certain number of decimal places.
  fitDown(maxDenom, decimalPlaces){
    var dp = (decimalPlaces && decimalPlaces > 0) ? decimalPlaces : 0;
    var clone = this.simplified;
    var [x, y] = clone.rationals;
    
    if (y > maxDenom){
      var factor = y / maxDenom;
      clone.numerator = Number((x / factor).toFixed(dp));  
      clone.denominator = maxDenom;
    }

    this.whole = 0;
    this.numerator = clone.numerator;
    this.denominator = clone.denominator;
  }

}

//Arithmetic functions
Fraction.prototype.add = function(_frac){
  if(isNaN(_frac)){
    _frac = new Fraction(_frac); // try to cast input into fraction
  }
  
  var clone = this.simplified;


  if(!(_frac instanceof Fraction)){
    clone.numerator += _frac;
    return clone.simplified;
  }
  
  _frac.simplify();
  
  var lcm = Math.lcm(_frac.denominator, clone.denominator);
  var a = (lcm * _frac.numerator / _frac.denominator);
  var b = (lcm * clone.numerator / clone.denominator);
  
  return new Fraction(a+b, lcm, 0).simplified;  
}

Fraction.prototype.subtract = function(_frac){
  if(isNaN(_frac)){
    _frac = new Fraction(_frac); // try to cast input into fraction
  }
  
  var clone = this.simplified;

  if(!(_frac instanceof Fraction)){
    clone.numerator -= _frac;
    return clone.simplified;
  }
  
  _frac.simplify();
  
  var lcm = Math.lcm(_frac.denominator, clone.denominator);
  var a = (lcm * _frac.numerator / _frac.denominator);
  var b = (lcm * clone.numerator / clone.denominator);
  
  return new Fraction(a-b, lcm, 0).simplified;  
}

Fraction.prototype.multiplyBy = function(_frac){
  if(isNaN(_frac)){
    _frac = new Fraction(_frac); // try to cast input into fraction
  }
  
  var clone = this.simplified;
  
  if(!(_frac instanceof Fraction)){
    clone.numerator *= _frac;
    return clone.simplified;
  }
  
  _frac.simplify();
  var a = (_frac.numerator * clone.numerator);
  var b = (_frac.denominator * clone.denominator);
  
  return new Fraction(a, b, 0).simplified;  
}

Fraction.prototype.divideBy = function(_frac){
  if(isNaN(_frac)){
    _frac = new Fraction(_frac); // try to cast input into fraction
  }
  
  var clone = this.simplified;
  if(!(_frac instanceof Fraction)){
    clone.numerator /= _frac;
    return clone.simplified;
  }
  
  // Division is just multiplication with inverse...
  var _alt = _frac.reciprocal;
  return this.multiplyBy(_alt);  
}

if(typeof module !== 'undefined'){
  module.exports = Fraction; 
}