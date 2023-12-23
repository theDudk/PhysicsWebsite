//determines if the user is requesting a specific question
const displayQuestion = new URLSearchParams(window.location.search).get("display_question");

if(displayQuestion != null){
    document.querySelector("#header-logo").onclick = function(){
        window.location.href = 'index.html';
    }
}

// gets a random number for the current day
let currentDate = new Date();
let currentRandomNumGen = new Math.seedrandom(currentDate.getDate() + currentDate.getMonth() + currentDate.getFullYear());
const randNums = []

if(localStorage.getItem("lastDate") == null || localStorage.getItem("lastDate") != getDateAsStorageIdx(new Date())){
    localStorage.setItem("lastAskedIdx", "-1");
    localStorage.setItem("lastDate", getDateAsStorageIdx(new Date()));
} else {
    if(displayQuestion == null){
        localStorage.setItem("lastAskedIdx", parseInt(localStorage.getItem("lastAskedIdx")) - 2);
    }
}

for(let i = 0; i < 1000; i++){
    randNums.push(currentRandomNumGen());
}

function getDailyRandomInt(min, max){
    localStorage.setItem("lastAskedIdx", parseInt(localStorage.getItem("lastAskedIdx")) + 1);
    if(localStorage.getItem("lastAskedIdx") == "1000"){
        localStorage.setItem("lastAskedIdx", "2");
    }
    console.log(localStorage.getItem("lastAskedIdx"));

    return Math.round(randNums[localStorage.getItem("lastAskedIdx")] * (max - min) + min);
}

let confirmBtnN = document.querySelector(".confirm-btn-n");
let confirmBtnMC = document.querySelector(".confirm-btn-mc");

// changes the Start icon randomly
let startIcons = [
    '<i class="btn-hover fa-solid fa-dragon"></i>',
    '<i class="btn-hover fa-solid fa-circle-arrow-right"></i>',
    '<i class="btn-hover fa-solid fa-shuttle-space"></i>',
    '<i class="btn-hover fa-solid fa-satellite"></i>',
    '<i class="btn-hover fa-solid fa-meteor"></i>',
    '<i class="btn-hover fa-solid fa-plane"></i>',
    '<i class="btn-hover fa-solid fa-atom"></i>',
    '<i class="btn-hover fa-solid fa-frog"></i>',
]

document.querySelector("#start-popup").querySelector("#start-btn").innerHTML = "Start" + startIcons[Math.round(Math.random() * (startIcons.length - 1))];

// updates the date to match the current date
const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

document.querySelector("#date").innerHTML = monthNames[currentDate.getMonth()] + " " + currentDate.getDate() + ", " + currentDate.getFullYear();

let pickedLessonIdx;
let pickedQuestionIDx;
let picked;

if(displayQuestion !== null){
    pickedLessonIdx = displayQuestion.substring(1, displayQuestion.indexOf(","));
    pickedQuestionIDx = displayQuestion.substring(displayQuestion.indexOf(",") + 1, displayQuestion.length - 1);
    picked = lessons[pickedLessonIdx][0][pickedQuestionIDx];
    document.querySelector("#start-popup").style.display = "none";
    renderQuestion()
    makeQuestionFunction();
} else {
    nextQuestion(false)
}

// functions for function mc and num questions
let nCheck = function(){
    let nQuestionElements = document.querySelectorAll(".answer-n");

    for(let i of nQuestionElements){
        if(i.querySelector("input").value == "" || document.querySelector("#result-div").style.display != "none"){
            confirmBtnN.setAttribute("clickable", "false");
            return;
        }
    }
    confirmBtnN.setAttribute("clickable", "true");
}

function mcCheck(){
    let mcQuestionElements = document.querySelectorAll(".multiple-choice-answer");

    let containsSelectedQ = false;
    for(let i of mcQuestionElements){
        if(i.getAttribute("selected") == 'true'){
            containsSelectedQ = true;
        }
    }

    if(!containsSelectedQ || document.querySelector("#result-div").style.display != "none"){
        confirmBtnMC.setAttribute("clickable", "false");
        return;
    }

    confirmBtnMC.setAttribute("clickable", "true");
}

// makes questions actually do stuff
makeQuestionFunction();

