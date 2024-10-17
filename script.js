const questions = [
    { question: "What is the capital of France?", options: ["Paris", "London", "Berlin", "Madrid"], answer: "Paris" },
    { question: "Which language runs in a web browser?", options: ["Java", "Python", "JavaScript", "C++"], answer: "JavaScript" },
    { question: "What does CSS stand for?", options: ["Central Style Sheets", "Cascading Style Sheets", "Cascading Simple Sheets", "Control Style Sheets"], answer: "Cascading Style Sheets" },
    { question: "What year was JavaScript launched?", options: ["1996", "1995", "1994", "1993"], answer: "1995" },
    { question: "Which company developed React?", options: ["Google", "Facebook", "Microsoft", "Apple"], answer: "Facebook" }
];

let currentQuestion = 0;
let score = 0;
let timeLeft = 30;
let timer;
let quizCompleted = false;
let selectedAnswers = new Array(questions.length).fill(null);

let questionStatus = [
    { id: 1, visited: false, attempted: false },
    { id: 2, visited: false, attempted: false },
    { id: 3, visited: false, attempted: false },
    { id: 4, visited: false, attempted: false },
    { id: 5, visited: false, attempted: false }
];

function loadQuestion() {
    if (quizCompleted) return;

    document.querySelector('.question-container').style.opacity = 0;
    setTimeout(() => {
        if (currentQuestion < questions.length) {
            const question = questions[currentQuestion];
            document.querySelector('.question').textContent = question.question;

            const options = document.querySelector('.options');
            options.innerHTML = '';
            question.options.forEach((option, index) => {
                const li = document.createElement('li');
                li.className = selectedAnswers[currentQuestion] === option ? 'selected' : '';
                li.innerHTML = `<label><input type="radio" name="option" value="${option}" ${selectedAnswers[currentQuestion] === option ? 'checked disabled' : ''}> ${option}</label>`;
                options.appendChild(li);
            });

            document.getElementById('progress').style.width = `${(currentQuestion + 1) / questions.length * 100}%`;
            document.querySelector('.question-container').style.opacity = 1;

            updateQuestionStatus(currentQuestion + 1, 'visited');
        } else {
            clearInterval(timer);
            showSummary();
        }
    }, 500);
}

function startQuiz() {
    quizCompleted = false;
    currentQuestion = 0;
    score = 0;
    timeLeft = 30;
    selectedAnswers.fill(null);
    questionStatus.forEach(q => {
        q.visited = false;
        q.attempted = false;
    });

    document.querySelector('.score').textContent = '';
    document.querySelector('.summary').style.display = 'none';
    document.querySelector('.question-container').style.display = 'block';
    document.querySelector('.navigation').style.display = 'flex';

    document.getElementById('progress').style.width = '0%';
    document.getElementById('time').textContent = timeLeft;

    loadQuestion();

    clearInterval(timer);
    timer = setInterval(() => {
        if (timeLeft > 0) {
            document.getElementById('time').textContent = --timeLeft;
        } else {
            clearInterval(timer);
            timeUp();
        }
    }, 1000);
}

function showSummary() {
    quizCompleted = true;

    document.querySelector('.question-container').style.display = 'none';
    document.querySelector('.navigation').style.display = 'none';
    document.querySelector('.summary').style.display = 'block';

    // Calculate statistics
    const totalQuestions = questions.length;
    const attemptedQuestions = selectedAnswers.filter(answer => answer !== null).length;
    const unattemptedQuestions = totalQuestions - attemptedQuestions;
    const correctAnswers = selectedAnswers.filter((answer, index) => answer === questions[index].answer).length;
    const wrongAnswers = attemptedQuestions - correctAnswers;
    const percentage = ((correctAnswers / totalQuestions) * 100).toFixed(2); // Calculate percentage

    const summary = document.querySelector('.summary');
    summary.innerHTML = `<h2>Quiz Completed</h2>
                         <p>Your Score: ${Math.min(score, totalQuestions)}/${totalQuestions}</p>
                         <p>Percentage: ${percentage}%</p>
                         <p>Questions Attempted: ${attemptedQuestions}/${totalQuestions}</p>
                         <p>Questions Not Attempted: ${unattemptedQuestions}</p>
                         <p>Correct Answers: ${correctAnswers}</p>
                         <p>Wrong Answers: ${wrongAnswers}</p>
                         <p>Time Left: ${timeLeft}s</p>
                         <button class="btn" onclick="startQuiz()">Restart Quiz</button>
                         <button class="btn" onclick="reviewAnswers()">Review Answers</button>`;
}

