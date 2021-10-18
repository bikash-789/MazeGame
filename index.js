const map = [
  [1, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 0, 1, 1, 0, 0],
  [1, 0, 1, 0, 0, 1, 0, 0],
  [1, 0, 1, 1, 1, 1, 0, 0],
  [1, 1, 1, 0, 0, 0, 1, 1],
  [1, 1, 1, 0, 0, 1, 0, 0],
  [0, 0, 1, 0, 0, 1, 0, 0],
  [0, 0, 1, 1, 1, 1, 1, 1],
];
let N;
let userIsPlaying = false;

const tile = (x, y, type) => {
  const t = document.createElement("div");
  if (type === "floor") t.style.background = "#FEEFE5";
  else t.style.background = "#2A2B2A";
  t.classList.add("tile");
  t.style.left = x + "rem";
  t.style.top = y + "rem";
  return t;
};

const placeTile = (arr) => {
  let top = 0,
    left = -5;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (arr[i][j] === 1) {
        document
          .getElementById("board")
          .appendChild(tile(left + 5, top, "floor"));
      } else {
        document
          .getElementById("board")
          .appendChild(tile(left + 5, top, "wall"));
      }
      left += 5;
    }
    left = -5;
    top += 5;
  }
};

placeTile(map);

class Ball {
  constructor() {
    this.ball = document.createElement("div");
    this.ball.classList.add("ball");
    document.getElementById("board").appendChild(this.ball);
  }
}

class sprite extends Ball {
  default_X = 0;
  default_Y = 0;
  constructor() {
    super();
    this.x = 0;
    this.y = 0;
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        if (map[i][j] == 1) {
          this.x = this.default_X = j * 5;
          this.y = this.default_Y = i * 5;
          this.ball.style.left = j * 5 + "rem";
          this.ball.style.top = i * 5 + "rem";
          break;
        }
      }
      break;
    }
  }

  //set X
  set_X(x) {
    this.x = x;
    this.ball.style.left = this.x + "rem";
  }

  //set Y
  set_Y(y) {
    this.y = y;
    this.ball.style.top = this.y + "rem";
  }

  //set position
  set_position(x, y) {
    this.x = x;
    this.y = y;
    this.ball.style.left = x + "rem";
    this.ball.style.top = y + "rem";
    this.ball.classList.add("anim");
  }

  //get X
  get_X() {
    return this.x;
  }

  //get Y
  get_Y() {
    return this.y;
  }

  //get position
  get_position() {
    const pos = [];
    pos.push(this.x);
    pos.push(this.y);
    return pos;
  }

  //left move
  leftMove = () => {
    const xCord = this.get_X();
    const yCord = this.get_Y();
    if (xCord != 0 && map[yCord / 5][xCord / 5 - 1] != 0) {
      this.set_X(xCord - 5);
      this.ball.classList.add("anim");
      checkWin();
    }
  };

  //right move
  rightMove = () => {
    const xCord = this.get_X();
    const yCord = this.get_Y();
    if (xCord != 35 && map[yCord / 5][xCord / 5 + 1] != 0) {
      this.set_X(xCord + 5);
      this.ball.classList.add("anim");
      checkWin();
    }
  };

  //up move
  upMove = () => {
    const xCord = this.get_X();
    const yCord = this.get_Y();
    if (yCord != 0 && map[yCord / 5 - 1][xCord / 5] != 0) {
      this.set_Y(yCord - 5);
      this.ball.classList.add("anim");
      checkWin();
    }
  };

  //down move
  downMove = () => {
    const xCord = this.get_X();
    const yCord = this.get_Y();
    if (yCord != 35 && map[yCord / 5 + 1][xCord / 5] != 0) {
      this.set_Y(yCord + 5);
      this.ball.classList.add("anim");
      checkWin();
    }
  };

  //get default position
  get_default_pos() {
    const pos = [];
    pos.push(this.default_X);
    pos.push(this.default_Y);
    return pos;
  }

  //reset function
  reset() {
    const pos = this.get_default_pos();
    this.set_position(pos[0], pos[1]);
  }

  hasReachedGoal() {
    const pos = this.get_position();
    if (pos[0] == pos[1] && pos[0] == 35) {
      return true;
    }
    return false;
  }
}

