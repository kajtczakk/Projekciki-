$("document").ready(function(){
    /*
    Categories:
        15 - Video Games
        22 - Geography
        23 - History
        31 - Anime/Manga
    */

    // Changing quiz type
    $("div.quiz-type").on("click", function(){
        if(!$("#results").css("display") == "none"){
            if($("#choosing-questions").css("display") == "none"){
                $("#choosing-questions").css("display", "flex");
                $("#playing-game").attr("id", "starting-game");
                $("#playing").css("display", "none");
            }
            $("main > h1").text($(this).text() + " quiz");
            let whichCategory = $(this).text();
            switch(whichCategory){
                case "Geography":
                    category = 22;
                    break;
                case "Anime/Manga":
                    category = 31;
                    break;
                case "History":
                    category = 23;
                    break;
                case "Video Games":
                    category = 15;
                    break;
            }
        }
    });

    // Selecting questions
    $(".answers > button").on("click", function(){
        $(".selected").removeClass("selected");
        $(this).addClass("selected");
        chosenAnswers[questionNumber] = Number($(this).val());
        displayingQuestionList();
    });

    // Updating output values
    $("input[type = 'range']").on("input", function(){
        $("output").html($("input[type = 'range']").val());
    });

    // Going through questions
    $(".working-around > button").on("click", function(){
        if($(this).attr("class") == "go-next"){
            if(questionNumber != Number(numberOfQuestions) - 1){
                questionNumber++;
                resettingClasses();
            }
            else if (questionNumber == Number(numberOfQuestions) - 1){
                $(".end-info").css("display", "flex");
            }
        }
        else if($(this).attr("class") == "go-previous"){
            if(questionNumber != 0){
                questionNumber--;
                resettingClasses();

            }
        }
        if(questionNumber == Number(numberOfQuestions) - 1) $(".go-next").text("End quiz");
        else $(".go-next").text("Next question");
        displayingQuestion();
        displayingQuestionList();
    });

    // Chosing questions from list
    $(".question-list > div").on("click", function(){
        console.log($(this).children("h2").text(), "nig")
        questionNumber = $(this).children("h2").text();
        displayingQuestion();
    });

    // End/continue quiz
    $(".end-info-container > button").on("click", function(){
        if($(this).attr("class") == "continue-game"){
            $(".end-info").css("display", "none");
        }
        else if($(this).attr("class") == "end-game"){
            displayingQuestionAndAnswersList();
            settingScore();
        }
    });

    // Reseting classes in answer buttons
    function resettingClasses(){
        $(".answers > button").removeClass("selected");
    }

    // Decoding "&" values from API
    function decodeEntities(encodedString) {
        var textArea = document.createElement('textarea');
        textArea.innerHTML = encodedString;
        return textArea.value;
    }

    // Creating question list
    function creatingQuesionList(){
        for(let i = 1; i <= Number(numberOfQuestions); i++){
            $(".question-list").append(`<div><h2>${i}</h2><div class="color"></div></div>`)
        }
    }

    // Displaying question and answers
    function displayingQuestion(){
        if(howToDisplay[questionNumber] == null){
            activeQuestion = questions[questionNumber];
            howToDisplay[questionNumber] = new Array(4);
            $(".question").text(decodeEntities(activeQuestion.question));
            let correctAnswer = Math.floor(Math.random() * 4), correctAnswerString = decodeEntities(activeQuestion.correct_answer);
            let x = 0;
            switch(correctAnswer){
                case 0:
                    $(".answer-1").text(correctAnswerString);
                    howToDisplay[questionNumber][0] = correctAnswerString;
                    break;
                case 1:
                    $(".answer-2").text(correctAnswerString);
                    howToDisplay[questionNumber][1] = correctAnswerString;
                    break;
                case 2:
                    $(".answer-3").text(correctAnswerString);
                    howToDisplay[questionNumber][2] = correctAnswerString;
                    break;
                case 3:
                    $(".answer-4").text(correctAnswerString);
                    howToDisplay[questionNumber][3] = correctAnswerString;
                    break;
            }
            for(let i = 0; i < 4; i++){
                if(correctAnswer == i) continue;
                else{
                    let chosenAnswer = ".answer-" + (i + 1);
                    $(chosenAnswer).text(decodeEntities(activeQuestion.incorrect_answers[x]));
                    howToDisplay[questionNumber][i] = decodeEntities(activeQuestion.incorrect_answers[x]);
                    x++;
                }
            }
        }
        else{
            $(".question").text(decodeEntities(questions[questionNumber].question));
            for(let i = 0; i < 4; i++){
                let chosenAnswer = ".answer-" + (i + 1);
                $(chosenAnswer).text(howToDisplay[questionNumber][i]);
            }
            if(chosenAnswers[questionNumber] != null) $(".answer-" + chosenAnswers[questionNumber]).addClass("selected");
        }
    }

    // Displaying question list
    function displayingQuestionList(){
        $(".question-list").html("");
        creatingQuesionList();
        let selectedListNumber;
        for(let i = 1; i <= Number(numberOfQuestions); i++){
            selectedListNumber = $(".question-list > div:nth-of-type(" + i + ")"); 
            if((Number(questionNumber) + 1) == i){
                selectedListNumber.css("background-color", "#0C0C0C");
            }
            else{
                selectedListNumber.css("background-color", "inherit");
            }
            if(chosenAnswers[i - 1] == null){
                selectedListNumber.children("div.color").css("background-color", "#FF204E");
            }
            else{
                selectedListNumber.children("div.color").css("background-color", "#A0153E");
                selectedListNumber.children("div.color").append('<i class="material-symbols-outlined"></i>');
            }
        }
        if(numberOfQuestions > 30){
            $(".question-list > div").css("width", "7.5%")
        }
    }

    // Displaying answer list after doing the quiz
    function displayingQuestionAndAnswersList(){
        console.log(howToDisplay, chosenAnswers)
        $("#playing").css("display", "none");
        $(".end-info").css("display", "none");
        $("#results").css("display", "flex");
        for(let i = 0; i < Number(numberOfQuestions); i++){
            $(".results").append(`<div class="question-result"><h2>${questions[i].question}</h2></div>`);
            if(howToDisplay[i] == null){
                howToDisplay[i] = new Array(4);
                let correctAnswer = Math.floor(Math.random() * 4), x = 0;
                howToDisplay[i][correctAnswer] = decodeEntities(questions[i].correct_answer);
                for(let j = 0; j < 4; j++){
                    if(correctAnswer == j) continue;
                    else{
                        howToDisplay[i][j] = decodeEntities(questions[i].incorrect_answers[x]);
                        x++;
                    }
                }
            }
            for(let j = 0; j < 4; j++){
                $(".question-result:last-of-type").append(`<div>${howToDisplay[i][j]}</div>`);
                if(howToDisplay[i][j] == questions[i].correct_answer) $(".question-result:last-of-type > div:last-of-type").addClass
                ("correct-answer");
                if(chosenAnswers[i] - 1 == j){
                    $(".question-result:last-of-type > div:last-of-type").addClass("chosen-by-player");
                    console.log(chosenAnswers[i]);
                }
            }

        }
    }
    
    // Setting a score for the player
    function settingScore(){
        let correctlyChosen = 0;
        for(let i = 0; i < Number(numberOfQuestions); i++){
            if(questions[i].correct_answer == howToDisplay[i][chosenAnswers[i] - 1]) correctlyChosen++;
        }
        console.log(correctlyChosen)
        $(".your-percentage").text(Math.round(correctlyChosen / numberOfQuestions * 100) + "%");
    }

    var chosenAnswers, howToDisplay, questions;
    var activeQuestion;
    var category = 22, questionNumber = 0, numberOfQuestions;
    var apiUrl;

    $(".start-button").on("click", function(){
        numberOfQuestions = $("input[type = 'range']").val();
        let quizDifficulty = $("input[type = 'radio']:checked").val();
        apiUrl = `https://opentdb.com/api.php?amount=${numberOfQuestions}&category=${category}&difficulty=${quizDifficulty}&type=multiple`;
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                questions = data.results;
                console.log(questions)
                chosenAnswers = new Array(Number(numberOfQuestions));
                howToDisplay = new Array(Number(numberOfQuestions));
                $("#starting-game").attr("id", "playing-game");
                $("#choosing-questions").css("display", "none");
                $("#playing").css("display", "grid");
                activeQuestion = questions[questionNumber];
                if(numberOfQuestions == 1){
                    $(".go-next").text("End quiz")
                }
                displayingQuestion();
                displayingQuestionList();
            })
            .catch(error => {
                console.error(error);
            });
    });
});