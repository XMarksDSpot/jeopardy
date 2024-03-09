document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#start-game').addEventListener('click', () => {
        document.getElementById('game-container').style.display = 'block'; // Display the game
        startGame(); // Initialize the game setup
    });
});

function startGame() {
    setupCategoryTitles();
    setupGameBoard();
    generateCategories();
}

function setupCategoryTitles() {
    const categoryHeader = document.getElementById('category-row');
    categoryHeader.innerHTML = ''; // Clear existing content more succinctly

    for (let i = 0; i < 6; i++) {
        const headerCell = document.createElement('div');
        headerCell.className = 'clue-box category-box';
        categoryHeader.appendChild(headerCell);
    }
}

function setupGameBoard() {
    const gameBoard = document.getElementById('clue-board');
    gameBoard.innerHTML = ''; // Clear existing content

    for (let i = 0; i < 5; i++) {
        const row = document.createElement('div');
        row.className = 'clue-row';
        for (let j = 0; j < 6; j++) {
            const cell = document.createElement('div');
            cell.className = 'clue-box';
            cell.textContent = '$' + (200 * (i + 1));
            cell.addEventListener('click', revealClue);
            row.appendChild(cell);
        }
        gameBoard.appendChild(row);
    }
}

function randomCategory() {
    return Math.floor(Math.random() * 18418) + 1;
}

let categories = [];

function generateCategories() {
    clearBoard(); // Reset the board before fetching new categories

    const promises = Array.from({ length: 6 }, () => {
        return fetch(`https://jservice.io/api/category?id=${randomCategory()}`)
               .then(response => {
                   if (!response.ok) {
                       throw new Error('Network response was not ok');
                   }
                   return response.json();
               })
               .catch(error => console.error('There has been a problem with your fetch operation:', error));
    });

    Promise.all(promises).then(results => {
        categories = results.filter(category => category); // Filter out undefined results
        displayCategories(categories);
    });
}

function clearBoard() {
    document.getElementById('clue-board').innerHTML = '';
    document.getElementById('category-row').innerHTML = '';
    document.getElementById('score').innerText = '0';
}

function displayCategories(categoriesList) {
    const categoryElements = document.getElementById('category-row').children;
    categoriesList.forEach((category, index) => {
        if (category && categoryElements[index]) { // Check if category and element exist
            categoryElements[index].innerHTML = category.title;
        }
    });
}

function revealClue(event) {
    const selectedClue = event.currentTarget;
    const rowIndex = Array.prototype.indexOf.call(selectedClue.parentNode.children, selectedClue);
    if (categories[rowIndex]) {
        const value = parseInt(selectedClue.textContent.slice(1));
        const clueList = categories[rowIndex].clues;
        const selected = clueList.find(clue => clue.value === value);
        if (selected) { // Check if selected clue exists
            promptQuestion(selected, selectedClue, value);
        }
    }
}

function promptQuestion(clue, element, value) {
    const userResponse = prompt(clue.question).toLowerCase();
    const correctResponse = clue.answer.toLowerCase().replace(/<\/?[^>]+(>|$)/g, "");
    const scoreValue = parseInt(value);
    element.innerHTML = clue.answer; // Show the answer in the clue box
    element.removeEventListener('click', revealClue);
    verifyAnswer(userResponse, correctResponse, scoreValue, element);
}

function verifyAnswer(userInput, correctInput, scoreValue, element) {
    const result = (userInput === correctInput) ? 'correct' : 'incorrect';
    const userConfirmation = confirm(`For $${scoreValue}, your answer was "${userInput}", and the correct answer was "${correctInput}". Your answer appears to be ${result}. Click OK to accept.`);
    updateScore(result, userConfirmation, scoreValue, element);
}

function updateScore(result, confirmation, points, element) {
    if (result === 'correct' || (result === 'incorrect' && confirmation)) {
        const scoreElement = document.getElementById('score');
        let currentScore = parseInt(scoreElement.innerText);
        currentScore += (result === 'correct') ? points : -points; // Deduct points if incorrect but confirmed
        scoreElement.innerText = currentScore;
    } else {
        alert(`No points awarded or deducted.`);
        element.addEventListener('click', revealClue); // Allow to try again
    }
}
