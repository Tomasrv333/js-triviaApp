
// Variables

const form = document.querySelector('#default-form');
const main = document.querySelector('#main-app');
const formBtn = document.querySelector('#default-form-btn');

// Eventos

eventListeners();
function eventListeners() {
    form.addEventListener('submit', getDataSelect);
}
    
// Clases

class UI {
    printQuestion(message) {
        const divQuestion = document.createElement('div');
        divQuestion.classList.add('game-question');

        const pQuestion = document.createElement('p');
        pQuestion.classList.add('p-question');
        divQuestion.appendChild(pQuestion);

        pQuestion.textContent = message;

        main.appendChild(divQuestion);
    }

    printAlert(message, type) {
        const divMessage = document.createElement('div');
        divMessage.classList.add('mensajeAlerta')

        if (type === 'error') {
            divMessage.classList.add('alert-error');
        } else {
            divMessage.classList.add('alert-success');
        }

        divMessage.textContent = message;

        document.querySelector('#main-app').insertBefore(divMessage, form);
    
        setTimeout(() => {
            divMessage.remove();
        }, 3000);
    }
}

const ui = new UI();

// Funciones

function getDataSelect(e) {
    e.preventDefault()

    const difficulty = document.querySelector('#select-difficulty').value;
    const category = document.querySelector('#select-category').value;
    const type = document.querySelector('#select-type').value;
    
    if (difficulty === '' || difficulty === 'any') {
        ui.printAlert('Select the difficulty', 'error');
        return

    } else if (category === '' || category === 'any') {
        ui.printAlert('Select the category', 'error');
        return

    } else if (type === '' || type === 'any') {
        ui.printAlert('Select the type', 'error');
        return

    } else {
        getTrivia(difficulty, category, type);
    }
}

function getTrivia(difficulty, category, type) {
    fetch(`https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=${type}`) 
        .then(response => response.json())
        .then(data => {
            let dataTrivia = data.results;
            let triviaQuestions = [];

            for (let i = 0; i < dataTrivia.length; i++) {
                triviaQuestions.push(dataTrivia[i].question);
            }
        })
}

function renderQuestion(triviaQuestions) {
    console.log(triviaQuestions)
}



function cleanHTML() {
    main.innerHTML = '';
}



