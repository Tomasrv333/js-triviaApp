
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
        this.timer = false;
    }
}

const game = new Game();

class UI {
    printQuestion(message) {
        const divQuestion = document.createElement('div');
        divQuestion.classList.add('main__question');

        const pQuestion = document.createElement('p');
        pQuestion.classList.add('question__text');
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
        const gameQuestion = document.querySelector('.question__text')
        const contentStats = document.createElement('div');
        const contentNumber = document.createElement('div');
        const contentScore = document.createElement('div');
        const contentTime = document.createElement('div');

        contentStats.classList.add('stats');
        contentNumber.classList.add('stats__item');
        contentScore.classList.add('stats__item');
        contentTime.classList.add('stats__item--time');

        contentNumber.textContent = '#' + game.number + ' / 10';
        contentScore.textContent = 'Score: ' + game.score;
        contentTime.textContent = '0:08';

        contentStats.appendChild(contentNumber);
        contentStats.appendChild(contentScore);
        contentStats.appendChild(contentTime);

        gameQuestion.insertAdjacentElement('beforeend', contentStats);
    }

    printTimer(currentTime) {
        const contentTime = document.querySelector('.stats__item--time');
        contentTime.textContent = '0:0' + currentTime;
    }

    printNext(message) {
        const answerItem = document.querySelector('#answers');
        const blurBackground = document.createElement('div');
        const contentResult = document.createElement('div');
        const result = document.createElement('h1');
        const btnNext = document.createElement('button');

        blurBackground.classList.add('main__blur');
        contentResult.classList.add('result');
        result.classList.add('main__result-answer', 'alert-succes');
        btnNext.classList.add('main__btn-next', 'btn-1');

        result.textContent = message;
        btnNext.textContent = 'Next Question';

        main.appendChild(blurBackground);
        main.appendChild(result);
        main.appendChild(btnNext);

        setTimeout(() => {
            result.remove();
            blurBackground.remove();
        }, 1900)
    }

    printEndGame() {
        const contentEnd = document.createElement('div');
        const btnEnd = document.createElement('button');
        const contentScore = document.createElement('div');
        const title = document.createElement('h1');
        const score = document.createElement('p');
        const message = document.createElement('p');

        contentEnd.classList.add('end-screen');
        btnEnd.classList.add('end-screen__button', 'btn-1');
        contentScore.classList.add('end-screen__score');
        title.classList.add('end-screen__title');
        score.classList.add('end-screen__score--item');
        message.classList.add('end-screen__score--item');

        title.textContent = 'Has completado el juego.';

        score.textContent = game.score;

        if (game.score < 250) {
            message.textContent = 'Auch!';
        } else if (game.score < 500) {
            message.textContent = 'Sigue practicando...';
        } else if (game.score < 750) {
            message.textContent = 'Bien hecho!';
        } else {
            message.textContent = 'Excelente puntaje!';
        }

        btnEnd.textContent = 'Volver a jugar';

        contentEnd.appendChild(title);
        contentScore.appendChild(score);
        contentScore.appendChild(message);
        contentEnd.appendChild(contentScore);
        contentEnd.appendChild(btnEnd);
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

    let correctAnswer = data.correct_answer;
    let incorrectAnswer = data.incorrect_answers;
    let optionList = incorrectAnswer;

    ui.printQuestion(data.question)

    optionList.splice(Math.floor(Math.random() * optionList.length), 0, correctAnswer);

    for (let i = 0; i < optionList.length; i++) {
        ui.printAnswers(optionList[i]);
    }

    ui.printStats();

    checkAnswer(correctAnswer);
    endGame();

    console.log(correctAnswer, optionList)
}

function startTimer() {
    let currentTime = 7;

    timer = setInterval(function() {
        ui.printTimer(currentTime)
        currentTime--;
        if (currentTime === -1) {
            game.score = game.score - 100;
            game.number = game.number + 1;
            game.timer = false;
            console.log(game.score)
            clearInterval(timer);
            ui.printNext('Time over');
            nextQuestion();
        }
    }, 1000)
}

function checkAnswer(correctAnswer) {
    startTimer();

    const answerItems = document.querySelectorAll('.answers__item');

    for (let i = 0; i < answerItems.length; i++) {
        answerItems[i].addEventListener('click', function() {
            if (answerItems[i].textContent == correctAnswer) {
                game.score = game.score + 100;
                game.number = game.number + 1;
                game.timer = false;
                console.log(game.score, game.number)
                clearInterval(timer);
                answerItems[i].style.backgroundColor = 'blueviolet';
                answerItems[i].style.color = 'white';
                ui.printNext('Correct!');
                nextQuestion();
            } else {
                game.score = game.score - 100;
                game.number = game.number + 1;
                game.timer = false;
                console.log(game.score)
                clearInterval(timer);
                ui.printNext('Incorrect');
                nextQuestion();
            }
        })
    }
}

function nextQuestion(correctAnswer) {
    const btnNext = document.querySelector('.main__btn-next');
    const contentStats = document.querySelector('.stats');

    contentStats.remove();
    ui.printStats();

    btnNext.addEventListener('click', getQuestion);
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



