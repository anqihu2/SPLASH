########################
#
#  This script takes multiple sound files from different
#  directories and concatenates them into a single sound
#  file.  The final file is saved as specified. 
#
#	This script can be modified so that more for loops are embedded and more files can be concatenated at once. This script takes an extra step: it generates short concatenated files in the Objects window first and select the files directly from the Objects. This is helpful for sound editing during concatenation.
#
########################

form Concatenate sound files
	comment Directory of input sound files
	sentence intro_sound /Users/jojohu/Documents/Splash/video_stimuli/instruction/sound_stim/intro_sound/
	sentence initial_sound /Users/jojohu/Documents/Splash/video_stimuli/instruction/sound_stim/initial_sound/
	sentence second_sound /Users/jojohu/Documents/Splash/video_stimuli/instruction/sound_stim/second_sound/
	sentence third_sound /Users/jojohu/Documents/Splash/video_stimuli/instruction/sound_stim/third_sound/
	sentence target_sound /Users/jojohu/Documents/Splash/video_stimuli/instruction/sound_stim/target_phrase/
    sentence sound_file_extension .wav
	sentence like_dir /Users/jojohu/Documents/Splash/video_stimuli/instruction/sound_stim/like_it/
	sentence output_dir /Users/jojohu/Documents/Splash/video_stimuli/instruction/sound_stim/concatenated_sound/
endform

# Here, you make a listing of all the sound files in the specified directory.

Create Strings as file list... introList 'intro_sound$'*'sound_file_extension$'
numberOfIntroFiles = Get number of strings

Create Strings as file list... initialList 'initial_sound$'*'sound_file_extension$'
numberOfInitialFiles = Get number of strings

Create Strings as file list... secondList 'second_sound$'*'sound_file_extension$'
numberOfSecondFiles = Get number of strings

Create Strings as file list... thirdList 'third_sound$'*'sound_file_extension$'
numberOfThirdFiles = Get number of strings

Create Strings as file list... targetList 'target_sound$'*'sound_file_extension$'
numberOfTargetFiles = Get number of strings


# Start a global index for the array below:
index = 0

for ifile from 1 to numberOfIntroFiles
	select Strings introList
	introFilename$ = Get string... ifile
    introSoundFileName$ = "Sound" + " " + introFilename$ - sound_file_extension$
	Read from file... 'intro_sound$''introFilename$'

	for yfile from 1 to numberOfTargetFiles
		select Strings targetList
		targetFilename$ = Get string... yfile
    	targetSoundFileName$ = "Sound" + " " + targetFilename$ - sound_file_extension$
		Read from file... 'target_sound$''targetFilename$'


		# Concanenate the files:
		selectObject: introSoundFileName$
		plusObject: targetSoundFileName$
		Concatenate
		
		# Rename the concanenated file:
       	tempfile$ = introFilename$ - sound_file_extension$ + "_" + targetFilename$ - sound_file_extension$
		selectObject: "Sound chain"
		Rename: tempfile$

		# Creat an array of the names of the concatenated files:
		index = index + 1
		conFileList$[index] = "Sound" +  " " + tempfile$
				
		# To Do: Put this above so every step is in one script
		# Use only these two for loops to concatenate target phrases 
		#for jfile from 1 to numberOfInitialFiles
			#select Strings initialList
			#intialFilename$ = Get string... jfile
    		#initialSoundFileName$ = "Sound" + " " + intialFilename$ - sound_file_extension$
			#Read from file... 'initial_sound$''intialFilename$'

			#for kfile from 1 to numberOfSecondFiles
				#select Strings secondList
				#secondFilename$ = Get string... kfile
    			#secondSoundFileName$ = "Sound" + " " + secondFilename$ - sound_file_extension$
				#Read from file... 'second_sound$''secondFilename$'

				# Concanenate the files:
				#plusObject: initialSoundFileName$
				#plusObject: secondSoundFileName$
				#Concatenate

				# Use this for saving concatenated target phrases
				#outputfile$ = output_dir$ + intialFilename$ - ".wav" + "_" + secondFilename$
				
				#Write to WAV file... 'outputfile$'
			#endfor
		#endfor
	endfor
endfor


# Get the total number of concatenated files in the object window:
totalConFile = numberOfIntroFiles*numberOfTargetFiles



