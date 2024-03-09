// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]
const NUM_CATEGORIES = 6; // Assuming you want 6 categories
const NUM_QUESTIONS_PER_CAT = 5; // Assuming each category has 5 questions

let categories = [];



/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

async function getCategoryIds() {
    // This function should reach out to an API to get random categories.
    // I'm making assumptions about the API endpoint and response format based on common structures.
    const response = await fetch('https://jservice.io/api/categories?count=' + NUM_CATEGORIES);
    const data = await response.json();
    return data.map(category => category.id);
}

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

async function getCategory(catId) {
    // Fetch category data, including questions (clues in Jeopardy terminology)
    const response = await fetch(`https://jservice.io/api/category?id=${catId}`);
    const data = await response.json();
    return {
        title: data.title,
        clues: data.clues.slice(0, NUM_QUESTIONS_PER_CAT).map(clue => ({
            question: clue.question,
            answer: clue.answer,
            showing: null,
        })),
    };
}

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

async function fillTable() {
    const $table = document.querySelector('#jeopardy');
    const $thead = $table.createTHead();
    const $tbody = document.createElement('tbody');
    const $tr = $thead.insertRow();

    for (const category of categories) {
        const $th = document.createElement('th');
        $th.innerText = category.title;
        $tr.appendChild($th);
    }

    for (let i = 0; i < NUM_QUESTIONS_PER_CAT; i++) {
        const $row = $tbody.insertRow();
        for (const category of categories) {
            const $cell = $row.insertCell();
            const clue = category.clues[i];
            $cell.innerHTML = '?';
            $cell.dataset.question = clue.question;
            $cell.dataset.answer = clue.answer;
            $cell.dataset.showing = 'null';
            $cell.addEventListener('click', handleClick);
        }
    }

    $table.appendChild($tbody);
}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {
    let $td = evt.target;
    let catId = $td.getAttribute('data-cat-id');
    let clueId = $td.getAttribute('data-clue-id');
    let clue = categories[catId].clues[clueId];

    if (!clue.showing) {
        clue.showing = 'question';
        $td.innerHTML = clue.question;
    } else if (clue.showing === 'question') {
        clue.showing = 'answer';
        $td.innerHTML = clue.answer;
    }
    // If showing is 'answer', we do nothing
}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {
    document.getElementById('loading').style.display = 'block';
}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {
    document.getElementById('loading').style.display = 'none';
}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {
    showLoadingView();
    let ids = await getCategoryIds();
    categories = await Promise.all(ids.map(getCategory));
    fillTable();
    hideLoadingView();
}

// Assuming your button has an id "start-btn"
document.querySelector('#start-btn').addEventListener
async function setupAndStart() {
}

/** On click of start / restart button, set up game. */

// TODO

/** On page load, add event handler for clicking clues */

// TODO