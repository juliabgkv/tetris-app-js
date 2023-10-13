const OCCUPIED_CLASS = 'occupied';
const TETRO_BLOCK_CLASS = 'tetro-block';
const GAME_OVER_CLASS = 'game-over';

const grid = document.querySelector('#grid');
const scoreElem = document.querySelector('#score');
const startPauseBtn = document.querySelector('#start-pause-button');
let squaresArr = Array.from(document.querySelectorAll('#grid div'));

const mainBackgroundColor = '#131313';
const cellWidth = 10;
let score = 0;
let timer = null;
let isGameActive = false;
const colors = [
    'blue',
    'purple',
    'green',
    'orange',
    'grey',
    'yellow',
    'red'
];

const iBlock = [
    [1, cellWidth+1, cellWidth*2+1, cellWidth*3+1],
    [cellWidth, cellWidth+1, cellWidth+2, cellWidth+3],
    [1, cellWidth+1, cellWidth*2+1, cellWidth*3+1],
    [cellWidth, cellWidth+1, cellWidth+2, cellWidth+3]
];

const oBlock = [
    [0, 1, cellWidth, cellWidth+1],
    [0, 1, cellWidth, cellWidth+1],
    [0, 1, cellWidth, cellWidth+1],
    [0, 1, cellWidth, cellWidth+1]
];

const jBlock = [
    [2, cellWidth+2, cellWidth*2+2, cellWidth*2+1],
    [cellWidth, cellWidth*2, cellWidth*2+1, cellWidth*2+2],
    [0, 1, cellWidth,cellWidth*2],
    [0, 1, 2, cellWidth+2]
];

const lBlock = [
    [0, cellWidth, cellWidth*2,cellWidth*2+1],
    [0,1,2,cellWidth],
    [1,2,cellWidth+2,cellWidth*2+2],
    [cellWidth+2,cellWidth*2,cellWidth*2+1,cellWidth*2+2]
];

const zBlock = [
    [0, 1, cellWidth+1, cellWidth+2],
    [2, cellWidth+1, cellWidth+2,cellWidth*2+1],
    [0,1,cellWidth+1, cellWidth+2],
    [1,cellWidth, cellWidth+1,cellWidth*2]
];

const tBlock = [
    [1, cellWidth, cellWidth+1,cellWidth+2],
    [1,cellWidth+1,cellWidth+2,cellWidth*2+1],
    [cellWidth,cellWidth+1,cellWidth+2,cellWidth*2+1],
    [1, cellWidth, cellWidth+1,cellWidth*2+1]
];

const sBlock = [
    [1,2,cellWidth,cellWidth+1],
    [1,cellWidth+1,cellWidth+2,cellWidth*2+2],
    [1,2,cellWidth,cellWidth+1],
    [0,cellWidth,cellWidth+1,cellWidth*2+1]
];

const tetroBlocks = [iBlock, oBlock, jBlock, lBlock, zBlock, tBlock, sBlock];

let currentPosition = 4;
let currentRotation = 0;

let randomIdx = Math.floor(Math.random() * tetroBlocks.length);
let currentBlock = tetroBlocks[randomIdx][currentRotation];

function drawBlock() {
    currentBlock.forEach(cellIndex => {
        squaresArr[currentPosition + cellIndex].classList.add(TETRO_BLOCK_CLASS);
        squaresArr[currentPosition + cellIndex].style.backgroundColor = colors[randomIdx];
    });
}

function undrawBlock() {
    currentBlock.forEach(cellIndex => {
        squaresArr[currentPosition + cellIndex].classList.remove(TETRO_BLOCK_CLASS);
        squaresArr[currentPosition + cellIndex].style.backgroundColor = mainBackgroundColor;
    });
}

function moveDown() {
    undrawBlock();
    currentPosition += cellWidth;
    drawBlock();
    freeze();
}

function freeze() {
    if(currentBlock.some(idx => squaresArr[currentPosition + idx + cellWidth].classList.contains(OCCUPIED_CLASS))) {
        currentBlock.map(idx => squaresArr[currentPosition + idx].classList.add(OCCUPIED_CLASS));

        clearInterval(timer);
        timer = null;

        currentPosition = 4;
        randomIdx = Math.floor(Math.random() * tetroBlocks.length);
        currentBlock = tetroBlocks[randomIdx][currentRotation];

        increaseScore();

        checkRows();
        gameOverCheck();

        if(isGameActive) {
            drawBlock();
            timer = setInterval(moveDown, 1000);
        }
    }
}

