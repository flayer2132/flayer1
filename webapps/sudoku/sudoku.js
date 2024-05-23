// init global variables
let newSquare = "";
let lastSquare = "";

const chars = "abcdefghi";
let locked = [];
let win = [];

let grid = {
  seta: [0, 0, 0, 0, 0, 0, 0, 0, 0],
  setb: [0, 0, 0, 0, 0, 0, 0, 0, 0],
  setc: [0, 0, 0, 0, 0, 0, 0, 0, 0],
  setd: [0, 0, 0, 0, 0, 0, 0, 0, 0],
  sete: [0, 0, 0, 0, 0, 0, 0, 0, 0],
  setf: [0, 0, 0, 0, 0, 0, 0, 0, 0],
  setg: [0, 0, 0, 0, 0, 0, 0, 0, 0],
  seth: [0, 0, 0, 0, 0, 0, 0, 0, 0],
  seti: [0, 0, 0, 0, 0, 0, 0, 0, 0]
};

let check = Object.keys(grid);

let games = 0;
let errors = 0;


//-------------------------------------------------------------------------------

//mBUG: can generate impossible f columns (~5%) will restart generation on detection
//mBUG: does not update existing highlighted numbers if they become legal

//-------------------------------------------------------------------------------


window.onload = clearAll();

//check if entire column is correct
function winV(set){

  //get contents of given set
  let column = "set" + set;
  let array = grid[column];

  let total = 0;

  array.forEach(element => {
    total = total + element;
  });

  //check win cond for set
  //add set to win if not there
  if (total == 45){
    if(win.includes(set)){

    } else {
      win.push(set);
    };
    
  };

};

//check win cond for pos
//add pos to win if not there
function winH(pos){

  let total = 0;

  //loop though each set and total values in pos
  for(i = 0; i < 9; i++){
    let set = "set" + chars[i];
    total = total + parseInt(grid[set][pos]);
  };

  //check win cond for pos
  //add set to win if not there
  if (total == 45){
    if(win.includes(pos)){

    } else {
      win.push(pos);
    };
    
  };

};

function victory(){
  if(win.length == 18){
    alert("Congratulations! You Win!");
  };
};

//clear sets and grid text
//clears edited styling
function clearAll(){

  //clear values of all sets
  check.forEach(element => {
    grid[element] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  });
  
  //remove text from game board
  //remove styling from game board
  for (let n = 1; n < 10; n++) {
      let pos = n;
      for (let c = 0; c < 9; c++) {
        let set = chars[c];
        $("#"+ pos + set).text("");
        $("#"+ pos + set).removeClass("edited error pressed");
      };
  };

  //clear global variables
  newSquare = "";
  lastSquare = "";
  locked = [];
  win = [];

  //generate new grid
  nextSet();

};

//cycle through all nine sets and run assign for each set
function nextSet(){

  let total = 0;

  const clues = 9;
  const columns = 9;

  let x = false;
  
  for (let i = 0; i < columns; i++) {
    let set = chars[i];
    console.log("ASSIGNING SET " + set);
    total = total + clues;
    x = assignClues(set, clues);
    if (x == true){
      i = 0;
      errors++;
    };
  };
  games++;
  console.log("Games: " + games);
  console.log("Generation Errors: " + errors);
  scrubGrid();
  newSquare = "";
  lastSquare = "";
  
};

//clear numbers from grid
function scrubGrid(){

  //each set from a though i
  for (let i = 0; i < 9; i++) {
    let set = chars[i];

    //random number of empty cells
    let empty = Math.floor((Math.random() * 2)) + 4;
    
    //number of times equal to empty
    for (let i = 0; i < empty; i++) {
      //random pos
      let pos = Math.floor((Math.random() * 9));
      setNumber(set, pos, 0);

     //remove from lock array
      let lockNum = (pos + 1) + set;
      let keyNum = locked.indexOf(lockNum);
      if(keyNum !== -1){
        let cut = slice(keyNum, locked);
        locked = cut;
      };

    };

  };

};

