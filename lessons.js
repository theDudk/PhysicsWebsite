// question & answer classes
class NumQuestion{
    constructor(name, text, isChallenge, ...units){
        this.name = name;
        this.text = text;
        this.isChallenge = isChallenge;

        this.answers = [];
        for(let i of units){
            this.answers.push(new NumAnswer(i));
        }
    }
    getHTML(){
        let container = document.createElement("div");

        let answersContainer = document.createElement("div");
        answersContainer.setAttribute('class', 'answers-container');
        let answersText = document.createElement("h3");
        answersText.textContent = "Answer";
        answersContainer.appendChild(answersText);
        
        let questionText = document.createElement("h2");
        if(this.isChallenge){
            questionText.innerHTML = "<span class='badge badge-danger'>Challenge</span> ";
        }
        questionText.innerHTML += this.text;
        questionText.setAttribute('class', "question");

        let submit = document.createElement('button');
        submit.setAttribute('class', "btn btn-large confirm-btn confirm-btn-n mt-2");
        submit.innerHTML = 'Confirm <i class="btn-hover fa-solid fa-check"></i>';
        submit.setAttribute("clickable", "false");
        let submitContainer = document.createElement("div");
        submitContainer.className = "confirm-btn-cont";

        container.appendChild(questionText);

        for(let i of this.answers){
            answersContainer.appendChild(i.getHTML());
        }

        submitContainer.appendChild(submit);
        answersContainer.appendChild(submitContainer)
        container.appendChild(answersContainer);

        return container;
    }
    isCorrect(){
        let idx = 0;
        for(let i of document.querySelectorAll("#root input")){
            if(!this.answers[idx].isCorrect(i.value)){
                return false;
            }
            idx++;
        }

        return true;
    }
    getAnswers(){
        let returnStr = "";
        let idx = 0;
        for(let i of this.answers){
            returnStr += i.correctAnswer;
            returnStr += " " + i.unit;
            if(idx !== this.answers.length - 1){
                returnStr += ", "
            }
            idx++;
        }

        return returnStr;
    }
}
class MultipleChoiceQuestion{
    constructor(name, text, isChallenge, ...answers){
        this.name = name;
        this.text = text;
        this.isChallenge = isChallenge;

        this.answers = [];
        for(let i of answers){
            this.answers.push(new MultipleChoiceAnswer(i[0], i[1]));
        }
    }
    getHTML(){
        let container = document.createElement("div");

        let answersContainer = document.createElement("div");
        answersContainer.setAttribute('class', 'answers-container');
        let answersText = document.createElement("h3");
        answersText.textContent = "Answer";
        answersContainer.appendChild(answersText);
        
        let questionText = document.createElement("h2");
        if(this.isChallenge){
            questionText.innerHTML = "<span class='badge badge-danger'>Challenge</span> ";
        }
        questionText.innerHTML += this.text;
        questionText.setAttribute('class', "question, h2 mb-3");

        if(questionText.textContent.length > 50){
            questionText.setAttribute('class', "question, h3 mb-3");
        }

        let submit = document.createElement('button');
        submit.setAttribute('class', "btn btn-large confirm-btn confirm-btn-mc");
        submit.innerHTML = 'Confirm <i class="btn-hover fa-solid fa-check"></i>';
        submit.setAttribute("clickable", "false");
        let submitContainer = document.createElement("div");
        submitContainer.className = "confirm-btn-cont";

        container.appendChild(questionText);
        for(let i of this.answers){
            answersContainer.appendChild(i.getHTML());
        }
        submitContainer.appendChild(submit);
        answersContainer.appendChild(submitContainer)
        container.appendChild(answersContainer);

        return container;
    }
    isCorrect(){
        for(let i of document.querySelectorAll("#root .multiple-choice-answer")){
            if(i.getAttribute("selected") !== "true"){
                continue;
            }
            for(let ii of this.answers){
                console.log(i.textContent);
                console.log(ii.isCorrect(i.textContent));
                if(ii.isCorrect(i.textContent)){
                    return true;
                }
            }
        }

        return false;
    }
    getAnswers(){
        for(let i of this.answers){
            if(i._isCorrect == true){
                return i.text;
            }
        }

        console.error("ERROR: No correct answer!");
        return "ERROR: No correct answer!";
    }
}
class NumAnswer{
    constructor(unit){
        this.unit = unit[0];
        this.correctAnswer = this.standardizeAnswer(unit[1]);
    }
    getHTML(){
        let container = document.createElement("div");
        container.setAttribute("class", "input-group answer answer-n mt-3");

        let numInput = document.createElement("input");
        numInput.setAttribute("class", "form-control");
        numInput.setAttribute("placeholder", "...");

        let units = document.createElement("span");
        units.textContent = this.unit;
        units.setAttribute("class", "input-group-text unit");

        container.appendChild(numInput);
        if(this.unit != ""){
            container.appendChild(units);
        }

        return container;
    }
    isCorrect(val){
        let testValue = this.standardizeAnswer(val);
        if (testValue == this.correctAnswer){
            return true;
        }
        return false;
    }
    standardizeAnswer(value){
        return value.toLowerCase().replaceAll(" ", "").replaceAll("x", "*");
    }
}
class MultipleChoiceAnswer{
    constructor(text, isCorrect){
        this.text = text;
        this._isCorrect = isCorrect;
    }
    getHTML(){
        let container = document.createElement("div");
        container.setAttribute("class", "multiple-choice-answer")
        
        let text = document.createElement("h5");
        text.style.margin = "0";
        text.textContent = this.text;

        let dot = document.createElement("div");
        dot.innerHTML = '<i class="fa-solid fa-circle"></i>';

        container.appendChild(text);
        container.appendChild(dot);

        return container;
    }
    isCorrect(val){
        if (val == this.text && this._isCorrect){
            return true;
        }
        return false;
    }
}

class NumQuestionIMG extends NumQuestion{
    constructor(name, text, isChallenge, src, ...units){
        super(name, text, isChallenge, ...units);
        this.src = src;
    }
    getHTML(){
        let container = document.createElement("div");
        let questionContainer = super.getHTML();
        let imgContainer = document.createElement("div");
        imgContainer.setAttribute("class", "question-img-container");
        imgContainer.style.display = "none";

        let imgToggle = document.createElement("button");
        imgToggle.setAttribute("class", "btn square-btn");
        imgToggle.innerHTML = '<i class="fa-solid fa-square-plus"></i> Image';
        imgToggle.id = "image-toggle";
        imgToggle.addEventListener("click", function(){
            if(imgContainer.style.display == "none"){
                imgContainer.style.display = "block";
                imgToggle.innerHTML = '<i class="fa-solid fa-square-minus"></i> Image';
                return;
            }
            imgToggle.innerHTML = '<i class="fa-solid fa-square-plus"></i> Image';
            imgContainer.style.display = "none";
        })

        let image = document.createElement("img");
        image.setAttribute('src', this.src);

        imgContainer.appendChild(image);
        container.appendChild(questionContainer);
        document.body.appendChild(imgContainer);
        document.body.appendChild(imgToggle)

        return container;
    }
}
class MultipleChoiceQuestionIMG extends MultipleChoiceQuestion{
    constructor(name, text, isChallenge, src, ...units){
        super(name, text, isChallenge, ...units);
        this.src = src;
    }
    getHTML(){
        let container = document.createElement("div");
        let questionContainer = super.getHTML();

        let imgContainer = document.createElement("div");
        imgContainer.setAttribute("class", "question-img-container");
        imgContainer.style.display = "none";

        let imgToggle = document.createElement("button");
        imgToggle.setAttribute("class", "btn square-btn");
        imgToggle.innerHTML = '<i class="fa-solid fa-square-plus"></i> Image';
        imgToggle.id = "image-toggle";
        imgToggle.addEventListener("click", function(){
            if(imgContainer.style.display == "none"){
                imgContainer.style.display = "block";
                imgToggle.innerHTML = '<i class="fa-solid fa-square-minus"></i> Image';
                return;
            }
            imgToggle.innerHTML = '<i class="fa-solid fa-square-plus"></i> Image';
            imgContainer.style.display = "none";
        })

        let image = document.createElement("img");
        image.setAttribute('src', this.src);

        imgContainer.appendChild(image);
        container.appendChild(questionContainer);
        document.body.appendChild(imgContainer);
        document.body.appendChild(imgToggle)

        return container;
    }
}

function getDateAsStorageIdx(date){
    return date.getDate() + "," + date.getMonth() + "," + date.getFullYear();
}

function setActivity(date, level){
    localStorage.setItem(getDateAsStorageIdx(new Date(currentDate.getFullYear(), currentDate.getMonth(), date.getDate())), level)
}

function getActivity(date){
    return localStorage.getItem(getDateAsStorageIdx(date))
}

