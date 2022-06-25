const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const questionCounterText=document.getElementById('questionCounter');
const scoreText=document.getElementById('score');
const progressText = document.getElementById("progressText");
const progressBarFull = document.getElementById("progressBarFull");
const loader = document.getElementById('loader');
const game = document.getElementById('game');

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuesions = [];

let questions = [];
fetch('https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple')
    .then((res) => {
        return res.json();
    })
    .then((loadedquestions) => {
        questions= loadedquestions.results.map((loadedQuestion) => {
            const formattedQuestion = {
                question: loadedQuestion.question,
            };

            const answerChoices = [...loadedQuestion.incorrect_answers];
            formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
            answerChoices.splice(
                formattedQuestion.answer - 1,
                0,
                loadedQuestion.correct_answer
            );

            answerChoices.forEach((choice, index) => {
                formattedQuestion['choice' + (index + 1)] = choice;
            });

            return formattedQuestion;
        });
        startGame();
    })
    .catch((err)=>{
        console.log(err);
    });
//CONSTANTS
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 10;

startGame = () => {
    questionCounter = 0;
    score = 0;
//    let ques= questions; // if we assign the questions this way then if we make changes in ques array then there will be change in questions as well that is deep copy
    availableQuesions = [...questions]; // assigning with spread operator will have shallow copy and changong tp available questions will not change questions
    getNewQuestion();
    game.classList.remove('hidden');
    loader.classList.add('hidden');
};

getNewQuestion = () => {
    if(availableQuesions.length===0 || availableQuesions>=MAX_QUESTIONS){
        localStorage.setItem("mostRecentScore",score); //localstorage only stores strings
        return window.location.assign('/end.html');
    }
    questionCounter++;
    // questionCounterText.innerText=questionCounter+"/"+MAX_QUESTIONS;
    // questionCounterText.innerText=`${questionCounter}/${MAX_QUESTIONS}`; alternate solution
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
    //Update the progress bar
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    const questionIndex = Math.floor(Math.random() * availableQuesions.length);
    currentQuestion=availableQuesions[questionIndex];
    question.innerText=availableQuesions[questionIndex].question;
 
    choices.forEach((choice) => {
        const number = choice.dataset['number'];  // this gives the property number from dataset
        choice.innerText = currentQuestion['choice' + number];
    });
    availableQuesions.splice(questionIndex,1);
    acceptingAnswers=true;
}

choices.forEach((choice) => {
    choice.addEventListener('click', (e) => {
        if (!acceptingAnswers) return;
        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];
        const classToApply=selectedAnswer==currentQuestion.answer ? "correct" : "incorrect";

        if (classToApply === "correct") {
            incrementScore(CORRECT_BONUS);
          }


        selectedChoice.parentElement.classList.add(classToApply);
        
        setTimeout(() => {
        selectedChoice.parentElement.classList.remove(classToApply);
        getNewQuestion();
        }, 1000);
    });
});

incrementScore = num =>{
    score+=num;
    scoreText.innerText=score;
}