//slices out given index (p) from array (array)
//returns updated array
function slice(p, array){

  let a = array;
  
  let before = [];
  let after = [];
  let update = [];

  before = a.slice(0, p);
  after = a.slice(p + 1);
  update = before.concat(after);

  return update;

};

//assign a number of clues (clues) for the given set (set)
function assignClues(set, clues){

  let pool = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  let free = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  let backup = [];

  let i = 0;
  let test = 0;
  let cycle = 0;

  let x = false;
  let y = false;

  let cut = [];
  let num = 0;
  let select = 0;

  function newPosition(){

    //pick a random empty position in current set
    empty = Math.floor((Math.random() * free.length));
    pos = free[empty];

    console.log("next position: " + (pos + 1));

    //slice empty position from free
    cut = slice(empty, free);
    free = cut;

  };

  newPosition();

  //randomly assign a number to cells in current column for the given number of clues (clues) 
  //track number using counter (i)
  while (i < clues){

    //select a random unused number to insert into pos
    select = Math.floor((Math.random() * pool.length));
    num = pool[select];

    console.log("next number: " + num);
    
    console.log("checking validity of " + num + " in grid " + (pos+1) + set);

    //check for duplicates horizontally
    x = checkH(pos, num);
    //check for duplicates in box
    y = checkB(set, pos, num);

    //if a dupicate is detected
    if (x == true || y == true){

      console.log(true);

      //store failed numbers in backup array
      backup.push(num);

      //slice out selected used number from pool
      cut = slice(select, pool);
      pool = cut;

      console.log(pool);
      console.log(backup);

      //impossible generaton detector
      //break generation and restart grid
      if(cycle > 20){
        console.log("error: cycle maximum detected in set " + set + " " + free.length);
        return true;
      };

      //if no numbers remain that fit into selected position, coloumn assignment must be invalid.
      //erase column, reset counter and try to assign entire column again
      if(pool.length == 0){
        console.log("Error: invalid set assignment - erasing set");
        eraseColumn(set);
        i = 0;
        test = 0;
        cycle++;
        backup = [];
        pool = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        free = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        newPosition();
      };

    };

    //if no duplicate is detected
    if (x == false && y == false){
      
      //send selected number (num) at position (pos) to set
      setNumber(set, pos, num);

      //lock cell from editing
      lockCell(set, pos);

      //restore backup numbers
      pool = pool.concat(backup);
      backup = [];

      //get correct positon in pool
      select = pool.indexOf(num);

      //slice out selected used number from pool
      cut = slice(select, pool);
      pool = cut;

      //move to next random cell (i), reset loop detection (test), pick a new random cell
      i++;
      test = 0;
      if (free.length > 0){
        newPosition();
      };

      console.log(pool);

    };

    //infininte loop detection and break
    test++
    if (test > 20){
      alert("infinite loop detected");
      console.log("ERROR: INF LOOP DETECTED - SKIPPING");
      break;
    };

  };

};

//set all numbers to 0 for given column (set) directly
//clears text in the column in game grid
//unlocks all cells for this column
function eraseColumn(set){

  let find = "set" + set;
  grid[find] = [0, 0, 0, 0, 0, 0, 0, 0, 0]; 

  //clear text in grid
  for(i = 1; i < 10; i++){
    $("#"+ i + set).text("");
  }
  
  // unlock all cells for this set
  locked.forEach((element) =>  {

    if (element.charAt(1) == set){

      //find index of matching element
      let a = locked.indexOf(element);

      //slice out that element in array
      let cut = slice(a, locked);
      locked = cut;

    };

  });

};

//check for duplicates of number (num) at postion (pos) in each set
function checkH(pos, num){

  let i = 0;
  let err = false;
  
  //check value of each set at postion
  check.forEach(element => {
    if(grid[element][pos] == num){
      err = true;
    };
    i++;
  });

  return err;

};

