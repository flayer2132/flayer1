var total = 0; // sum total of dice
var pool = []; // array for dice tray

function addDice(num){
    if(pool.length < 8){
        var pos = (pool.length) + 1;
        pool.push(num);
        console.log(pool);
        document.getElementById(pos).innerHTML = num;
    }
}

function removeDice(loc){
    var rem = parseInt(loc) - 1;
    var before = [];
    var after = [];
    var upd = [];

    //cut & concat array
    if (pool.length > 0){
        before = pool.slice(0, rem);
        after = pool.slice(rem + 1);
        upd = before.concat(after);
        pool = upd;
    }

    console.log(pool);

    //need to re-print all tray numbers in this function
    clear();
    reprint();
}

//clears entire tray
function clear(){
    for (let i = 1; i < 9; i ++) {
        document.getElementById(i).innerHTML = "";
    }
}

//prints elements of pool array to tray
function reprint(){
    var len = pool.length;
    var p = (pool.length) + 1;
    var mod = 0;
    for (let i = 0; i < len; i ++) {
        mod = i + 1;
        document.getElementById(mod).innerHTML = pool[i];
    }
}

function calculate(){
    var res = []; //result for the throw
    
    //show die roll
    let x = 0; //each roll
    let roll = 0; //roll total

    if (pool.length > 0) {
        pool.forEach((die) => {
            x = Math.floor((Math.random() * die) + 1);
            roll = roll + x;
            console.log("this roll" + x);
            res.push(x);
        });
        var workings = res.toString(); //show all results
        document.getElementById("workings").innerHTML = workings;
    }

    console.log("total roll: " + roll);
    console.log(total);
    document.getElementById("result").innerHTML = roll;
}