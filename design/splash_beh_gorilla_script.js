//------------------
// USER REQUIREMENTS
//------------------
// For this script to function correctly you will need to
// 1) Change the value of _requiredDisplay and _requiredScreen to match the screen and display you want to perform the check
var _randomSeedKey: string = 'experimentRandomSeed';
//-------------------
// REQUIRED VARIABLES
//-------------------
// A global variable to store our modified spreadsheet
const _modifiedSpreadsheet: any[] = [];

//***************************************
//Copyright (c) Cauldron Science Ltd 2020
// THIS SCRIPT IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SCRIPT
// OR THE USE OR OTHER DEALINGS IN THE SCRIPT.
//***************************************

// PRELOAD FUNCTIONALITY
// If you want to filter by extensions i.e. your stimuli, (images, video and audio) are all mixed in to one or more columns
// switch this variable to true
const _useExtensions: boolean = true;

//--------------------------
// IF _useExtensions == TRUE
//--------------------------
// For the case where we'll be looking for file extensions, this is the list of spreadsheet columns we will run through
const _generalStimuliColumns: string[] = ['intro_file','video_file','sound_file','intro_file2'];

// IMAGES - a comma separated list of the extensions used by all the images in the task
const _imageExtensions: string[] = [];
// AUDIO - a comma separated list of the extensions used by all the audios in the task
const _audioExtensions: string[] = [];
// VIDEO - a comma separated list of the extensions used by all the videos in the task
const _videoExtensions: string[] =['mp4'];

//--------------------------
// IF _useExtensions == FALSE
//--------------------------
// IMAGES - a comma separted list of the spreadsheet columns containing image stimuli
const _imageStimuliColumns: string[] = [];
// AUDIO - a comma separted list of the spreadsheet columns containing audio stimuli
const _audioStimuliColumns: string[] = [];
// VIDEO - a comma separted list of the spreadsheet columns containing video stimuli
const _videoStimuliColumns: string[] = [];

// -------------------------
// STATIC STIMULI
// if you have any further stimuli that are defined statically in the task, enter their names here as a comma separated list
// IMAGES
const _imageStimuliNames: string[] = [];
// AUDIO
const _audioStimuliNames: string[] = [];
// VIDEO
const _videoStimuliNames: string[] = [];

// -----------------------------------------------------------------------------------------------------------------
// Unless you need to change the scripts core functionality, you should not need to change anything below this line!
// -----------------------------------------------------------------------------------------------------------------

interface stimuliMapping {
    stimuliName: string;
    stimuliEmbeddedDataKey: string;
    stimuliNewURL: string;
}

// This function initially pulls out all the stimuli from the spreadsheet
function collateStimuli(spreadsheet: any){
    return new promise((resolve: (result: {images: string[], audios: string[], videos: string[]}) => any, reject: (err) => any) => {
        var arrayOfImages: string[] = [];
        var arrayOfAudios: string[] = [];
        var arrayofVideos: string[] = [];

        // Start by adding our individual stimuli names
        if(_imageStimuliNames.length>0){ arrayOfImages.push(..._imageStimuliNames); }
        if(_audioStimuliNames.length>0){ arrayOfAudios.push(..._audioStimuliNames); }
        if(_videoStimuliNames.length>0){ arrayofVideos.push(..._videoStimuliNames); }

        for(var i = 0; i < spreadsheet.length; i++){
            // Then, the next step varies depending on whether we are looking at fixed columns of image/audio/video stimuli or mixed columns (so we'll parse by extension)
            if(_useExtensions){
                // Go through out listing of stimuli columns and try to work out what kind of stimuli it is based on it's extension
                for(let stimCol = 0; stimCol < _generalStimuliColumns.length; stimCol++){
                    if(spreadsheet[i][_generalStimuliColumns[stimCol]] && spreadsheet[i][_generalStimuliColumns[stimCol]].length > 0){
                        const currentExtension: string = spreadsheet[i][_generalStimuliColumns[stimCol]].split('.').pop();
                        if(_imageExtensions.includes(currentExtension)){
                            if(!arrayOfImages.includes(spreadsheet[i][_generalStimuliColumns[stimCol]])){
                                arrayOfImages.push(spreadsheet[i][_generalStimuliColumns[stimCol]]);
                            }
                        } else if(_audioExtensions.includes(currentExtension)){
                            if(!arrayOfAudios.includes(spreadsheet[i][_generalStimuliColumns[stimCol]])){
                                arrayOfAudios.push(spreadsheet[i][_generalStimuliColumns[stimCol]]);
                            }
                        } else if(_videoExtensions.includes(currentExtension)){
                            if(!arrayofVideos.includes(spreadsheet[i][_generalStimuliColumns[stimCol]])){
                                arrayofVideos.push(spreadsheet[i][_generalStimuliColumns[stimCol]]);
                            }
                        } else {
                            console.log(`Could not determine stimuli type for ${spreadsheet[i][_generalStimuliColumns[stimCol]]}`);
                        }
                    }
                }
            } else {

                for(var imageI = 0; imageI < _imageStimuliColumns.length; imageI++){
                    if(spreadsheet[i][_imageStimuliColumns[imageI]] && spreadsheet[i][_imageStimuliColumns[imageI]].length > 0  && !arrayOfImages.includes(spreadsheet[i][_imageStimuliColumns[imageI]])){
                        arrayOfImages.push(spreadsheet[i][_imageStimuliColumns[imageI]]);
                    }
                }

                for(var audioI = 0; audioI < _audioStimuliColumns.length; audioI++){
                    if(spreadsheet[i][_audioStimuliColumns[audioI]] && spreadsheet[i][_audioStimuliColumns[audioI]].length > 0  && !arrayOfAudios.includes(spreadsheet[i][_audioStimuliColumns[audioI]])){
                        arrayOfAudios.push(spreadsheet[i][_audioStimuliColumns[audioI]]);
                    }
                }

                for(var videoI = 0; videoI < _videoStimuliColumns.length; videoI++){
                    if(spreadsheet[i][_videoStimuliColumns[videoI]] && spreadsheet[i][_videoStimuliColumns[videoI]].length > 0  && !arrayofVideos.includes(spreadsheet[i][_videoStimuliColumns[videoI]])){
                        arrayofVideos.push(spreadsheet[i][_videoStimuliColumns[videoI]]);
                    }
                }
            }
        }

        resolve({images: arrayOfImages, audios: arrayOfAudios, videos: arrayofVideos});
    })
}

