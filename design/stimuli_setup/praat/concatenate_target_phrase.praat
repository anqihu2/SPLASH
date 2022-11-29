########################
#
#  This script takes multiple sound files from different
#  directories and concatenates them into a single sound
#  file.  The final file is saved as specified. 
#
#	This script can be modified so that more for loops are embedded and more files can be concatenated at once. This script takes an extra step: it generates short concatenated files in the Objects window first and select the files directly from the Objects. This is helpful for sound editing during concatenation.
#
########################

form Concatenate target phrases files
	comment Directory of input sound files
	sentence initial_sound /Users/jojohu/Documents/Splash/video_stimuli/instruction/sound_stim/initial_sound/
	sentence second_sound /Users/jojohu/Documents/Splash/video_stimuli/instruction/sound_stim/second_sound/
    sentence sound_file_extension .wav
	sentence output_dir /Users/jojohu/Documents/Splash/video_stimuli/instruction/sound_stim/target_phrase/
endform

# Here, you make a listing of all the sound files in the specified directory.

Create Strings as file list... initialList 'initial_sound$'*'sound_file_extension$'
numberOfInitialFiles = Get number of strings

Create Strings as file list... secondList 'second_sound$'*'sound_file_extension$'
numberOfSecondFiles = Get number of strings


# Use only these two for loops to concatenate target phrases
for jfile from 1 to numberOfInitialFiles
	select Strings initialList
	intialFilename$ = Get string... jfile
	initialSoundFileName$ = "Sound" + " " + intialFilename$ - sound_file_extension$
	Read from file... 'initial_sound$''intialFilename$'

	for kfile from 1 to numberOfSecondFiles
		select Strings secondList
		secondFilename$ = Get string... kfile
		secondSoundFileName$ = "Sound" + " " + secondFilename$ - sound_file_extension$
		Read from file... 'second_sound$''secondFilename$'

		# Concanenate the files:
		selectObject: initialSoundFileName$
		plusObject: secondSoundFileName$
		Concatenate

		# Use this for saving concatenated target phrases
		outputfile$ = output_dir$ + intialFilename$ - ".wav" + "_" + secondFilename$

		Write to WAV file... 'outputfile$'
	endfor
endfor
