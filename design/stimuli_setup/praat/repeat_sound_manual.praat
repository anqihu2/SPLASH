
# This script is for concatening files with the same target word
# Right now,  from_to_by# () does not work because of the version of Praat, try again after update.
# Doing manual selection of even and off files now.

form Concatenate sound files
	comment Directory of input sound files
    sentence sound_file_extension .wav
	sentence output_dir /Users/jojohu/Documents/Splash/video_stimuli/instruction/sound_stim/concatenated_sound/
	sentence final_dir /Users/jojohu/Documents/Splash/video_stimuli/instruction/sound_stim/repeated_target_trial/
	sentence like_dir /Users/jojohu/Documents/Splash/video_stimuli/instruction/sound_stim/like_it/
	sentence see_dir /Users/jojohu/Documents/Splash/video_stimuli/instruction/sound_stim/see_it/
endform

# Concatenate the same target word phrases
Create Strings as file list... concatList 'output_dir$'*'sound_file_extension$'
numberOfConcatFiles = Get number of strings

Create Strings as file list... seeList 'see_dir$'*'sound_file_extension$'
numberOfSeeFiles = Get number of strings

Create Strings as file list... likeList 'like_dir$'*'sound_file_extension$'
numberOfLikeFiles = Get number of strings

blankSound$ = "/Users/jojohu/Documents/Splash/video_stimuli/instruction/sound_stim/blank.wav"
Read from file... 'blankSound$'

# Even and Odd total number of rows should have the same length
# Concatenate sounds from the like_it and see_it folders

for xfile from 1 to numberOfSeeFiles
	select Strings seeList
	seeFilename$ = Get string... xfile	
	seeSoundFilename$ = "Sound" + " " + seeFilename$ - sound_file_extension$
	Read from file... 'see_dir$''seeFilename$'

	#Concanenate works in the order the files are read in, not the order it is selected in a single for loop
	blankSound$ = "/Users/jojohu/Documents/Splash/video_stimuli/instruction/sound_stim/blank.wav"
	Read from file... 'blankSound$'

	select Strings likeList
	likeFilename$ = Get string... xfile	
	likeSoundFilename$ = "Sound" + " " + likeFilename$ - sound_file_extension$
	Read from file... 'like_dir$''likeFilename$'


	selectObject()
	selectObject: seeSoundFilename$
	plusObject: "Sound blank"
	plusObject: likeSoundFilename$
	Concatenate

	repeatFile$ = final_dir$ + seeFilename$
	Write to WAV file... 'repeatFile$'
endfor
