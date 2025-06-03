// MonkeyType-inspired typing test
const wordsList = {
    common: [
        "the", "of", "and", "to", "a", "in", "is", "you", "that", "it", "he", "was", "for", "on", "are", "as", "with", "his", "they", "i",
        "at", "be", "this", "have", "from", "or", "one", "had", "by", "word", "but", "not", "what", "all", "were", "we", "when", "your", "can", "said",
        "there", "each", "which", "she", "do", "how", "their", "if", "will", "up", "other", "about", "out", "many", "then", "them", "these", "so", "some", "her",
        "would", "make", "like", "into", "him", "time", "has", "two", "more", "very", "after", "words", "first", "where", "did", "get", "may", "way", "been", "call",
        "who", "oil", "now", "find", "long", "down", "day", "came", "made", "may", "part", "over", "new", "sound", "take", "only", "little", "work", "know", "place",
        "year", "live", "me", "back", "give", "most", "very", "after", "thing", "our", "just", "name", "good", "sentence", "man", "think", "say", "great", "where", "help",
        "through", "much", "before", "line", "right", "too", "mean", "old", "any", "same", "tell", "boy", "follow", "came", "want", "show", "also", "around", "form", "three",
        "small", "set", "put", "end", "why", "again", "turn", "here", "off", "went", "old", "number", "great", "tell", "men", "say", "small", "every", "found", "still"
    ]
};

let gameState = {
    words: [],
    currentWordIndex: 0,
    currentCharIndex: 0,
    startTime: null,
    endTime: null,
    isActive: false,
    mode: 'time',
    duration: 60,
    timeLeft: 60,
    errors: 0,
    correctChars: 0,
    totalChars: 0,
    rawWPM: 0,
    wpm: 0,
    accuracy: 100,
    statsInterval: null,
    wordsTyped: 0,
    wordStates: new Map() // Track word states: correct, incorrect, pending
};

const elements = {
    textDisplay: document.getElementById('textDisplay'),
    typingInput: document.getElementById('typingInput'),
    wpmStat: document.getElementById('wpmStat'),
    accuracyStat: document.getElementById('accuracyStat'),
    timeStat: document.getElementById('timeStat'),
    errorStat: document.getElementById('errorStat'),
    progressFill: document.getElementById('progressFill'),
    results: document.getElementById('results'),
    mode60: document.getElementById('mode60'),
    mode30: document.getElementById('mode30'),
    modeWords: document.getElementById('modeWords'),
    resetBtn: document.getElementById('resetBtn'),
    installBtn: document.getElementById('installBtn'),
    darkModeToggle: document.getElementById('darkModeToggle')
};

function generateWords(count = 200) {
    const words = [];
    for (let i = 0; i < count; i++) {
        words.push(wordsList.common[Math.floor(Math.random() * wordsList.common.length)]);
    }
    return words;
}

function initializeTest() {
    // Clear any existing interval
    if (gameState.statsInterval) {
        clearInterval(gameState.statsInterval);
        gameState.statsInterval = null;
    }
    
    // Reset game state
    gameState.words = generateWords();
    gameState.currentWordIndex = 0;
    gameState.currentCharIndex = 0;
    gameState.startTime = null;
    gameState.endTime = null;
    gameState.isActive = false;
    gameState.timeLeft = gameState.duration;
    gameState.errors = 0;
    gameState.correctChars = 0;
    gameState.totalChars = 0;
    gameState.rawWPM = 0;
    gameState.wpm = 0;
    gameState.accuracy = 100;
    gameState.wordsTyped = 0;
    gameState.wordStates.clear(); // Clear word states
    
    renderWords();
    updateStats();
    elements.results.classList.remove('show');
    elements.typingInput.value = '';
    elements.typingInput.disabled = false;
    elements.typingInput.focus();
    elements.progressFill.style.width = '0%';
}