let incorrectText = [
    "ARGH! SO CLOSE",
    "ZOINKS! Not quite",
    "Incorrect",
    ");",
    "WHOOPS! To the Salt Mines!",
    ":sklown:",
    "BEEEEEEEE",
    "SCIAV! REMEMBER THE CHICKEN!",
    "THOU SHALT NOT PASS!",
    "Mission Failed!",
    "早上好中国，我喜欢吃冰激凌。",
    "No Bridges?",
    "When the apple falls upward",
    "Here's a speeding ticket for disobeying the Laws of Motion",
    "Are you a negative vector, because you're pointed in the opposite direction you should be.",
    "It is fitting you submitted that answer digitally as a series of electrons, because the outcome was very negative.",
]
let correctText = [
    "Correct!",
    "Someone listened to Buluh",
    "Hi Yu-Tian o/",
    "HOW HAVE YOU SOLVED THE RIDDLE",
    "mmm, yah",
    "早上好中国，我爱冰激凌。",
    "Woah! Kepler stole your data!",
    "Schrödingers rat pov:",
    "Are you a physics problem, because I need your seven significant digits",
    "The Cat is out of the Box, ALIVE!!!",
    "You drive at 114,004,827 miles per hour",
    "Are you a star? Because you're insanely hot and bright!",
    "Once upon a time there were chemistry jokes but now they all Argon",
    "I New-ton you could do it!",
    "You Clearly Kep-learned a lot!",
    "Keep up that inertia! You're headed in the right direction!",
]

function showResult(){
    let resultDiv = document.querySelector("#result-div");

    if(document.querySelector(".confirm-btn").getAttribute("clickable") != "true" || resultDiv.style.display == ""){
        return;
    }

    resultDiv.setAttribute("style", "")

    if(document.querySelector(".confirm-btn-mc") != null){
        mcCheck();
    } else {
        nCheck();
    }

    if(!picked.isCorrect()){
        resultDiv.setAttribute("style", "background-color: var(--danger-light);")
        resultDiv.querySelector("#result").innerHTML = '<i class="fa-solid fa-skull"></i> ' + incorrectText[Math.round(Math.random() * (incorrectText.length - 1))];
        resultDiv.querySelector("#result-subtitle").innerHTML = '<button class="btn btn-large me-2 btn-danger-onhover">Reveal Answer<i class="btn-hover fa-solid fa-triangle-exclamation"></i></button>';
        resultDiv.querySelector("#result-subtitle").onclick = function(){document.querySelector("#confirm-popup").style.display="block"};
        if(picked instanceof MultipleChoiceQuestion || picked instanceof MultipleChoiceQuestionIMG){
            if(displayQuestion == null){
                resultDiv.querySelector("#prompt").innerHTML = 'Skip Question <i class="btn-hover fa-solid fa-arrow-right"></i>';
                resultDiv.querySelector("#prompt").onclick = function(){localStorage.setItem("{"+pickedLessonIdx+","+pickedLessonIdx+"}", "-1");nextQuestion(false)};    
            } else {
                resultDiv.querySelector("#prompt").innerHTML = 'Back to Lesson packs <i class="btn-hover fa-solid fa-arrow-right"></i>';
                resultDiv.querySelector("#prompt").onclick = function(){localStorage.setItem("{"+pickedLessonIdx+","+pickedLessonIdx+"}", "-1");window.location.href='lessonPacks.html'};

            }
        } else {
            resultDiv.querySelector("#prompt").innerHTML = 'Try Again? <i class="btn-hover fa-solid fa-arrow-right"></i>';
            document.querySelector("#prompt").onclick = function(){if(document.querySelector("#revealed-answer").style.display == 'none'){hideResult()}};
        }

        if(displayQuestion != null){
            document.querySelector("#revealed-answer-next").onclick = function(){
                document.querySelector('#revealed-answer').setAttribute('style', 'display: none;');
                localStorage.setItem('{'+pickedLessonIdx+','+pickedQuestionIDx+'}', '-1'); 
                window.location.href='lessonPacks.html';
            };
        } else {
            document.querySelector("#revealed-answer-next").onclick = function(){
                document.querySelector('#revealed-answer').setAttribute('style', 'display: none;');
                localStorage.setItem('{'+pickedLessonIdx+','+pickedQuestionIDx+'}', '-1'); 
                localStorage.setItem('lastAskedIdx', parseInt(localStorage.getItem('lastAskedIdx')) - 2); 
                nextQuestion();
            };        
        }
    }
    if(picked.isCorrect()){
        if(displayQuestion !== null){
            localStorage.setItem("{" + pickedLessonIdx + "," + pickedQuestionIDx + "}", "2");
        }
        else if(localStorage.getItem("{" + pickedLessonIdx + "," + pickedQuestionIDx + "}") !== "2"){
            localStorage.setItem("{" + pickedLessonIdx + "," + pickedQuestionIDx + "}", "1");
        }

        resultDiv.setAttribute("style", "background-color: var(--success-light);")
        resultDiv.querySelector("#result").innerHTML = '<i class="fa-solid fa-flag-checkered"></i> ' + correctText[Math.round(Math.random() * (correctText.length - 1))];
        resultDiv.querySelector("#result-subtitle").innerHTML = "Answer(s): " + picked.getAnswers();
        resultDiv.querySelector("#result-subtitle").onclick = "";
        resultDiv.querySelector("#prompt").innerHTML = 'Practice More <i class="btn-hover fa-solid fa-arrow-right"></i>';
        if(displayQuestion == null){
            resultDiv.querySelector("#prompt").onclick = function(){nextQuestion(true)};
        } else {
            resultDiv.querySelector("#prompt").onclick = function(){markWin(); window.location.href='lessonPacks.html'};
        }
    }
}