// array of lessons containing an array of questions
let lessons = [
    // Lesson 1 
    [[
        new NumQuestion("Example 1", "An object travels 510 km in 4.0 h. What was the average speed of the object?", false, ["* 10^2 km/h", "1.3"]),
        new NumQuestion("Example 2", "An object travels 6.5 km in 31 minutes. What was the average speed in m/s?", false, ["m/s", "3.5"]),
        new NumQuestion("Example 3", "An object travelling at 60 km/h will travel how far in a 20 minute time interval?", false, ["km", "20"]),
        new NumQuestion("Example 4", "How much time is required for an object travelling at 50 m/s to travel a distance of 6.0km?", false, ["* 10^2 s", "1.2"]),
        new NumQuestion("Example 5", "Convert 40.0 km/h into m/s.", false, ["m/s", "11.1"]),
        new NumQuestion("Example 6", "An airplane travels 1800 km at a speed of 1000 km/h. It then encounters a headwind that slows the plane to 850 km/h for the next 2300 km. What was the plane’s average speed?", false, ["km/h", "911"]),
        new NumQuestion("Example 7", "Two roller bladers, A and B, are having a race. B gives A a head start of 5.0 s. Each roller blader moves with a constant speed in the same direction. If A travels at 5.0 m/s and B travels at 7.5 m/s: How long will it take for B to catch A? At what position will B catch up with A?", true, ["s", "15"], ["m", "75"]),
        new NumQuestion("Practice 1", "If an object can travel at 30 m/s, how long will it take for the object to travel 700 cm?", false, ["s", "0.23"]),
        new NumQuestion("Practice 2", "You run 100 m at a speed of 5.0 m/s and then you walk 100 m at a speed of 1.0 m/s. What was your average speed?", false, ["m/s", "1.7"]),
        new NumQuestion("Practice 3", "Bill is 35.0 m away from Tom. Both men walk in the same direction. Bill walks at 1.65 m/s and Tom walks at 1.85 m/s. From where they began, how far does Tom walk before he catches up with Bill? How long does it take for Tom to catch Bill?", true, ["m", "324"], ["s", "175"]),
        new NumQuestion("Assignment 1", "What distance does a car travel in 75 minutes if it travels with an average speed of 75 km/h during this time? ", false, ["km", "94"]),
        new NumQuestion("Assignment 2", "A bean plant grows at 3.858 x 10^(-5) cm/s. How much will it grow in three days?", false, ["cm", "10.00"]),
        new NumQuestion("Assignment 3", "If light travels at 3.0 x 10^(8) m/s, how long will it take for light to travel from the sun to the Earth which is a distance of 1.5 x 10^(8) km away? ", false, ["* 10^2 s", "5.0"]),
        new NumQuestion("Assignment 4", "A man walks 200 m at a speed of 1.5 m/s and then he runs the remaining 300 m at 3.0 m/s to a store. How long does it take him to travel the total distance? What is his average speed for the journey? ", false, ["* 10^2 s", "2.3"], ["m/s", "2.1"]),
        new NumQuestion("Assignment 5", "A man walks for 25 s at a speed of 1.5 m/s and then runs for 40 s at 3.0 m/s. How far does the man travel? What was his average speed?", false, ["* 10^2 m", "1.6"], ["m/s", "2.4"]),
        new NumQuestion("Assignment 6","A rhinoceros sees a group of American tourists 700 m away. The tourists are wearing fake safari hats. The rhinoceros hates fake safari hats. The rhinoceros rambles toward them for 500 m at a speed of 2.5 m/s and then charges for 200 m at a speed of 6.5 m/s. If the tourists need to get into their safari jeep to escape the rhinoceros, how long do they have to make it to safety? What was the rhinoceros’ average speed?", false, ["* 10^2 s", "2.3"], ["m/s", "3.0"]),
        new NumQuestion("Assignment 8","A turtle and a hare enter a race. How far apart will the two be after 4.5 min if the turtle has a top cruising speed of 0.25 m/s and the hare blazes along at 5.0 m/s?", false, ["km", "1.3"]),
        new NumQuestion("Assignment 9","Jake the snake can slither at 125 cm/s and Mack the rat can run at 200 cm/s. If they start at the same point, how far apart will they be after 5.0 s if they both run in the same direction?", false, ["* 10^2 cm", "3.8"]),
        new MultipleChoiceQuestion("Assignment 10", "Jack the jaguar can run for only 1.0 min at 13.0 m/s before he has to stop to rest, while Zeke the zebra can gallop at 7.25 m/s for 5.0 min. Can Jack catch Zeke for lunch if they are initially 350 m apart? ", false, ["Zeke will get caught", false], ["Zeke will escape", true]),
        new NumQuestion("Assignment 12", "A British Concorde (BC) and a French Concorde (FC) flew in opposite directions around the earth (40 000 km). The BC covered half of its flight distance at a supersonic speed of 2500 km/h and the other half at a subsonic speed of 1000 km/h. The FC spent half of its flight time at 2500 km/h and the other half at 1000 km/h. Which Concorde completed the trip first, and by how many hours did it beat the other?", true, ["h", "5.143"]),
        new NumQuestion("Assignment 13", "Two trains, one starting in Calgary and the other in Edmonton, travel toward one another. The Edmonton train travels at 120 km/h toward Calgary, while the Calgary train travels at 140 km/h toward Edmonton. If the trains begin at the same time and Edmonton and Calgary are 285 km apart, how far from Calgary will the trains pass each other? ", true, ["km", "153"]),
    ], true],
    // lesson 2
    [[
        new NumQuestion("Example 1", "A person walks 10 m east, then 20m west, and finally 10 m east. What is the person’s distance and displacement at each point of the trip?", false, ["m", "40"], ["m [west]", "0.0"]),
        new NumQuestion("Example 2", "A man walks 35 m east and then 185 m west: What is the distance traveled? What is the displacement of the man?", false, ["* 10^m", "2.2"],["* 10^2m [west]", "1.5"]),
        new NumQuestion("Example 3", "A man walks 35 m north, 129 m south, 375 m north and finally 785 m south. What was the distance traveled by the man? What is the displacement of the man?", false, ["* 10^3m", "1.3"],["* 10^2m [south]", "5.0"]),
        new NumQuestion("Example 4", "A man walks 75 m west and then 192 m east. If the time required was 90 s. What was the average speed of the man? What was the displacement of the object? ", false, ["m/s", "3.0"],["* 10^2m [east]", "1.2"]),
        new NumQuestion("Assignment 2A", "Determine the distance and displacement for each of the following questions. An object moves 20 m [W] then 40 m [E].", false, ["m", "60"], ["m [east]", "20"]),
        new NumQuestion("Assignment 2B", "Determine the distance and displacement for each of the following questions. An object moves 55 m [N] then 14 m [S] then 6.4 m [N].", false, ["m", "75"], ["m [north]", "47"]),
        new NumQuestion("Assignment 2C", "Determine the distance and displacement for each of the following questions. An object moves 8.45 cm up, 3.46 cm down, 0.0561 m up, and 0.0632 m down", false, ["cm", "23.8"], ["m [up]", "4.28"]),
        new NumQuestion("Assignment 2D", "Determine the distance and displacement for each of the following questions. An object moves 3.56 km [E], 7855 m [W], 2.543 km [W], and 5.00 x 10^5 cm left", false, ["km", "18.0"], ["km [W]", "11.8"]),
        new NumQuestion("Assignment 2E", "Determine the distance and displacement for each of the following questions. An object moves 7.5 cm left, 62 mm right, 0.012 m [W], and 2.3 cm [E].", false, ["cm", "17"], ["cm [W]", "0.20"]),
        new NumQuestion("Assignment 2F", "Determine the distance and displacement for each of the following questions. An object moves 16 km [E], 17,000 m left, 4.5x10^5 cm right, and 25 km [W].", false, ["km", "63"], ["km [W]", "22"]),
        new NumQuestion("Assignment 3", "An object travels north at 5.0 m/s for 30 s and then south at 8.0 m/s for 45 s. What was the distance traveled by the object? The final displacement of the object? The average speed of the object?", false, ["* 10^2 m", "5.1"],["* 10^2m [south]", "2.1"],["m/s", "6.8"]), 
        new NumQuestion("Assignment 4", "An object travels east for 500 m at a speed of 25 m/ s and then west for 800 m at 16 m/s. What was the distance traveled by the object? The final displacement of the object? The average speed of the object?", false, ["* 10^3 m", "1.3"],["* 10^2 m [west]", "3.0"],["m/s", "19"]),
        new NumQuestion("Assignment 5", "If a runner completes one circuit of a 400 m track in 44.0 s, determine her average speed and final displacement.", false, ["m/s", "9.09"],["m", "0.00"]),        
    ], true],
    // lesson 3
    [[
        new NumQuestionIMG("example 1", "What is the average velocity of the object plotted on the graph? What is the velocity of the object at 5 s and at 15 s? How far did the object travel during the 10 s to 30 s time interval? How far would the object travel over 25 seconds? How long did it take for this object to travel from 6 m to 10 m?", false, "images/L3/1.png", ["m/s [+]", "0.4"], ["m/s [+]", "0.4"], ["m", "7"], ["m", "7"], ["* 10 s", "1"]),
        new NumQuestionIMG("Assignment 1", "What was the velocity of the object at 5.0 s and at 25 s? How much time did the object require to travel 30 m from its starting position? How far would the object travel in 40 s?", false, "images/L3/2.png", ["m/s [-]", "2.7"], ["s", "11"], ["* 10^2 m [-]", "1.1"]),
        new NumQuestionIMG("Assignment 2", "What was the object’s distance and displacement for the 0.0 to 8.0 second interval? At what time was the displacement zero? (answer in 2 Significant Digits)", false, "images/L3/3.png", ["m", "64"], ["m [+]", "16"], ["s", "11"]),
    ], false],
    // lesson 7
    [[
        new NumQuestion("Example 1", "An object travelling at 40 m/s increases its speed to 100 m/ s in 4.0 s. What was the acceleration of the object?", false, ["m/s^2 [+]", "15"]),
        new NumQuestion("Example 2", "An object travelling at 300 km/h slows to 40 km/h in 5.0 minutes. What is the acceleration?", false, ["km/h/min [-]", "52"]),
        new NumQuestion("Example 3", "An object traveling at 60 m/s accelerates at 5.0 m/s^2 . If the final speed becomes 100 m/s, how long was the object being accelerated?", false, ["s", "8.0"]),
        new NumQuestion("Example 4", "An object traveling west at 40 m/s experiences an acceleration of 5.0 m/s^2 east for 5.0 s. What is the resulting velocity?", false, ["m/s [west]", "15"]),
        new NumQuestion("Example 5", "On the planet “PHYSICSISHELL” an object dropped from rest takes 5.6 s to reach a velocity of 20 m/s down. What is the acceleration due to gravity for the planet?", false, ["m/s^2 [down]", "3.6"]),
        new NumQuestion("Example 6", "How fast will an object be traveling after falling for 6.0 seconds?", false, ["m/s [down]", "59"]),
        new NumQuestion("Example 7", "If a ball is thrown up in the air at 15.0 m/ s, how long will it take to reach its maximum height? In addition, what is the total time that the ball is in the air?", false, ["s", "1.53"]),
        new NumQuestion("Practice Problems 1", "An object traveling at 150 km/ h slows to 10 km/ h in 5.0 s. What is the acceleration?", false, ["km/h/s [-]", "28"]),
        new NumQuestion("Practice Problems 2", "An object accelerates from rest at +4.0 m/s^2 for 1.0 min. What is the object’s final velocity?", false, ["* 10^2 m/s [+]", "2.4"]),
        new NumQuestion("Practice Problems 3", "How long would it take for an object traveling at 60 m/s to reach a speed of 100 m/s if the acceleration is 5.0 m/s^2?", false, ["s", "8.0"]),
        new NumQuestion("Practice Problems 4", "A rock is thrown upward with an initial speed of 12.0 m/ s. How long will it take for the object to get to its maximum height? What is the rock’s velocity after 1.5 s?", false, ["s", "1.2"],["m/s [down]", "2.7"]),
        new NumQuestion("Practice Problems 5", "A ball traveling at 10 m/ s begins rolling up an inclined plane. It comes to a stop 5.0 s later and begins to roll back down. What is the acceleration? Velocity after 2.0 s? and velocity after 7.0 s?", false, ["m/s^2 [down the incline]", "2.0"],["m/s [up the incline]", "6.0"],["m/s [down the incline]", "4.0"]),
        new NumQuestion("Assignment 1", "A car starts from rest and accelerates to 100 kilometers per hour in exactly one minute. What was the acceleration?", false, ["km/h/min", "100"]),
        new NumQuestion("Assignment 2", "A boy on a bicycle travels in a straight line and slows down from 30 m/s to 10 m/s in 5.0 s. What is his acceleration?", false, ["m/s^2 [-]", "4.0"]),
        new NumQuestion("Assignment 3", "A plane traveling at 200 km/ h accelerates at 5 km/h/s for one minute. What is the plane’s final speed?", false, ["* 10^2 km/h [+]", "5"]),
        new NumQuestion("Assignment 4", "A car traveling at 50 m/s speeds up to 80 m/s by accelerating at a rate of 4.0 m/s^2 . What was the time required?", false, ["s", "7.5"]),
        new NumQuestion("Assignment 5", "A car slows down from 80 m/s to 40 m/ s by accelerating at -4.0 m/s^2. What time interval was required?", false, ["s", "10"]), 
        new NumQuestion("Assignment 6", "A car accelerates at 3.0 m/s^2 for 9.0 s and reaches a speed of 90 m/s. What was the car’s original speed?", false, ["m/s", "63"]),
        new NumQuestion("Assignment 7", "A car traveling east at an unknown speed applies the brakes and slows down at a rate of 5.0 m/s^2 for 5.0 s. If the final velocity of the car is 95 m/s east, what was the original velocity of the car?", false, ["* 10^2 m/s [east]", "1.2"]),
        new NumQuestion("Assignment 8", "An object traveling at 40 m/s starts rolling up an inclined plane. If the object comes to rest after 8.0 s. What was the acceleration experienced by the object? Velocity of the object after 6.5 s? Velocity of the object after 11 s?", false, ["m/s^2 [-]", "5.0"],["m/s [+]", "7.5"],["m/s [-]", "15"]),
        new NumQuestion("Assignment 9", "An object is thrown downward at 35.0 m/s from a great height. What is its velocity after 5.0 s?", false, ["m/s [down]", "84"]),
        new NumQuestion("Assignment 10", "A 0.50 kg rock is launched upward with an initial speed of 80.0 m/s. How long will it take for the rock to reach its maximum height? How long is the rock in the air? What will the rock’s velocity be after 11.0 s?", false, ["s", "8.15"],["s", "16.3"],["m/s [down]", "27.9"]),
        new MultipleChoiceQuestion("Assignment 13", "What variables determine how long a projectile is in the air?", false,  ["Final velocity and acceleration", false], ["Momentum and mass", false], ["Initial velocity and acceleration", true], ["Mass and acceleration", false], ["Average velocity and acceleration", false]),
    ], true],
    // lesson 8
    [[
        new NumQuestion("example 1", "An object traveling at 10 m/s accelerates until the final speed becomes 20 m/s. If the time interval was 5.0 s, how far did the object travel over the interval?", false, ["m", "75"]),
        new NumQuestion("example 2", "A car starting from rest, accelerates at 5.0 m/s^2 for an unknown time interval. If the car travels 250 m in the acceleration period, what is the time interval?", false, ["s", "10"]),
        new NumQuestion("example 3", "An object accelerates from 5.0 m/s to 100 m/s. If the object traveled 250 m during this time, what was the acceleration?", false, ["m/s^2 [+]", "20"]),
        new NumQuestion("example 4", "A ball rolls up an inclined plane with a initial upward speed of 9.0 m/s and stops rolling upward after 3.0 s. Then it begins to roll back down the plane. What was the displacement after 3.0 seconds?", false, ["m [up the inline]", "14"]),
        new NumQuestion("example 5", "A car traveling east at 30 m/s applies its brake to generate an acceleration of 4.0 m/s^2 west. If the final speed of the car was 5.0 m/s east, how far did the car travel in the acceleration period?", false, ["* 10^2 m [east]", "1.1"]),
        new NumQuestion("example 6", "How fast will an object be traveling after falling for 7.0 s?", false, ["m/s [down]", "67"]),
        new NumQuestion("example 7", "A man standing on the roof of a building throws a stone downward at 20 m/s and the stone hits the ground after 5.0 s. How tall is the building?", false, ["* 10^2 m tall", "2.2"]),
        new NumQuestion("example 8AB", "An object is thrown upward at 49.05 m/s. What is the velocity at 3.0 s? What is the velocity after 7.0 s?", false, ["m/s [up]", "20"], ["m/s [up]", "-20"]),
        new NumQuestion("example 8CD", "An object is thrown upward at 49.05 m/s. How long does it take to reach its maximum height? What is the maximum displacement?", false, ["s", "5.000"], ["m [up]", "122.6"]),
        new NumQuestion("Practice 1", "A man traveling at 35 m/s increases to 85 m/s over five minutes. What was the distance traveled over that time interval?", false, ["km", "18"]),
        new NumQuestion("Practice 2", "An object traveling at 100 m/s accelerates at -5.0 m/s^2 for 15 s. What was the distance traveled by the object as it slowed down over the 15 s? ", false, ["* 10^2 m [+]", "9.4"]),
        new NumQuestion("Practice 3", "An object traveling at an unknown speed accelerates at 4.00 m/s^2 for 25.0 s. If the object travels 1500 m over the time interval, what was the initial velocity before acceleration?", false, ["m/s [+]", "10.0"]),
        new NumQuestion("Practice 4", "A ball is dropped from a height of 3.5 m into the hand of a person waiting below. The ball comes to rest in the person’s hand over a distance of 0.25 m. What was the acceleration of the ball when it landed in the person’s hand?", false, ["* 10^2 m/s^2 [up]", "1.3"]),
        new NumQuestion("Assignment 2", "A car traveling at 60 m/s accelerates at +3.0 m/s^2 for 9.0 s. How far does the car travel in this time?", false, ["* 10^2 m", "6.6"]),
        new NumQuestion("Assignment 3", "A car starting from rest travels 1296 m with an acceleration of 32 m/s^2. How long does it take for the car to travel that distance?", false, ["s", "9.0"]),
        new NumQuestion("Assignment 4", "A person drops a ball from a height of 20 m. What is the ball's final speed and how long did it take to fall? ", false, ["m/s [down]", "20"], ["s", "2.0"]),
        new NumQuestion("Assignment 5", "A car travels 1760 m over 10 s. If the acceleration was -20 m/s^2, what was the initial velocity? ", false, ["* 10^2 m/s [+]", "2.8"]),
        new NumQuestion("Assignment 6", "A car traveling at 60 m/s suddenly has its brakes applied bringing the car to a stop after 4.0 s. How far did the car travel in this time?", false, ["* 10^2 m [+]", "1.2"]),
        new NumQuestion("Assignment 7", "A car traveling at 100 m/s comes to a stop in 200 m. How long did it take for the car to come to a stop?", false, ["s", "4.00"]),
        new NumQuestion("Assignment 8", "A stone is thrown upward with an initial velocity of 11 m/s. Calculate the maximum height and the time the stone is in the air?", false, ["m", "6.2"], ["s", "2.2"]),
        new NumQuestion("Assignment 9", "A bullet leaves a rifle barrel with a speed of 350 m/s. If the length of the barrel is 0.75 m, determine the acceleration of the bullet while it was in the barrel.", false, ["* 10^4 m/s^2", "8.2"]),
        new NumQuestion("Assignment 10", "An object traveling at 10.0 m/s accelerates at 5.0 m/s^2 for 12 s. How far does the object travel in the last three seconds?", false, ["* 10^2 m", "1.9"]),
    ], true],
    // lesson 9
    [[
        new NumQuestion("Example 1", "A rock is thrown up from a 20.0 m high cliff with an initial velocity of +35.0 m/ s. How long does it take for the rock to hit the ground below?", false, ["s", "7.67"]),
        new NumQuestion("Practice Problems 1", "A rock is thrown downward from a cliff at 15.0 m/ s. The rock hits the waves below after 2.45 s. What was the height of the cliff? What was its velocity after 2.0 s?", false, ["m", "66.1"],["m/s down", "34.6"]),
        new NumQuestion("Practice Problems 2", "A rock is thrown upward with a speed of 20 m/s from a 45.0 m cliff. How long will it take for the rock to reach the bottom of the cliff?", false, ["s", "5.7"]),
        new NumQuestion("Assignment 1", "A ball is thrown upward with an initial velocity of 35.0 m/s. What is the velocity after three seconds? Velocity after five seconds? maximum height the ball reachs?", false, ["m/s [up]", "5.57"],["m/s [down]", "14.1"],["m [+]", "62.4"]),
        new NumQuestion("Assignment 2", "A ball traveling at 50 m/s begins to roll up an inclined plane before coming to rest. The ball comes to a stop 80.0 m up the incline. What was the velocity of the ball 2.5 s after starting up the incline?", false, ["m/s [up the incline]", "11"]),
        new NumQuestion("Assignment 3", "A stone is thrown vertically upward from a 117.82 m high cliff with an initial speed of 19.62 m/s. How long will it take for the stone to hit the water below?", false, ["s", "7.290"]),
        new NumQuestion("Assignment 4", "An object is allowed to free fall from rest for 6.0 s. What distance does the object travel in the last second of the fall?", false, ["m [down]", "54"]),
        new NumQuestion("Assignment 5", "A car accelerates uniformly from rest at the rate of 2.0 m/s^2 for 6.0 s. It then maintains a constant speed for 0.50 min. Finally, the brakes are applied and the vehicle slows down at a uniform rate and comes to rest in 5.0 s. Find (a) the maximum speed of the car and (b) the total displacement.", false, ["m/s", "12"],["* 10^2 m", "4.3"]),
        new NumQuestion("Assignment 6", "While driving her car, Mrs. Jones sees an obstruction in the road. It takes her 0.80 s to react and put her foot on the brake. Her car is traveling at 25 m/s. How far will the car travel before she puts her foot on the brake? If, when the brake is applied, the car decelerates at a uniform rate of 9.3 m/s^2 what is the total displacement of the car?", false, ["m", "20"],["m", "54"]),
        new NumQuestion("Assignment 7", "A stone is thrown straight down from the top of a cliff with an initial speed of 6.0 m/s. It reaches the bottom in 3.0 s. How high is the cliff?", false, ["m", "62"]),
        new NumQuestion("Assignment 8", "A ball is thrown vertically upward from a window at 10 m/s. It hits the ground 5.0 s later. What is the height of the window from the ground?", false, ["m", "73"]),
        new NumQuestion("Assignment 9", "An object starting from rest travels 77 m in the sixth second. What was the acceleration?", true, ["m/s^2 [+]", "14"]),
    ], true],
    //lesson 10
    [[
        new NumQuestion("Example 1", "A person walks 20 m west , then 15 m east , and finally 10 m east. What is the person’s final displacement?", false, ["m [East]", "5.0"]),
        new NumQuestion("Example 2", "A person walks 10 m east and then 20 m south. What is her final displacement?", false, ["m [63° S of E]", "22"]),
        new NumQuestion("Example 3", "A man walks 20 m north and then 50 m west. What is the distance traveled and what is the man’s final displacement? (2SD)", false, ["m", "70"], ["m [68.2° W of N]", "54"]),
        new NumQuestion("Example 4", "An object travels 50 m west, 30 m north, 150 m east and 10 m south. What is the resulting displacement?", false, ["* 10^2 m [11.3° N of E]", "1.0"]),
        new NumQuestion("Practice Problem 1", "An ant crawls 40 cm south and then 20 cm west. What is the final distance and displacement for the ant?", false, ["cm", "60"], ["cm [63° S of W]", "45"]),
        new NumQuestion("Practice Problem 1", "A car is driven 80 km north, then 50 km east, then 30 km south and then 90 km west. The entire trip required 4.5 hours. What was the average speed and displacement of the car?", false, ["km/h", "56"], ["km [51° N of W]", "64"]),
        new NumQuestion("Trigonometry Review 4", "Given a right triangle with an hypotenuse length of 42 cm and an angle of 30°. What are the lengths of the opposite and adjacent sides?", false, ["cm", "21"], ["cm", "36"]),
        new NumQuestion("Trigonometry Review 5", "One angle of a right triangle is 55° and the adjacent side with length 24 m, determine the length of the hypotenuse.", false, ["m", "42"]),
        new NumQuestion("Trigonometry Review 6", "In a right triangle there is an angle of 38° opposite a side with a length of 15 m. What is the length of the hypotenuse?", false, ["m", "24"]),
        new NumQuestion("Trigonometry Review 7", "The opposite and adjacent sides of a right triangle are 12 cm and 16 cm respectively. What is the angle involved? What is the length of the hypotenuse?", false, ["°", "37"], ["m", "20"]),
        new NumQuestion("Trigonometry Review 8", "The hypotenuse of an isosceles right triangle is 20 cm long. What is the length of the other two sides? What are the other two angles?", false, ["m", "14"], ["m", "14"], ["°", "45"], ["°", "45"]),
        new NumQuestion("Hand in Assignment 1", "An student walks 20 m [N] then 10 m [S] then 30 m [N] then 25 m [S]. Find distance and displacement.", false, ["m", "85"], ["m [N]", "15"]),
        new NumQuestion("Hand in Assignment 2", "An ant walks 20 cm [W] then 5.0 cm [N]. Find distance and displacement.", false, ["cm", "25"], ["cm [14° N of W]", "21"]),
        new NumQuestion("Hand in Assignment 3", "A mouse runs 30 m [W], 10 m [N], and then 20 m [W]. Find distance and displacement.", false, ["m", "60"], ["m [11° N of W]", "51"]),
        new NumQuestion("Hand in Assignment 4", "A hamster runs 60 cm [N], 30 cm [E], and then 90 cm [S].", false, ["* 10^2 cm", "1.8"], ["cm [45° E of S]", "42"]),
        new NumQuestion("Hand in Assignment 5", "What is the displacement after a plane flies: 20 km [W], 50 km [S] and 60 km [E] (2SD)?", false, ["km [51.3° S of E]", "64"]),
        new NumQuestion("Hand in Assignment 6", "An object travels 858 m WEST then 297 m SOUTH. The time required for the journey was 13 minutes. What was the total distance traveled, what was the displacement of the object, and what was the average speed?", false, ["* 10^3 m", "1.2"], ["* 10^2 m [19° S of W]", "9.1"], ["m/min", "89"]),
        new NumQuestion("Hand in Assignment 7", "An object travels 500 m south, 480 m east, 350 m north, 1650 m west, 390 m north, 590 m east, and 190 m north. The entire trip required 3.00 hours and 21.0 minutes. What was the resulting displacement of the object and what was the average speed in m/min?", false, ["m [53° W of N]", "722"], ["m/min", "20.6"]),

    ], true],
    //lesson 11
    [[
        new NumQuestion("Example 1", "Calculate the west and south components for the acceleration 25.0 m/s^2 [215°].", false, ["m/s^2 [W]", "20.5"],["m/s^2 [S]", "14.3"]),
        new NumQuestion("Example 2", "A man walks 40 m [30° N of E], then 70 m [60° S of E], and finally 20 m [45° N of W]. What is the displacement of the man?", false, ["m [64.5° E of S]", "62"]),
        new NumQuestion("Practice Problems 1", "A turtle walks 60 m [210°], then 50 m [45° W of N] and then 60 m [0.0°]. What was the turtle’s final displacement?", false, ["m [11° N of W]", "28"]),
        new NumQuestion("Assignment 1A", "Calculate the east-west and north-south components for 25 m/s [40° E of N].", false, ["m/s [E]", "16"],["m/s [N]", "19"]), 
        new NumQuestion("Assignment 1B", "Calculate the east-west and north-south components for 16 m/s^2 [20° S of W].", false, ["m/s^2 [W]", "15"],["m/s^2 [S]", "5.5"]),
        new NumQuestion("Assignment 1C", "Calculate the east-west and north-south components for 45 km [15° N of E].", false, ["km [E]", "44"],["km [N]", "12"]),
        new NumQuestion("Assignment 2", "A woman walks 440 m [50° S of W] and then 580 m [60° N of E ]. The entire trip required 15 minutes. What was the total distance travelled? What was the displacement of the woman? What was the average speed of the woman in m/min?", false, ["* 10^3 m", "1.0"],["* 10^2 m [2.5° E of N]", "1.7"],["m/min", "68"]),
        new NumQuestion("Assignment 4", "A boy runs at 5.0 m/s [30° S of W] for 2.5 minutes and then he turns and runs at 3.0 m/s [40° S of E] for 4.5 minutes. What was his average speed? What was his displacement?", false, ["m/s", "3.7"], ["* 10^2 m [1.9° W of S ]", "9.0"]),
        new NumQuestion("Assignment 5", "A man walks 600 m [47° N of E], then 500 m [38° W of N], then 300 m [29° S of W], and finally 400 m [13° E of S]. Find his resultant displacement.", false, ["* 10^2 m [13° W of N]", "3.1"]),
        new NumQuestion("Assignment 6", "A slightly disoriented homing pigeon flies the following course in the following order at a constant speed of 15 m/s: 800 m [37° E of N], 300 m due west, and 400 m [37° S of E].", true, ["m/s", "6.4"]),
        new NumQuestion("Assignment 7", "An airplane is climbing at an angle of 15° to the horizontal with the sun directly overhead. The shadow of the airplane is observed to be moving across the ground at 200 km/h. (a) What is the actual airspeed of the plane? (b) How long does it take for the plane to increase its altitude by 1000 m?", false, ["* 10^2 km/h", "2.1"], ["min", "1.1"]),
    ], true],
    //lesson 12
    [[
        new MultipleChoiceQuestion("Example 2", "A bird flies at 50 km/h north where a wind of 40 km/h is blowing East. What is the resultant velocity of the bird when it flies?", false, ["east", true], ["west", false], ["north", false]), 
        new NumQuestion("Example 3", "An airplane flies North at 300 km/h but a wind is blowing at West 70 km/h. What is the velocity of the plane relative to the ground? How far off course will the plane be after 3.0 hours?", false, ["*10^2 km/h [13° W of N]", "3.1"], ["*10^2 km [W]", "2.1"]),
        new NumQuestion("Example 4", "City A is 600 km south of city B. An airplane which can fly at 200 km/h relative to the air must fly from city B to city A. A West wind of 90 km/h is blowing. What is the required heading? What is the actual velocity of the plane relative to the ground? How long is the flight from city B to city A?", false, ["° W of S]", "27"], ["*10^2 km/h [S]", "1.8"], ["h", "3.4"]),
        new NumQuestion("Example 5", "A girl standing on the west side of a river that flows from north to south at 1.5 km/h, wishes to swim straight across from point A to point B on the diagram. She can swim at 3.0 km/h in still water. What is the heading she must use? What is her actual velocity? If the river is 0.25 km wide, how long would it take her to swim across the river in minutes?", false, ["° N of E]", "30"], ["km/h [E]", "2.6"], ["h", "0.096"]),
        new NumQuestion("Practice 2", "An aircraft has a cruising speed of 100 m/s. On this particular day, a wind is blowing at 75 m/s [0.0°]. If the plane were to fly due north, what would be the velocity relative to the ground? If the pilot wishes to have a resultant direction of due north, in what direction should he point the plane? What will be the plane’s displacement in 1.25 h?", false, ["* 10^2 m/s [37° N of E]]", "1.3"], ["° W of N", "49"], ["* 10^2 km", "3.0"]),
        new NumQuestion("Assignment 1", "There are four animals in a race (the number in brackets indicates their top speeds); a tortoise (0.2 m/s), a chicken (1.5 m/s), a rabbit (5.0 m/s) and a dog (7.0 m/s). What is the velocity of: A. The ground relative to the chicken? B. The rabbit relative to the dog? C. The tortoise relative to the chicken? D. The ground relative to the rabbit? E. The dog relative to the ground? F. The rabbit relative to the tortoise? G. The chicken relative to the tortoise? H. The chicken relative to the dog? I. The dog relative to the dog? J. The tortoise relative to the dog?", false, ["m/s", "-1.5"], ["m/s", "-2.0"], ["m/s", "-1.3"], ["m/s", "-5.0"], ["m/s", "7.0"], ["m/s", "4.8"], ["m/s", "1.3"], ["m/s", "-5.5"], ["m/s", "0.0"], ["m/s", "-6.8"]),            
        new NumQuestion("Assignment Question 2", "A train is going east with a speed of 30 m/s. Jim and Sam are passengers on the train and they are moving away from each other. Jim is walking west with a speed of 1.5 m/s relative to the train, while Sam is running east at 5.0 m/s relative to the train. A. What is Jim's velocity relative to the ground? B. What is Sam's velocity relative to the ground? C. What is the train's velocity relative to Jim? D. What is the train's velocity relative to Sam?", false, ["m/s [E]", "29"], ["m/s [E]", "35"], ["m/s [E]", "1.5"], ["m/s [W]", "5.0"]),
        new NumQuestion("Assignment Question 3", "Two boathouses are located on a river, 1.0 km apart on the same shore. Two men make round trips from one boathouse to the other, and back. One man paddles a canoe at a velocity of 4.0 km/h relative to the water, and the other walks along the shore at a constant velocity of 4.0 km/h. The current in the river is 2.0 km/h in the starting direction of the canoeist.  A. How much sooner than the walker does the canoeist reach the second boathouse?  B. How long does it take each to make the round trip? ", false, ["min", "5.0"], ["min", "40"], ["min", "30"]),
        new NumQuestion("Assignment Question 4", "A dog walks at 1.6 m/s on the deck of a boat that is traveling north at 7.6 m/s with respect to the water. A. What is the velocity of the dog with respect to the water if it walks towards the bow? B. What is the velocity of the dog with respect to the water if it walks towards the stern? C. What is the velocity of the dog with respect to the water if it walks towards the east rail, at right angles to the boat's keel? ", false, ["m/s [N]", "9.2"], ["m/s [N]", "6.0"], ["m/s [78° N of E]", "7.8"]),
        new NumQuestion("Assignment Question 5", "An airplane with an airspeed of 400 km/h is flying south, but an east wind of 86 km/h blows the plane off course. What was the actual velocity of the plane? ", false, ["* 10^2 km/h [12° W of S]", "4.1"]),
        new NumQuestion("Assignment Question 6", "Two people can paddle a canoe at 4.75 km/h in still water. A river has a 2.65 km/h current. A. If the canoeists wish to paddle straight across the river, what angle should the keel of the canoe make with the shoreline? B. If the river is 0.50 km wide, how much time is required to make the journey (in minutes)? ", false, ["°", "56"], ["min", "7.6"]),
        new NumQuestion("Assignment Question 7", "The pilot of a ferry boat, with a cruising speed of 12 km/h, wishes to sail north from Georgetown, Malaysia to Medan, Indonesia across the Strait of Malacca. If the strait has a 3.0 km/h current flowing west, what course should the pilot set to compensate for the current? If the distance from Georgetown to Medan is 100 km, how long will the sailing take? ", false, ["° [E of N]", "15"], ["h", "8.6"]),
        new NumQuestion("Assignment Question 8", "A pilot heads her plane with a velocity of 255 km/h north. If there is a strong 112 km/h wind blowing east, what is the velocity of the plane in reference to the ground? ", false, ["km/h", "279"], ["° [E of N]", "23.7"]),
        new NumQuestion("Assignment Question 9", "A pilot wants to fly west. If the plane has an airspeed of 95 m/s and there is a 25.0 m/s wind blowing north: A. In what direction must she head the plane? B. What will be her speed relative to the ground? C. How far will the plane go in 2.25 h? ", false, ["° [S of W]", "15.3"], ["m/s", "91.7"], ["km [W]", "743"]),
        new NumQuestion("Assignment Question 10", "A 70 m wide river flows at 0.80 m/s. A girl swims across it at 1.4 m/s relative to the water. A. What is the least time she requires to cross the river? B. How far downstream will she be when she lands on the opposite shore? C. At what angle to the shore would she have to aim, in order to arrive at a point directly opposite the starting point? D. How long would the trip in part (C) take? ", false, ["s", "50"], ["m", "40"], ["°", "55"], ["s", "61"]),
        new NumQuestion("Assignment Question 11", "A yacht has a cruising speed of 45 km/h and it is headed east. If there is 20 km/h current at 40° S of E, what is the actual velocity of the boat? ", false, ["km/h", "62"], ["° [S of E]", "12"]),
        new NumQuestion("Assignment Question 12", "A pilot maintains a heading due west with an air speed of 240 km/h. A passenger, who has graduated from Physics 20, measures the velocity of the aircraft relative to the ground and calculates it to be 180 km/h [35° N of W]. What is the magnitude and direction of the wind?", false, ["* 10^2 km/h", "1.4"], ["° [N of E]", "48"]),
    ], true],
    // lesson 13
    [[
        new NumQuestion("Example 1", "A rock is thrown horizontally from a 100 m high cliff. It strikes the ground 90 m from the base of the cliff. At what speed was the rock thrown?", false, ["m/s", "20"]),
        new NumQuestion("Example 2", "A ball is projected at an angle of 37° up from the horizontal with a speed of 20 m/s. What was the maximum height? How long was the ball in the air? What is the range?", false, ["m", "7.4"], ["s", "2.5"], ["m", "39"]),
        new NumQuestion("Example 3", "A rock is thrown with a speed of 30.0 m/s at 30° below the horizontal from a 150 m sheer cliff. How far away from the base of the cliff did the rock land?", false, ["m", "109"]),
        new NumQuestion("Practice 1", "A rock is thrown horizontally at 10.0 m/s off of a 150 m sheer cliff. What is the range?", false, ["m", "55.3"]),
        new NumQuestion("Practice 2", "A quarterback throws a football at 15 m/s at 40° to the horizontal. What is the maximum height of the ball? What is the range?", false, ["m", "4.8"], ["m", "23"]),
        new NumQuestion("Assignment 3", "A man is standing on the edge of the roof of a building that is 828.1 m high. If he throws an object horizontally from the roof at 12 m/s, how far from the base of the building does the object land?", false, ["* 10^2 m", "1.6"]),
        new NumQuestion("Assignment 4", "A man standing at the edge of a cliff throws a stone horizontally at 40 m/s. The stone lands 360 m from the base of the cliff. How high is the cliff? ", false, ["* 10^2 m", "4.0"]),
        new NumQuestion("Assignment 5", "A baseball is thrown at 30° above the horizontal with a speed of 49.0 m/s. How long does it take for the ball to reach its maximum height? What is the maximum height? How long is the baseball in the air? What is the maximum range of the baseball?", false, ["s", "2.5"], ["m", "3.1"], ["s", "5.0"], ["* 10^2 m", "2.1"]),
        new NumQuestion("Assignment 6", "If a stone is thrown at 60° above the horizontal with a speed of 196 m/s, what is the maximum height and the range?", false, ["* 10^3 m", "1.5"], ["* 10^3 m", "3.4"]),
        new NumQuestion("Assignment 7", "An airplane is flying level at 80.0 m above the ground with a speed of 350 km/h. The bombardier wishes to drop food and medical supplies to hit a target on the ground. At what horizontal distance from the target should the bombardier release the supplies?", false, ["m", "393"]),
        new NumQuestion("Assignment 8", "A ball is thrown horizontally from a window at 10 m/s and hits the ground 5.0 s later. What is the height of the window and how far from the base of the building does the ball first hit?", false, ["* 10^2 m", "1.2"], ["m", "50"]),
        new NumQuestion("Assignment 9", "An artillery gun is fired so that the shell has a vertical component of velocity of 210 m/s and a horizontal component of 360 m/s. If the target is at the same level as the gun (a) how long will the shell stay in the air and (b) how far down-range will the shell hit the target?", false, ["s", "42.9"], ["km", "15.4"]),
        new NumQuestion("Assignment 10", "A girl standing on the top of a roof throws a rock at 30 m/s at an angle of 30° below the horizontal. If the roof is 50 m high, how far from the base of the building will the rock land?", true, ["m", "52"]),
        new NumQuestion("Assignment 11", "A cannon is fired at 30° above the horizontal with a velocity of 200 m/s from the edge of a 125 m high cliff. Calculate where the cannonball lands on the level plain below.", true, ["* 10^3 m", "3.7"]),
        new NumQuestion("Assignment 12", "A golfer hits a golf ball with a pitching wedge from a tee that is 15 m lower than the green. If the ball leaves the tee at 35 m/s at an angle of 40° to the horizontal and it lands in the hole on the green, what is the horizontal distance from the golfer to the hole?", true, ["* 10^2 m", "1.0"]),
    ], true],
    // lesson 14 & 15
    [[
        new NumQuestion("Example 2", "What is the mass and weight of a 30 kg object located on the surface of the Earth and on the Moon (g_moon = 1.61 m/s^2)?", false, ["* 10^2 N [down]", "3.0"], ["N [down]", "48"]),
        new NumQuestion("Example 3", "For a 60 kg mass, if the frictional force is 40 N, what applied force is required to acce lerate the object at 4.0 m/s^2 ?", false, ["* 10^2 N", "2.8"]),
        new NumQuestion("Example 4", "Two ice skaters, Jim (60 kg) and Bob (40 kg) are standing facing other. When Jim pushes on Bob, Bob’s acceleration is 2.0 m/s^2 east. Assuming that the frictional forces are negligible, what is Jim’s acceleration?", false, ["m/s^2 [West]", "1.3"]),
        new NumQuestion("Example 5", "A 2.0 kg object experiences a 15 N force pulling south, a 25 N force pulling west an d a 20 N force pulling at 30° S of E. What is the acceleration experienced by the object?", false, ["m/s^2 [17.1° W of S]", "13"]),
        new NumQuestion("Example 6", "If a 130 N east net force is applied for 2.0 seconds to a 50 kg mass at rest, what is the resulting displacement of the object?", false, ["m [East]", "5.2"]),
        new NumQuestion("Example 7", "A 15 kg ob ject is pushed from rest for 5.0 s by a 60 N east force and then it is allowed to continue moving. The object eventually comes to rest. If the frictional force is 20 N, how far from its starting point does the object come to rest?", false, ["* 10^2 m", "1.0"]),
        new NumQuestion("Example 8", "A force of 90 N is applied to a sled (mass 40 kg) at an angle of 30° to the horizontal. If the frictional force is 27.94 N, what is the resulting acceleration of the sled?", false, ["m/s^2", "1.3"]),
        new NumQuestion("Practice Problem 1", "A 6.0 kg cart is being pulled with a horizontal force of 25 N. If the frictional force is 15 N, what is the acceleration of the cart?", false, ["m/s^2", "1.7"]),
        new NumQuestion("Practice Problem 2", "A 1200 kg car comes to a stop from a speed of 25 m/s in 6.5 s. What braking force was required?", false, ["10^3 N", "4.6"]),
        new NumQuestion("Practice Problem 3", "A 5.0 kg object experiences a 15 N force pulling north, a 25 N force pulling east and a 20 N force pulling at 30° E of S. What is the acceleration experienced by the object?", false, ["m/s^2 [3.8° S of E]", "7.0"]),
        new NumQuestion("Practice Problem 4", "A 130 N eastward force is applied for 2.0 s to a 50 kg object starting from rest on a level surface. If there is a frictional force of 50 N, what is the resulting displacement of the object?", false, ["m", "3.2"]),
        new NumQuestion("Assignment 2", "A 300 kg object is accelerated at 0.25 m/s^2 by what unknown force?", false, ["N", "75"]),
        new NumQuestion("Assignment 3", "A 400 g mass at rest is acted on by a 200 N net force for 12.0 s. What is its final velocity?", false, ["10^3 m/s", "6.00"]),
        new NumQuestion("Assignment 4", "What is the mass of an object that is acted on by a 500 N horizontal force and a 150 N frictional force if it changes velocity from 20 m/s to 40 m/s in 2.5 s?", false, ["kg", "44"]),
        new NumQuestion("Assignment 5", "What is the initial velocity of a 2.2 kg object that experiences a net force of 2.50 N for 8.0 s giving it a final velocity of 70 m/s?", false, ["m/s", "61"]),
        new NumQuestion("Assignment 6", "A 4000 kg vehicle travelling at 26 m/s west is slowed to 2.0 m/s west in 20 s by what braking force?", false, ["* 10^3 N [East]", "4.8"]),
        new NumQuestion("Assignment 7", "A car of mass 1.5 x 10^3 kg is being driven at 20 m/s. The driver sees a massive hole 100 m ahead. What is the minimum frictional force required to stop the car in time?", false, ["* 10^3 N", "3.0"]),
        new NumQuestion("Assignment 8", "A bullet of mass 20 g strikes a fixed block of wood at a speed of 320 m/s. The bullet embeds itself in the block of wood, penetrating to a depth of 6.0 cm. Calculate the average force acting on the bullet to bring it to rest?", false, ["10^4 N", "1.7"]),
        new NumQuestion("Assignment 9", "A 40 N push north combines with a 30 N pull east. What is the net force?", false, ["N [36.9° E of N]", "50"]),
        new NumQuestion("Assignment 10", "Three strings are attached to an object. If one of the strings is pulled north with a force of 10 N and one of the other strings is pulled west with 15 N, what force must be applied to the third string so that the object does not move?", false, ["N [33.7° S of E]", "18"]),
        new NumQuestion("Assignment 12", "An 8.0 g bullet travelling at 400 m/s passes through a heavy block of wood in 4.0 x 10^-4 s and emerges with a speed of 100 m/s. (a) With what average force did the wood oppose the motion of the bullet? (b) How thick is the block of wood?", false, ["10^3 N", "-6.0"], ["10^-1 m", "1.0"]),
        new NumQuestion("Assignment 13", "A 1600 kg car is at a stop light on a level, horizontal road. There is an average frictional force of 680 N acting on the car. When the light turns green the driver accelerates the car to a speed of 72 km/h in 25 s. What was the applied force on the car during this time? The driver then maintains a constant speed of 72 km/h for 6.5 km. What was the applied force on the car during this time? When the driver sees a red light ahead he slows to a stop over 32 s. What was the applied braking force on the car during this time?", false, ["* 10^3 N", "2.0"], ["* 10^2 N", "6.8"], ["* 10^2 N", "-3.2"]),
        new NumQuestion("Assignment 14", "A man drags a package across the floor with a force of a 40 N. The mass of the package is 10 kg. If the acceleration of the package is 3.5 m/s^2 and friction can be neglected, at what angle to the horizontal does the man pull?", false, ["°", "29"]),
        new NumQuestion("Assignment 15", "A spring is compressed between two marbles. When the spring is released, marble A (mass = 20.0 g) is projected from rest to –15.0 m/s in 0.0350 s. What is the mass of marble B if it experiences a velocity change from rest to +22.0 m/s in 0.0350 s?", false, ["g", "13.6"]),        
    ], true],
    // lesson 16
    [[
        new NumQuestion("Example 1", "What friction force must be overcome to start a 50 kg object sliding across a horizontal surface when the static coefficient of friction is 0.35? ", false, ["* 10^2 N", "1.7"]),
        new NumQuestion("Example 2", "A 400 N object is pulled over a horizontal surface. If the coefficient of kinetic friction is 0.23 and the applied force is 120 N, what is its acceleration? ", false, ["m/s^2", "0.69"]),
        new NumQuestion("Example 3", "A 10 kg box is dragged over a horizontal surface by a force of 40 N. If the box moves with a constant speed of 0.5 m/s, what is the coefficient of kinetic friction for the surface? ", false, ["", "0.41"]),
        new NumQuestion("Example 4", "A 10 kg box is dragged across a level floor with a force of 60 N. The force is applied at an angle of 30° above the horizontal. If the coefficient of friction is 0.20, what is the acceleration of the box?", false, ["m/s^2", "3.8"]),
        new NumQuestion("Practice 1", "A 15 kg box is being dragged over a concrete floor with an applied horizontal force of 40 N. If the coefficient of kinetic friction is 0.25, what is the acceleration of the box?", false, ["m/s^2", "0.21"]),
        new NumQuestion("Practice 2", "A 20 kg apple crate is being dragged across a floor at constant velocity with a horizontal force of 25 N. What is the coefficient of friction?", false, ["", "0.13"]),
        new NumQuestion("Practice 3", "A rope attached to a 50 kg box is being pulled at an angle of 25° across a horizontal floor where the coefficient of static friction is 0.20. What is the acceleration of the box if a 200 N force is applied? ", false, ["m/s^2", "2.1"]),
        new NumQuestion("Assignment Question 2", "It takes a 50 N horizontal force to pull a 20 kg object along the ground at constant velocity. What is the coefficient of friction?", false, ["", "0.26"]),
        new NumQuestion("Assignment Question 3", "If the coefficient of friction is 0.30, how much horizontal force is needed to pull a mass of 15 kg across a level board with constant velocity?", false, ["N", "44"]),
        new NumQuestion("Assignment Question 4", "A box, mass = 2.0 kg, is pulled across a level desk by a horizontal force of 4.0 N. If the coefficient of kinetic friction is 0.12, what is the acceleration of the box?", false, ["m/s^2", "0.82"]),
        new NumQuestion("Assignment Question 5", "A girl pushes a light (i.e. weight is negligible) snow shovel at a uniform velocity across a sidewalk. If the handle of the shovel is inclined at 55° to the horizontal and she pushes along the handle with a force of 100 N, what is the force of friction? What is the coefficient of kinetic friction? ", false, ["N", "57"], ["", "0.70"]),
        new NumQuestion("Assignment Question 6", "A 70 kg hockey player coasts along the ice on steel skates. If the coefficient of kinetic friction is 0.010. A. what is the force of friction? B. How long will it take him to coast to a stop, if he is initially travelling at 1.0 m/s? ", false, ["N", "6.9"], ["s", "10"]),
        new NumQuestion("Assignment Question 7", "A 10 kg box is pulled across a level floor, where the coefficient of kinetic friction is 0.35. What horizontal force is required for an acceleration of 2.0 m/s^2? ", false, ["N", "54"]),
        new NumQuestion("Assignment Question 8", "A boy pulls a 50 kg crate across a level floor with a force of 200 N. If the force acts at an angle of 30° up from the horizontal, and the coefficient of kinetic friction is 0.30, determine the normal force exerted on the crate by the floor, the frictional force exerted on the crate by the floor and the acceleration of the crate. ", false, ["*10^2 N", "3.9"], ["*10^2 N", "1.2"], ["m/s^2", "1.1"]),
        new NumQuestion("Assignment Question 9", "A can of pop (mass = 500 g) is given a shove. It slides across a table, eventually coming to a stop. If its initial velocity is 2.0 m/s, and the coefficient of kinetic friction between the two surfaces is 0.20, how far will it travel across the table? ", false, ["m", "1.0"]),
    ], true],
    // lesson 17
    [[
        new NumQuestion("Example 1", "A rope is attached to a 50 kg mass. What is the tension force required to accelerate the mass upward at 2.0 m/s^2?", false, ["* 10^2 N [up]", "5.9"]),
        new NumQuestion("Example 2", "A rope is attached to a 50 kg mass. What is the tension force required to lift the mass upward at a constant speed?", false, ["* 10^2 N [up]", "4.9"]),
        new NumQuestion("Example 3", "A rope is attached to a 50 kg mass. If an upward force of 280 N is applied on the rope, what is the resulting motion of the mass?", false, ["m/s^2", "4.2"]),
        new NumQuestion("Example 4", "If you normally weigh 706 N, what is your apparent weight if you are in an elevator that is slowing down at the rate of 1.65 m/s^2?", false, ["N", "587"]),
        new NumQuestion("Example 5", "A 1200 kg rocket produces 30000 N of thrust. What is the velocity of the rocket 45 s after launch?", false, ["* 10^2 m/s [up]", "6.8"]),
        new NumQuestion("Example 6", "A 30 kg object is on an inclined plane set at 40° to the horizontal. What is the acceleration experienced by the object if the coefficient of friction is 0.25?", false, ["m/s [down the incline]", "4.4"]),
        new NumQuestion("Practice 1", "A 490 N object is suspended from a rope. What is the force required to raise it vertically at 5.00 m/s? What is the force required to accelerate it down at 3.00 m/s^2?", false, ["N", "490"], ["N", "340"]),
        new NumQuestion("Practice 2", "A 20.0 kg mass is placed on a 50° incline. If the coefficient of friction is 0.35, what is the acceleration of the mass?", false, ["m/s^2", "5.3"]),
        new MultipleChoiceQuestion("Assignment 2", "A rope is used to lift a 4.0 kg rock vertically up at 0.50 m/s. What is the tension in the rope?", false, ["41 N", false], ["39 N", true], ["78 N", false], ["12 m/s^3 [up]"]),
        new NumQuestion("Assignment 3", "A jet accelerates vertically up at 8.5 m/s2. What force does the exhaust gas exert on the 4400 kg jet?", false, ["* 10^4 N", "8.1"]),
        new NumQuestion("Assignment 4", "A 360 N force is applied horizontally to a 150 N box which experiences a force of friction of 75.0 N. What is the net acceleration of the box?", false, ["m/s^2", "18.6"]),
        new NumQuestion("Assignment 5", "A 2.0 kg pendulum hangs in an elevator. Calculate the tension in the string supporting the pendulum if the elevator moves: (a) with zero velocity. (b) downward at a constant velocity of 2.5 m/s. (c) upward at a constant velocity of 2.5 m/s. (d) downward at a constant acceleration of 2.0 m/s^2. (e) upward at a constant acceleration of 2.0 m/s^2.", false, ["N", "20"], ["N", "20"], ["N", "20"], ["N", "16"], ["N", "24"]),
        new NumQuestion("Assignment 6A", "A man measures the acceleration of an elevator by using a spring balance. He fastens the scale to the roof, and suspends a mass from it. The scale reads 98 N when the elevator is at rest, and 93 N when the elevator is moving. What is the acceleration of the elevator?", false, ["m/s^2", "0.50"]),
        new MultipleChoiceQuestion("assignment 6B", "A man measures the acceleration of an elevator by using a spring balance. He fastens the scale to the roof, and suspends a mass from it. The scale reads 98 N when the elevator is at rest, and 93 N when the elevator is moving. In which direction is the elevator accelerating?", false, ["up", false], ["down", true], ["S", false], ["N", false])
    ], true],
    // lesson 18
    [[
        new NumQuestion("Example 1", "A 30 kg mass is connected over a pulley with a 20 kg mass. What is the resulting acceleration when the masses are released? What is the tension in the rope? ", false, ["m/s^2", "2.0"], ["*10^2 N", "2.4"]),
        new NumQuestion("Practice 1", "A 600 kg mass is connected over a pulley to a 400 kg mass. What is the resulting acceleration when the masses are released? What is the tension in the rope? ", false, ["m/s^2", "1.96"], ["*10^3 N", "4.71"]),
        new NumQuestion("Assignment 1", "A 40 kg block on a level, frictionless table is connected to a 15 kg mass by a rope passing over a frictionless pulley. What will be the acceleration of the 15 kg mass when it is released? ", false, ["m/s^2", "2.7"]),
        new NumQuestion("Assignment 3", "A 3.0 kg mass is attached to a 5.0 kg mass by a strong string that passes over a frictionless pulley. When the masses are released what will be (a) the acceleration of the masses, and (b) the magnitude of the tension in the string? ", false, ["m/s^2", "2.5"], ["N","37"]),
        new NumQuestion("Bonus Question 1", "Three small children of mass 20.0 kg, 24.0 kg, and 16.0 kg, respectively, hold hands, as shown, and are pulled across a smooth frozen pond by a larger boy on skates, who pulls a horizontal rope being held by the first child. The skater pulls on the rope with a force of 135 N. Calculate each of the following. A. the acceleration of the skater B. the force with which each pair of children must hold hands, to ensure that the chain is not broken.", false, ["m/s^2", "2.25"], ["N","90.0"], ["N","36.0"]),
        new NumQuestion("Bonus Question 5", "A 0.50 kg wooden block is placed on top of a 1.0 kg wooden block. The coefficient of static friction between the two blocks is 0.35. The coefficient of kinetic friction between the lower block and the level table is 0.20. What is the maximum horizontal force that can be applied to the lower block without the upper block slipping?", false, ["N", "8.1"]),
        new NumQuestion("Bonus Question 6", "A skier skiing downhill reaches the bottom of a hollow with a velocity of 20 m/s, and then coasts up a hill with a 10° slope. If the coefficient of kinetic friction is 0.10, how far up the slope will she travel before she stops? ", false, ["m", "75"]),
    ], false],
    // lesson 19
    [[
        new NumQuestion("Example 1", "Calculate the centripetal force acting on a 2.5 kg object whirling at a speed of 3.5 m/s in a horizontal circle of radius 0.80 m.", false, ["N", "38"]),
        new NumQuestion("Example 2", "A car travelling at 20 m/s goes around an un-banked curve in the road which has a radius of 122 m. What is the acceleration experienced by the car? What provided the centripetal acceleration?", false, ["m/s^2", "3.3"]),
        new NumQuestion("Example 3", "If the frequency of rotation for an object is 4.0 Hz, what is its period of rotation?", false, ["s", "0.25"]),
        new NumQuestion("Example 4", "If an object travelling in a circle with a radius of 5.0 m has a frequency of 6.0 Hz, what is the speed of the object?", false, ["* 10^2 m/s", "1.9"]),
        new NumQuestion("Example 5", "If the centripetal acceleration on a stone being whirled in a circle at the end of a 1.75 m string is 350 m/s2, what is the frequency of rotation?", false, ["Hz", "2.25"]),
        new NumQuestion("Example 6", "A 1000 kg car enters an unbanked curve of 80 m radius. If the coefficient of friction between the pavement and the car tires is 0.51, what is the maximum speed which the car can go around the curve?", false, ["* 10^3 N", "5.0"]),
        new NumQuestion("Practice 1", "A 5.00 kg object is attached to a rope. What is the tension in the rope if the object is travelling at 6.0 m/s in a circle with a radius of 4.50 m?", false, ["N", "40"]),
        new NumQuestion("Practice 2", "If a centripetal force of 80.0 N causes a 6.00 kg object to travel in a circle once every 0.75 s, what is the radius of the circle? What is the speed of the object?", false, ["m", "0.19"], ["m/s", "1.6"]),
        new NumQuestion("Practice 3", "A force of 45.0 N causes an object to travel in a circle with a diameter of 7.50 m with a frequency of 0.60 Hz. What is the mass of the object?", false, ["kg", '0.84']),
        new NumQuestion("Practice 4", "An object rotates around a circle of radius 4.75 m. If the object completes 15 cycles in 35 s, what is the centripetal acceleration?", false, ["m/s^2", '34']),
        new NumQuestion("Assignment 1", "What is the centripetal acceleration of a small girl sitting on the outer edge of a merry-go-round which has a radius of 5.0 m an completes one revolution every 5.0 seconds?", false, ["m/s^2", "7.9"]),
        new NumQuestion("Assignment 2", "An airplane flies in a horizontal circle of radius 1000 m. If its centripetal acceleration is 25 m/s2, how long does it take to complete one circuit?", false, ["s", "40"]),
        new NumQuestion("Assignment 3", "If a 7.95 kg object requires 5.00 minutes to complete 25 revolutions around a circle with radius 19.5 m, what is the centripetal force required?", false, ["N", "43"]),
        new NumQuestion("Assignment 4", "A string can exert a 4.0 N force without breaking. The string is used to whirl a 0.75 kg mass in a horizontal circle with a radius of 0.85 m. What is the minimum time to complete one revolution without breaking the string?", false, ["s", "2.5"]),
        new NumQuestion("Assignment 5", "The moon orbits the earth at a distance of 3.9 x 10^8 m. The moon requires 27.3 days to complete its orbit. What is the centripetal acceleration experienced by the moon?", false, ["* 10^-3 m/s^2", "2.8"]),
        new NumQuestion("Assignment 6", "Europa is a moon of the planet Jupiter. Europa requires 3.551 days to orbit Jupiter at a distance of 6.71 x 10^8 m. If the mass of Europa is 4.88 x 10^22 kg, what is the centripetal force exerted on Europa by Jupiter?", false, ["N", "1.37"]),
        new NumQuestion("Assignment 7", "A 1500 kg car enters a curve with a radius of 120 m. If the frictional force between the tires and the road is 4500 N, with what maximum speed could the car enter the curve without slipping off the road?", false, ["m/s", "19.0"]),
        new NumQuestion("Assignment 8", "An electron (m = 9.11 x 10^-31 kg) moves in a circle whose radius is 2.00 x 10^-2 m. If the force acting on the electron is 4.60 x 10^-14 N, what is the speed of the electron?", false, ["* 10^7 m/s", "3.18"]),
        new NumQuestion("Assignment 9AB", "An athlete whirls a 3.7 kg shot-put in a horizontal circle with a radius of 0.90 m. If the period of rotation is 0.30 s, What is the speed of the shot-put when released? What is the centripetal force acting on the shot-put?", false, ["m/s", "19"], ["* 10^3 N", "1.5"]),
        new NumQuestion("Assignment 9C", "An athlete whirls a 3.7 kg shot-put in a horizontal circle with a radius of 0.90 m. If the period of rotation is 0.30 s, How far would the shot-put travel horizontally if it is released 1.2 m above the level ground?", false, ["m", "9.3"]),
        new NumQuestion("Assignment 10", "A 932 kg car is travelling around an unbanked curve that has a radius of 82.0 m. What is the maximum speed that this car can round this curve if: the coefficient of friction is 0.950? The coefficient of friction is 0.400?", false, ["m/s", "27.6"], ["m/s", "17.9"]),
        new NumQuestion("Assignment 11", "A boy is riding a merry-go-round at a distance of 7.00 m from its center. The boy experiences a centripetal acceleration of 7.50 m/s^2. What centripetal acceleration is experienced by another person who is riding at a distance of 3.00 m from the center?", false, ["m/s^2", "3.21"]),
        new NumQuestionIMG("Assignment 12", "A space station is rotating to create artificial gravity, as the drawing indicates. The rate of rotation is chosen so the outer ring (rA = 2150 m) simulates the acceleration due to gravity on the surface of Venus (8.62 m/s^2). How long does it take the space station to spin once on its axis? What should be the radius rB, so the inner ring simulates the acceleration of gravity on the surface of Mercury (3.63 m/s^2)?", false, "images/L19/1.png", ["s", "99.2"], ["m", "905"]),
    ], true],
    // Lesson 20
    [[
        new NumQuestion("Example 1", "A 1.8 kg object is swung from the end of a 0.50 m string in a vertical circle. If the time of revolution is 1.2 s, what is the tension in the string at the top of the circle? at the bottom of the circle?", false, ["N", "7.0"], ["N", "42"]),   
        new NumQuestion("Example 2", "An object is swung in a vertical circle with a radius of 0.85 m. What is the minimum speed of the object so that it remains in circular motion?", false, ["m/s", "2.9"]),
        new NumQuestion("Practice 1", "Mr. Licht is rotating a pail of water with a mass of 2.00 kg in a vertical circle. Mr. Licht’s arm is 70 cm long. If the pail has a speed of 3.00 m/s, what is the tension in Mr. Licht’s arm: At the top of the swing? At the bottom of the swing?", false, ["N", "6.1"], ["N", "45"]),
        new NumQuestion("Practice 2", "What is the minimum speed required so that a roller coaster car will safely go around a vertical loop which has a radius of 5.0 m?", false, ["m/s", "7.0"]),
        new NumQuestion("Assignment 2", "You are riding your bike on a track that forms a vertical circular loop. If the diameter of the loop is 7.0 m, how fast would you have to be travelling when you reached the top of the loop so that you would not fall? ", false, ["m/s", "5.9"]),
        new NumQuestion("Assignment 3", "You are rotating a bucket of water in a vertical circle. Assuming that the radius of the rotation of the water is 0.95 m, what is the minimum velocity of the bucket at the top of its swing if the water is not to spill? ", false, ["m/s", "3.1"]),
        new NumQuestion("Assignment 4", "A student has a weight of 655 N. While riding on a roller-coaster this same student has an apparent weight of 1.96 x 10^3 N at the bottom of the dip that has a radius of 18.0 m. What is the speed of the roller-coaster?", false, ["m/s", "18.8"]),
        new NumQuestion("Assignment 5", "A string requires a 186 N force in order to break. A 1.50 kg mass is tied to this string and whirled in a vertical circle with a radius of 1.90 m. What is the maximum speed that this mass can be whirled without breaking the string?", false, ["m/s", "14.7"]),
        new NumQuestion("Assignment 6", "A 2.2 kg object is whirled in a vertical circle whose radius is 1.0 m. If the time of one revolution is 0.97 s, what is the tension in the string (assume uniform speed) when it is at the top? when it is at the bottom?", false, ["N", "71"], ["* 10^2 N", "1.1"]),
    ], true],
    // Lesson 21
    [[
        new NumQuestion("Example 1", "What is the gravitational force of attraction between a tanker (m = 50000 kg) and a super-tanker (m = 150000 kg) when they are separated by a distance of 500 m?", false, ["* 10^-6 N", "2.00"]),   
        new NumQuestion("Example 2", "Two very dense objects have masses of 5.0 x 10^8 kg and 6.0 x 10^8 kg. If the force of attraction between them is 500 N, what is the separation distance between their centres of mass?", false, ["* 10^2 m", "2.0"]),
        new NumQuestion("Example 3", "A person with a mass of 100 kg has a weight of 981 N on the surface of the Earth. What is the person’s weight at a height of 12000 m above the surface of the Earth?", false, ["N", "979"]),
        new NumQuestion("Example 4", "If the attractive force between two masses is 9.0 x 10^-6 N and the distance between them is 50 m, what is the mass of each object if one is three times more massive than the other?", false, ["* 10^4 kg", "1.1"], ["* 10^4 kg", "3.2"]),
        new NumQuestion("Example 5", "When two masses are set a certain distance apart, a force of 8.0 N exists. What is the force between the two masses if the distance between them is doubled and one of the masses is tripled?", false, ["N", "6.0"]),
        new NumQuestion("Practice 1", "Bob (mass = 85.0 kg) and Jane (mass = 60.0 kg) are sitting 1.85 m apart. What is the gravitational force of attraction between them?", false, ["* 10^-8N", "9.94"]),
        new NumQuestionIMG("Practice 2", "What is the force of attraction between Mercury and the Sun. (3 sigdigs)", false, "images/L21/1.png", ["* 10^22 N", "1.29"]),
        new NumQuestion("Practice 3", "The force between two objects is measured to be 45.0 N. What is the force if one of the masses is tripled, the other doubled and the distance between them is halved?", false, ["* 10^3 N", "1.08"]),
        new NumQuestion("Assignment 1", "What is the force of gravitational attraction between two 1.8 x 10^8 kg super-tankers moored so that their centres are located 94 m apart?", false, ["* 10^2 N", "2.4"]),
        new NumQuestionIMG("Assignment 2", "A woman standing on the surface of the Earth, 6.38 x 10^6 m from its centre, has a mass of 50.0 kg. If the mass of the Earth is 5.98 x 10^24 kg, what is the force of gravity on the woman?", false, "images/L21/1.png", ["* 10^2 N", "4.9"]),
        new NumQuestion("Assignment 3", "The force of gravitational attraction between two masses is 36 N. What will be the force if one mass is doubled and the distance between them is tripled? ", false, ["N", "8.0"]),
        new NumQuestionIMG("Assignment 4", "If the force of gravity on a mass is 600 N on Earth, what will it be on Mars?", false, "images/L21/1.png", ["* 10^2 N", "2.2"]),
        new NumQuestion("Assignment 5", "A 70 kg boy stands 0.10 m from a 60 kg girl. Calculate the gravitational force between them.", false, ["*10^-5 N", "2.8"]),
        new NumQuestion("Assignment 6", "Two metal spheres each have mass of 3.0 x 10^8 kg. If the gravitational force of attraction between them is 37.5 N, what is the distance between their centers of mass?", false, ["* 10^2 m", "4.0"]),
        new NumQuestion("Assignment 7", "Two masses are set 500 m apart. One mass has 5 times the mass of the other. If the gravitational force of attraction between them is 333.5 N, what is the magnitude of each mass? (small than big)", false, ["* 10^8 kg", "5.0"], ["*10^9 kg", "2.5"]),
        new NumQuestionIMG("Assignment 8", "If you were to place yourself between the moon and the Earth, how far away from the Earth would you have to be in order that the net force on you is zero? (3 SigDigs)", true, "images/L21/1.png", ["*10^8 m", "3.51"]),
    ], true],
    // lesson 22
    [[
        new NumQuestionIMG("Example 1", "What is the gravitational field strength on the surface of Neptune? (4 SigDigs)", false, "images/L21/1.png", ["N/kg", "11.17"]),
        new NumQuestion("Example 2", "What is the gravitational field strength at a distance of 1.914 x 10^7 m above the surface of the Earth? If a person weighs 400 N on the surface, what would he weigh at this distance?", false, "images/L21/1.png", ["N/kg", "0.613"], ["N", "25"]),
        new NumQuestion("Practice 1", "What is the gravitational field strength on the surface of Earth? What is the gravitational field strength 100 km above the surface of Earth? ", false, ["m/s^2", "9.81"], ["m/s^2", "9.53"]),
        new NumQuestion("Practice 2", "You are on a planet whose radius is known to be about 4500 km. You then perform the following experiment: You drop a rock from a height of 10.0 m and measure the time of its fall to be 2.65 s. What is the mass of the planet?", false, ["* 10^23 kg", "8.65"]),
        new NumQuestionIMG("Assignment 1", "Calculate the acceleration due to gravity on Jupiter.", false, "images/L21/1.png", ["m/s^2", "24"]),
        new NumQuestionIMG("Assignment 2", "If a man weighs 780 N on Earth, what would he weigh on the moon?", false, "images/L21/1.png", ["N", "129"]),
        new NumQuestionIMG("Assignment 3", "The instrument payload of a rocket weighs 890 N on Earth. What does it weigh at an altitude of 25520 km above the surface of the Earth? ", false, "images/L21/1.png", ["N", "35.6"]),
        new NumQuestionIMG("Assignment 4", "Calculate the acceleration due to gravity on Saturn. How much will a 60.0 kg man weigh on the surface of Saturn?", false, "images/L21/1.png", ["m/s^2", "10.4"], ["N", "624"]),
        new NumQuestionIMG("Assignment 5", "At the top of Mt. Robson in British Columbia, a 7.50 kg turkey weighs 72.6 N. Calculate the magnitude of the gravitational field strength at this location. ", false, "images/L21/1.png", ["N/kg", "9.68"]),
    ], true],
    // lesson 23
    [[
        new NumQuestionIMG("Example 1", "What is the speed of orbit for a satellite orbiting Saturn if the radius of orbit is 6.43 x 10^7 m?", false, "images/L21/1.png", ["* 10^4 m/s", "2.43"]),
        new NumQuestion("Example 2", "An artificial satellite in orbit around the Earth has a speed of 7.6 x 10^3 m/s. How far above the Earth’s surface is the satellite orbiting?", false, ["* 10^5 m", "5.3"]),
        new NumQuestion("Example 3", "The average distance from the centre of the Earth to the centre of the Moon is 3.85 x 10^8 m? What is the period of orbit of the Moon around the Earth?", false, ["days", "27.5"]),
        new NumQuestion("Example 4", "At what height above the surface of the Earth must a satellite be positioned in order to have a period of orbit of 10 h?", false, ["* 10^7 m", "1.7"]),
        new NumQuestion("Practice 1", "What is the speed required to place an object in orbit just above the Earth’s surface? (3SD)", false, ["* 10^3 m/s", "7.91"]),
        new NumQuestion("Practice 2", "The space shuttle orbits the Earth at an average altitude of 500 km. What is its period of orbit?", false, ["* 10^3 s", "5.67"]),
        new NumQuestion("Practice 3", "If the average distance from the Sun to the Earth is 1.49 x 10^11 m, what is the mass of the Sun?", false, ["* 10^30 kg", "1.97"]),
        new NumQuestion("Practice 4", "A geosynchronous orbit is where a satellite maintains the same position above a certain point on the Earth's surface. At what height above the Earth's surface must a satellite be positioned in order to have a geosynchronous orbit? (3SD)", false, ["* 10^7 m", "3.59"]),
        new NumQuestion("Assignment 1", "A satellite is located 250 km above the surface of the Earth. How long would it take for the satellite to complete one orbit of the Earth?", false, ["* 10^3 s", "5.36"]),
        new NumQuestionIMG("Assignment 2", "Ariel is a moon of Uranus. If Ariel orbits Uranus at a radius of 1.91 x 10^5 km, what is the period of rotation for Ariel around Uranus (in Earth days)?", false, "images/L21/1.png", ["* 10^5 s", "2.16"]),
        new NumQuestionIMG("Assignment 3", "Calculate the height above the Earth's surface for a satellite with a speed of 7.60 * 10^3 m/s?", "images/L21/1.png", false, ["* 10^5 m", "5.26"]),
        new NumQuestionIMG("Assignment 4", "If the moon is about 3.80 x 10^8 m away and its period of orbit is 2.36 x 10^6 s, calculate the speed of the moon in its orbit around the Earth. Using this result, calculate the mass of the Earth. ", false, "images/L21/1.png", ["* 10^24 kg", "5.83"]),
        new NumQuestion("Assignment 5", "The Earth is 1.49 x 10^11 m away from the Sun and it requires 365.25 days to complete one orbit. Calculate the speed of the Earth in its orbit around the Sun. Calculate the mass of the Sun.", false, ["* 10^4 m/s", "2.97"], ["* 10^30 kg", "1.97"]),
        new NumQuestionIMG("Assignment 6", "If a small planet were located 8 times as far as the Earth's distance from the Sun, what would be its period in Earth years? (3SD)", false, "images/L21/1.png", ["Earth years", "22.5"]),
        new NumQuestion("Assignment 7", "If a planet orbiting the Sun had a period of 7.82 x 10^9 s, how far is the planet from the Sun?", false, "images/L21/1.png", ["* 10^12 m", "5.87"]),
        new NumQuestionIMG("Assignment 8", "In order for the Enterprise to use its transporter it must be in synchronous orbit over the beam-down point. What height above the planet Mars must the Enterprise be for a synchronous orbit? (3SD)", false, "images/L21/1.png", ["* 10^7 m", "1.69"]),
        new NumQuestionIMG("Assignment 9", "An asteroid has a mean radius of orbit of 4.8 x 10^11 m. What is its orbital period around the sun?", false, "images/L21/1.png", ["* 10^8 s", "1.8"]),
        new NumQuestionIMG("Assignment 10", "A spy satellite is located one Earth radius above the surface of the Earth. What is its period of revolution? (3SD)", false, "images/L21/1.png", ["* 10^4 s", "1.43"]),
        new NumQuestionIMG("Assignment 11", "It is estimated that the Sun is 2.7 x 10^20 m away from the centre of the Milky Way Galaxy. If the period of revolution for the galaxy is about 200 million years, what is the speed (in km/h) of the Sun going around the center of the galaxy?", false, "images/L21/1.png", ["* 10^5 km/h", "9.7"]),
    ], true],
    // Lesson 24
    [[
        new NumQuestion("Example 1", "What is the period and frequency of a vibrating spring that requires 4 minutes and 40 seconds to complete 500 complete oscillations? (2SD)", false, ["s", "0.56"], ["Hz", "1.8"]),
        new NumQuestion("Example 2", "If a pendulum is 80.0 cm long, what is its period and frequency of vibration?", false, ["s", "1.79"], ["Hz", "0.557"]),
        new NumQuestion("Example 3", "On the planet called Trathelmadore, Billy found that a 50.0 cm pendulum completed 20 swings in 33.6 s. What is the acceleration of gravity on Trathelmadore?", false, ["m/s^2", "6.99"]),
        new NumQuestion("Practice 1", "What is the period and frequency for a 0.75 m pendulum? ", false, ["s", "1.7"], ["Hz", "0.58"]),
        new NumQuestion("Practice 2", "A pendulum requires 56.74 s to swing 20 times. What is the period, frequency, and length of the pendulum? (3SD)", false, ["s", "2.84"], ["Hz", "0.352"], ["m", "2.00"]),
        new NumQuestion("Practice 3", "On the moon, a simple experiment was done to measure the acceleration of gravity. The period for a 1.0 m long pendulum was measured and found to be 4.94 s. What is the acceleration due to gravity on the moon?", false, ["m/s^2", "1.6"]),
        new NumQuestion("Assignment 2", "A pendulum swings 400 times in 8.0 minutes and 20 seconds. What is its frequency and period of vibration?", false, ["Hz", "0.80"], ["s", "1.3"]),
        new NumQuestion("Assignment 3", "If a pendulum is 135 cm long: What is the period of the pendulum? How many swings will it complete in 2.5 minutes?", false, ["s", "2.3"], ["", "64"]),
        new NumQuestion("Assignment 4", "If a pendulum takes 4.0 minutes to swing 400 times, what is the length of the pendulum?", false, ["m", "0.089"]),
        new NumQuestion("Assignment 5", "What is the acceleration due to gravity on a planet where an 80 cm pendulum requires 162.15 s to swing 50 times? ", false, ["m/s^2", "3.0"]),
        new NumQuestion("Assignment 6", "A pendulum swings with a period of 5.00 s on the Moon, where the gravitationalfield strength is 1.62 m/s^2. What is the pendulum's length?", false, ["m", "1.03"]),
        new NumQuestion("Assignment 7", "An inquisitive student brings a pendulum aboard a jet plane. The plane is in level flight at an altitude of 12.31 km. What period do you expect for a 20.0 cm pendulum?", false, ["s", "0.898"]),
    ], true],
    // Lesson 25
    [[
        new NumQuestion("Example 1", "In a tire pressure gauge, the air in the tire pushes against a spring when the gauge is attached to the tire valve as in the figure above. If the spring constant is 320 N/m and the bar indicator extends 2.0 cm, what force does the air in the tire apply to the spring?", false, ["N", "6.4"]),
        new NumQuestion("Example 2", "When a 2.45 kg mass is vertically hung from a spring, the spring stretches by 12.4 cm. What is the spring constant of the spring?", false, ["N/m", "194"]),
        new NumQuestion("Example 3", "What is the period of a vibrating spring (spring constant = 100 N/m) if a mass of 5.0 * 10^2 g is hung from the spring?", false, ["s", "0.44"]),
        new NumQuestion("Practice 1", "A 500.0 g mass is vertically hung from a spring. If the spring stretches by 22.75 cm, what is the spring constant?", false, ["N/m", "21.56"]),
        new NumQuestion("Practice 2", "An ideal spring requires 16.5 s to vibrate 25 times when a 200 g mass is attached to the spring. What is the spring constant?", false, ["N/m", "18.1"]),
        new NumQuestion("Assignment 1", "If a 500 g mass causes a vertical spring to stretch 79 cm, what is the spring constant?", false, ["N/m", "6.2"]),
        new NumQuestion("Assignment 2", "Five people with a combined mass of 275.0 kg get into a car. The car's four springs are each compressed a distance of 5.00 cm. Assuming the weight is distributed evenly to each spring, determine the spring constant of the springs.", false, ["* 10^4 N/m", "1.35"]),
        new NumQuestion("Assignment 3", "What mass must be attached to a vertical spring with a spring constant of 85 N/m in order to cause it to stretch by 95 cm?", false, ["kg", "8.2"]),
        new NumQuestion("Assignment 4", "Two springs are hooked together and one end is attached to a ceiling. Spring A has a spring constant of 25 N/m, and spring B has a spring constant of 60 N/m. A mass weighing 40.0 N is attached to the free end of the spring system to pull it downward from the ceiling. What is the total displacement of the mass? ", false, ["m", "-2.3"]),
        new NumQuestion("Assignment 6", "A 4.5 kg mass is hung from a spring. If the force constant on the spring is 45 N/m: What is the period of vibration for the spring? How long will it take for the spring to vibrate 150 times?", false, ["s", "2.0"], ["s", "298"]),
        new NumQuestion("Assignment 7", "A 1650 g mass is hung from a spring. If the spring vibrates 300 times in 8.00 minutes, what is the force constant of the spring?", false, ["N/m", "25.4"]),
        new NumQuestion("Assignment 8", "When a 5.75 kg mass is hung from a spring it stretches by 95.0 cm. If the spring is then set into vibration, how long will it take the system to vibrate 500 times?", false, ["s", "977"]),
    ], true],
    // lesson 26
    [[
        new MultipleChoiceQuestion("Custom 1", "Which of the following is not a form of mechanical energy", false, ["Kinetic Energy", false], ["Gravitational Potential Energy", false], ["Electric Potential Energy", true], ["Elastic Potential Energy", false]),
        new NumQuestion("Example 1", "A workman exerts a horizontal force of 30.0 N to push a 12.0 kg table 4.00 m across a level floor at constant speed. Calculate the work done", false, ["Nm", "120"]),
        new NumQuestion("Example 2", "Find the work done in pulling a luggage carrier by a 45.0 N force at an angle of 50° for a distance of 75.0 m.", false, ["* 10^3 Nm", "2.2"]),
        new NumQuestion("Example 3", "A weight lifter is bench-pressing a barbell whose mass is 110 kg. He raises the barbell a distance of 0.65 m above his chest and then lowers the barbell the same distance. The weight is raised and lowered at a constant velocity. Determine the work done on the barbell by the lifter when (a) the barbell is lifted and (b) when it is lowered. (c) What was the net work done (2SD)?", false, ["* 10^2 Nm", "7.0"], ["* 10^2 Nm", "-7.0"], ["Nm", "0.0"]),
        new NumQuestion("Example 4", "A 50.0 kg crate is being dragged across a floor by a force of 200 N at an angle of 40.0° from the horizontal. The crate is dragged a distance of 5.00 m and the frictional force is 60.0 N. What is the work done on the crate by the applied force? What is the work done on the crate by the frictional force? What is the net work done on the crate?", false, ["Nm", "766"], ["Nm", "300"], ["Nm", "466"]),
        new NumQuestion("Example 5", "A 20 kg object is lifted from a table to a vertical height of 0.50 m above the table. What is the gravitational potential energy of the object with respect to the table?", false, ["J", "98"]),
        new NumQuestion("Example 6", "An archer draws an arrow back by exerting an average force of 90 N on the string. If the string is drawn back 80 cm, what is the elastic potential energy of the bow string?", false, ["J", "72"]),
        new NumQuestion("Example 7", "A 50 N force stretches a spring by 0.75 m. What is the spring constant and how much energy is stored in the spring?", false, ["N/m", "67"], ["J", "19"]),
        new NumQuestion("Example 8", "What is the kinetic energy of a 40 kg object that is traveling at 50 m/s?", false, ["kJ", "50"]),
        new NumQuestion("Example 11", "How much work can a 1.5 kW kettle do in 10 minutes?", false, ["MJ", "0.90"]),
        new NumQuestion("Example 12", "A car driven at 100 km/h is overcoming a frictional force of 3200 N. How much power is being produced? What is the horsepower?", false, ["kW", "88.9"], ["h.p.", "105"]),
        new NumQuestion("Practice 1", "A 600 kg object is dragged 40 m over a surface that has a coefficient of friction equal to 0.60. How much work against friction was done? ", false, ["* 10^5 J", "1.4"]),
        new NumQuestion("Practice 2", "How much work is done in carrying a 40 kg object 50 m horizontally? ", false, ["Nm", "0.0"]),
        new NumQuestion("Practice 3", "A student using a push broom exerts a force of 20 N while pushing the broom 30 m across the floor. If the broom handle is set at 70° to the floor, how much work is done?", false, ["* 10^2 J", "2.1"]),
        new NumQuestion("Practice 4", "What is the kinetic energy of a 1200 kg car traveling at 60 km/h?", false, ["* 10^5 J", "1.7"]),
        new NumQuestion("Practice 5", "A spring with a spring constant of 150 N/m has 4.69 J of stored energy. By how much has the spring been compressed?", false, ["m", "0.250"]),
        new NumQuestion("Practice 6", "What power is consumed in lifting a 500 kg object over a vertical distance of 500 m in a 30 minute time period?", false, ["kW", "1.4"]),
        new NumQuestionIMG("Work 1", "Given the following force-displacement graph, determine the work done.", false, "images/L26/1.png", ["J", "56"]),
        new NumQuestionIMG("Work 1", "Given the following force-displacement graph, determine the work done.", false, "images/L26/2.png", ["J", "-26"]),
        new NumQuestion("Work 2", "The cable of a large crane applies a force of 2.2 x 10^4 N to a demolition ball as the ball is lifted vertically a distance of 7.6 m. How much work does this force do on the ball?", false, ["* 10^5 J", "1.7"]),
        new NumQuestion("Work 3", "Fred is moving into an apartment at the beginning of the school year. Fred weighs 685 N and his belongings weigh 915 N. How much work does the elevator do in lifting Fred and his belongings up five stories (15.2 m)? How much work does the elevator do on Fred on the downward trip? ", false, ["* 10^4 J", "2.43"], ["* 10^4 J", "-1.04"]),
        new NumQuestionIMG("Work 4", "The drawing below shows a boat being pulled by two locomotives through a two kilometre canal. The tension in each cable is 5.00 x 10^3 N and theta = 20°. What is the work done on the boat by the locomotives? ", false, "images/L26/3.png", ["* 10^7 J", "1.9"]),
        new NumQuestion("Work 5", "A 2.40 x 10^2 N force, acting at 20° above the surface, is pulling on an 85.8 kg refrigerator across a horizontal floor. The frictional force opposing the motion is 1.67 x 10^2 N and the refrigerator is moved a distance of 8.00 m. Find the work done by the applied force and the work done by the frictional force.", false, ["kJ", "1.8"], ["kJ", "1.3"]),
        new NumQuestion("Work 6", "A 100 kg crate is pulled across a horizontal floor by a force P that makes a 30.0° angle with the floor. If the frictional force is 196 N, what would be the magnitude of P so that the net work is zero? ", false, ["N", "266"]),
        new NumQuestionIMG("Work 7", "A window washer on a scaffold is hoisting the scaffold up the side of a skyscraper by pulling down on a rope. The combined mass of the window washer and the scaffold is 155 kg. If the scaffold is pulled up at a constant velocity through a distance of 120 m: How much work was done? What force must the window washer supply? How many meters of rope are required, assuming that the pulleys touch at the top?", false, "images/L26/4.png", ["* 10^5 J", "1.82"], ["N", "507"], ["m", "360"]),
        new NumQuestion("Energy 1", "A 65.0 kg jogger is running at a speed of 5.30 m/s. What is the jogger’s kinetic energy?", false, ["J", "913"]),
        new NumQuestion("Energy 2", "Relative to the ground, what is the energy of a 55.0 kg person at the top of the Sear's Tower in Chicago, which is 443 m high? ", false, ["kJ", "239"]),
        new NumQuestion("Energy 3", "A 75.0 kg skier rides a 2830 m long chair lift to the top of a mountain. The lift makes an angle of 14.6° with the horizontal. What is the change in the skier's potential energy?", false, ["kJ", "525"]),
        new NumQuestion("Energy 4", "A spring is compressed 0.045 m by a 120 N force. What is the spring constant and how much energy is in the spring?", false, ["* 10^3 N/m", "2.7"], ["J", "2.7"]),
        new NumQuestion("Energy 5", "A spring with a spring constant of 25 N/m is compressed by 9.6 cm. How much energy is in the spring?", false, ["J", "0.12"]),
        new NumQuestion("Power 2", "What is the power output of a machine which applies a force of 2.50 x 10^4 N for 12.0 s in pulling a block through 60.0 m? ", false, ["kW", "125"]),
        new NumQuestion("Power 3", "A machine has an output power of 10.0 kW. How long would it take for the machine to raise a 5000 kg load through a height of 2.5 m?", false, ["s", "12"]),
        new NumQuestion("Power 4", "Water flows over a section of Niagara Falls at the rate of 1.2 x 10^6 kg/s and falls 50.0 m. How much power is generated by the falling water? ", false, ["* 10^8 W", "5.9"]),
        new NumQuestion("Power 5", "A machine operates at a power consumption of 3.5 kW for ten minutes. In the process it produces 500 kJ of waste heat energy. How much net work was done?", false, ["MJ", "1.6"]),
    ], true],
    // lesson 27
    [[
        new NumQuestion("Example 1", "A 50 kg object falls 490.5 m. What is the speed of the object just before impact with the ground?", false, ["m/s", "98"]),
        new NumQuestion("Example 2", "A snowmobile driver with a mass of 100 kg traveling at 15.0 m/s slams into a snow drift. If the driver sinks 0.50 m into the snow drift before stopping, what is the retarding force applied by the snow drift?", false, ["* 10^4 N", "2.3"]),
        new NumQuestion("Example 3", "A 5.0 kg object is thrown vertically down from the top of a 50.0 m tower with a speed of 15.0 m/s. What is the speed of the object at the bottom of the tower just before it hits the ground?", false, ["m/s", "35"]),
        new NumQuestion("Example 4", "A 5.0 gram bullet enters a wooden block at 350 m/s and exits the 20 cm wide block at 150 m/s. What was the force applied to the bullet by the block?", false, ["* 10^3 N","1.25"]),
        new NumQuestion("Example 5", "A 25 kg object resting at the top of a 15 m high inclined plane begins to slide down the plane. At the bottom of the plane the object has a speed of 14.0 m/s. How much heat energy was produced? If the incline is 35.0 m long, what is the frictional force?", false, ["* 10^3 J", "1.2"], ["N", "35"]),
        new NumQuestion("Example 6", "A toy car with mass 348 g is pushed up against a compression spring. The spring is compressed by 5.3 cm. When the car is released its final speed is 7.3 m/s. What is the spring constant for the compression spring?", false, ["* 10^3 N/m", "6.6"]),
        new NumQuestionIMG("Practice 1", "A motorcycle rider is trying to leap across the canyon as shown in the figure by driving horizontally off the cliff. When it leaves the cliff, the cycle has a speed of 38.0 m/s. Ignoring air resistance, find the speed with which the cycle strikes the ground on the other side. ", false, "images/L27/1.png", ["m/s", "46.2"]),
        new NumQuestionIMG("Practice 2", "A 6.00 m rope is tied to a tree limb and used as a swing. A person starts from rest with the rope held in a horizontal orientation, as in the figure. Ignoring friction and air resistance, determine how fast the person is moving at the lowest point on the circular arc of the swing.", false, "images/L27/2.png", ["m/s", "10.8"]),
        new NumQuestion("Practice 3", "One of the fastest roller coasters (2000 kg) in the world is the Magnum XL - 200 at Cedar Point Park in Sandusky, Ohio. This ride includes an initial vertical drop of 59.3 m. Assume that the roller coaster has a speed of nearly zero as it crests the top of the hill. If the track was frictionless, find the speed of the roller coaster at the bottom of the hill. The actual speed of the roller coaster at the bottom is 32.2 m/s. If the length of track is 125 m, what is the average frictional force acting on the roller coaster?", false, ["m/s", "34.1"], ["* 10^3 N", "1.01"]),
        new NumQuestionIMG("Assignment 1", "An 80.0 kg box is pushed up a frictionless incline as shown in the diagram. How much work is done on the box in moving it to the top?", false, "images/L27/3.png", ["kJ", "5.49"]),
        new NumQuestion("Assignment 2", "A 75 g arrow is fired horizontally. The bow string exerts an average force of 65 N on the arrow over a distance of 0.90 m. With what speed does the arrow leave the bow string?", false, ["m/s", "39"]),
        new NumQuestion("Assignment 3", "In the high jump, the kinetic energy of an athlete is transformed into gravitational potential energy. With what minimum speed must the athlete leave the ground in order to lift his center of mass 2.10 m and cross the bar with a speed of 0.80 m/s?", false, ["m/s", "6.5"]),
        new NumQuestion("Assignment 4", "A 50.0 kg pole vaulter running at 10.0 m/s vaults over the bar. Assuming that the vaulter's horizontal component of velocity over the bar is 1.00 m/s and disregarding air resistance, how high was the jump?", false, ["m", "5.05"]),
        new NumQuestion("Assignment 5", "If a 4.00 kg board skidding across the floor with an initial speed of 5.50 m/s comes to rest, how much thermal energy is produced?", false, ["J", "60.5"]),
        new NumQuestionIMG("Assignment 6", "A roller coaster is shown in the drawing. Assuming no friction, calculate the speed at points B, C, D, assuming it has a speed of 1.80 m/s at point A. ", false, "images/L27/4.png", ["m/s", "24.3"], ["m/s", "10.1"], ["m/s", "18.9"]),
        new NumQuestion("Assignment 7", "A water skier lets go of the tow rope upon leaving the end of a jump ramp at a speed of 14.0 m/s. As the drawing indicates, the skier has a speed of 13.0 m/s at the highest point of the jump. Ignoring air resistance, determine the skier’s height H above the top of the ramp at the highest point. ", false, ["m", "1.38"]),
        new NumQuestion("Assignment 8", "A roller coaster vehicle with occupants has a mass of 2.9 x 10^3 kg. It starts at point A with a speed of 14 m/s and slides down the track through a vertical distance of 25 m to B. It then climbs in the direction of point C which is 36 m above B. An interesting feature of this roller coaster is that due to cost-over-runs and poor planning, the track ends at point C. The occupant is the chief design engineer of the roller coaster ride. Estimate the speed of the vehicle at point B and then determine whether the fellow survives the ride. ", false, ["m/s", "26"]),
        new NumQuestion("Assignment 9", "The speed of a hockey puck (mass = 100.0 g) decreases from 45.00 m/s to 42.68 m/s in coasting 16.00 m across the ice. How much thermal energy was produced? What frictional force was acting on the puck?", false, ["J", "10.17"], ["N", "0.6357"]),
        new NumQuestion("Assignment 11", "A 45.0 kg box initially at rest slides from the top of a 12.5 m long incline. The incline is 5.0 m high at the top. If the box reaches the bottom of the incline at a speed of 5.0 m/s, what is the force of friction on the box along the incline?", false, ["* 10^2 N", "1.3"]),
        new NumQuestionIMG("Assignment 12", "For the pulley system illustrated to the right, when the masses are released, what is the final speed of the 12 kg mass just before it hits the floor?", true, "images/L27/5.png", ["m/s", "7.0"]),
    ], true],
    // lesson 28
    [[
        new NumQuestion("Example 1", "Determine the acceleration of a 0.250 kg pendulum bob as it passes through an angle of 16° to the right of the equilibrium point.", false, ["m/s^2 [right]", "-2.70"]),
        new NumQuestion("Example 2", "A 2.0 kg mass on a string is pulled so that the mass is 1.274 m higher than at the equilibrium point. When it is released: What is the maximum speed that the pendulum will have during its swing? What is the speed of the pendulum when it is half way down from its maximum height?", false, ["m/s", "5.0"], ["m/s", "3.54"]),
        new NumQuestion("Example 3", "A 0.724 kg mass is oscillating on a horizontal frictionless surface attached to a spring (k = 8.21 N/m). What is the mass's displacement when its instantaneous acceleration is 4.11 m/s^2 [left]?", false, ["m [right]", "0.362"]),
        new NumQuestion("Example 4", "A 0.40 kg mass vibrates at the end of a horizontal spring along a frictionless surface. If the spring’s force constant is 55 N/m and the maximum displacement (amplitude) is 15 cm, what is the maximum speed of the mass as it passes through the equilibrium point?", false, ["m/s", "1.8"]),
        new NumQuestion("Practice 1", "A pendulum bob (m = 250.0 g) experiences a restoring force of 0.468 N. Through what angle is it displaced?", false, ["°", "11.0"]),
        new NumQuestion("Practice 2", "A 0.50 kg pendulum is pulled back and released. When the height is 0.60 m above its equilibrium position its speed is 1.9 m/s. What is the maximum height of the pendulum?", false, ["m", "0.78"]),
        new NumQuestion("Practice 3", "A 2.60 g mass experiences an acceleration of 20.0 m/s^2 at a displacement of 0.700 m on a spring. What is k for this spring?", false, ["N/m", "0.0743"]),
        new NumQuestion("Practice 4", "A mass vibrates at the end of a horizontal spring (k = 125 N/m) along a frictionless surface reaching a maximum speed of 7.0 m/s. If the maximum displacement of the mass is 85.0 cm, what is the mass?", false, ["kg", "1.84"]),
        new NumQuestion("Assignment 3", "Determine the restoring force of a pendulum that is pulled to an angle of 12.0° left of the vertical. The mass of the bob is 300.0 g.", false, ["N [right]", "0.612"]),
        new NumQuestion("Assignment 4", "At what angle must a pendulum be displaced to create a restoring force of 4.00 N on a bob with a mass of 500.0 g?", false, ["°", "54.6"]),
        new NumQuestion("Assignment 5", "A 1.35 kg pendulum bob is hung from a 3.20 m string. When the pendulum is in motion its speed is 2.40 m/s when its height is 85.0 cm above the equilibrium point. What is the maximum speed of the pendulum? What is the period of vibration for the pendulum?", false, ["m/s", "4.74"], ["s", "3.59"]),
        new NumQuestion("Assignment 6", "A 2.50 kg pendulum bob is hung from a 2.75 m string. The pendulum is pulled back and released from a height h above the equilibrium point. If its maximum speed is 6.26 m/s what is h? What is the period of vibration for the pendulum?", false, ["m", "2.00"], ["s", "3.33"]),
        new NumQuestion("Assignment 7", "Tarzan swings on a 30.0 m long vine initially inclined at an angle of 37.0° from the vertical. What is his speed at the bottom of the swing if he does the following? starts from rest. pushes off with a speed of 4.00 m/s", false, ["m/s", "10.9"], ["m/s", "11.6"]),
        new NumQuestion("Assignment 9", "A mass of 3.08 kg oscillates on the end of a horizontal spring with a period of 0.323 s. What acceleration does the mass experience when its displacement is 2.85 m to the right?", false, ["* 10^3 m/s^2 [right]", "-1.08"]),
        new NumQuestion("Assignment 10", "A 4.0 kg mass vibrates at the end of a horizontal spring along a frictionless surface reaching a maximum speed of 5.0 m/s. If the maximum displacement of the mass is 11.0 cm, what is the spring constant? ", false, ["* 10^3 N/m", "8.3"]),
        new NumQuestion("Assignment 11", "An object vibrates at the end of a horizontal spring, spring constant = 18 N/m, along a frictionless horizontal surface. If the maximum speed of the object is 0.35 m/s and its maximum displacement is 0.29 m, what is the speed of the object when the displacement is 0.20 m?", false, ["m/s", "0.25"]),
        new NumQuestion("Assignment 12", "A 0.750 kg object vibrates at the end of a horizontal spring (k = 995 N/m) along a frictionless surface. The speed of the object is 2.50 m/s when its displacement is 0.145 m. What is the maximum displacement and speed of the object?", false, ["m", "0.160"], ["m/s", "5.84"]),
        new NumQuestion("Assignment 13", "A mass of 2.50 kg is attached to a horizontal spring and oscillates with an amplitude of 0.800 m. The spring constant is 40.0 N/m. Determine: the acceleration of the mass when it is at a displacement of +0.300 m. the maximum speed. the period.", false, ["m/s^2 [negative]", "4.80"], ["m/s", "3.20"], ["s", "1.57"]),
        new NumQuestion("Assignment 14", "A horizontal mass-spring system has a mass of 0.200 kg, a maximum speed of 0.803 m/s, and an amplitude of 0.120 m. What is the mass's position when its acceleration is 3.58 m/s^2 to the west?", false, ["m [east]", "0.0799"]),
        new NumQuestion("Assignment 15", "An object vibrates at the end of a horizontal spring, k = 18 N/m, along a frictionless horizontal surface. If the maximum speed of the object is 0.35 m/s and its maximum displacement is 0.29 m, what is the speed of the object when the displacement is 0.20 m?", false, ["m/s", "0.25"]),
    ], true],
    // lesson 29
    [[
        new NumQuestion("Example 1", "A series of waves with a wavelength of 2.5 m have a frequency of 50 Hz. What is the speed if the wave series?", false, ["m/s", "1.3"]),
        new NumQuestion("Example 2", "A wave series with a wavelength of 10 m has a speed of 300 m/s. What is the frequency of the waves?", false, ["Hz", "30"]),
        new MultipleChoiceQuestionIMG("Assignment 2a", "What point is a crest", false, "images/L29/1.png", ["A", false], ["B", true], ["C", false], ["D", false]),
        new MultipleChoiceQuestionIMG("Assignment 2b", "What point is a trough", false, "images/L29/1.png", ["A", false], ["B", false], ["C", false], ["D", true]),
        new MultipleChoiceQuestionIMG("Assignment 2c", "What point is 1 wavelength away from point C", false, "images/L29/1.png", ["E", false], ["F", false], ["G", true], ["H", false]),
        new MultipleChoiceQuestionIMG("Assignment 2d", "What point is a one half of a wavelength from point B", false, "images/L29/1.png", ["D", false], ["F", false], ["G", true], ["H", false]),
        new NumQuestionIMG("Assignment 2e", "What is the wavelength (1 square = 1 cm)", false, "images/L29/1.png", ["cm", "20"]),
        new NumQuestionIMG("Assignment 2f", "What is the amplitude (1 square = 1 cm)", false, "images/L29/1.png", ["cm", "6"]),
        new NumQuestionIMG("Assignment 2g", "If the frequency is equal to 40.0 Hz, what is the speed of the wave? (1 square = 1 cm)", false, "images/L29/1.png", ["cm/s", "800"]),
        new NumQuestion("Assignment 8", "For each of the following examples of periodic motion, determine the period and frequency: a metronome clicks 50 times in 15 s. a patient breathes 18 times in 30 s. a flywheel makes 300 revolutions in one minute. a cricket chirps 30 times in 15 s", false, ["s", "0.30"], ["Hz", "3.3"], ["s", "1.7"], ["Hz", "0.60"], ["s", "0.20"], ["Hz", "5.0"], ["s", "0.50"], ["Hz", "2.0"]),
        new MultipleChoiceQuestionIMG("Assignment 9", "People can actually use their bodies as particles in a medium to form a wave. In each of the diagrams, determine if the wave is transverse or longitudinal.", false, "images/L29/2.png", ["a: Longitudinal, b: Longitudinal", false], ["a: transverse, b: Longitudinal", true], ["a: Longitudinal, b: transverse", false], ["a: transverse, b: transverse", false]),
        new MultipleChoiceQuestion("Assignment 10a", "Which best matches Period", false, ["the motion of a pendulum", false], ["an S shape on its side", false], ["number of vibrations per second", false], ["the completion of one cycle", false], ["the location of an object", false], ["time to complete one vibration", true], ["position of maximum displacement", false]),
        new MultipleChoiceQuestion("Assignment 10b", "Which best matches Frequency", false, ["the motion of a pendulum", false], ["an S shape on its side", false], ["number of vibrations per second", true], ["the completion of one cycle", false], ["the location of an object", false], ["time to complete one vibration", false], ["position of maximum displacement", false]),
        new MultipleChoiceQuestion("Assignment 10c", "Which best matches Amplitude", false, ["the motion of a pendulum", false], ["an S shape on its side", false], ["number of vibrations per second", false], ["the completion of one cycle", false], ["the location of an object", false], ["time to complete one vibration", false], ["position of maximum displacement", true]),
        new MultipleChoiceQuestion("Assignment 10d", "Which best matches Displacement", false, ["the motion of a pendulum", false], ["an S shape on its side", false], ["number of vibrations per second", false], ["the completion of one cycle", false], ["the location of an object", true], ["time to complete one vibration", false], ["position of maximum displacement", false]),
        new MultipleChoiceQuestion("Assignment 10e", "Which best matches Sine Curve", false, ["the motion of a pendulum", false], ["an S shape on its side", true], ["number of vibrations per second", false], ["the completion of one cycle", false], ["the location of an object", false], ["time to complete one vibration", false], ["position of maximum displacement", false]),
        new MultipleChoiceQuestion("Assignment 10f", "Which best matches Vibration", false, ["the motion of a pendulum", false], ["an S shape on its side", false], ["number of vibrations per second", false], ["the completion of one cycle", true], ["the location of an object", false], ["time to complete one vibration", false], ["position of maximum displacement", false]),
        new MultipleChoiceQuestion("Assignment 10g", "Which best matches Simple Harmonic Motion", false, ["the motion of a pendulum", true], ["an S shape on its side", false], ["number of vibrations per second", false], ["the completion of one cycle", false], ["the location of an object", false], ["time to complete one vibration", false], ["position of maximum displacement", false]),
        new NumQuestion("Assignment 11", "A meter stick is held vertically behind an object on a spring. The object vibrates from the 20 cm mark to the 32 cm mark on the stick. Find: the equilibrium position, the amplitude, the displacement when the object is at the 20 cm mark, 24 cm mark, 26 cm mark, and 30 cm mark", false, ["cm", "26"], ["cm", "6.0"], ["cm [+]", "6.0"], ["cm [+]", "2.0"], ["cm [+]", "0.0"], ["cm [+]", "-4.0"]),
        new NumQuestion("Assignment 12", "The crest of a wave in a ripple tank travels 60 cm in 2.0 s. If the distance between crests is 0.50 cm, what is the frequency of the wave?", false, ["Hz", "60"]),
        new NumQuestion("Assignment 13", "The wave generator in a ripple tank produces circular wave patterns at a frequency of 6.0 Hz. A student measures the distance on the floor between troughs of the 3rd and 8th waves to be 7.5 cm. What is the speed of the wave?", false, ["cm/s", "9.0"]),
        new NumQuestion("Assignment 14", "Radio telescopes receive waves from distant stars. If such a wave has a wavelength of 21 cm and travels at the speed of light (c = 3.00 x 10^8 m/s), what is the frequency?", false, ["* 10^9 Hz", "1.4"]),
        new NumQuestion("Assignment 15ab", "A tuning fork that vibrates at 256 Hz produces a sound wave that is 130 cm long. What is the speed of sound in air? A sound wave in a steel rail has a period of 1.613 x 10^-3 s and a wavelength of 10.5 m. What is the speed of sound in steel? ", false, ["m/s", "333"], ["* 10^3 m/s", "6.51"]),
        new NumQuestion("Assignment 15c", "A tuning fork that vibrates at 256 Hz produces a sound wave that is 130 cm long. Two men are standing beside a railway line and they are 500 m apart. If one man strikes the rail with a hammer how long does it take for the other man: to see the hammer hit the rail? to hear the sound from the rail line? to hear the sound in the air?", false, ["* 10^-6 s", "1.76"], ["* 10^-2 s", "7.68"], ["s", '1.50']),
        new MultipleChoiceQuestion("Assignment 16", "Using the terms frequency, wavelength and speed, fill in the blanks: _____ and _____ are determined by properties of the medium, while _____ is determined by the source of the wave", false, ["speed, wavelength, frequency", true], ["frequency, speed, wavelength", false], ["wavelength, frequency, speed", false]),
        new NumQuestion("Assignment 18", "The human ear can hear frequencies ranging from 20 Hz to 20000 Hz. If the speed of sound in air is 340 m/s, what is the range of wavelengths for audible sound?", false, ["m", "17"], ["m", "0.017"]),
        new MultipleChoiceQuestion("Assignment 19", "If the wavelength of a wave is quadrupled and the speed is quartered, what happens to the frequency?", false, ["increased by 16x", false], ["increased by 8x", false], ["increased by 4x", false], ["increased by 2x", false], ["decreased by 2x", false], ["decreased by 4x", false], ["decreased by 8x", false], ["decreased by 16x", true]),
        new NumQuestion("Assignment 21", "The speed and wavelength of deep water waves are 12 cm/s and 1.5 cm respectively. When the water waves enter a shallow region, their speed is reduced to 8.0 cm/s. What is the wavelength in the shallow region?", false, ["cm", '1.0']),
        new NumQuestion("Assignment 22", "The speed and wavelength of shallow water waves are 12 cm/s and 1.5 cm respectively. When the waves enter a deeper region the wavelength increases to 2.0 cm. What is the speed in the deep region?", false, ["cm/s", "16"]),
        new NumQuestion("Assignment 23", "A 12 Hz wave travels from deep to shallow water. As it does so, its speed changes from 20 cm/s to 16 cm/s. What are the wavelengths in each region?", false, ["cm (shallow)", "1.7"], ["cm (deep)", "1.3"]),
    ], true],
    // lesson 30
    [[
        new NumQuestion("Example 1", "A wave is incident on boundary A and reflects to boundary B. What is the angle of reflection at boundary B? (3SD)", false, ["°", "180"]),
        new NumQuestionIMG("Example 2", "A water wave travelling in deep water at 15.0 m/s enters a shallow region with an angle of incidence of 30°. If the angle of refraction is 22°, what is the speed of the wave in the shallow region?", false, "images/L30/1.png", ["m/s", "11"]),
        new NumQuestion("Example 3", "A wave travels from a region with a speed of 45 m/s into a region with a speed of 60 m/s. If the wavelength of the wave is 1.5 m in the slow region, what is the wavelength in the fast region?", false, ["m", "2.0"]),
        new MultipleChoiceQuestionIMG("Example 4", "Points S_1 and S_2 are sources of identical water waves. P is a point some distance away from the sources. PS_1 is 80 cm and PS_2 is 90 cm. Explain whether there will be destructive or constructive interference at P if the sources produce the following wavelengths: 5 cm (a)? 20 cm (b)?", false, "images/L30/2.png", ["a: constructive, b: constructive", false], ["a: destructive, b: constructive", false], ["a: constructive, b: destructive", true], ["a: destructive, b: destructive", false]),
        new MultipleChoiceQuestion("Assignment 4", "How do wave characteristics change when refraction of a wave results in bending toward the normal?", false, ["Wave slows down, Wavelength gets shorter", true], ["Wave gets faster, Wavelength gets shorter", false], ["Wave slows down, Wavelength gets longer", false], ["Wave gets faster, Wavelength gets longer", false]),
        new MultipleChoiceQuestion("Assignment 4", "How do wave characteristics change when refraction of a wave results in bending away from the normal?", false, ["Wave slows down, Wavelength gets shorter", false], ["Wave gets faster, Wavelength gets shorter", false], ["Wave slows down, Wavelength gets longer", false], ["Wave gets faster, Wavelength gets longer", true]),
        new NumQuestionIMG("Assignment 7", "For the following diagram, what is the angle of reflection from surface Y? What is the angle between the wave ray and surface Y?", false, "images/L30/3.png", ["°", "30"], ["°", "60"]),
        new NumQuestionIMG("Assignment 8", "For the following diagram, what is the angle of reflection from surface Y? What is the angle between the wave ray and surface Y?", false, "images/L30/4.png", ["°", "50"], ["°", "40"]),
        new NumQuestionIMG("Assignment 9", "For the following diagram, what is the angle of reflection from surface Z?", false, "images/L30/5.png", ["°", "8"]),
        new NumQuestion("Assignment 12", "An echo is heard 2.50 s after it is produced. If the speed of sound in air is 340 m/s, how far away is the reflecting surface? ", false, ["m", "425"]),
        new NumQuestion("Assignment 13", "A sonar equipped boat detects the echo of a submarine and the ocean bottom at the same moment. The echo from the submarine is heard 3.25 s after the sonar signal is produced and the echo from the ocean floor is heard 4.26 s after the sonar signal is produced. If the speed of sound in water is 1150 m/s, how far from the bottom is the submarine?", false, ["m", "581"]),
        new NumQuestion("Assignment 14", "A ripple-tank wave passes through a straight boundary between deep and shallow water. The angle of incidence at the boundary is 45° and the angle of refraction is 30°. If the wavelength in the deep end is 1.20 cm, what will the wavelength be in the shallow side?", false, ["cm", "0.85"]),
        new NumQuestion("Assignment 15", "The speed of water waves in a deep region of a ripple-tank is 0.30 m/s. The wave enters a shallow region at an angle of incidence of 40° and then move with a speed of 0.20 m/s. What is the angle of refraction?", false, ["°", "25"]),
    ], true],
    // lesson 31
    [[
        new NumQuestion("Example 1", "What is the wavelength of the 4th harmonic on a 2.4 m string?", false, ["m", "1.2"]),
        new NumQuestion("Example 2", "A 3rd harmonic standing wave appears on a 1.80 m string when the frequency is 32 Hz. What is the speed of a wave on the string?", false, ["m/s", "38"]),
        new NumQuestion("Example 3", "The first resonant length of a closed air column occurs when the length is 18 cm. (a) What is the wavelength of the sound? (b) If the frequency is 512 Hz, what is the speed of sound in air?", false, ["m", "0.72"], ["* 10^2 m/s", "3.7"]),
        new NumQuestion("Example 4", "An organ pipe, 3.6 m long, open at both ends, produces a note at the fundamental frequency. (a) What is the wavelength of the note produced? (b) If the speed of sound is 346 m/s, what is the frequency of the pipe?", false, ["m", "7.2"], ["Hz", "48"]),
        new NumQuestion("Assignment 1", "A fundamental frequency of 300 Hz is produced on a violin string. What are the 3rd and 4th harmonics?", false, ["Hz", "900"], ["* 10^3 Hz", "1.20"]),
        new NumQuestion("Assignment 2", "The 3rd harmonic on a piano string occurs when a 45 cm wave is produced. How long is the string? ", false, ["cm", "68"]),
        new NumQuestion("Assignment 3", "The fundamental frequency is produced on a 75.0 cm guitar string. What is the wavelength of the wave on the string? If the frequency is 252 Hz, what is the speed of the wave on the string? ", false, ["cm", "150"], ["m/s", "378"]),
        new NumQuestion("Assignment 4", "The first resonant length of a closed air column occurs when the length is 30 cm. What will the second and third resonant lengths be? ", false, ["cm", "90"], ["* 10^2 cm", "1.5"]),
        new NumQuestion("Assignment 5", "The third resonant length of a closed air column is 75 cm. Determine the first and second resonant lengths", false, ["cm", '15'], ["cm", "45"]),
        new NumQuestion("Assignment 6", "What is the shortest closed air column that will resonate at a frequency of 440 Hz when the speed of sound is 352 m/s?", false, ["cm", "20.0"]),
        new NumQuestion("Assignment 7", "The second resonant length of an air column open at both ends is 48 cm. Determine the first and third resonant lengths. ", false, ["cm", "24"], ["cm", "72"]),
        new NumQuestion("Assignment 8", "An organ pipe, open at both ends, resonates at its first resonant length with a frequency of 128 Hz. What is the length of the pipe if the speed of sound is 346 m/s?", false, ["cm", '135']),
    ], true],
    // lesson 32
    [[
        new NumQuestion("Example 1", "A fire engine is roaring past you at 15.0 m/s while its 900 Hz siren is on. If the speed of sound in air is 340 m/s, what frequency do you hear as the engine comes toward you? goes away from you?", false, ["Hz", "942"], ["Hz", "862"]),
        new NumQuestion("Example 2", "A car is travelling at 29.0 m/s toward a stationary whistle with a frequency of 625 Hz. If the speed of sound is 337 m/s, what is the apparent frequency of the whistle as heard by the driver of the car?", false, ["Hz", "679"]),
        new NumQuestion("Example 3", "A whistle with a frequency of 2500 Hz is travelling south at 27.0 m/s. You are travelling north toward the whistle at 15.0 m/s. If the speed of sound is 341 m/s, what frequency do you hear?", false, ["* 10^3 Hz", "2.83"]),
        new NumQuestion("Practice 1", "A fire engine is sitting beside the road with its 900 Hz siren on. You drive past the fire engine at 15.0 m/s. If the speed of sound in air is 340 m/s, what frequency do you hear as you go toward the engine? go away from the engine?", false, ["Hz", "940"], ["Hz", "860"]),
        new NumQuestion("Practice 2", "A distant star is being observed by an astronomer on Earth. The frequency for sodium light as measured on Earth is 5.17 x 10^14 Hz. The measured frequency for sodium light from the star is 6.10 x 10^14 Hz. If the speed of light is 3.00 x 10^8 m/s, what is the speed of the star relative to us?", false, ["* 10^7 m/s [towards]", "4.57"]),
        new NumQuestion("Assignment 1", "You are standing at a railway crossing. A train approaching at 100 km/h sounds its whistle. If the frequency of the whistle is 400 Hz and the speed of sound in air is 344 m/s, what is the frequency you hear (a) when the train approaches you and (b) when the train has passed you?", false, ["Hz", "435"], ["Hz", "370"]),
        new NumQuestion("Assignment 2", "A factory whistle emits a sound with a wavelength of 38.0 cm. If the speed of sound is 340 m/s, what frequency will be heard by you if you are driving at 20.0 m/s (a) away from the whistle and (b) toward the whistle?", false, ["Hz", "842"], ["Hz", "947"]),
        new NumQuestion("Assignment 3", "The whistle on a train has a frequency of 2150 Hz. If the speed of sound is 339 m/s, what is the apparent frequency you would hear if the train was travelling toward you at 25 m/s?", false, ["* 10^3 Hz", "2.3"]),
        new NumQuestion("Assignment 4", "A whistle with a frequency of 1200 Hz is travelling south at a velocity of 30.0 m/s. You are travelling north away from the whistle at a speed of 18.0 m/s. If the speed of sound is 340 m/s, what is the apparent frequency of the whistle as heard by you?", false, ["* 10^3 Hz", "1.04"]),
    ], true],
]