function renderWords() {
    let html = '';
    const wordsPerLine = 12; // Words per line for better spacing
    const maxVisibleLines = 3; // Show only 3 lines at a time
    
    // Calculate current line and determine which lines to show
    const currentLine = Math.floor(gameState.currentWordIndex / wordsPerLine);
    
    // For line scrolling: show current line in the middle (line 2 of 3)
    // When current line > 1, start showing from currentLine - 1
    const startLine = Math.max(0, currentLine - 1);
    const endLine = startLine + maxVisibleLines;
    
    const startIndex = startLine * wordsPerLine;
    const endIndex = Math.min(gameState.words.length, endLine * wordsPerLine);
    
    // Group words into lines
    const lines = [];
    for (let lineNum = startLine; lineNum < endLine; lineNum++) {
        const lineStartIndex = lineNum * wordsPerLine;
        const lineEndIndex = Math.min(gameState.words.length, (lineNum + 1) * wordsPerLine);
        
        if (lineStartIndex < gameState.words.length) {
            const lineWords = [];
            for (let wordIndex = lineStartIndex; wordIndex < lineEndIndex; wordIndex++) {
                if (wordIndex < gameState.words.length) {
                    lineWords.push(wordIndex);
                }
            }
            lines.push(lineWords);
        }
    }
    
    // Render each line
    lines.forEach((lineWords, lineIndex) => {
        html += '<div class="line">';
        
        lineWords.forEach((wordIndex, wordInLineIndex) => {
            const word = gameState.words[wordIndex];
            const isCurrentWord = wordIndex === gameState.currentWordIndex;
            const isCompleted = wordIndex < gameState.currentWordIndex;
            const wordState = gameState.wordStates.get(wordIndex) || 'pending';
            
            let wordHtml = '<span class="word';
            if (isCurrentWord) wordHtml += ' current';
            if (isCompleted) {
                wordHtml += ' completed';
                if (wordState === 'incorrect') wordHtml += ' word-incorrect';
            }
            wordHtml += '">';
            
            // Render each character in the word
            for (let charIndex = 0; charIndex < word.length; charIndex++) {
                const char = word[charIndex];
                let charClass = 'char';
                
                if (isCurrentWord && charIndex < gameState.currentCharIndex) {
                    const typedValue = elements.typingInput.value;
                    if (typedValue[charIndex] === char) {
                        charClass += ' correct';
                    } else {
                        charClass += ' incorrect';
                    }
                } else if (isCompleted) {
                    if (wordState === 'correct') {
                        charClass += ' correct';
                    } else if (wordState === 'incorrect') {
                        charClass += ' incorrect';
                    }
                }
                
                wordHtml += `<span class="${charClass}">${char}</span>`;
            }
            
            wordHtml += '</span>';
            html += wordHtml;
            
            // Add single space between words (except last word in line)
            if (wordInLineIndex < lineWords.length - 1) {
                html += ' ';
            }
        });
        
        html += '</div>';
    });
    
    elements.textDisplay.innerHTML = html;
    
    // Add/remove active class based on game state
    if (gameState.isActive || gameState.currentWordIndex > 0) {
        elements.textDisplay.classList.add('active');
    } else {
        elements.textDisplay.classList.remove('active');
    }
}

function updateStats() {
    if (!gameState.startTime) {
        elements.wpmStat.textContent = '0';
        elements.accuracyStat.textContent = '100%';
        elements.timeStat.textContent = gameState.timeLeft + 's';
        elements.errorStat.textContent = '0';
        return;
    }
    
    const elapsed = (Date.now() - gameState.startTime) / 1000 / 60; // minutes
    
    // Calculate raw WPM (including errors)
    gameState.rawWPM = Math.round((gameState.totalChars / 5) / elapsed) || 0;
    
    // Calculate net WPM (subtracting errors)
    gameState.wpm = Math.max(0, Math.round(((gameState.correctChars / 5) - gameState.errors) / elapsed)) || 0;
    
    // Calculate accuracy
    gameState.accuracy = gameState.totalChars > 0 ? Math.round((gameState.correctChars / gameState.totalChars) * 100) : 100;
    
    elements.wpmStat.textContent = gameState.wpm;
    elements.accuracyStat.textContent = gameState.accuracy + '%';
    elements.errorStat.textContent = gameState.errors;
    
    if (gameState.mode === 'time') {
        const remaining = Math.max(0, gameState.duration - Math.floor((Date.now() - gameState.startTime) / 1000));
        gameState.timeLeft = remaining;
        elements.timeStat.textContent = remaining + 's';
        elements.progressFill.style.width = ((gameState.duration - remaining) / gameState.duration * 100) + '%';
        
        if (remaining === 0) {
            endTest();
        }
    } else {
        const progress = (gameState.wordsTyped / 25) * 100; // 25 words mode
        elements.progressFill.style.width = Math.min(progress, 100) + '%';
        elements.timeStat.textContent = Math.floor((Date.now() - gameState.startTime) / 1000) + 's';
        
        if (gameState.wordsTyped >= 25) {
            endTest();
        }
    }
}