// This function loads a single image and reports back the time that it took
function loadSingleImage(imageName: string){
    return new promise((resolve: (result) => any, reject: (err) => any) => {
        const image = new Image();
        const startTime: number = Date.now();
        image.addEventListener('load', ()=>{
            const endTime: number = Date.now();
            const completionTime: number = endTime - startTime;
            resolve(completionTime);
        })

        image.src = gorilla.stimuliURL(imageName);
    })
}

function loadSingleAudioVisual(stimuliName: string){
    return new promise((resolve: (result: { newStimuliMapping: {stimuliName: string, stimuliEmbeddedDataKey: string, stimuliNewURL: string}, timeToLoad: number}) => any, reject: (err) => any) => {
        var req = new XMLHttpRequest();
        req.open('GET', gorilla.stimuliURL(stimuliName), true);
        req.responseType = 'blob';

        const startTime: number = Date.now();

        req.onload = function(){
            // First, check the status code to make sure our download actually succedded
            if(this.status == 200){
                const stimuliBlob = this.response;
                const stimuliURL = URL.createObjectURL(stimuliBlob);
                // create embedded data name
                // - remove extensions
                // - strip out spaces
                const stimuliEmbeddedDataKey = stimuliName.replace(/\.[^/.]+$/, "").replace(/\s/g, '');
                const endTime: number = Date.now();
                const completionTime: number = endTime - startTime;
                resolve({ newStimuliMapping: {stimuliName: stimuliName, stimuliEmbeddedDataKey: stimuliEmbeddedDataKey, stimuliNewURL: stimuliURL}, timeToLoad: completionTime});
            }
        }

        req.onabort = function() {
            // Handle a reject of the promise here
        }

        req.send();
    })
}

var _batchSize: number = 3;

function CreateBatches(stimuliToBatch: string[]){
    var batchedStimuli: string[][] = [];
    while(stimuliToBatch.length > 0){
        batchedStimuli.push(CreateSingleBatch(stimuliToBatch));
    }

    return batchedStimuli;

}

function CreateSingleBatch(stimuliToBatch: string[]){
    var singleBatch: string[] = [];
    for(var i = 0; i<_batchSize; i++){
        if(stimuliToBatch.length > 0){
            singleBatch.push(stimuliToBatch.shift());
        }
    }

    return singleBatch;
}

// A helper function to nicely format the time
function FormatTime(timeToFormat: number){
    let remainingDownloadTimeString: string = '';
    let timeInSeconds: number = parseInt((timeToFormat/1000).toFixed(0));
    if(timeInSeconds > 60){
        let minutes: number = Math.floor(timeInSeconds/60);
        remainingDownloadTimeString += minutes + ' minutes, ';
        timeInSeconds = timeInSeconds - (60 * minutes);
    }
    remainingDownloadTimeString += timeInSeconds + ' seconds';
    return remainingDownloadTimeString;
}

// LOADING SCREEN HTML
var loadingScreenHTML: string = `<div class="container" style="position: relative; top: 30%;">
    <h1 style="text-align: center;">Task Content is Loading!</h1>
    <br>
    <p style="font-size: 18px;">There are <span class="total-stimuli"></span> stimuli to download</p>
    <br>
    <p style="width: 50%; font-size: 18px;"> <span>Current progress:</span> <span style="text-align: right;"><span class="current-number-counter"></span> of <span class="total-number-counter"></span></span></p>
    <p style="font-size: 18px;">Current (estimated) download time remaining: <span class="download-time-remain" style="text-align: right">Awaiting first batch...</span></p>
<p style="font-size: 18px;">Current total download time: <span class="download-time-total" style="text-align: right">Awaiting first batch...</span></p>
</div>`;

