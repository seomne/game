import blocks from "./blocks.js";

// DOM
const playground = document.querySelector(".playground > ul");
const gameText = document.querySelector(".game_text");
const scoreDisplay = document.querySelector(".score");
const restartButton = document.querySelector(".game_text > button");

// Setting
const GAME_ROWS = 20;
const GAME_COLS = 10;

// variables
let score = 0;
let duration = 500;
let downInteral;
let tempMoveingItem;

const movingItem = {
  type: "",
  direction: 3,
  top: 0,
  left: 3,
};

init();

// funtions
function init() {   
  tempMoveingItem = { ...movingItem };
  for (let i = 0; i < GAME_ROWS; i++) {
    prependNewLine();
  }
  generateNewBlock();
}

function prependNewLine() {
  const li = document.createElement("li");
  const ul = document.createElement("ul");
  for (let j = 0; j < GAME_COLS; j++) {
    const matrix = document.createElement("li");
    ul.prepend(matrix);
  }
  li.prepend(ul);
  playground.prepend(li);
};

function renderBlocks(moveType = "") {
    const { type, direction, top, left } = tempMoveingItem;
    const movingBlocks = document.querySelectorAll('.moving');
    movingBlocks.forEach(moving => {
        moving.classList.remove(type, 'moving');
    });
    blocks[type][direction].some(block => {
        const x = block[0] + left;
        const y = block[1] + top;
        //조건 ? 참일경우 : 거짓일경우
        const target = playground.childNodes[y] ? playground.childNodes[y].childNodes[0].childNodes[x] : null;
        const isAvailable = checkEmpty(target);
        if (isAvailable) {
            target.classList.add(type, 'moving');
        } else {
            tempMoveingItem = { ...movingItem }
            if (moveType === 'retry') {
                clearInterval(downInteral);
                showGameoverText();
            }
            setTimeout(() => {
                renderBlocks('retry');
                if (moveType === 'top') {
                    seizeBlock();
                }                
            }, 0); 
            return true;           
        }
    });
    movingItem.left = left;
    movingItem.top = top;
    movingItem.direction = direction;
};

function seizeBlock() {
    const movingBlocks = document.querySelectorAll('.moving');
    movingBlocks.forEach(moving => {
        moving.classList.remove('moving');
        moving.classList.add('seized');
    });
    checkMatch();    
}

function checkMatch() {
    const childNodes = playground.childNodes;
    childNodes.forEach(child => {
        let matched = true;
        child.children[0].childNodes.forEach(li => {
            if(!li.classList.contains('seized')) {
                matched = false;
            }
        });
        if(matched) {
            child.remove();
            prependNewLine();
            score++;
            scoreDisplay.innerText = score;
        }

    })
    generateNewBlock();
}

function generateNewBlock() {
    clearInterval(downInteral);
    downInteral = setInterval(() => {
        moveBlock('top',1)
    }, duration)

    const blockArray = Object.entries(blocks);
    const randomIndex = Math.floor(Math.random() * blockArray.length);       
    movingItem.type = blockArray[randomIndex][0];
    movingItem.top = 0;
    movingItem.left = 3;
    movingItem.direction = 0;
    tempMoveingItem = { ...movingItem };
    renderBlocks();
}

function checkEmpty(target) {
    if(!target || target.classList.contains('seized') ){
        return false;
    }
    return true;
};

function moveBlock(moveType, amount) {
    tempMoveingItem[moveType] += amount;
    renderBlocks(moveType);
}

function chageDirection() {
    const direction = tempMoveingItem.direction;
    direction === 3 ? tempMoveingItem.direction = 0 : tempMoveingItem.direction += 1;
    renderBlocks();
}

function dropBlock() {
    clearInterval(downInteral);
    downInteral = setInterval(() => {
        moveBlock('top', 1)
    }, 10)
}

function showGameoverText() {
    gameText.style.display = "flex"
}

// event headling
document.addEventListener('keydown', e => {
    switch(e.keyCode){
        case 39 :
            moveBlock('left', 1);
            break;
        case 37 :
            moveBlock('left', -1);
            break;
        case 40 :
            moveBlock('top', 1);
            break;
        case 38 :
            chageDirection();
            break;
        case 32 : 
            dropBlock();
            break;
        default : 
            break;
    }
});

restartButton.addEventListener('click', () => {
    playground.innerHTML = "";
    gameText.style.display = "none"; 
    init();
})