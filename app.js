const OCCUPIED_CLASS = 'occupied';
const TETRO_BLOCK_CLASS = 'tetro-block';
const GAME_OVER_CLASS = 'game-over';
const PAUSED_CLASS = 'paused';

const grid = document.querySelector('#grid');
const scoreElem = document.querySelector('#score');
const linesElem = document.querySelector('#lines');
const recordElem = document.querySelector('#record');
const startPauseBtn = document.querySelector('#startPauseButton');
const controlButtons = document.querySelector('#controlButtons');
let squaresArr = Array.from(document.querySelectorAll('#grid div'));
let miniDisplayArr = Array.from(document.querySelectorAll('#displayNext div'));

const mainBackgroundColor = '#131313';
let score = 0;
let lines = 10;
let timer = null;
let isGameActive = false;

let currentRotation;
let currentPosition;
let currentIndex;
let nextIndex;
let currentBlock;
let nextBlock;

const colors = [
    'blue',
    'purple',
    'green',
    'orange',
    'grey',
    'yellow',
    'red'
];

const cellWidth = 10;
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

const miniDisplayWidth = 4;
const miniTetroBlocks = [
    [1,miniDisplayWidth+1,miniDisplayWidth*2+1,miniDisplayWidth*3+1], //iBlock
    [0,1,miniDisplayWidth,miniDisplayWidth+1], //oBlock
    [2,miniDisplayWidth+2,miniDisplayWidth*2+2,miniDisplayWidth*2+1], //jBlock
    [0,miniDisplayWidth,miniDisplayWidth*2,miniDisplayWidth*2+1], //lBlock
    [0,1,miniDisplayWidth+1,miniDisplayWidth+2], //zBlock
    [1,miniDisplayWidth,miniDisplayWidth+1,miniDisplayWidth+2], //tBlock
    [1,2,miniDisplayWidth,miniDisplayWidth+1] //sBlock
];

setNewCurrentBlock();
checkRecord();


function checkRecord() {
    if(!localStorage.getItem('record')) {
        localStorage.setItem('record', 0);
    }
    if(score > localStorage.getItem('record')) {
        localStorage.setItem('record', score);
    }
    recordElem.innerHTML = localStorage.getItem('record');
}

function setNewCurrentBlock(nextIdx) {
    currentPosition = 4;
    currentRotation = 0;
    currentIndex = isUndefined(nextIdx) ? getRandomIndex() : nextIdx;
    currentBlock = tetroBlocks[currentIndex][currentRotation];
}

function isUndefined(value) {
    return value === void(0);
}

function displayNextBlock() {
    clearMiniDisplay();
    nextIndex = getRandomIndex();
    nextBlock = miniTetroBlocks[nextIndex];

    nextBlock.forEach(idx => {
        let position = (nextIndex === 0) ? 0 : 5; //if next block is I
        miniDisplayArr[idx +  position].style.backgroundColor = colors[nextIndex];
    });
}

function clearMiniDisplay() {
    miniDisplayArr.forEach(cell => cell.style.backgroundColor = '');
}

function getRandomIndex() {
    return Math.floor(Math.random() * tetroBlocks.length);
}

function drawBlock() {
    currentBlock.forEach(cellIndex => {
        squaresArr[currentPosition + cellIndex].classList.add(TETRO_BLOCK_CLASS);
        squaresArr[currentPosition + cellIndex].style.backgroundColor = colors[currentIndex];
    });
}

function undrawBlock() {
    currentBlock.forEach(cellIndex => {
        squaresArr[currentPosition + cellIndex].classList.remove(TETRO_BLOCK_CLASS);
        squaresArr[currentPosition + cellIndex].style.backgroundColor = mainBackgroundColor;
    });
}

function moveDown() {
    if(!currentBlock.some(idx => squaresArr[idx + currentPosition + cellWidth].classList.contains(OCCUPIED_CLASS))) {
        undrawBlock();
        currentPosition += cellWidth;
        drawBlock();
    } else {
        freeze();
    }
}