gorillaTaskBuilder.onLoad((spreadsheet, done)=>{
    var stimuliCollection: {images: string[], audios: string[], videos: string[]} = null;
    var completeStimuliRemappings: { [stimuliKey: string] : stimuliMapping }  = {};
    var totalStimuliToLoad: number = 0;
    var currentTotalLoadingTime: number = 0;
    var loadedStimuliCount: number = 0;

    console.log(spreadsheet)
    // STAGE 1) Set up random seed
    // First, check the store to see if we already have a random seed setup
    // We need to check in the experiment (global) store (third variable set to true)
    var randomSeed = gorilla.retrieve(_randomSeedKey, null, true);

    // If we don't have a random seed stored yet, lets create one by using the current Date
    // Date.now() returns the time, in ms, from January 1, 1970 00:00:00 UTC to the current time
    // This is quite likely to be unique per participant - two participants would have to start
    // at the exact same millisecond to get the same randomSeed
    if(!randomSeed){
        randomSeed = Date.now();
        gorilla.store(_randomSeedKey, randomSeed, true);
        console.log(randomSeed)
    }

var _frontNR: any[] = [];
  var _sideNR: any[] = [];
  var _frontVR: any[] = [];
  var _sideVR: any[] = [];

  // For each spreadsheet row, we want to iterate through our list of dataSet spreadsheet columns and pull out the N/ V/ Front/ Side/ Left/ Right stories
  for(var i = 0; i< spreadsheet.length; i++){
        j = i + 1
        k = i + 2
        if(spreadsheet[i].display == ""){
          if(spreadsheet[i].word_type == "noun" && spreadsheet[i].speaker_face == "front" && spreadsheet[i].speaker_side == "right"){
             _frontNR.push([spreadsheet[i],spreadsheet[j],spreadsheet[k]]);
           } else if(spreadsheet[i].word_type == "noun" && spreadsheet[i].speaker_face == "side" && spreadsheet[i].speaker_side == "right"){
             _sideNR.push([spreadsheet[i],spreadsheet[j],spreadsheet[k]]);
           } else if(spreadsheet[i].word_type == "verb" && spreadsheet[i].speaker_face == "front" && spreadsheet[i].speaker_side == "right"){
             _frontVR.push([spreadsheet[i],spreadsheet[j],spreadsheet[k]]);
           } else if(spreadsheet[i].word_type == "verb" && spreadsheet[i].speaker_face == "side" && spreadsheet[i].speaker_side == "right"){
             _sideVR.push([spreadsheet[i],spreadsheet[j],spreadsheet[k]]);
                console.log(_sideVR)
           }
        }
  }
      // STAGE 3) Shuffle the collections
      // We're going to use the function gorilla.shuffle to shuffle this array of trials
      // However, we're going to give it a predefined seed (which we set up in STAGE 1)
      // This means that, within-participants, we will always shuffle the spreadsheet in the same way
      // even across multiple iterations of the same task
      // IMPORTANTLY, if the participant refreshes the page (causing all this logic to be executed again) they'll get the same shuffle
      // Shuffle the stories
      _rfrontNR = gorilla.shuffle(_frontNR, randomSeed); // Adding a +1 causes the second shuffle to be slightly different from the first
      _rsideNR = gorilla.shuffle(_sideNR, randomSeed + 1);
      _rfrontVR = gorilla.shuffle(_frontVR, randomSeed + 2);
      _rsideVR = gorilla.shuffle(_sideVR, randomSeed + 3);

      console.log(_rfrontNR)


  // Get the rows for each block
   var _block1: any[] = [];
   var _block2: any[] = [];
   var _block3: any[] = [];
   var _block4: any[] = [];

// Loop through the rows of the spreadsheet and get the rows for each block
   var _block1: any[] = [];
   for(var i = 0; i< spreadsheet.length; i++){
       if(spreadsheet[i].block == 1) {
         block1j = i + 1
         // block1k = i + 2
         // _block1.push([i, block1j, block1k]) // Put the row for the story, the confidence question, and the comprehension question into one index in an array
         _block1.push([i, block1j]) // Put the row for the story and the comprehension question into one index in an array
         // i = i + 2
         i = i + 1
       } else if(spreadsheet[i].block == 2) {
         block2j = i + 1
         // block2k = i + 2
         _block2.push([i, block2j])
          i = i + 1
       } else if(spreadsheet[i].block == 3) {
         block3j = i + 1
         // block3k = i + 2
         _block3.push([i, block3j])
          i = i + 1
       } else if(spreadsheet[i].block == 4) {
         block4j = i + 1
         // block4k = i + 2
         _block4.push([i, block4j])
          i = i + 1
       }
     }

// STAGE 4) Select the subsets of trials
// Now that the trials are shuffled, we can select our subsets according to the variables laid out in the SUBSET VALUES section above
// Copy the rows containing story trials to the correct rows in the spreadsheet after randomization above
// Get relevant columns with stories and comprehension questions
   var _columns: string[] = ["word_type", "speaker_face", "speaker_side", "novel_word", "key", "intro_file", "intro_file2", "comprehension_key",
   "video_file", "sound_file", "target", "thematic_dist", "taxonomic_dist", "text_dist", "story", "story_trial"]

// Assign front noun and front verb videos
   for(var i = 0; i< 5; i++){
           for(var j = 0; j< _columns.length; j++) {
               if(i < 2) {// block 1: 2 N, 3 V
                spreadsheet[_block1[i][0]][_columns[j]] = _rfrontNR[i][0][_columns[j]] // noun story video trial
                console.log(_rfrontNR[i][0])
                console.log(spreadsheet[_block1[i][0]])
                spreadsheet[_block1[i][1]][_columns[j]] = _rfrontNR[i][1][_columns[j]] // noun Q1 confidence trial & Q2 comprehension question trial
                // spreadsheet[_block1[i][2]][_columns[j]] = _rfrontNR[i][2][_columns[j]] // noun Q2 comprehension question trial

                // block 3: 2 V, 3 N
                spreadsheet[_block3[i][0]][_columns[j]] = _rfrontVR[i][0][_columns[j]] // verb story video trial
                spreadsheet[_block3[i][1]][_columns[j]] = _rfrontVR[i][1][_columns[j]] // verb Q1 confidence trial & Q2 comprehension question trial
                // spreadsheet[_block3[i][2]][_columns[j]] = _rfrontVR[i][2][_columns[j]] // verb Q2 comprehension question trial

                   console.log(_rfrontVR)
               } else {// block 3: 2 V, 3 N
                spreadsheet[_block3[i][0]][_columns[j]] = _rfrontNR[i][0][_columns[j]]
                spreadsheet[_block3[i][1]][_columns[j]] = _rfrontNR[i][1][_columns[j]]
                // spreadsheet[_block3[i][2]][_columns[j]] = _rfrontNR[i][2][_columns[j]]

                // block 1: 2 N, 3 V
                spreadsheet[_block1[i][0]][_columns[j]] = _rfrontVR[i][0][_columns[j]]
                spreadsheet[_block1[i][1]][_columns[j]] = _rfrontVR[i][1][_columns[j]]
                // spreadsheet[_block1[i][2]][_columns[j]] = _rfrontVR[i][2][_columns[j]]
              }
           }
       }

// Assign side noun and side verb videos
       for(var i = 0; i< 5; i++){
               for(var j = 0; j< _columns.length; j++) {
                   if(i < 3) {// block 2: 3 N, 2 V
                    spreadsheet[_block2[i][0]][_columns[j]] = _rsideNR[i][0][_columns[j]] // noun story video trial
                    spreadsheet[_block2[i][1]][_columns[j]] = _rsideNR[i][1][_columns[j]] // noun Q1 confidence trial & Q2 comprehension question trial
                    // spreadsheet[_block2[i][2]][_columns[j]] = _rsideNR[i][2][_columns[j]] // noun Q2 comprehension question trial

                    // block 4: 3 V, 2 N
                    spreadsheet[_block4[i][0]][_columns[j]] = _rsideVR[i][0][_columns[j]] // verb story video trial
                    spreadsheet[_block4[i][1]][_columns[j]] = _rsideVR[i][1][_columns[j]] // verb Q1 confidence trial & Q2 comprehension question trial
                    // spreadsheet[_block4[i][2]][_columns[j]] = _rsideVR[i][2][_columns[j]] // verb Q2 comprehension question trial
                  } else {// block 4: 3 V, 2 N
                    spreadsheet[_block4[i][0]][_columns[j]] = _rsideNR[i][0][_columns[j]]
                    spreadsheet[_block4[i][1]][_columns[j]] = _rsideNR[i][1][_columns[j]]
                    // spreadsheet[_block4[i][2]][_columns[j]] = _rsideNR[i][2][_columns[j]]

                    // block 2: 3 N, 2 V
                    spreadsheet[_block2[i][0]][_columns[j]] = _rsideVR[i][0][_columns[j]]
                    spreadsheet[_block2[i][1]][_columns[j]] = _rsideVR[i][1][_columns[j]]
                    // spreadsheet[_block2[i][2]][_columns[j]] = _rsideVR[i][2][_columns[j]]
                  }
               }
           }


  console.log(spreadsheet)

// Assign speaker side; Left and Right interspersed within one block;
    for(var i = 0; i< 5; i++){
        if(i % 2 == 1) {// Block 1 and Block 2: R/L/R/L/R (i = 1; 3)
        spreadsheet[_block1[i][0]]["speaker_side"] = "left"
        spreadsheet[_block1[i][0]]["intro_file"] = spreadsheet[_block1[i][0]]["intro_file"].replace(".mp4", "_right.mp4")
        spreadsheet[_block1[i][0]]["video_file"] = spreadsheet[_block1[i][0]]["video_file"].replace(".mp4", "_right.mp4")

        spreadsheet[_block2[i][0]]["speaker_side"] = "left"
        spreadsheet[_block2[i][0]]["intro_file"] = spreadsheet[_block2[i][0]]["intro_file"].replace(".mp4", "_right.mp4")
        spreadsheet[_block2[i][0]]["video_file"] = spreadsheet[_block2[i][0]]["video_file"].replace(".mp4", "_right.mp4")
        } else {// Block 3 and Block 4: L/R/L/R/L (i = 0; 2; 4)
        spreadsheet[_block3[i][0]]["speaker_side"] = "left"
        spreadsheet[_block3[i][0]]["intro_file"] = spreadsheet[_block3[i][0]]["intro_file"].replace(".mp4", "_right.mp4")
        spreadsheet[_block3[i][0]]["video_file"] = spreadsheet[_block3[i][0]]["video_file"].replace(".mp4", "_right.mp4")

        spreadsheet[_block4[i][0]]["speaker_side"] = "left"
        spreadsheet[_block4[i][0]]["intro_file"] = spreadsheet[_block4[i][0]]["intro_file"].replace(".mp4", "_right.mp4")
        spreadsheet[_block4[i][0]]["video_file"] = spreadsheet[_block4[i][0]]["video_file"].replace(".mp4", "_right.mp4")
        }
      }



  console.log(spreadsheet)

// Get Columns for Post-test columns
     var _post: string[] = ["target", "thematic_dist", "taxonomic_dist", "text_dist"]
     var _retention: string[] = ["target", "thematic_pdist", "taxonomic_pdist", "text_pdist"]
     console.log(_retention)
     var modifiedSpreadsheet = [];

// Get all rows for Post-test columns and shuffle each row
     for(var i = 0; i < spreadsheet.length; i++){

      var _postT = [];
      var _retentionT = [];

       for(var j = 0; j < _post.length; j++){
         if(spreadsheet[i][_post[j]] != "" && spreadsheet[i].text_dist != "") {
          _postT.push(spreadsheet[i][_post[j]]);
        }
        if(spreadsheet[i][_retention[j]] != "" && spreadsheet[i].text_pdist != "") {
          _retentionT.push(spreadsheet[i][_retention[j]]);
        }
      }
        // Next, use gorilla.shuffle to shuffle the column order
        _shuffledPost = gorilla.shuffle(_postT, randomSeed + i);
        _shuffledRetention = gorilla.shuffle(_retentionT, randomSeed + i);

        // Now, insert the randomised contents back into the row
        for(var k = 0; k < _post.length; k++){
          if(spreadsheet[i][_post[k]] != "" && spreadsheet[i].text_dist != "") {
            spreadsheet[i][_post[k]] = _shuffledPost[k];
          }
          if(spreadsheet[i][_retention[k]] != "" && spreadsheet[i].text_pdist != "") {
            spreadsheet[i][_retention[k]] = _shuffledRetention[k];
          }
        }
        // This is where we will store our new spreadsheet
         modifiedSpreadsheet.push(spreadsheet[i]);
      }

      console.log(modifiedSpreadsheet)


      // Copy immediate post test after each block (if this is not necessary, then delete this section and the corresponding section in the spreadsheet)
      var _postBlock1 = [];
      var _postBlock2 = [];
      var _postBlock3 = [];
      var _postBlock4 = [];

      for(var i = 0; i < modifiedSpreadsheet.length; i++){
        if(modifiedSpreadsheet[i].video_file != "") {
          if(modifiedSpreadsheet[i].block == 1) {
            _postBlock1.push(modifiedSpreadsheet[i])
            _postBlock1 = gorilla.shuffle(_postBlock1, randomSeed + 3)
          } else if(modifiedSpreadsheet[i].block == 2) {
            _postBlock2.push(modifiedSpreadsheet[i])
            _postBlock2 = gorilla.shuffle(_postBlock2, randomSeed + 4)
          } else if(modifiedSpreadsheet[i].block == 3) {
            _postBlock3.push(modifiedSpreadsheet[i])
            _postBlock3 = gorilla.shuffle(_postBlock3, randomSeed + 5)
          } else if(modifiedSpreadsheet[i].block == 4) {
            _postBlock4.push(modifiedSpreadsheet[i])
            _postBlock4 = gorilla.shuffle(_postBlock4, randomSeed + 7)
          }
        }
      }

      console.log(_postBlock1)
      console.log(_postBlock2)
      console.log(_postBlock3)
      console.log(_postBlock4)

      var _postBtest: string[] = ["target", "thematic_dist", "taxonomic_dist", "text_dist", "sound_file"]

      for(var i = 0; i < modifiedSpreadsheet.length; i++){
        for(var k = 0; k < _postBtest.length; k++){
          if(modifiedSpreadsheet[i].block_position == "post_block1" && modifiedSpreadsheet[i].trial == 1) {
            var j = 0
            modifiedSpreadsheet[i][_postBtest[k]] = _postBlock1[j][_postBtest[k]];
            modifiedSpreadsheet[i+1][_postBtest[k]] = _postBlock1[j+1][_postBtest[k]];
            modifiedSpreadsheet[i+2][_postBtest[k]] = _postBlock1[j+2][_postBtest[k]];
            modifiedSpreadsheet[i+3][_postBtest[k]] = _postBlock1[j+3][_postBtest[k]];
            modifiedSpreadsheet[i+4][_postBtest[k]] = _postBlock1[j+4][_postBtest[k]];
          } else if(modifiedSpreadsheet[i].block_position == "post_block2" && modifiedSpreadsheet[i].trial == 1) {
            var f = 0
            modifiedSpreadsheet[i][_postBtest[k]] = _postBlock2[f][_postBtest[k]];
            modifiedSpreadsheet[i+1][_postBtest[k]] = _postBlock2[f+1][_postBtest[k]];
            modifiedSpreadsheet[i+2][_postBtest[k]] = _postBlock2[f+2][_postBtest[k]];
            modifiedSpreadsheet[i+3][_postBtest[k]] = _postBlock2[f+3][_postBtest[k]];
            modifiedSpreadsheet[i+4][_postBtest[k]] = _postBlock2[f+4][_postBtest[k]];
          } else if(modifiedSpreadsheet[i].block_position == "post_block3" && modifiedSpreadsheet[i].trial == 1) {
            var g = 0
            modifiedSpreadsheet[i][_postBtest[k]] = _postBlock3[g][_postBtest[k]];
            modifiedSpreadsheet[i+1][_postBtest[k]] = _postBlock3[g+1][_postBtest[k]];
            modifiedSpreadsheet[i+2][_postBtest[k]] = _postBlock3[g+2][_postBtest[k]];
            modifiedSpreadsheet[i+3][_postBtest[k]] = _postBlock3[g+3][_postBtest[k]];
            modifiedSpreadsheet[i+4][_postBtest[k]] = _postBlock3[g+4][_postBtest[k]];
        } else if(modifiedSpreadsheet[i].block_position == "post_block4" && modifiedSpreadsheet[i].trial == 1) {
            var h = 0
            modifiedSpreadsheet[i][_postBtest[k]] = _postBlock4[h][_postBtest[k]];
            modifiedSpreadsheet[i+1][_postBtest[k]] = _postBlock4[h+1][_postBtest[k]];
            modifiedSpreadsheet[i+2][_postBtest[k]] = _postBlock4[h+2][_postBtest[k]];
            modifiedSpreadsheet[i+3][_postBtest[k]] = _postBlock4[h+3][_postBtest[k]];
            modifiedSpreadsheet[i+4][_postBtest[k]] = _postBlock4[h+4][_postBtest[k]];
          }
        }
            if((modifiedSpreadsheet[i]["text_dist"]).match(".mp4") == ".mp4" && modifiedSpreadsheet[i]["display"] == "block_test") {
                modifiedSpreadsheet[i]["display"] = "block_testV"
            }
      }
      console.log(modifiedSpreadsheet)

    // Shuffle the retention post test rows
        var _shuffled_retention = [];
        var _shuffled_retentionT = [];

         for(var i = 0; i < modifiedSpreadsheet.length; i++){
               if((modifiedSpreadsheet[i].display == "post-test" || modifiedSpreadsheet[i].display == "post-testV")
               && modifiedSpreadsheet[i].text_pdist != "") {
                 _shuffled_retention.push(modifiedSpreadsheet[i])
                 _shuffled_retentionT.push(i)
               }
         }

    _shuffled_retention = gorilla.shuffle(_shuffled_retention, randomSeed + 6)


    for(var i = 0; i < _shuffled_retention.length; i++){
          modifiedSpreadsheet[_shuffled_retentionT[i]] = _shuffled_retention[i];
    }



   var finalSpreadsheet = []

   for(var i = 0; i < modifiedSpreadsheet.length; i++){
     finalSpreadsheet.push(modifiedSpreadsheet[i]);

    if(modifiedSpreadsheet[i].display == "end") {
       break;
     }
   }

    console.log(finalSpreadsheet)

    _modifiedSpreadsheet.push(...finalSpreadsheet);

    return collateStimuli(spreadsheet)
    .then(
    (result: {images: string[], audios: string[], videos: string[]} )=>{
        stimuliCollection = result;
        $('#gorilla').append(loadingScreenHTML);
        totalStimuliToLoad = stimuliCollection.images.length + stimuliCollection.audios.length + stimuliCollection.videos.length;

        $('.total-stimuli').html(totalStimuliToLoad);
        $('.total-number-counter').html(totalStimuliToLoad);
        $('.current-number-counter').html(0);
        console.log(totalStimuliToLoad);

        // Create our batched set of stimuli
        if(stimuliCollection.images.length > 0){
            var batchedImageStimuli: string[][] = CreateBatches(stimuliCollection.images);
                // This is a mapSeries, made available in the Bluebird Promise library
            // We can pass it an array of things and it will execute the defined function/promise chain
            // on each thing IN SERIES
            return promise.mapSeries(batchedImageStimuli, (singleBatch: string[], index, arrayLength)=>{
                // We're going to load a batch of stimuli in one go
                // We'll set this up as an array of promises which will get executed by promise.all
                // Start time for our batch
                var batchStartTime: number = Date.now();

                var promises = [];
                for(var i = 0; i<singleBatch.length; i++){
                    promises.push(
                    loadSingleImage(singleBatch[i])
                    .then(
                    (timeToLoad: number)=>{
                        // update our count of loaded stimuli
                        loadedStimuliCount++;
                        // Update any single stimuli elements of our UI
                        // At the moment, this is just the current number of stimuli loaded
                        $('.current-number-counter').html(loadedStimuliCount);
                    }))
                }

                return promise.all(promises)
                .then(
                (result)=>{
                    var batchEndTime: number = Date.now();
                    var timeTakenOnBatch: number = batchEndTime - batchStartTime;
                    currentTotalLoadingTime += timeTakenOnBatch;
                    var timePerImage: number = currentTotalLoadingTime / loadedStimuliCount;
                    var timeToDownloadRemainder: number = timePerImage * ( totalStimuliToLoad - loadedStimuliCount);

                    // Update batch specific elements of the UI
                    $('.download-time-remain').html(FormatTime(timeToDownloadRemainder));
                    $('.download-time-total').html(FormatTime(currentTotalLoadingTime));
                })
            })
        } else {
            return promise.resolve();
        }
    })
    .then(
    ()=>{
        var combinedAVStimuli: string[] = stimuliCollection.audios.concat(stimuliCollection.videos);
        if(combinedAVStimuli.length > 0){
            // Create our batched set of stimuli
            var batchedStimuli: string[][] = CreateBatches(combinedAVStimuli);

            return promise.mapSeries(batchedStimuli, (singleBatch: string[], index, arrayLength)=>{
                // We're going to load a batch of stimuli in one go
                // We'll set this up as an array of promises which will get executed by promise.all
                // Start time for our batch
                var batchStartTime: number = Date.now();

                var promises = [];
                for(var i = 0; i<singleBatch.length; i++){
                    promises.push(
                    loadSingleAudioVisual(singleBatch[i])
                    .then(
                    (result: { newStimuliMapping: {stimuliName: string, stimuliEmbeddedDataKey: string, stimuliNewURL: string}, timeToLoad: number})=>{
                        // first, add our new mapping to our associative array
                        completeStimuliRemappings[result.newStimuliMapping.stimuliName] = result.newStimuliMapping;
                        // save our embedded data
                        gorilla.store(result.newStimuliMapping.stimuliEmbeddedDataKey, result.newStimuliMapping.stimuliNewURL, true);
                        // update our count of loaded stimuli
                        loadedStimuliCount++;

                        // Update any single stimuli elements of our UI
                        // At the moment, this is just the current number of stimuli loaded
                        $('.current-number-counter').html(loadedStimuliCount);
                    }))
                }

                return promise.all(promises)
                .then(
                (result)=>{
                    var batchEndTime: number = Date.now();
                    var timeTakenOnBatch: number = batchEndTime - batchStartTime;
                    currentTotalLoadingTime += timeTakenOnBatch;
                    var timePerImage: number = currentTotalLoadingTime / loadedStimuliCount;
                    var timeToDownloadRemainder: number = timePerImage * ( totalStimuliToLoad - loadedStimuliCount);

                    // Update batch specific elements of the UI
                    $('.download-time-remain').html(FormatTime(timeToDownloadRemainder));
                    $('.download-time-total').html(FormatTime(currentTotalLoadingTime));
                })
            })
        } else {
            return promise.resolve();
        }
    })
    .then(
    ()=>{
        console.log('All stimuli loaded');
        // Now, parse through the spreadsheet, replacing our audio/video entries with the equivalent embedded data content
        for(var i = 0; i < spreadsheet.length; i++){
            // The next step varies depending on whether we are filtering by extension
            if(_useExtensions){
                // Go through out listing of stimuli columns and try to work out what kind of stimuli it is based on it's extension
                for(let stimCol = 0; stimCol < _generalStimuliColumns.length; stimCol++){
                    if(spreadsheet[i][_generalStimuliColumns[stimCol]] && spreadsheet[i][_generalStimuliColumns[stimCol]].length > 0){
                        const currentExtension: string = spreadsheet[i][_generalStimuliColumns[stimCol]].split('.').pop();
                        if(_audioExtensions.includes(currentExtension)){
                            const audioName: string = spreadsheet[i][_generalStimuliColumns[stimCol]];
                            const audioEmbeddedDataKey = audioName.replace(/\.[^/.]+$/, "").replace(/\s/g, '');
                            spreadsheet[i][_generalStimuliColumns[stimCol]] = '$${' + audioEmbeddedDataKey + '}';
                        } else if(_videoExtensions.includes(currentExtension)){
                            const videoName: string = spreadsheet[i][_generalStimuliColumns[stimCol]];
                            const videoEmbeddedDataKey = videoName.replace(/\.[^/.]+$/, "").replace(/\s/g, '');
                            spreadsheet[i][_generalStimuliColumns[stimCol]] = '$${' + videoEmbeddedDataKey + '}';
                        } else {
                            //console.log(`Could not determine stimuli type for ${spreadsheet[i][_generalStimuliColumns[stimCol]]}`);
                        }
                    }
                }
            } else {
                for(let j = 0; j < _audioStimuliColumns.length; j++){
                    if(spreadsheet[i][_audioStimuliColumns[j]] && spreadsheet[i][_audioStimuliColumns[j]].length > 0){
                        const audioName: string = spreadsheet[i][_audioStimuliColumns[j]];
                        const audioEmbeddedDataKey = audioName.replace(/\.[^/.]+$/, "").replace(/\s/g, '');
                        spreadsheet[i][_audioStimuliColumns[j]] = '$${' + audioEmbeddedDataKey + '}';
                    }
                }

                for(let k = 0; k < _videoStimuliColumns.length; k++){
                    if(spreadsheet[i][_videoStimuliColumns[k]] && spreadsheet[i][_videoStimuliColumns[k]].length > 0){
                        const videoName: string = spreadsheet[i][_videoStimuliColumns[k]];
                        const videoEmbeddedDataKey = videoName.replace(/\.[^/.]+$/, "").replace(/\s/g, '');
                        spreadsheet[i][_videoStimuliColumns[k]] = '$${' + videoEmbeddedDataKey + '}';
                    }
                }
            }
        }
        $('#gorilla').empty();
        done();
    })
});


