let currentDate = new Date();
let focusedDate = new Date();

let totalAnsweredQ = localStorage.getItem("totalCompletedQuestions");
if(totalAnsweredQ == null){
    document.getElementById("total-answered-questions").textContent = "Total Answered: 0";
} else {
    document.getElementById("total-answered-questions").textContent = "Total Answered: " + totalAnsweredQ;
}

function getDateAsStorageIdx(date){
    return date.getDate() + "," + date.getMonth() + "," + date.getFullYear();
}

function hasPracticedThisWeek(){
    let targetDay = new Date();
    for(let i = 1; i <= 7; i++){
        targetDay.setDate(targetDay.getDate() - 1);
        if(localStorage.getItem(getDateAsStorageIdx(targetDay)) == null){
            return false;
        }
    }

    return true;
}

let activityFace = document.querySelector("#activity-face");
if(localStorage.getItem(getDateAsStorageIdx(currentDate)) == null){
    activityFace.setAttribute("class", "h-0 fa-solid fa-face-frown");

    if(!hasPracticedThisWeek()){
        activityFace.setAttribute("class", "h-0 fa-solid fa-face-sad-cry");
    }
} else {
    activityFace.setAttribute("class", "h-0 fa-solid fa-face-smile");

    if(hasPracticedThisWeek()){
        activityFace.setAttribute("class", "h-0 fa-solid fa-face-laugh-wink");
    }
}

const monthNames = ["Jan", "Feb", "March", "April", "May", "June",
  "July", "Aug", "Sept", "Oct", "Nov", "Dec"
];
const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function setActivity(date, level){
    localStorage.setItem(getDateAsStorageIdx(new Date(currentDate.getFullYear(), currentDate.getMonth(), date.getDate())), level)
}

function getActivity(date){
    return localStorage.getItem(getDateAsStorageIdx(date))
}

function createDayNode(date){
    let container = document.createElement("div");
    container.setAttribute("class", "date");
    container.onclick = function(){showDateInfo(date)};

    let dayOfTheWeek = document.createElement("span");
    dayOfTheWeek.innerHTML = '<i class="fa-solid fa-fire"></i>';
    if(date > currentDate){
        dayOfTheWeek.innerHTML = '<i class="fa-solid fa-stopwatch"></i>';
    }
    if(date.getFullYear() >= 2007 && date.getMonth() == 3 && date.getDate() == 5){
        dayOfTheWeek.innerHTML = '<i class="fa-solid fa-cake-candles"></i>';
    }

    switch(localStorage.getItem(getDateAsStorageIdx(date))){
        case null:
            break;
        case "1":
            container.classList.add("date-red");
            break;
        case "2":
            container.classList.add("date-orange");
            break;
        case "3":
            container.classList.add("date-white");
            break;
        case '4':
            container.classList.add("date-white");
            break;
        case '5':
            container.classList.add("date-blue");
            break;
        case '6':
            container.classList.add("date-blue");
            break;
        case '7':
            container.classList.add("date-black");
            break;
        default:
            container.classList.add("date-black");
            break;
    }

    if(getDateAsStorageIdx(date) == getDateAsStorageIdx(currentDate)){
        container.classList.add("date-current");
    }

    container.appendChild(dayOfTheWeek);

    return container;
}

function createCalendar(date){
    let container = document.createElement("div");

    let info = document.createElement('div');
    info.setAttribute("class", "info");

    let infoText = document.createElement("h1");
    infoText.textContent = monthNames[date.getMonth()] + ", " + date.getFullYear();
    infoText.setAttribute('class', "date--info")

    let infoBtns = document.createElement("div");
    infoBtns.setAttribute("class", "info--btns");
    infoBtns.innerHTML = '<i class="info--btn info--btn-left fa-solid fa-chevron-left" onclick="lastMonth()"></i><i class="info--btn info--btn-right fa-solid fa-chevron-right" onclick="nextMonth()"></i>'

    let dateContainer = document.createElement("div");
    dateContainer.classList.add("date-container");

    for(let i = 1; i <= new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(); i++){
        let targetDate = new Date(date.getFullYear(), date.getMonth(), i);
    
        dateContainer.appendChild(createDayNode(targetDate));
    }

    info.appendChild(infoText)
    info.appendChild(infoBtns)
    container.appendChild(info);
    container.appendChild(dateContainer);

    return container;
}

let calendarDiv = document.getElementById("calendar");
calendarDiv.appendChild(createCalendar(focusedDate));
showDateInfo(currentDate)

function lastMonth(){
    calendarDiv.innerHTML = "";
    focusedDate = new Date(focusedDate.getFullYear(), focusedDate.getMonth() - 1);
    calendarDiv.appendChild(createCalendar(focusedDate));
}

function nextMonth(){
    calendarDiv.innerHTML = "";
    focusedDate = new Date(focusedDate.getFullYear(), focusedDate.getMonth() + 1);
    calendarDiv.appendChild(createCalendar(focusedDate));
}

function showDateInfo(date){
    let dateInfo = document.querySelector("#day-info-popup");
    dateInfo.setAttribute("style", "");

    if(dateInfo.getAttribute("last-date") == getDateAsStorageIdx(date)){
        dateInfo.setAttribute("style", "display:none;");
        dateInfo.setAttribute("last-date", "");
        return;
    }

    dateInfo.setAttribute("last-date", getDateAsStorageIdx(date));

    switch(getActivity(date)){
        case null:
            dateInfo.setAttribute("class", "");
            break;
        case "1":
            dateInfo.setAttribute("class", "flames-red");
            break;
        case "2":
            dateInfo.setAttribute("class", "flames-orange");
            break;
        case "3":
            dateInfo.setAttribute("class", "flames-white");
            break;
        case '4':
            dateInfo.setAttribute("class", "flames-white");
            break;
        case '5':
            dateInfo.setAttribute("class", "flames-blue");
            break;
        case '6':
            dateInfo.setAttribute("class", "flames-blue");
            break;
        case '7':
            dateInfo.setAttribute("class", "flames-black");
            break;
        default:
            dateInfo.setAttribute("class", "flames-black");
            break;
    }

    if(date > currentDate){
        dateInfo.querySelector(".icon-div--icon").setAttribute("class", "icon-div--icon fa-solid fa-ban");
    } else {
        dateInfo.querySelector(".icon-div--icon").setAttribute("class", "icon-div--icon fa-solid fa-fire");
    }

    if(date.getFullYear() >= 2007 && date.getMonth() == 3 && date.getDate() == 5){
        dateInfo.querySelector(".icon-div--icon").setAttribute("class", "icon-div--icon fa-solid fa-cake-candles");
    }

    dateInfo.querySelector("div:not(.icon-div) h1").innerHTML = weekDays[date.getDay()];
    dateInfo.querySelector("div:not(.icon-div) h2").innerHTML = monthNames[date.getMonth()] + " " + date.getDate() + ', ' + date.getFullYear();
    if(getActivity(date) == null){
        dateInfo.querySelector(".icon-div h1").innerHTML = "0";
        return;
    }
    dateInfo.querySelector(".icon-div h1").innerHTML = getActivity(date);
}