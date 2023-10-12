const grid = document.querySelector('#grid');
const scoreElem = document.querySelector('#score');
const startPauseBtn = document.querySelector('#start-pause-button');
let squaresArr = Array.from(document.querySelectorAll('#grid div'));
const cellWidth = 10;
let score = 0;
let timer = null;
let isGameStarted = false;
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
        squaresArr[currentPosition + cellIndex].classList.add('tetro-block');
        squaresArr[currentPosition + cellIndex].style.backgroundColor = colors[randomIdx];
    });
}

function undrawBlock() {
    currentBlock.forEach(cellIndex => {
        squaresArr[currentPosition + cellIndex].classList.remove('tetro-block');
        squaresArr[currentPosition + cellIndex].style.backgroundColor = '#131313';
    });
}

function moveDown() {
    undrawBlock();
    currentPosition += cellWidth;
    drawBlock();
    freeze();
}

function freeze() {
    if(currentBlock.some(idx => squaresArr[currentPosition + idx + cellWidth].classList.contains('occupied'))) {
        currentBlock.map(idx => squaresArr[currentPosition + idx].classList.add('occupied'));

        clearInterval(timer);
        timer = null;

        currentPosition = 4;
        randomIdx = Math.floor(Math.random() * tetroBlocks.length);
        currentBlock = tetroBlocks[randomIdx][currentRotation];

        drawBlock();
        timer = setInterval(moveDown, 1000);

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
    if(!timer) {
        drawBlock();
        timer = setInterval(moveDown, 1000);
    } else {
        clearInterval(timer);
        timer = null;
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
    if(!isGameStarted) {
        isGameStarted = true;
        drawBlock();
        timer = setInterval(moveDown, 1000);
    } else if(isGameStarted) {
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
        }
    }
    if(isGameStarted) {
        if(e.key === 'p' || e.key === 'Escape') {
            startPauseToggle();
        }
    }
}, false);