gorillaTaskBuilder.preProcessSpreadsheet((spreadsheet: any[])=>{
    return _modifiedSpreadsheet;
});

// This function will test whether or not the participant is in fullscreen
// As almost every browser has its own variable for checking this, we need to test them all
function isFullscreen(){
    return (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement);
}

// This function will launch the participant into fullscreen
// As above, we have to call a different function for every browser
function launchIntoFullscreen(element){
    if(element.requestFullscreen) {
    element.requestFullscreen();
  } else if(element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if(element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if(element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
}

gorillaTaskBuilder.onScreenStart((spreadsheet: any, rowIndex: number, screenIndex: number, row: any, container: string) => {
    // Check we are on the designated display and screen for the fullscreen check
    if(row.display == 'full_screen' && screenIndex == 0){
        // Hide the contents of the fullscreen check div
        $(container + ' .fullscreen-check').hide();
        // Check if we aren't in fullscreen
        if(!isFullscreen()){
            // display the fullscreen check information (that requests the user be in fullscreen)
            $(container + ' .fullscreen-check').show();
            // Refresh the layout, to make sure everything is laid out on the page correct
            gorilla.refreshLayout();
            $(container + ' .fullscreen-button').on('click', (event) => {
                launchIntoFullscreen(document.documentElement);
                // forceAdvance() advances on to the next screen of a display or, if there are no more more screens, onto the next row of the spreadsheet
                gorillaTaskBuilder.forceAdvance();
            });
        } else {
            // This short timeout is necessary because of the ordering of gorillaTaskBuilder hooks (onScreenStart, forceAdvance etc.) in the backend.
            // without it, the forceAdvance function can be run before it's actually been intialised to anything
            setTimeout(function(){
                gorillaTaskBuilder.forceAdvance();
            }, 1);
        }
    };

      // First, check if we have a requiredDisplay set and if it matches the current display
    // row corresponds to the current spreadsheet row we are on. row.display returns the value of the 'Display' column in that row
    if(row.display == "start" || row.display == "block_intro"|| row.display == "videoblock" || row.display == "videoblock_verb"){

        // check if we have a requiredScreen set and if it matches the required screen
        // screenIndex gives us the index of the current screen we are on
        // Note that we want to check that _requiredScreen has been set (this is always a good safety check) BUT _requiredScreen
        // could itself be zero (which would normally evaluate to false)
        // So we have to check if it exists or if it is equal to 0.  If either one of these is true then the whole left hand (in brackets)
        // evaulates as true
        if(screenIndex == 0 || screenIndex == 1 || screenIndex == 2 ){
            // NB By default, even if controls are set to be hidden on the HTML element (which they are in Gorilla by default)
            // Google Chrome will show them again when you go to fullscreen because...
            // Well, because Chrome just decides that's what it wants to do... Thanks for being helpful Chrome (NOT!)
            // Appending the styling below will prevent this from happening and make sure controls remain hidden!

            $('body').append('<style> video::-webkit-media-controls { display:none !important; } </style>');

            // The changes that affect autoplay also affect the ability to make a video element fullscreen
            // Fullscreen must be initiated by a user interaction i.e. it must be in responde to a click action
            // So, we'll add an additional on click function to our video element
            // JULY 2020 update
            // Fixed to allow for binding to either video or overlay
            // First, wait a frame to make sure everything is bound/setup by gorilla
            setTimeout(()=>{
                var selector: string = '';
                if($(container + ' .overlay').is(':visible')){
                    selector = container + ' .overlay';
                } else {
                    selector = container + ' video';
                }
                $(selector).on('click.custom', (event)=>{
                    $(selector).off('click.custom');
                    // First, collect the audio element for the page
                    var videoElement = $(container + ' video');
                    // And now...
                    // So, because the fullscreen api is not yet standardised almost every browser has its own function
                    // to initiate fullscreen
                    // We'll go through each of the possibilities in turn
                    // In the if statement, we'll check to see if the required function exists
                    // if it does, we'll call it
                    // Please note that Mozilla has seen fit to deviate from all the other browsers and chosen to capitalise
                    // the s of Screen
                    // This, gathered Gorilla users, is why we have API standards and why they should be
                    // agreed upon and inacted as swiftly as reasonably possible
                    if (videoElement[0].requestFullscreen) {
                        videoElement[0].requestFullscreen(); // Standard
                    } else if (videoElement[0].webkitRequestFullscreen) {
                        videoElement[0].webkitRequestFullscreen(); // Chrome, Opera, Safari, Edge
                    }else if (videoElement[0].mozRequestFullScreen) {
                        videoElement[0].mozRequestFullScreen(); // Firefox
                    } else if (videoElement[0].msRequestFullscreen){
                        videoElement[0].msRequestFullscreen(); // IE
                    }

                    // now, disable the cursor
                    $('body').css({'cursor' : 'none'});
                });
            }, 16)
        };
    }; //end of second required screen

    /* Autoplay does not work with full screen...
    function autoFullScreen() {
         $('body').append('<style> video::-webkit-media-controls { display:none !important; } </style>');
         $(container + ' video').on('play', (event)=>{
             var videoElement = $(container + ' video');
             if (videoElement[0].requestFullscreen) {
                    videoElement[0].requestFullscreen();
                } else if (videoElement[0].mozRequestFullScreen) {
                    videoElement[0].mozRequestFullScreen();
                } else if (videoElement[0].webkitRequestFullscreen) {
                    videoElement[0].webkitRequestFullscreen();
                }
         }); //
    };*/

     $('body').css({'cursor' : 'pointer'});

/*
    var _puzzle: string = gorilla.retrieve("puzzle", null, true);
    console.log(_puzzle)

     if(row.display == "break"){
         if(screenIndex == 0){
           if(_puzzle == "space_blurred.jpg"){
              var chosenPuzzle = row.image3
           } else if(_puzzle == "space_blurred1.jpg"){
               var chosenPuzzle = row.image4
           } else if(_puzzle == "space_blurred3.jpg"){
               var chosenPuzzle = row.image6
           }
           var stimuliURL: string = gorilla.stimuliURL(chosenPuzzle);
           $(container + ' .' + "breakimage").attr('src', stimuliURL);
         };
       };
       */
     if(row.display=="end"){
         // Go through out listing of stimuli columns and try to work out what kind of stimuli it is based on it's extension
        for(var i = 0; i < spreadsheet.length; i++){
            for(let stimCol = 0; stimCol < _generalStimuliColumns.length; stimCol++){
                if(spreadsheet[i][_generalStimuliColumns[stimCol]] && spreadsheet[i][_generalStimuliColumns[stimCol]].length > 0){
                    const currentExtension: string = spreadsheet[i][_generalStimuliColumns[stimCol]].split('.').pop();
                    if(_audioExtensions.includes(currentExtension)){
                        const audioEmbeddedDataString: string = spreadsheet[i][_generalStimuliColumns[stimCol]];
                        const audioEmbeddedDataKey = audioEmbeddedDataString.replace(/\$\$\{/, "").replace(/\}/, "");
                        gorilla.store(audioEmbeddedDataKey, null, true);
                    } else if(_videoExtensions.includes(currentExtension)){
                        const videoEmbeddedDataString: string = spreadsheet[i][_generalStimuliColumns[stimCol]];
                        const videoEmbeddedDataKey = videoEmbeddedDataString.replace(/\$\$\{/, "").replace(/\}/, "");
                        gorilla.store(videoEmbeddedDataKey, null, true);
                    } else {
                        //console.log(`Could not determine stimuli type for ${spreadsheet[i][_generalStimuliColumns[stimCol]]}`);
                    }
                }
            }
        }
     }


});


// This function runs when the current screen finishes - this is when the screen is about to advance to the next
gorillaTaskBuilder.onScreenFinish((spreadsheet: any, rowIndex: number, screenIndex: number, row: any, container: string, correct: boolean) => {
    // As above, find the required display and screen


    if((row.display == "start" & screenIndex == 1) || (row.display == "block_intro" & (screenIndex == 0 || screenIndex == 1 || screenIndex == 2 )) || (row.display == "videoblock" & (screenIndex == 0 || screenIndex == 1)) || (row.display == "videoblock_verb" & (screenIndex == 0 || screenIndex == 1))){
        var videoElement = $(container + ' video');
            if (videoElement[0].exitFullscreen) {
                videoElement[0].exitFullscreen(); // Standard
            } else if (videoElement[0].webkitExitFullscreen) {
                videoElement[0].webkitExitFullscreen(); // Chrome, Opera, Safari, Edge
            } else if (videoElement[0].mozCancelFullScreen) {
                videoElement[0].mozCancelFullScreen(); // Firefox
            } else if (document.msExitFullscreen) {
                videoElement[0].msExitFullscreen(); // IE
            }

            // now, reenable the cursor
            $('body').css({'cursor' : 'auto'});
        }
    }
});
