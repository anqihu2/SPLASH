
# This script is for concatening files with the same target word
# Right now,  from_to_by# () does not work because of the version of Praat, try again after update.
# Doing manual selection of even and off files now.

form Concatenate sound files
	comment Directory of input sound files
    sentence sound_file_extension .wav
	sentence output_dir /Users/jojohu/Documents/Splash/video_stimuli/instruction/sound_stim/concatenated_sound/
	sentence final_dir /Users/jojohu/Documents/Splash/video_stimuli/instruction/sound_stim/repeated_target_trial/
endform

# Concatenate the same target word phrases
Create Strings as file list... concatList 'output_dir$'*'sound_file_extension$'
numberOfConcatFiles = Get number of strings


# Select the even and odd rows from the string list:
indexOdd# = from_to_by# (-1, numberOfConcatFiles, 2)
indexEven# = from_to_by# (0, numberOfConcatFiles, 2)

odd$ = concatList$[index0dd#]
even$ = concatList$[indexEven#]

# Even and Odd total number of rows should have the same length
numberOfOddFiles = length(odd$)

for xfile from 1 to numberOfOddFiles
	select Strings odd$
	oddFilename$ = Get string... xfile	
	oddSoundFilename$ = "Sound" + " " + oddFilename$ - sound_file_extension$
	Read from file... 'output_dir$''oddFilename$'

	select Strings even$
	evenFilename$ = Get string... xfile	
	evenSoundFilename$ = "Sound" + " " + evenFilename$ - sound_file_extension$
	Read from file... 'output_dir$''evenFilename$'

	selectObject()
	selectObject: evenSoundFilename$
	plusObject: oddSoundFilename$
	Concatenate

	repeatFile$ = final_dir$ + concatFilename$
	# Write to WAV file... 'repeatFile$'
endfor
