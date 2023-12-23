for(let i = 0; i < lessons.length; i++){
    for(let j = 0; j < lessons[i][0].length; j++){
        let questionIdxString = "{"+i+","+j+"}";
        let currentFocus = localStorage.getItem(questionIdxString);
    }

    document.querySelector("#root").appendChild(createLessonSection(i));
}

function createLessonSection(i){
    let container = document.createElement("div");
    container.setAttribute("class", "lesson " + getLessonClass(i));

    let lessonPackContainer = document.createElement("div");
    lessonPackContainer.setAttribute("class", "row g-2 collapse lesson-packs");
    lessonPackContainer.setAttribute("id", "lesson-packs-"+i);

    for(let j = 0; j < lessons[i][0].length; j++){
        lessonPackContainer.appendChild(createElement(i, j));
    }

    let lessonText = document.createElement("h1");
    lessonText.setAttribute("class", "lesson-text collapsed");
    let icon = "";
    if(lessonIcons[i] !== undefined){
        icon = lessonIcons[i];
    }
    lessonText.innerHTML = icon + ' Lesson ' + i;
    if(lessonTitles[i] !== undefined){
        lessonText.innerHTML = icon + " " + lessonTitles[i];
    }
    lessonText.setAttribute("data-bs-toggle", "collapse");
    lessonText.setAttribute("data-bs-target", "#lesson-packs-"+i);
    container.appendChild(lessonText);
    container.appendChild(lessonPackContainer);

    return container;
}

function createElement(lIdx, qIdx){
    let targetLesson = lessons[lIdx][0][qIdx];
    let isChallenge = targetLesson.isChallenge;
    let questionIdxString = "{"+lIdx+","+qIdx+"}";

    let container = document.createElement("div");
    container.setAttribute("class", "col-sm-12 col-md-6 col-lg-4");
    let innerContainer = document.createElement("div");
    innerContainer.onclick = function(){window.location.href='index.html?display_question=' + questionIdxString};

    let icon = document.createElement("i");
    if(lessons[lIdx][0][qIdx] instanceof NumQuestion && !(lessons[lIdx][0][qIdx] instanceof NumQuestionIMG)){
        icon.setAttribute("class", "fa-solid fa-pen-to-square fa-xl");
    } else if(lessons[lIdx][0][qIdx] instanceof MultipleChoiceQuestion && !(lessons[lIdx][0][qIdx] instanceof MultipleChoiceQuestionIMG)){
        icon.setAttribute("class", "fa-solid fa-list fa-xl");
    } else {
        icon.setAttribute("class", "fa-solid fa-image fa-xl");
    }
    
    if(isChallenge){
        icon.setAttribute("class", "fa-solid fa-crown fa-xl");
    }

    let hoverIcon = document.createElement("i");
    hoverIcon.setAttribute("class", "lesson-pack--hover-icon fa-solid fa-arrow-right fa-xl");

    switch(localStorage.getItem(questionIdxString)){
        case "-1":
            innerContainer.setAttribute("class", "lesson-pack lesson-pack--failed");
            if(isChallenge){
                break;
            }
            // icon.setAttribute("class", "fa-solid fa-thumbs-down fa-xl");
            break;
        case "1":
            innerContainer.setAttribute("class", "lesson-pack lesson-pack--daily");
            if(isChallenge){
                break;
            }
            // icon.setAttribute("class", "fa-solid fa-thumbs-up fa-xl");
            break;
        case "2":
            innerContainer.setAttribute("class", "lesson-pack lesson-pack--complete");
            if(isChallenge){
                break;
            }
            // icon.setAttribute("class", "fa-solid fa-thumbs-up fa-xl");
            break;
        default:
            innerContainer.setAttribute("class", "lesson-pack");
            break;
    }

    let title = document.createElement("h1");
    title.setAttribute("class", "lesson-pack--title");
    title.textContent = targetLesson.name;

    innerContainer.appendChild(icon);
    innerContainer.appendChild(title);
    innerContainer.appendChild(hoverIcon);
    container.appendChild(innerContainer);

    return container;
}

function getLessonClass(i){
    let allGreen = true;
    let unAnsweredExists = false;

    for(let j = 0; j < lessons[i][0].length; j++){
        let questionIdxString = "{"+i+","+j+"}";
        if(localStorage.getItem(questionIdxString) == -1 && lessons[i][0][j].isChallenge == false){
            return "lesson--failed";
        }
        if(localStorage.getItem(questionIdxString) == null){
            unAnsweredExists = true;
        }
        if(localStorage.getItem(questionIdxString) != 2){
            allGreen = false;
        }
    }

    if(unAnsweredExists){
        return "";
    }

    if(allGreen){
        return "lesson--all-complete";
    }
    return "lesson--all-daily";
}