# Concatenate the third sound with the already concatenated files in the object window:
for zfile from 1 to numberOfThirdFiles
	select Strings thirdList
	thirdFilename$ = Get string... zfile
    thirdSoundFileName$ = "Sound" + " " + thirdFilename$ - sound_file_extension$
	Read from file... 'third_sound$''thirdFilename$'

	for i from 1 to totalConFile

		# Concanenate the files:
		selectObject()
		selectObject: thirdSoundFileName$
		plusObject: conFileList$[i]
		Concatenate

		conFileName$ = replace$(conFileList$[i], "Sound ", "", 0)
		
		# Save the concatenated files:
		outputfile$ = output_dir$ + conFileName$ + "_" + thirdFilename$
		Write to WAV file... 'outputfile$'
 	endfor
endfor


form Concatenate sound files
	comment Directory of input sound files
	sentence intro_sound /Users/jojohu/Documents/Splash/video_stimuli/instruction/sound_stim/intro_sound/
	sentence initial_sound /Users/jojohu/Documents/Splash/video_stimuli/instruction/sound_stim/initial_sound/
	sentence second_sound /Users/jojohu/Documents/Splash/video_stimuli/instruction/sound_stim/second_sound/
	sentence third_sound /Users/jojohu/Documents/Splash/video_stimuli/instruction/sound_stim/third_sound/
	sentence target_sound /Users/jojohu/Documents/Splash/video_stimuli/instruction/sound_stim/target_phrase/
    sentence sound_file_extension .wav
	sentence like_dir /Users/jojohu/Documents/Splash/video_stimuli/instruction/sound_stim/like_it/
	sentence output_dir /Users/jojohu/Documents/Splash/video_stimuli/instruction/sound_stim/concatenated_sound/
endform

# Here, you make a listing of all the sound files in the specified directory.

Create Strings as file list... introList 'intro_sound$'*'sound_file_extension$'
numberOfIntroFiles = Get number of strings

Create Strings as file list... initialList 'initial_sound$'*'sound_file_extension$'
numberOfInitialFiles = Get number of strings

Create Strings as file list... secondList 'second_sound$'*'sound_file_extension$'
numberOfSecondFiles = Get number of strings

Create Strings as file list... thirdList 'third_sound$'*'sound_file_extension$'
numberOfThirdFiles = Get number of strings

Create Strings as file list... targetList 'target_sound$'*'sound_file_extension$'
numberOfTargetFiles = Get number of strings


# Concatenate only the target phrase with the third sound:
# for targfile from 1 to numberOfTargetFiles
# 	select Strings targetList
# 	targetFilename$ = Get string... targfile
# 	targetSoundFileName$ = "Sound" + " " + targetFilename$ - sound_file_extension$
# 	Read from file... 'target_sound$''targetFilename$'
# 
# 	for tfile from 1 to numberOfThirdFiles
# 		select Strings thirdList
# 		thirdFilename$ = Get string... tfile
# 		thirdSoundFileName$ = "Sound" + " " + thirdFilename$ - sound_file_extension$
# 		Read from file... 'third_sound$''thirdFilename$'
# 
# 
# 		# Concanenate the files:
# 		selectObject: targetSoundFileName$
# 		plusObject: thirdSoundFileName$
# 		Concatenate
# 
# 		# Use this for saving concatenated target phrases
# 		targetThird$ = like_dir$ + targetFilename$ - ".wav" + "_" + thirdFilename$
# 		
# 		# iTunes seems to have a bug and play the first and last concatenated sound reversely; use Praat to listen to them
# 		Write to WAV file... 'targetThird$'
# 	endfor
# endfor

for targfile from 1 to numberOfTargetFiles
	select Strings targetList
	targetFilename$ = Get string... targfile
	targetSoundFileName$ = "Sound" + " " + targetFilename$ - sound_file_extension$
	Read from file... 'target_sound$''targetFilename$'

	for tfile from 1 to numberOfThirdFiles
		select Strings thirdList
		thirdFilename$ = Get string... tfile
		thirdSoundFileName$ = "Sound" + " " + thirdFilename$ - sound_file_extension$
		Read from file... 'third_sound$''thirdFilename$'


		# Concanenate the files:
		selectObject: targetSoundFileName$
		plusObject: thirdSoundFileName$
		Concatenate

		# Use this for saving concatenated target phrases
		targetThird$ = like_dir$ + targetFilename$ - ".wav" + "_" + thirdFilename$

		# iTunes seems to have a bug and play the first and last concatenated sound reversely; use Praat to listen to them
		Write to WAV file... 'targetThird$'
	endfor
endfor