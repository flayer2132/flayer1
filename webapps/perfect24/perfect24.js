
//a prime number is any whole number greater than 1 that is only evenly divisibly by itself and 1

var num = 0; //number to check if prime
var max = 30; //maximum number to check for prime

start();

//run primecalc for each even number up to the max specified
function start(){
    $("#subtitle").append(" - (Maximum "+ max +")");
    for(var i = 1; i <= max; i++){
        num = i;
    primeCalc(num);
    }
}

//determine if number is prime
//if true, print number to new line
function primeCalc(num) {
    
    var chk = 1;
    var pri = [];

    console.log("new number");

    //divide num by each int starting at 1
    //record even divisors in var pri
    for (var i = 1; i <= num; i++){
        console.log("new calc");
        console.log("num: " + num);
        console.log("i: " + i);
        
        chk = num % i;
        
        console.log("check: " + chk);
        
        if (chk == 0){
            pri.push(i);
            console.log("pri: " + pri);
        }

    }

    //if num is prime, print num
    if (pri.length == 2){
        $("#result").append(num + " ");
    }
    
    //check if num is perfect, using discovered divisors
    perfectCalc(pri, num);

}

//check if number is perfect
function perfectCalc(div, prime){
    console.log("div: " + div);
    var per = 0;
    div.forEach(element => {
        per = per + element; 
    });
    
    //if perfect found, print perfect
    if(prime * 2 == per){
        $("#perfect").append(num + " ");
    }
    console.log("per: " + per);
}

