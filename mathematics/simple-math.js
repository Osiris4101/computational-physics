/****************************************************************
 * July 26th, 2021                                 M. Adil Umer *
 * Simpler mathematical function collection for misc. use cases.*
 ****************************************************************/

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

if (!Math.difference){
  Math.difference = function(a, b) {
    return Math.abs(a - b);
  }
}