// new NumQuestion("Title", "Question", false, []),
// °

// icon classes used for each lesson
let lessonIcons = [
    '<i class="fa-solid fa-cable-car"></i>', // L1
    '<i class="fa-solid fa-people-arrows"></i>', // L2
    '<i class="fa-solid fa-chart-line"></i>', // L3
    '<i class="fa-solid fa-gauge-simple"></i>', // L7
    '<i class="fa-solid fa-car"></i>', // L8
    '<i class="fa-solid fa-truck-fast"></i>', // L9
    '<i class="fa-solid fa-plus"></i>', // L10
    '<i class="fa-solid fa-shapes"></i>', // L11
    '<i class="fa-solid fa-arrows-to-eye"></i>', // L12
    '<i class="fa-solid fa-person-falling"></i>', // L13
    '<i class="fa-solid fa-square-root-variable"></i>', // L14/15
    '<i class="fa-solid fa-gear"></i>', // L16
    '<i class="fa-solid fa-elevator"></i>', // L17
    '<i class="fa-solid fa-users-viewfinder"></i>', // L18
    '<i class="fa-regular fa-circle-right"></i>', // L19
    '<i class="fa-regular fa-circle-up"></i>', // L20
    '<i class="fa-solid fa-sun"></i>', // L21
    '<i class="fa-solid fa-earth-americas"></i>', // L22
    '<i class="fa-solid fa-satellite"></i>', // L23
    '<i class="fa-solid fa-ear-listen"></i>', // L24
    '<i class="fa-solid fa-down-left-and-up-right-to-center"></i>', // L25
    '<i class="fa-solid fa-battery-full"></i>', // L26
    '<i class="fa-solid fa-equals"></i>', // L27
    '<i class="fa-solid fa-bolt"></i>', // L28
    '<i class="fa-solid fa-wave-square"></i>', // L29
    '<i class="fa-solid fa-water"></i>', // L30
    '<i class="fa-solid fa-volume-high"></i>', // L31
    '<i class="fa-solid fa-truck-medical"></i>', // L32
]

