// These are the variable you may want to change

// This variable indicates the display name for trials where we want to add the image content
var _requiredDisplay: string = 'Fill_Blanks';

// This variable indicates the screen number for the screen requiring the image content
// This numbering starts at 0 for the 1st screen, 1 for the 2nd screen etc.
var _requiredScreen: number = 0;

// ZONE NAMES

// This variable indicates the name of the central zone used to display the full word
var _wordAreaName: string = 'wordArea';

//
//var _responseTextName: string = 'responseText';
var _responseText: string= 'responseText'

var _nextStoryZone: string = 'nextStory'

var _instructionZone: string = 'instructionZone'

var _emptyWord: string = 'emptyWord'
// SPREADSHEET COLUMNS
// The names of the spreadsheet columns where the first and last letters of the word are stored
var _firstLetter: string = 'First';
var _lastLetters: string = 'Last';

// This string will be used to store random seed we generate on the first run of the task
var _randomSeedKey = 'experimentRandomSeed';




// GORILLA KEYS
// This variable will hold the key used to access the modified spreadsheet in the gorilla store

var TASK_KEY = 'Task'


//-----------------------
// OTHER GLOBAL VARIABLES
//-----------------------


var _finishingTrialIndex = null;

//--------------------------------------------------------------------------------------------------------------