function endTest() {
    gameState.isActive = false;
    gameState.endTime = Date.now();
    
    // Clear the stats interval
    if (gameState.statsInterval) {
        clearInterval(gameState.statsInterval);
        gameState.statsInterval = null;
    }
    
    elements.typingInput.disabled = true;
    
    // Final calculations
    const elapsed = (gameState.endTime - gameState.startTime) / 1000 / 60;
    const finalWPM = Math.max(0, Math.round(((gameState.correctChars / 5) - gameState.errors) / elapsed)) || 0;
    const finalAccuracy = gameState.totalChars > 0 ? Math.round((gameState.correctChars / gameState.totalChars) * 100) : 100;
    
    elements.results.querySelector('#finalWpm').textContent = finalWPM;
    elements.results.querySelector('#finalAccuracy').textContent = finalAccuracy + '%';
    elements.results.querySelector('#finalChars').textContent = gameState.correctChars + '/' + gameState.totalChars;
    elements.results.querySelector('#finalErrors').textContent = gameState.errors;
    elements.results.classList.add('show');
}

function handleInput(inputValue) {
    const currentWord = gameState.words[gameState.currentWordIndex];
    
    // Start test on first keystroke
    if (!gameState.isActive) {
        gameState.isActive = true;
        gameState.startTime = Date.now();
        
        gameState.statsInterval = setInterval(() => {
            if (gameState.isActive) {
                updateStats();
            }
        }, 100);
    }
    
    // Handle space key - move to next word
    if (inputValue.endsWith(' ')) {
        const typedWord = inputValue.slice(0, -1);
        
        // Determine if the word was typed correctly
        const isWordCorrect = typedWord === currentWord;
        gameState.wordStates.set(gameState.currentWordIndex, isWordCorrect ? 'correct' : 'incorrect');
        
        // Count characters for stats
        for (let i = 0; i < Math.max(typedWord.length, currentWord.length); i++) {
            gameState.totalChars++;
            if (i < typedWord.length && i < currentWord.length && typedWord[i] === currentWord[i]) {
                gameState.correctChars++;
            } else {
                gameState.errors++;
            }
        }
        
        // Move to next word
        gameState.currentWordIndex++;
        gameState.currentCharIndex = 0;
        gameState.wordsTyped++;
        elements.typingInput.value = '';
        
        // Generate more words if needed
        if (gameState.currentWordIndex >= gameState.words.length - 20) {
            gameState.words.push(...generateWords(50));
        }
        
        renderWords();
        return;
    }
    
    // Handle backspace
    if (inputValue.length < gameState.currentCharIndex) {
        gameState.currentCharIndex = inputValue.length;
        renderWords();
        return;
    }
    
    // Handle regular character input
    gameState.currentCharIndex = inputValue.length;
    
    // Prevent typing beyond the current word length
    if (inputValue.length > currentWord.length) {
        elements.typingInput.value = inputValue.slice(0, currentWord.length);
        gameState.currentCharIndex = currentWord.length;
        return;
    }
    
    renderWords();
}

function setMode(mode, duration) {
    document.querySelectorAll('.btn').forEach(btn => btn.classList.remove('active'));
    
    if (mode === 'time') {
        gameState.mode = 'time';
        gameState.duration = duration;
        gameState.timeLeft = duration;
        elements.timeStat.textContent = duration + 's';
        if (duration === 60) elements.mode60.classList.add('active');
        if (duration === 30) elements.mode30.classList.add('active');
    } else {
        gameState.mode = 'words';
        elements.modeWords.classList.add('active');
    }
    
    initializeTest();
}

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

// Event listeners
elements.typingInput.addEventListener('input', (e) => {
    handleInput(e.target.value);
});

// Prevent tab and other navigation keys from moving focus
elements.typingInput.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        e.preventDefault();
        elements.typingInput.value += '    '; // 4 spaces for tab
        handleInput(elements.typingInput.value);
    }
});

// Keep focus on the input and handle text display clicks
document.addEventListener('click', (e) => {
    if (!elements.typingInput.disabled) {
        elements.typingInput.focus();
    }
});

// Focus input when clicking on text display
elements.textDisplay.addEventListener('click', () => {
    if (!elements.typingInput.disabled) {
        elements.typingInput.focus();
    }
});

// Handle keyboard events globally to capture typing
document.addEventListener('keydown', (e) => {
    // Don't interfere with buttons and other controls
    if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT') {
        return;
    }
    
    // Prevent default for most keys to avoid page scrolling, etc.
    if (!['F5', 'F12'].includes(e.key) && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        
        // Focus the hidden input to capture the keystroke
        if (!elements.typingInput.disabled) {
            elements.typingInput.focus();
        }
    }
});

elements.mode60.addEventListener('click', () => setMode('time', 60));
elements.mode30.addEventListener('click', () => setMode('time', 30));
elements.modeWords.addEventListener('click', () => setMode('words', 0));
elements.resetBtn.addEventListener('click', initializeTest);

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

elements.installBtn.addEventListener('click', showModal);
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

// Initialize
initializeTest();