function increaseScore(points = 10) {
    score += points;
    scoreElem.innerHTML = score;
}

function checkRows() {
    for(let i = 0; i < 200; i += cellWidth) {
        const row = [];
        for(let x = 0; x < 10; x++) {
            row.push(i + x);
        }

        if(row.every(idx => squaresArr[idx].classList.contains(OCCUPIED_CLASS))) {
            increaseScore(100);
            row.forEach(idx => {
                squaresArr[idx].className = '';
                squaresArr[idx].style.backgroundColor = mainBackgroundColor;
            });
            const removedSquares = squaresArr.splice(i, 10);
            squaresArr = removedSquares.concat(squaresArr);
            squaresArr.forEach(cell => grid.appendChild(cell));
        }
    }
}

function moveLeft() {
    if(!isOnLeftEdge()) {
        undrawBlock();
        currentPosition -= 1;
        drawBlock();
    }
}

function moveRight() {
    if(!isOnRightEdge()) {
        undrawBlock();
        currentPosition += 1;
        drawBlock();
    }
}

function isOnLeftEdge() {
    return currentBlock.some(idx => (currentPosition + idx) % cellWidth === 0);
}

function isOnRightEdge() {
    return currentBlock.some(idx => (currentPosition + idx) % cellWidth === (cellWidth - 1));
}

function rotateBlock() {
    undrawBlock();
    currentRotation = currentRotation === 3 ? 0 : ++currentRotation;
    currentBlock = tetroBlocks[randomIdx][currentRotation];
    checkRotation();
    drawBlock();
}

function checkRotation() {
    if((currentPosition + 1) % cellWidth < 4) {
        if(isOnRightEdge()) {
            currentPosition +=1;
            checkRotation();
        }
    } else if(currentPosition % cellWidth > 4) {
        if(isOnLeftEdge()) {
            currentPosition -= 1;
            checkRotation();
        }
    }
}

function startPauseToggle() {
    if(timer) {
        clearInterval(timer);
        timer = null;
        grid.classList.add('paused');
    } else {
        drawBlock();
        timer = setInterval(moveDown, 1000);
        grid.classList.remove('paused');
    }
}

startPauseBtn.addEventListener('click', () => {
    if(!isGameActive) {
        if(squaresArr.some(square => square.classList.contains(OCCUPIED_CLASS))) {
            for(let i = 0; i < 200; i++) {
                squaresArr[i].classList.remove(OCCUPIED_CLASS);
                squaresArr[i].style.backgroundColor = mainBackgroundColor;
            }
        }

        isGameActive = true;
        grid.classList.remove(GAME_OVER_CLASS);
        drawBlock();
        timer = setInterval(moveDown, 1000);
    } else if(isGameActive) {
        startPauseToggle();
    }
});

document.addEventListener('keydown', (e) => {
    if(timer) {
        if(e.key === 'ArrowUp') {
            rotateBlock();
        } else if(e.key === 'ArrowDown') {
            moveDown();
        } else if(e.key === 'ArrowLeft') {
            moveLeft();
        } else if(e.key === 'ArrowRight') {
            moveRight();
        } else if(e.code === 'Space') {
            e.preventDefault();
            dropBlock();
        }
    }
    if (isGameActive) {
        if(e.key === 'p' || e.key === 'Escape') {
            startPauseToggle();
        }
    }
}, false);

function dropBlock() {
    undrawBlock();
    
    while(!currentBlock.some(idx => squaresArr[currentPosition + idx].classList.contains(OCCUPIED_CLASS))) {
        currentPosition += cellWidth;
    }
    currentPosition -= cellWidth;
    
    drawBlock();
    freeze();
}

function gameOverCheck() {
    if(currentBlock.some(idx => squaresArr[currentPosition + idx].classList.contains(OCCUPIED_CLASS))) {
        clearInterval(timer);
        timer = null;
        
        grid.classList.add(GAME_OVER_CLASS);
        isGameActive = false;
    }
}