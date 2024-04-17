
//recieve dice number and set the corrosponding image and text to the result
function diceRoll(a){
    var d6 = Math.floor(Math.random() * 6) + 1;
    console.log("P" + a + " rolls " + d6)
    document.getElementById("d6-" + a + "-result").innerHTML = d6;
    document.getElementById("d6-" + a + "-img").src = "images/dice" + d6 + ".png";
}

//compare result of each die and determine winner
function winner(){
    var p1 = document.getElementById("d6-1-result").textContent;
    var p2 = document.getElementById("d6-2-result").textContent;
    
    if (p1 > p2){
        document.getElementById("winner").textContent = "Player 1 Wins!";
    }
    else if (p1 < p2){
        document.getElementById("winner").textContent = "Player 2 Wins!";
    }
    else if (p1 == p2){
        document.getElementById("winner").textContent = "It's a Draw!";
    }
}