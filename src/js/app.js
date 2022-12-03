
// Variables

const form = document.querySelector('#default-form');
const main = document.querySelector('#main-app');
const formBtn = document.querySelector('#default-form-btn');

gameMode = {};

// Eventos

eventListeners();

function eventListeners() {
    form.addEventListener('submit', getDataSelect);
}
    
// Clases
class Game {
    constructor(game) {
        this.number = 1;
        this.score = Number(0);
    }
}

const game = new Game();

class UI {
    printQuestion(message) {
        const divQuestion = document.createElement('div');
        divQuestion.classList.add('game-question');

        const pQuestion = document.createElement('p');
        pQuestion.classList.add('p-question');
        divQuestion.appendChild(pQuestion);
        pQuestion.textContent = message;

        const contentAnswers = document.createElement('div');
        contentAnswers.setAttribute('id', 'answers')
        divQuestion.appendChild(contentAnswers);

        console.log(main)

        main.appendChild(divQuestion);
    }

    printAnswers(message) {
        const contentAnswers = document.querySelector('#answers')

        const answerItem = document.createElement('div');
        answerItem.classList.add('answers__item');
        answerItem.textContent = message;
        contentAnswers.appendChild(answerItem);
    }

    printStats() {
        const gameQuestion = document.querySelector('.p-question')

        const contentStats = document.createElement('div');
        const contentNumber = document.createElement('div');
        const contentScore = document.createElement('div');
        const contentTime = document.createElement('div');

        contentStats.classList.add('stats');
        contentNumber.classList.add('stats__number');
        contentScore.classList.add('stats__score');
        contentTime.classList.add('stats__time');

        contentNumber.textContent = '#' + game.number + ' / 10';
        contentScore.textContent = 'Score: ' + game.score;
        contentTime.textContent = '0:08';

        contentStats.appendChild(contentNumber);
        contentStats.appendChild(contentScore);
        contentStats.appendChild(contentTime);

        gameQuestion.insertAdjacentElement('beforebegin', contentStats)
    }

    printTimer() {
        const contentTime = document.querySelector('.stats__time');
        let number = 7;

        const timer = setInterval(() => {
            contentTime.textContent = '0:0' + number;
            number--;
            if (number == 0) {
                clearInterval(timer)
            }
        }, 1000)
        
    }

    printEndGame() {
        const contentEnd = document.createElement('div');
        const btnEnd = document.createElement('button');
        const contentScore = document.createElement('div');
        const score = document.createElement('p');
        const message = document.createElement('p');

        contentEnd.classList.add('end-screen');
        btnEnd.classList.add('end-screen__button');



        contentEnd.appendChild(btnEnd)
        main.appendChild(contentEnd);
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

        main.insertBefore(divMessage, form);
    
        setTimeout(() => {
            divMessage.remove();
        }, 5000);
    }
}

const ui = new UI();

// Funciones

function getDataSelect(e) {
    e.preventDefault();

    const difficulty = document.querySelector('#select-difficulty').value;
    const category = document.querySelector('#select-category').value;
    const type = document.querySelector('#select-type').value;

    gameMode.difficulty = difficulty;
    gameMode.category = category;
    gameMode.type = type;

    console.log(gameMode)
    
    if (gameMode.difficulty === '' || gameMode.difficulty === 'any') {
        ui.printAlert('Select the difficulty', 'error');
        return

    } else if (gameMode.category === '' || gameMode.category === 'any') {
        ui.printAlert('Select the category', 'error');
        return

    } else if (gameMode.type === '' || gameMode.type === 'any') {
        ui.printAlert('Select the type', 'error');
        return

    } else {
        getQuestion();
    }
}

function getQuestion() {
    let url = `https://opentdb.com/api.php?amount=1&category=${gameMode.category}&difficulty=${gameMode.difficulty}&type=${gameMode.type}`;
    fetch(url) 
        .then(response => response.json())
        .then(data => {
            // Validando data
            let dataSize = Object.keys(data).length
            if (dataSize < 1) {
                ui.printAlert('No encontramos trivias con ese tipo de juego. Intenta otro!', 'error')
            } else {
                renderQuestion(data.results[0]);
            }
        })
}

function renderQuestion(data) {

    cleanHTML();

    ui.printQuestion(data.question)

    let correctAnswer = data.correct_answer;
    let incorrectAnswer = data.incorrect_answers;
    let optionList = incorrectAnswer;

    optionList.splice(Math.floor(Math.random() * optionList.length), 0, correctAnswer);

    for (let i = 0; i < optionList.length; i++) {
        ui.printAnswers(optionList[i]);
    }

    console.log(correctAnswer, optionList)

    ui.printStats();
    
    timerQuestion();
    checkAnswer(correctAnswer);
    endGame();
}

function checkAnswer(correctAnswer) {
    const answerItems = document.querySelectorAll('.answers__item')

    for (let i = 0; i < answerItems.length; i++) {
        answerItems[i].addEventListener('click', function() {
            if (answerItems[i].textContent == correctAnswer) {
                game.score = game.score + 100;
                game.number = game.number + 1;
                console.log(game.score, game.number)
                getQuestion();
            } else {
                game.score = game.score - 100;
                game.number = game.number + 1;
                console.log(game.score)
                getQuestion();
            }
        })
    }
}

function timerQuestion() {
    let number = 8;

    ui.printTimer();

    const timer = setInterval(() => {
        number--;
        if (number == 0) {
            game.number++;
            clearInterval(timer);
            getQuestion();
        }
    }, 1000)

    clearInterval(timer);
}

function endGame() {
    if (game.number > 10) {
        cleanHTML();

        ui.printEndGame();
    }
}

function cleanHTML() {
    main.innerHTML = '';
}