function reviewAnswers() {
    const reviewContainer = document.createElement('div');
    reviewContainer.innerHTML = '<h3>Review Your Answers</h3>';
    
    questions.forEach((question, index) => {
        const userAnswer = selectedAnswers[index];
        const correctAnswer = question.answer;
        
        const reviewItem = document.createElement('div');
        reviewItem.innerHTML = `
            <p><strong>Question ${index + 1}:</strong> ${question.question}</p>
            <p><strong>Your Answer:</strong> ${userAnswer || 'Not Attempted'}</p>
            <p><strong>Correct Answer:</strong> ${correctAnswer}</p>
            <hr>
        `;
        reviewContainer.appendChild(reviewItem);
    });
    
    document.querySelector('.summary').innerHTML = '';
    document.querySelector('.summary').appendChild(reviewContainer);
    const backButton = document.createElement('button');
    backButton.className = 'btn';
    backButton.textContent = 'Back to Summary';
    backButton.onclick = () => {
        showSummary();
    };
    reviewContainer.appendChild(backButton);
}

function timeUp() {
    quizCompleted = true;

    document.querySelector('.question-container').style.display = 'none';
    document.querySelector('.navigation').style.display = 'none';
    document.querySelector('.summary').style.display = 'block';

    // Calculate statistics
    const totalQuestions = questions.length;
    const attemptedQuestions = selectedAnswers.filter(answer => answer !== null).length;
    const unattemptedQuestions = totalQuestions - attemptedQuestions;
    const correctAnswers = selectedAnswers.filter((answer, index) => answer === questions[index].answer).length;
    const wrongAnswers = attemptedQuestions - correctAnswers;
    const percentage = ((correctAnswers / totalQuestions) * 100).toFixed(2); // Calculate percentage

    const summary = document.querySelector('.summary');
    summary.innerHTML = `<h2>Time's Up!</h2>
                         <p>Your Score: ${Math.min(score, totalQuestions)}/${totalQuestions}</p>
                         <p>Percentage: ${percentage}%</p>
                         <p>Questions Attempted: ${attemptedQuestions}/${totalQuestions}</p>
                         <p>Questions Not Attempted: ${unattemptedQuestions}</p>
                         <p>Correct Answers: ${correctAnswers}</p>
                         <p>Wrong Answers: ${wrongAnswers}</p>
                         <button class="btn" onclick="startQuiz()">Restart Quiz</button>
                         <button class="btn" onclick="reviewAnswers()">Review Answers</button>`;
}

document.getElementById('next').addEventListener('click', () => {
    if (quizCompleted) return;

    const selectedOption = document.querySelector('input[name="option"]:checked');
    if (selectedOption) {
        if (selectedOption.value === questions[currentQuestion].answer) {
            score++;
            selectedOption.parentElement.parentElement.classList.add('correct');
        } else {
            selectedOption.parentElement.parentElement.classList.add('wrong');
        }

        selectedAnswers[currentQuestion] = selectedOption.value;
        document.querySelectorAll('.options li').forEach(li => li.classList.remove('selected'));
        selectedOption.parentElement.parentElement.classList.add('selected');

        document.querySelectorAll('input[name="option"]').forEach(option => option.disabled = true);
        updateQuestionStatus(currentQuestion + 1, 'attempted');
    }

    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        setTimeout(loadQuestion, 500);
    }
});

document.getElementById('prev').addEventListener('click', () => {
    if (quizCompleted) return;
    if (currentQuestion > 0) {
        currentQuestion--;
        loadQuestion();
    }
});

document.getElementById('submit').addEventListener('click', () => {
    const selectedOption = document.querySelector('input[name="option"]:checked');
    if (selectedOption) {
        if (selectedOption.value === questions[currentQuestion].answer && selectedAnswers[currentQuestion] === null) {
            score++;
        }
        selectedAnswers[currentQuestion] = selectedOption.value;
    }

    clearInterval(timer);
    showSummary();
});

function updateQuestionStatus(questionId, status) {
    const question = questionStatus.find(q => q.id === questionId);

    if (status === 'visited') {
        question.visited = true;
    } else if (status === 'attempted') {
        question.visited = true;
        question.attempted = true;
    }

    updateUI();
}

function updateUI() {
    questionStatus.forEach(q => {
        const questionCircle = document.getElementById(`question-${q.id}`);
        questionCircle.className = 'question-circle';

        if (q.attempted) {
            questionCircle.classList.add('attempted');
        } else if (q.visited) {
            questionCircle.classList.add('visited');
        } else {
            questionCircle.classList.add('unattempted');
        }
    });
}

document.querySelectorAll('.question-circle').forEach((circle, index) => {
    circle.addEventListener('click', () => {
        currentQuestion = index;
        loadQuestion();
    });
});
startQuiz();