// Push story content onto screen
gorillaTaskBuilder.onScreenStart((spreadsheet: any, rowIndex: number, screenIndex: number, row: any, container: string) => {
    // We need to check if we are on the screen display
    if(_requiredDisplay && row.display == _requiredDisplay){
        // Next, we need to check if we are on the correct screen
        if((_requiredScreen || _requiredScreen == 0) && screenIndex == _requiredScreen){

      console.log(spreadsheet[0]['First'] + '_________' + spreadsheet[0]['Last'])


             // Fill in the blank function
            function firstFunction (){

            // Styling the story text
             $(container + ' .' + _wordAreaName).children(0)
             .css({"position": "fixed"})
             .css({"padding-right": "2%"})
             .css({"top": "2%"})
             .css({"left": "10%"})
             .css({"right": "10%"})
             .css({"bottom": "15%"})
             .css({"font-family": "Times New Roman"})
             .css({"text-align": "left"});


            // Create mouseover event for on screen instructions
             $(container + ' .' + "instruction").on({
                 'mouseout': function showInst (event) {
            $(container + ' .' + "instruction")[0].children[0].innerText = "Instructions";

            $(container + ' .' + "instruction")
            .css({"position": "fixed"})
            .css({"left": "0.1%"})
            .css({"bottom": "0.1%"})
            .css({"top": "93%"})
            .css('border', '2px solid #555')
            .css('background-color', '#555')
            .css('color', '#fff')
            .css('font-weight', 'bold')
            .css('padding', '20px')
            .css('border-radius', '4px')
            .css('cursor', 'pointer');
                 };
             };


                $(container + ' .' + "instruction").on({
                 'mouseover': function showInst (event) {
            $(container + ' .' + "instruction")[0].children[0].innerText =
            "Click the response box in the middle. Fill in the blank by typing one word that fits best to the context of the story. After typing the word, press the Enter key (for Windows Users) or the Return key (for Mac Users). Then press the Right Arrow key to see the next sentence.";

            $(container + ' .' + "instruction")
            .css({"position": "fixed"})
            .css({"left": "0.1%"})
            .css({"bottom": "0.1%"})
            .css({"top": "85%"})
            .css('border', '2px solid #555')
            .css('background-color', '#555')
            .css('color', '#fff')
            .css('font-weight', 'bold')
            .css('padding', '20px')
            .css('border-radius', '4px')
            .css('cursor', 'pointer');
                 };
             };

             // Format Response Box
             $(container + ' .' + _responseText).hide()

             $(container + ' .' + _responseText).children(0)
             .css({"border-color": "red"})
             .css({"border-width": "medium"})

             setTimeout(function() {
                 $(container + ' .' + _responseText).children(0)
                 .css("border-color", "");
             }, 5000)

             setTimeout(function(){
                    $(container + ' .' + _responseText).show()
                }, 3000);

            // Format instructionZone that should only show up before the first sentence
            $(container + ' .' + _instructionZone).hide()


               var v = 0
               var ok = 0

               if (v == 0){
                   console.log(v)
                    $(container + ' .' + _instructionZone).show()
               };

              // hide the Next Story button until the last sentence is pulled up (see .show() funciton below)
              $(container + ' .' + _nextStoryZone).hide()
              $(container + ' .' + _emptyWord).hide()


             // Input answers and story text
               var previousSentence = ""
             $(container + ' .' + _responseText).on({
                 'keydown': function fillWord (event) {
               var keypress = event.charCode || event.keyCode;
               if (keypress == 13 && ok == 0 && v !== 0) {  // 13 is enter key

               var word: string = $(event.currentTarget)[0].children[0].value;

               if (v != spreadsheet.length - 1 &&
               (word.length === 0 | (/[\.\,\/\#\!\$\%\^\&\*\;\:\{\}\=\_\`\~\(\)\[0-9\]]/.test(word) | !word.replace(/\s/g, '').length)) {

                   $(container + ' .' + _emptyWord).children(0).css({"color": "red"});
                   $(container + ' .' + _emptyWord).show();
                   setTimeout(function () {
                    $(container + ' .' + _emptyWord).hide();
                }, 5000);

               } else {

                var filledWord: string[] = [];
                // If _lastLetters is punctuations, then push the _lastLetters without a blank in between word and _lastLetters
                  if(spreadsheet[v][_firstLetter] && spreadsheet[v][_lastLetters] != '' && (/[\.\,\!\"\;\:]/.test(spreadsheet[v][_lastLetters][0]))){
                // add the value in the First word column and the value in the Last word column together into a string
                filledWord.push(spreadsheet[v][_firstLetter]+ '\xa0' + word + spreadsheet[v][_lastLetters]);
                console.log(filledWord)
                console.log(spreadsheet[v][_lastLetters][0])
                };
                // If _lastLetters is not punctuations but words, then push the _lastLetters WITH a blank in between word and _lastLetters
                 if(spreadsheet[v][_firstLetter] && spreadsheet[v][_lastLetters] != ''){
                // add the value in the First word column and the value in the Last word column together into a string
                filledWord.push(spreadsheet[v][_firstLetter]+ '\xa0' + word + '\xa0' + spreadsheet[v][_lastLetters]);
                console.log(filledWord)
                };

               // Append the current sentence filled with a word into the previous-sentence string
               // wordFilledSentence is for troubleshooting, maybe save it to the answer output
               var wordFilledSentence = ""

               wordFilledSentence += filledWord[0]
               previousSentence += '\n' + filledWord[0]

               $(container + ' .' + _wordAreaName)[0].children[0].innerText = previousSentence;

                console.log(wordFilledSentence)

                gorilla.refreshLayout();

                 $('div[class$="instruction"]')
                 .css({"position": "fixed"})
                 .css({"left": "0.1%"})
                 .css({"bottom": "0.1%"})
                 .css({"top": "93%"})
                 .css('border', '2px solid #555')
                 .css('background-color', '#555')
                 .css('color', '#fff')
                 .css('font-weight', 'bold')
                 .css('padding', '20px')
                 .css('border-radius', '4px')
                 .css('cursor', 'pointer');


               ok = 1


                gorilla.metric({
                trial_number: word,
                attempt: filledWord[0],
                x_coord: filledWord[0],
                y_coord: word,
               })

              };

            };


               if (keypress == 39 &&  (ok == 1 | v == 0)) {  //39 is the right arrow
              //var currentSentence: string = $(container + ' .' + _wordAreaName)[0].children[0].innerText;

                // Set up auto scroll when text is out of the wordArea. For this to work, the span must have class name "wordSpan" and "overflow: auto"
                // The division wordArea does not have any height.
                // Any height property needs to come from the text span.
                // To access span height, [0] is necessary
                // This should be embedded in the right arrow click event, as text is appended (this two lines took very long time to figure out)
                var wordSpanScH = $("span.wordSpan")[0].scrollHeight
                $("span.wordSpan").scrollTop(wordSpanScH);

               v++
              ok = 0
               console.log(v)
                 $(container + ' .' + _wordAreaName)[0].children[0].innerText = spreadsheet[v]['First'] + '_________' + spreadsheet[v]['Last'];
                 ok = 0

                 var continueBlankSentence: string[] = [];
                if(spreadsheet[v][_firstLetter] && spreadsheet[v][_lastLetters] != '' && v != spreadsheet.length - 1){
                // add the value in the First word column and the value in the Last word column together into a string
                continueBlankSentence.push(spreadsheet[v][_firstLetter] + '________' + spreadsheet[v][_lastLetters]);
                console.log(continueBlankSentence)
                 console.dir(typeof continueBlankSentence)
                 console.dir(continueBlankSentence)
                };

                if(spreadsheet[v][_firstLetter] && spreadsheet[v][_lastLetters] != '' && v == spreadsheet.length - 1){
                // add the value in the First word column and the value in the Last word column together into a string
                continueBlankSentence.push(spreadsheet[v][_firstLetter] + '\xa0' + spreadsheet[v][_lastLetters]);

                $(container + ' .' + _responseText).hide();


                console.log("spreadsheet_length:"spreadsheet.length)
                console.log(continueBlankSentence)
                 console.dir(typeof continueBlankSentence)
                 console.dir(continueBlankSentence)
                };

                //show Next Story button at the last trial
                 if(v == spreadsheet.length - 1){

                    setTimeout(function(){
                        $(container + ' .' + _nextStoryZone).show()
                    }, 3000);
                 };



                 var continueSentence = ""
                 continueSentence += continueBlankSentence[0]
                // for (var j = 0; j < nextStartingWord.length - 1; i++){

                    //var continueSentence = ""
                    //continueSentence += nextStartingWord[j+1];
                    //console.log(i)
                //}

                // var currentSentence: string = $(container + ' .' + _wordAreaName)[0].children[0].innerText
                 //console.log(currentSentence)

                 var nextSentence: string = previousSentence + '\n' + continueSentence


                 console.log(wordFilledSentence)
                 console.log(nextSentence)
                 //if the variable nextSentence can be accessed outside of breakScope(), this step is not necessary. This step circumvents the problem.
                 $(container + ' .' + _wordAreaName)[0].children[0].innerText = nextSentence



                 gorilla.refreshLayout();

                 $('div[class$="instruction"]')
                 .css({"position": "fixed"})
                 .css({"left": "0.1%"})
                 .css({"bottom": "0.1%"})
                 .css({"top": "93%"})
                 .css('border', '2px solid #555')
                 .css('background-color', '#555')
                 .css('color', '#fff')
                 .css('font-weight', 'bold')
                 .css('padding', '20px')
                 .css('border-radius', '4px')
                 .css('cursor', 'pointer');

               }
        });// end of on click

      };// end of firstFunction

// This hook allows us to create custom functionality to run when a screen starts


$( container + ' .' + _wordAreaName)[0].children[0].innerText = ""
firstFunction()

        }; // end of screenIndex == _requiredScreen (screen 0) if statement
    }; // end of row.display == _requiredDisplay (Fill_Blanks)

});
