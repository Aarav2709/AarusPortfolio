let gameState = {
    playerScore: 0,
    aiScore: 0,
    isPlayerTurn: true,
    gameStarted: false
};

const output = document.getElementById('output');
const gameInput = document.getElementById('gameInput');
const startBtn = document.getElementById('startGame');
const resetBtn = document.getElementById('resetGame');
const installBtn = document.getElementById('installLocal');

// Dark mode toggle functionality
const darkModeToggle = document.getElementById('darkModeToggle');
const toggleText = darkModeToggle.querySelector('.toggle-text');

darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
    toggleText.textContent = isDark ? 'light' : 'dark';
});

// Check for saved dark mode preference
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    if (toggleText) toggleText.textContent = 'light';
}

function addOutput(text, className = '') {
    const div = document.createElement('div');
    div.textContent = text;
    if (className) div.className = className;
    output.appendChild(div);
    output.scrollTop = output.scrollHeight;
}

function clearOutput() {
    output.innerHTML = `
        <div class="info-output">Welcome to OddEven-SP!</div>
        <div class="info-output">This is a web preview of the terminal-based cricket game.</div>
        <div class="info-output">Click "Start Game" to begin or "Install Locally" for the full experience.</div>
        <div class="info-output"></div>
        <div class="info-output">📦 Install with: pip install OddEvenSP</div>
        <div class="info-output">🎮 Features: Dark/Light mode, AI opponent, achievements, rank progression</div>
        <div class="info-output"></div>
    `;
}

function startGame() {
    gameState = { playerScore: 0, aiScore: 0, isPlayerTurn: true, gameStarted: true };
    addOutput('');
    addOutput('🏏 ODDEVEN CRICKET STARTED!', 'game-output');
    addOutput('═══════════════════════════════', 'game-output');
    addOutput('You are batting first!', 'info-output');
    addOutput('Choose a number between 1-10:', 'info-output');
    addOutput('If numbers match, you\'re OUT!', 'info-output');
    addOutput('');
    gameInput.disabled = false;
    gameInput.focus();
    startBtn.disabled = true;
}

function playTurn(playerChoice) {
    const aiChoice = Math.floor(Math.random() * 10) + 1;
    
    addOutput(`You chose: ${playerChoice}`, 'game-output');
    addOutput(`AI chose: ${aiChoice}`, 'game-output');
    
    if (playerChoice === aiChoice) {
        addOutput('MATCH! You\'re OUT!', 'error-output');
        addOutput(`Your final score: ${gameState.playerScore}`, 'info-output');
        addOutput('');
        
        if (gameState.isPlayerTurn) {
            addOutput('Now AI is batting...', 'info-output');
            gameState.isPlayerTurn = false;
            gameState.aiScore = 0;
            addOutput('Choose a number to bowl:', 'info-output');
        } else {
            endGame();
        }
    } else {
        if (gameState.isPlayerTurn) {
            gameState.playerScore += playerChoice;
            addOutput(`Score: ${gameState.playerScore}`, 'game-output');
        } else {
            gameState.aiScore += aiChoice;
            addOutput(`AI Score: ${gameState.aiScore}`, 'game-output');
            
            if (gameState.aiScore > gameState.playerScore) {
                addOutput('AI wins! Better luck next time!', 'error-output');
                endGame();
                return;
            }
        }
    }
    addOutput('');
}

function endGame() {
    const playerWon = gameState.playerScore > gameState.aiScore;
    addOutput('═══════════════════════════════', 'game-output');
    addOutput('GAME OVER!', 'game-output');
    addOutput(`Your Score: ${gameState.playerScore}`, 'info-output');
    addOutput(`AI Score: ${gameState.aiScore}`, 'info-output');
    addOutput(playerWon ? 'YOU WON! 🎉' : 'AI WINS! 🤖', playerWon ? 'game-output' : 'error-output');
    addOutput('');
    addOutput('Install the full version for achievements, rankings, and more!', 'info-output');
    
    gameInput.disabled = true;
    startBtn.disabled = false;
    gameState.gameStarted = false;
}

gameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && gameState.gameStarted) {
        const choice = parseInt(gameInput.value);
        if (choice >= 1 && choice <= 10) {
            playTurn(choice);
            gameInput.value = '';
        } else {
            addOutput('Please enter a number between 1-10!', 'error-output');
            gameInput.value = '';
        }
    }
});

startBtn.addEventListener('click', startGame);
resetBtn.addEventListener('click', () => {
    clearOutput();
    gameState.gameStarted = false;
    gameInput.disabled = true;
    gameInput.value = '';
    startBtn.disabled = false;
});

// Modal functionality
const installModal = document.getElementById('installModal');
const modalClose = document.getElementById('modalClose');

function showModal() {
    installModal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function hideModal() {
    installModal.classList.remove('show');
    document.body.style.overflow = '';
}

installBtn.addEventListener('click', showModal);
modalClose.addEventListener('click', hideModal);

// Close modal when clicking outside
installModal.addEventListener('click', (e) => {
    if (e.target === installModal) {
        hideModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && installModal.classList.contains('show')) {
        hideModal();
    }
});

// Cursor functionality
const cursor = document.querySelector('.cursor');
const cursorDot = document.querySelector('.cursor-dot');

let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;
let dotX = 0, dotY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animate() {
    // Safety check for cursor elements
    if (!cursor || !cursorDot) return;
    
    // Smooth cursor following
    cursorX += (mouseX - cursorX) * 0.1;
    cursorY += (mouseY - cursorY) * 0.1;

    dotX += (mouseX - dotX) * 0.8;
    dotY += (mouseY - dotY) * 0.8;

    cursor.style.left = cursorX - 10 + 'px';
    cursor.style.top = cursorY - 10 + 'px';

    cursorDot.style.left = dotX - 2 + 'px';
    cursorDot.style.top = dotY - 2 + 'px';

    requestAnimationFrame(animate);
}

// Start animation after DOM is loaded
if (cursor && cursorDot) {
    animate();
}

// Cursor hover effects
document.querySelectorAll('a, button, input').forEach(el => {
    el.addEventListener('mouseenter', () => {
        if (cursor) {
            cursor.style.transform = 'scale(1.5)';
            cursor.style.borderColor = '#999';
        }
    });

    el.addEventListener('mouseleave', () => {
        if (cursor) {
            cursor.style.transform = 'scale(1)';
            cursor.style.borderColor = '';
        }
    });
});