//create new ball object
const newBall = new sprite();
const targetBall = new sprite();
targetBall.set_position(35, 35);
targetBall.ball.style.background = "green";
targetBall.ball.style.zIndex = 2;

//check win
const checkWin = () => {
  const pos = newBall.get_position();
  if (pos[0] == pos[1] && pos[0] == 35 && userIsPlaying) {
    setTimeout(() => alert("Congrats! You won the game"), 500);
  }
};

document.addEventListener("keydown", (e) => {
  if (userIsPlaying) {
    switch (e.keyCode) {
      case 37:
        newBall.leftMove();
        break;
      case 38:
        newBall.upMove();
        break;
      case 39:
        newBall.rightMove();
        break;
      case 40:
        newBall.downMove();
        break;
    }
  }
});

//Program for solving maze problem

/* A utility function to print
    solution matrix sol[N][N] */
/*
function printSolution(sol) {
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) console.log(" " + sol[i][j] + " ");
    console.log("\n");
  }
}
*/

/* A utility function to check
        if x, y is valid index for N*N maze */

function isSafe(maze, x, y) {
  return x >= 0 && x < N && y >= 0 && y < N && maze[x][y] == 1;
}

let sol = new Array(N);
function solveMaze(maze) {
  for (let i = 0; i < N; i++) {
    sol[i] = new Array(N);
    for (let j = 0; j < N; j++) {
      sol[i][j] = 0;
    }
  }

  if (solveMazeUtil(maze, 0, 0, sol) == false) {
    return false;
  }

  return true;
}

function solveMazeUtil(maze, x, y, soln) {
  if (x == N - 1 && y == N - 1 && maze[x][y] == 1) {
    soln[x][y] = 1;
    return true;
  }

  if (isSafe(maze, x, y) == true) {
    if (soln[x][y] == 1) return false;

    soln[x][y] = 1;

    if (solveMazeUtil(maze, x + 1, y, soln)) return true;

    if (solveMazeUtil(maze, x, y + 1, soln)) return true;

    if (solveMazeUtil(maze, x - 1, y, soln)) return true;

    if (solveMazeUtil(maze, x, y - 1, soln)) return true;

    soln[x][y] = 0;
    return false;
  }

  return false;
}

let maze = map;
N = maze.length;

function waitForMove(milisec, dir) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (dir == 1) {
        newBall.rightMove();
        resolve("moved");
      } else if (dir == 0) {
        newBall.downMove();
        resolve("moved");
      }
    }, milisec);
  });
}

const runMazeGame = async (soln) => {
  const res = solveMaze(map);
  if (res) {
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        if (soln[i][j] == 1) {
          if (!newBall.hasReachedGoal() && soln[i][j + 1] == 1) {
            await waitForMove(1000, 1);
          } else if (!newBall.hasReachedGoal() && soln[i + 1][j] == 1) {
            await waitForMove(1000, 0);
          }
        }
      }
    }
    return Promise.resolve("Solved");
  }
  return Promise.reject("Cannot solve!");
};

const playBtn = document.getElementById("play-btn");
const solveBtn = document.getElementById("solve-btn");
const pauseBtn = document.getElementById("pause-btn");

playBtn.addEventListener("click", () => {
  userIsPlaying = true;
  pauseBtn.removeAttribute("disabled");
  playBtn.setAttribute("disabled", "true");
  solveBtn.setAttribute("disabled", "true");
});

pauseBtn.addEventListener("click", () => {
  pauseBtn.setAttribute("disabled", "true");
  playBtn.removeAttribute("disabled");
  newBall.reset();
  solveBtn.removeAttribute("disabled");
});

solveBtn.addEventListener("click", async () => {
  userIsPlaying = false;
  playBtn.setAttribute("disabled", "true");
  try {
    const result = await runMazeGame(sol);
    setTimeout(() => alert(result), 1000);
  } catch (error) {
    alert(error);
  }
});