function freeze() {
    if(currentBlock.some(idx => squaresArr[currentPosition + idx + cellWidth].classList.contains(OCCUPIED_CLASS))) {
        currentBlock.map(idx => squaresArr[currentPosition + idx].classList.add(OCCUPIED_CLASS));

        stopBlockFalling();

        setNewCurrentBlock(nextIndex);

        checkRows();
        gameOverCheck();

        if(isGameActive) {
            drawBlock();
            startBlockFalling();
            displayNextBlock();
        }
    }
}

function increaseScore(points) {
    score += points;
    scoreElem.innerHTML = score;
    
    checkRecord();
}

function increaseLines() {
    lines += 1;
    linesElem.innerHTML = lines;
}

function resetPlayerScore() {
    score = lines = 0;
    scoreElem.innerHTML = 0;
    linesElem.innerHTML = 0;
}

function checkRows() {
    let linesCounter = 0;
    for(let i = 0; i < 200; i += cellWidth) {
        const row = [];
        for(let x = 0; x < 10; x++) {
            row.push(i + x);
        }

        if(row.every(idx => squaresArr[idx].classList.contains(OCCUPIED_CLASS))) {
            linesCounter += 1;
            row.forEach(idx => {
                squaresArr[idx].className = '';
                squaresArr[idx].style.backgroundColor = mainBackgroundColor;
            });
            const removedSquares = squaresArr.splice(i, 10);
            squaresArr = removedSquares.concat(squaresArr);
            squaresArr.forEach(cell => grid.appendChild(cell));
        }
    }
    if(linesCounter) {
        increaseLines(linesCounter);

        const points = countPoints(linesCounter);
        increaseScore(points);
    }
}

function countPoints(lines) {
    let points = 0;

    if(lines === 1)
        points = 40;
    else if(lines === 2)
        points = 100;
    else if(lines === 3)
        points = 300;
    else if(lines === 4)
        points = 1200;

    return points;
}

function moveLeft() {
    if(!isOnLeftEdge() && !currentBlock.some(idx => squaresArr[idx + currentPosition - 1].classList.contains(OCCUPIED_CLASS))) {
        undrawBlock();
        currentPosition -= 1;
        drawBlock();
        freeze();
    }
}

function moveRight() {
    if(!isOnRightEdge() && !currentBlock.some(idx => squaresArr[idx + currentPosition + 1].classList.contains(OCCUPIED_CLASS))) {
        undrawBlock();
        currentPosition += 1;
        drawBlock();
        freeze();
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
    currentBlock = tetroBlocks[currentIndex][currentRotation];
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
        stopBlockFalling();
        grid.classList.add(PAUSED_CLASS);
    } else {
        drawBlock();
        startBlockFalling();
        grid.classList.remove(PAUSED_CLASS);
    }
}

function dropBlock() {
    undrawBlock();
    
    while(!currentBlock.some(idx => squaresArr[currentPosition + idx].classList.contains(OCCUPIED_CLASS))) {
        currentPosition += cellWidth;
    }
    currentPosition -= cellWidth;
    
    grid.classList.add('drop');
    setTimeout(() => grid.classList.remove('drop'), 100);

    drawBlock();
    freeze();
}

function gameOverCheck() {
    if(currentBlock.some(idx => squaresArr[currentPosition + idx].classList.contains(OCCUPIED_CLASS))) {
        stopBlockFalling();
        
        grid.classList.add(GAME_OVER_CLASS);
        isGameActive = false;
    }
}

function startBlockFalling() {
    timer = setInterval(moveDown, 1000);
}

function stopBlockFalling() {
    clearInterval(timer);
    timer = null;
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
        startBlockFalling();

        displayNextBlock();
        resetPlayerScore();
    } else if(isGameActive) {
        startPauseToggle();
    }
});

controlButtons.addEventListener('click', (e) => {
    if(isGameActive && timer) {
        if(e.target.classList.contains('rotate-btn')) {
            rotateBlock();
        } else if(e.target.classList.contains('left-btn')) {
            moveLeft();
        } else if(e.target.classList.contains('right-btn')) {
            moveRight();
        } else if(e.target.classList.contains('down-btn')) {
            moveDown();
        } else if(e.target.classList.contains('drop-btn')) {
            dropBlock();
        }
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