//check for duplicates of number (num) in set (set) in each set
function checkV(set, num){

  let err = false;

  let setName = "set" + set;
  let cont = grid[setName];

  cont.forEach(element => {
    if(element == num){
      err = true;
    };
  });

  return err;

};

//check 9x9 box for duplicates
function checkB(set, pos, num){

  let err = false;

  let keys = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
  let arr = keys.indexOf(set);
  
  let ns = check[arr + 1]
  let nns = check[arr + 2];
  let ps = check[arr - 1]
  let pps = check[arr - 2];
  
  const alph = {
    set1: ['a', 'd', 'g'],
    set2: ['b', 'e', 'h'],
    set3: ['c', 'f', 'i']
  };

  const numer = {
    pos1: [0, 3, 6],
    pos2: [1, 4, 7],
    pos3: [2, 5, 8]
  };

  //top left
  alph.set1.forEach(element => {
    if (set == element){
      numer.pos1.forEach(element => {
        if (pos == element){
          if (num == grid[ns][pos + 1]){
            err = true;
          }
          else if(num == grid[nns][pos + 1]){
            err = true;
          }
          else if(num == grid[ns][pos + 2]){
            err = true;
          }
          else if(num == grid[nns][pos + 2]){
            err = true;
          };
        };
      });
    };
  });

  //mid left
  alph.set1.forEach(element => {
    if (set == element){
      numer.pos2.forEach(element => {
        if (pos == element){
          if (num == grid[ns][pos + 1]){
            err = true;
          }
          else if(num == grid[nns][pos + 1]){
            err = true;
          }
          else if(num == grid[ns][pos - 1]){
            err = true;
          }
          else if(num == grid[nns][pos - 1]){
            err = true;
          };
        };
      });
    };
  });

  //bot left
  alph.set1.forEach(element => {
    if (set == element){
      numer.pos3.forEach(element => {
        if (pos == element){
          if (num == grid[ns][pos - 1]){
            err = true;
          }
          else if(num == grid[nns][pos - 1]){
            err = true;
          }
          else if(num == grid[ns][pos - 2]){
            err = true;
          }
          else if(num == grid[nns][pos - 2]){
            err = true;
          };
        };
      });
    };
  });

  //top mid
  alph.set2.forEach(element => {
    if (set == element){
      numer.pos1.forEach(element => {
        if (pos == element){
          if (num == grid[ps][pos + 1]){
            err = true;
          }
          else if(num == grid[ps][pos + 2]){
            err = true;
          }
          else if(num == grid[ns][pos + 1]){
            err = true;
          }
          else if(num == grid[ns][pos + 2]){
            err = true;
          };
        };
      });
    };
  });

  //mid mid
  alph.set2.forEach(element => {
    if (set == element){
      numer.pos2.forEach(element => {
        if (pos == element){
          if (num == grid[ps][pos - 1]){
            err = true;
          }
          else if(num == grid[ps][pos + 1]){
            err = true;
          }
          else if(num == grid[ns][pos - 1]){
            err = true;
          }
          else if(num == grid[ns][pos + 1]){
            err = true;
          };
        };
      });
    };
  });

  //bot mid
  alph.set2.forEach(element => {
    if (set == element){
      numer.pos3.forEach(element => {
        if (pos == element){
          if (num == grid[ps][pos - 1]){
            err = true;
          }
          else if(num == grid[ps][pos - 2]){
            err = true;
          }
          else if(num == grid[ns][pos - 1]){
            err = true;
          }
          else if(num == grid[ns][pos - 2]){
            err = true;
          };
        };
      });
    };
  });

  //top right
  alph.set3.forEach(element => {
    if (set == element){
      numer.pos1.forEach(element => {
        if (pos == element){
          if (num == grid[ps][pos + 1]){
            err = true;
          }
          else if(num == grid[pps][pos + 1]){
            err = true;
          }
          else if(num == grid[ps][pos + 2]){
            err = true;
          }
          else if(num == grid[pps][pos + 2]){
            err = true;
          };
        };
      });
    };
  });

  //mid right
  alph.set3.forEach(element => {
    if (set == element){
      numer.pos2.forEach(element => {
        if (pos == element){
          if (num == grid[ps][pos + 1]){
            err = true;
          }
          else if(num == grid[pps][pos + 1]){
            err = true;
          }
          else if(num == grid[ps][pos - 1]){
            err = true;
          }
          else if(num == grid[pps][pos - 1]){
            err = true;
          };
        };
      });
    };
  });

  //bot right
  alph.set3.forEach(element => {
    if (set == element){
      numer.pos3.forEach(element => {
        if (pos == element){
          if (num == grid[ps][pos - 1]){
            err = true;
          }
          else if(num == grid[pps][pos - 1]){
            err = true;
          }
          else if(num == grid[ps][pos - 2]){
            err = true;
          }
          else if(num == grid[pps][pos - 2]){
            err = true;
          };
        };
      });
    };
  });

  return err;

};