let lessonTitles = [
    "Average Speed", // L1
    "Displacement", // L2
    "Velocity Graph Analysis", // L3
    "Acceleration", // L7
    "Acceleration & Displacement", // L8
    "Acceleration & Displacement 2", // L9
    "Vector Addition", // L10
    "Vector Addition Components", // L11
    "Relative Motion", // L12
    "Projectiles", // L13
    "Dynamics Conceptual Change & Problem Solving", // L14/15
    "Friction", // L16
    "Elevators and Inclines", // L17
    "Systems", // L18
    'Uniform Circular Motion', // L19
    'Vertical Uniform Circular Motion', // L20
    'Universal Gravitation (may be inaccurate)', // L21
    'Gravitational field strength', // L22
    'Orbits and Satellites', // L23
    'Simple Harmonic Motion', // L24
    'Springs', // L25
    'Energy, Work, Power', // L26
    'Conservation of Energy', // L27
    'SHM Dynamics & Energy', // L28
    'Waves One Dimension', // L29
    'Waves Two Dimensions', // L30
    'Resonance and sound', // L31
    'Doppler effect', // L32
    '', // AP?
]

function getLessonName(idx){
    if(lessonTitles[idx] !== undefined){
        return lessonTitles[idx];
    }

    return 'Lesson ' + (idx + 1);
}