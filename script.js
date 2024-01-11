const frequencies = {
  A: 0.08167,
  B: 0.01492,
  C: 0.02782,
  D: 0.04253,
  E: 0.12703,
  F: 0.02228,
  G: 0.02015,
  H: 0.06094,
  I: 0.06966,
  J: 0.00153,
  K: 0.00772,
  L: 0.04025,
  M: 0.02406,
  N: 0.06749,
  O: 0.07507,
  P: 0.01929,
  Q: 0.00095,
  R: 0.05987,
  S: 0.06327,
  T: 0.09056,
  U: 0.02758,
  V: 0.00978,
  W: 0.0236,
  X: 0.0015,
  Y: 0.01974,
  Z: 0.00074,
};

var board = [];
var marked = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];
var currSum = 0;

var cumulativeFrequencies = {};

for (let [letter, freq] of Object.entries(frequencies)) {
  currSum = currSum + freq;
  cumulativeFrequencies[letter] = currSum;
}

function generateBoard() {
  for (let i = 0; i < 4; i++) {
    var col = [];
    for (let j = 0; j < 4; j++) {
      var rand = Math.random();
      var letterToAdd = "A";
      for (let [letter, freq] of Object.entries(cumulativeFrequencies)) {
        if (freq > rand) {
          letterToAdd = letter;
          break;
        }
      }
      col.push(letterToAdd);
      const id = "" + i + j;
      document.getElementById(id).innerHTML = letterToAdd;
    }
    board.push(col);
  }
}

function clear() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      marked[i][j] = 0;
    }
  }
}
function findWord(word, row, col) {
  if (4 <= col || 4 <= row || row < 0 || col < 0 || marked[row][col] == 1) {
    return false;
  }
  marked[row][col] = 1;

  if (word.length == 1) {
    if (board[row][col].charAt(0) == word.charAt(0)) {
      return true;
    } else {
      marked[row][col] = 0;
      return false;
    }
  } else if (board[row][col].charAt(0) == word.charAt(0)) {
    word = word.substring(1);
    if (findWord(word, row + 1, col + 1)) {
      return true;
    } else if (findWord(word, row + 1, col)) {
      return true;
    } else if (findWord(word, row + 1, col - 1)) {
      return true;
    } else if (findWord(word, row, col + 1)) {
      return true;
    } else if (findWord(word, row, col - 1)) {
      return true;
    } else if (findWord(word, row - 1, col + 1)) {
      return true;
    } else if (findWord(word, row - 1, col)) {
      return true;
    } else if (findWord(word, row - 1, col - 1)) {
      return true;
    }
  }

  marked[row][col] = 0;

  return false;
}
function matchWord(word) {
  clear();

  word = word.toUpperCase();

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (board[i][j].charAt(0) == word.charAt(0)) {
        var result = findWord(word, i, j);
        if (result) {
          return true;
        }
      }
    }
  }

  return false;
}

var score = 0;

var wordsFound = new Set();

function updateScore(word) {
  score += word.length - 2;
}

function reset() {
  score = 0;
  document.getElementById("score").innerText = score;
  wordsFound.clear();
  board = [];
  generateBoard();
}

async function enterWord() {
  var word = document.getElementById("input").value;

  isValidWord(word).then((isValid) => {
    if (matchWord(word) && !wordsFound.has(word) && isValid) {
      updateScore(word);
      document.getElementById("score").innerText = score;
      wordsFound.add(word);
      document.getElementById("response").innerText = word;
      document.getElementById("response").style.color = "green";
    } else if (wordsFound.has(word)) {
      document.getElementById("response").innerText = "Already Found";
      document.getElementById("response").style.color = "yellow";
    } else {
      console.log("invalid word");
      document.getElementById("response").innerText = "Invalid Word";
      document.getElementById("response").style.color = "purple";
    }
    document.getElementById("input").value = "";
  });
}

async function isValidWord(word) {
  const url = "https://api.dictionaryapi.dev/api/v2/entries/en/" + word;

  try {
    const response = await fetch(url);
    const result = await response.text();
    const resultObj = JSON.parse(result);

    return response.ok;
  } catch (error) {
    console.error(error);
    return false;
  }
}
0;
generateBoard();

document.getElementById("enter").addEventListener("click", (event) => {
  enterWord();
});
document.getElementById("input").addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("enter").click();
  }
});

document.getElementById("reset").addEventListener("click", (event) => {
  reset();
});