function hideResult(){
    let resultDiv = document.querySelector("#result-div");
    resultDiv.setAttribute("style", "display: none;");

    if(document.querySelector(".confirm-btn-mc") !== null){
        for(let i of document.querySelectorAll(".multiple-choice-answer")){
            i.setAttribute("selected", "false")
            document.querySelector(".confirm-btn-mc").setAttribute("clickable", "false");
        }
    }
}

function revealAnswer(){
    if(displayQuestion == null){
        localStorage.setItem("lastAskedIdx", parseInt(localStorage.getItem("lastAskedIdx")) + 2);
    }

    document.querySelector("#revealed-answer").setAttribute("style", "display: block;");
    let revealAnswerContent = document.querySelector("#revealed-answer #revealed-answer-content");
    revealAnswerContent.querySelector("#revealed-answer-answer").textContent = "The answer is: " + picked.getAnswers();
    revealAnswerContent.querySelector("#revealed-answer-source").innerHTML = "Source: <b>" + picked.name + "</b> from lesson <b>" + getLessonName(pickedLessonIdx) + "</b>";
}

function makeQuestionFunction(){
    confirmBtnMC = document.querySelector(".confirm-btn-mc");
    confirmBtnN = document.querySelector(".confirm-btn-n");

    // code for functional mutliple choice questions
    let mcQuestionElements = document.querySelectorAll(".multiple-choice-answer");

    for(let i of mcQuestionElements){
        i.onclick = function(){
            if(i.getAttribute("selected") == "true"){
                i.setAttribute("selected", "false")
                mcCheck();
                return;
            }
            
            for(let ii of mcQuestionElements){
                ii.setAttribute('selected', 'false');
            }
            i.setAttribute('selected', 'true');
            mcCheck();
        }
    }

    // code for functional numerical response questions
    let nQuestionElements = document.querySelectorAll(".answer-n");

    for(let i of nQuestionElements){
        i.setAttribute("oninput", "nCheck()");
    }

    //
    document.querySelector(".confirm-btn").addEventListener("click", showResult);
}

function renderQuestion(){
    document.querySelector("#root").innerHTML = "";
    document.querySelector("#root").appendChild(picked.getHTML());
}

function nextQuestion(gainPoints){
    let hasLoopedOnce = false;
    while(!hasLoopedOnce || isNaN(pickedLessonIdx) || pickedLessonIdx == null || lessons[pickedLessonIdx][1] == false){
        pickedLessonIdx = getDailyRandomInt(0, lessons.length - 1);
        hasLoopedOnce = true;
    }
    
    pickedQuestionIDx = getDailyRandomInt(0, lessons[pickedLessonIdx][0].length - 1);

    picked = lessons[pickedLessonIdx][0][pickedQuestionIDx];

    renderQuestion()

    hideResult();

    makeQuestionFunction();

    if(gainPoints !== true){
        return;
    }

    markWin();
}

function markWin(){
    if(localStorage.getItem(getDateAsStorageIdx(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()))) == null){
        setActivity(new Date(), "1")
    } else {
        setActivity(new Date(), parseInt(getActivity(new Date())) + 1)
    }

    if(localStorage.getItem("totalCompletedQuestions") == null){
        localStorage.setItem("totalCompletedQuestions", "1");
    } else {
        localStorage.setItem("totalCompletedQuestions", parseInt(localStorage.getItem("totalCompletedQuestions")) + 1);
    }
}

// ensure images are the right size
let problemImg = document.querySelector(".question-img-container");

addEventListener("resize", ensureImageFits);
setTimeout(ensureImageFits, 500)

function ensureImageFits(){
    if(problemImg == null){return}
    console.log(objectFitsX(problemImg))
    if(!objectFitsX(problemImg)){
        problemImg.style.width = "90vw";
        problemImg.style.height = "auto";
        problemImg.querySelector("img").setAttribute("style", "width: 100%; height:auto;");
    } else {
        problemImg.style.width = "auto";
        problemImg.style.height = "90vh";
        problemImg.querySelector("img").setAttribute("style", "width: auto; height:100%;");
    }
}

function objectFitsX(object){
    let initialStyle = object.getAttribute("style");
    let initialImgStyle = problemImg.querySelector("img").getAttribute("style");

    object.setAttribute("style", "display: block")
    problemImg.querySelector("img").setAttribute("style", "width: auto; height:100%;");
    let returnVal = !(object.getBoundingClientRect().left < 0);
    object.setAttribute("style", initialStyle);
    problemImg.querySelector("img").setAttribute("style", initialImgStyle);

    return returnVal;
}