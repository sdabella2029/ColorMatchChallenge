document.addEventListener('DOMContentLoaded', function() {

    // Game variables

    let score = 0;

    let timeLeft = 60;

    let moves = 0;

    let gameActive = false;

    let timerInterval;

    let firstTile = null;

    let secondTile = null;

    let canClick = true;

    

    // Color palette for the game

    const colors = [

        '#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0',

        '#118AB2', '#EF476F', '#7209B7', '#3A86FF',

        '#FB5607', '#8338EC', '#FF006E', '#8AC926'

    ];

    

    // DOM elements

    const scoreElement = document.getElementById('score-value');

    const timerElement = document.getElementById('timer');

    const movesElement = document.getElementById('moves');

    const startBtn = document.getElementById('start-btn');

    const resetBtn = document.getElementById('reset-btn');

    const colorGrid = document.getElementById('color-grid');

    const gameStatus = document.getElementById('game-status');

    

    // Initialize the game

    initializeGame();

    

    // Event listeners

    startBtn.addEventListener('click', startGame);

    resetBtn.addEventListener('click', resetGame);

    

    function initializeGame() {

        // Clear the grid

        colorGrid.innerHTML = '';

        

        // Create color pairs and shuffle

        let colorPairs = [...colors, ...colors];

        shuffleArray(colorPairs);

        

        // Create tiles

        colorPairs.forEach((color, index) => {

            const tile = document.createElement('div');

            tile.className = 'color-tile hidden';

            tile.dataset.color = color;

            tile.dataset.index = index;

            tile.style.backgroundColor = color;

            

            tile.addEventListener('click', () => handleTileClick(tile));

            colorGrid.appendChild(tile);

        });

        

        // Update display

        updateDisplay();

        gameStatus.textContent = 'Click "Start Game" to begin!';

    }

    

    function startGame() {

        if (gameActive) return;

        

        gameActive = true;

        score = 0;

        timeLeft = 60;

        moves = 0;

        firstTile = null;

        secondTile = null;

        

        updateDisplay();

        gameStatus.textContent = 'Memorize the colors!';

        gameStatus.style.color = '#feb47b';

        

        // Show all colors for 3 seconds

        showAllColors();

        

        // Start timer after 3 seconds

        setTimeout(() => {

            hideAllColors();

            gameStatus.textContent = 'Match the colors!';

            startTimer();

        }, 3000);

        

        startBtn.disabled = true;

        startBtn.style.opacity = '0.6';

    }

    

    function resetGame() {

        gameActive = false;

        clearInterval(timerInterval);

        startBtn.disabled = false;

        startBtn.style.opacity = '1';

        initializeGame();

    }

    

    function showAllColors() {

        const tiles = document.querySelectorAll('.color-tile');

        tiles.forEach(tile => {

            tile.classList.remove('hidden');

        });

    }

    

    function hideAllColors() {

        const tiles = document.querySelectorAll('.color-tile');

        tiles.forEach(tile => {

            if (!tile.classList.contains('matched')) {

                tile.classList.add('hidden');

            }

        });

    }

    

    function startTimer() {

        clearInterval(timerInterval);

        timerInterval = setInterval(() => {

            timeLeft--;

            timerElement.textContent = timeLeft;

            

            if (timeLeft <= 0) {

                endGame(false);

            }

            

            // Color change for low time

            if (timeLeft <= 10) {

                timerElement.style.color = '#FF6B6B';

                timerElement.style.animation = 'pulse 0.5s infinite alternate';

            }

        }, 1000);

    }



    function handleTileClick(tile) {

        if (!gameActive || !canClick || tile.classList.contains('matched') || !tile.classList.contains('hidden')) {

            return;

        }

        

        // Reveal the tile

        tile.classList.remove('hidden');

        

        if (!firstTile) {

            firstTile = tile;

        } else {

            secondTile = tile;

            moves++;

            movesElement.textContent = moves;

            canClick = false;

            

            // Check for match

            if (firstTile.dataset.color === secondTile.dataset.color) {

                // Match found

                setTimeout(() => {

                    firstTile.classList.add('matched');

                    secondTile.classList.add('matched');

                    score += 10;

                    updateDisplay();

                    

                    // Check for win

                    const matchedTiles = document.querySelectorAll('.color-tile.matched');

                    if (matchedTiles.length === colors.length * 2) {

                        endGame(true);

                    }

                    

                    resetSelection();

                }, 500);

            } else {

                // No match

                setTimeout(() => {

                    firstTile.classList.add('hidden');

                    secondTile.classList.add('hidden');

                    resetSelection();

                }, 1000);

            }

        }

    }

    

    function resetSelection() {

        firstTile = null;

        secondTile = null;

        canClick = true;

    }

    

    function endGame(isWin) {

        gameActive = false;

        clearInterval(timerInterval);

        

        if (isWin) {

            gameStatus.textContent = `🎉 Congratulations! You won with ${score} points!`;

            gameStatus.style.color = '#4ECDC4';

            

            // Add bonus for time remaining

            const timeBonus = timeLeft * 2;

            score += timeBonus;

            updateDisplay();

            

            // Show time bonus

            setTimeout(() => {

                gameStatus.textContent = `🎉 You won! Score: ${score} (${timeBonus} time bonus included!)`;

            }, 1500);

        } else {

            gameStatus.textContent = '⏰ Time\'s up! Game Over!';

            gameStatus.style.color = '#FF6B6B';

        }

        

        startBtn.disabled = false;

        startBtn.style.opacity = '1';

        

        // Show all tiles

        const tiles = document.querySelectorAll('.color-tile');

        tiles.forEach(tile => {

            tile.classList.remove('hidden');

        });

    }

    

    function updateDisplay() {

        scoreElement.textContent = score;

        timerElement.textContent = timeLeft;

        movesElement.textContent = moves;

    }

    

    // Utility function to shuffle array

    function shuffleArray(array) {

        for (let i = array.length - 1; i > 0; i--) {

            const j = Math.floor(Math.random() * (i + 1));

            [array[i], array[j]] = [array[j], array[i]];

        }

        return array;

    }

    

    // Add CSS animation for timer pulse

    const style = document.createElement('style');

    style.textContent = `

        @keyframes pulse {

            from { transform: scale(1); }

            to { transform: scale(1.1); }

        }

    `;

    document.head.appendChild(style);

});