//highlight cells in error for array and position
function showError(a, p){
  $("#" + (p + 1) + a).addClass("error");
}


//clear styling on cells with no error
function clearError(a, p){
  $("#" + (p + 1) + a).removeClass("error");
}

//lock cell from editing
function lockCell(set, pos){
  let lock = (pos + 1) + set;
  locked.push(lock);
  console.log("locking " + lock);
};

// set current and previous square variables
// also set visual effects
$(".square").on("click", function(){
  if(newSquare){
    lastSquare = newSquare;
  }
  else{
    lastSquare = this.id;
  }
  newSquare = this.id;
  
  $("#"+lastSquare).removeClass("pressed");
  $("#"+newSquare).addClass("pressed");
});


//set number in chosen square when number is pressed
//also set array for chosen square
$(".number").on("click", function(){
  if(newSquare){
    let a = newSquare.charAt(1);
    let p = parseInt(newSquare.charAt(0)) - 1;
    let n = parseInt(this.id);

    //check if cell is locked
    if(locked.includes(newSquare)){
      
    }
    else{
      
      //temp set number to 0 for error checking
      setNumber(a, p, 0);

      x = checkH(p, n);
      y = checkV(a, n);
      z = checkB(a, p, n);

      // console.log("checking set " + a + " pos " + p + " num " + n);
  
      setNumber(a, p, n);
      $("#" + (p + 1) + a).addClass("edited");

      if(x == true || y == true || z == true){
        showError(a, p);
      }
      else if(x == false && y == false && z == false){
        clearError(a, p);
        winH(p);
        winV(a);
        victory();
      };

    };
    
  };
  
});


//update array (set) at chosen position (pos) with given number (num)
function setNumber(set, pos, num){

  let array = "set" + set;

  //set grid location to write to
  newSquare = ((pos) + 1) + set;
  
  //write number in game grid
  if(num > 0){
    $("#"+newSquare).text(num);
  }
  else{
    $("#"+newSquare).text("");
  }

  //log status
  // console.log("writing grid: " + newSquare);
  // console.log("assigning set: " + num + " to " + pos + set);

  grid[array].splice(pos, 1, num);

};


//remove number in chosen square when erase is pressed
$(".erase").on("click", function(){
  if(newSquare){

    //check if cell is locked
    if(locked.includes(newSquare)){
      
    }
    else{
    let set = newSquare.charAt(1);
    let pos = parseInt(newSquare.charAt(0)) - 1;
    setNumber(set, pos, 0);
    clearError(set, pos);

    //if cell is in win, remove
    if (win.indexOf(set) !== -1){
      let setLoc = win.indexOf(set);
      let cut = slice(setLoc, win);
      win = cut;
    };
    if (win.indexOf(pos) !== -1){
      let setPos = win.indexOf(set);
      let cut = slice(setPos, win);
      win = cut;
    };

    };

  };
});

//reload page when back is pressed
$(".back").on("click", function(){
  window.location.reload();
});
