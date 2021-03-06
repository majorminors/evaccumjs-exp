function coh_stimulus_array_generator_with_angle(num_blocks, num_trials_per_block, num_cues, coh_point_values, num_point_tests, angle) {
	console.log("coherence stimulus array");

	/* requires:
		num_blocks: how many times you want to repeat your trial sets
		num_trials_per_block: how many trials you want
		num_cues: how many cues there are
	*/

    /* output:
		array with length equal to num_blocks. assume you called the function into 'array':
		array[0][0] = array[block 1][trial 1]
		each element in the array is a nested array of objects. This nested array length is equal to num_trials_per_block.
		each object in the nested array contains all the info for a single trial. Objects contain the following keys:
    
     	- cue_dir = cue direction (1-4)
     	- cue_dir_deg = cue direction (in degrees)
		- match_arrow = what arrow is the correct motion direction
		- dot_motion_deg = the degrees of the dot motion (either cue_dir_deg, or 180 + cue_dir_deg) modified (randomly +/-) by the angle you provide as `angle`
		- dot_motion_deg_rdk = dot motion converted from clockface to math circle for rdk plugin
		- coh_point_code = a code referring to ascending value of coherence
		- coherence_value = the coherence value
	*/

    /* helper functions */ 
	// generate a range between two values - replicating MATLABs ':' range function 
    function range_fun(start,stop,step) {
        return Array(Math.ceil((stop-start+1)/step)).fill(start).map(function(x,y) {
            return x+(y*step);
        });
    }
    // sort a numeric array in ascending order - replicating MATLABs 'sort' function
    function sort_num_array(num_array) {
        return num_array.sort(function(a,b) {return a-b;});
    }
    // shuffle the order of an array - like a deck of cards - picks 1 card randomly from the deck, decrements the deck by one, then picks another and so on.
	// we'll use this to shuffle the trial orders at the end
    function shuffle(array) {
        var copy_array = array.slice(0);
        var m = copy_array.length,
            t, i;
        // While there remain elements to shuffle…
        while (m) {
            // Pick a remaining element…
            i = Math.floor(Math.random() * m--);
            // And swap it with the current element.
            t = copy_array[m];
            copy_array[m] = copy_array[i];
            copy_array[i] = t;
        }
        return copy_array;
    }

    /* create the sets of trial info */
    var cue_directions = range_fun(45,315, 90); // create the cue directions in degrees
    console.log("cue directions: ", cue_directions);
    // create an array of length equal to number of trials per cue (e.g. 16 for 4 cues and 64 trials per block), 
    // then for each item in this array, replace each element with the array of cues,
    // then flatten this nested array, which returns an array of length equal to the number of trials per block (e.g. 64), 
    // finally, sort the array with the 'sort_num_array' function
    var cues = range_fun(1,4,1);
    var cue_dir = sort_num_array(Array.apply(null, Array(num_trials_per_block/num_cues)).map(function(){return cues;}).flat());
	var test = Array.apply(null, Array(num_trials_per_block/num_cues)).map(function(){return cues;}).flat();
	console.log(test);
    console.log("cue directions", cue_dir);
	// make a copy of cue_dir, then use the values to get values from corresponding cue_directions
    var cue_dir_deg = cue_dir.slice(0).map(function(x,i) {return cue_directions[x-1];}); 
    console.log("cue direction degrees: ", cue_dir_deg);
	// now we want dot motion degrees - half to go in direction of cue, half in opposite direction and also a code to use if we need
	var match_arrow = cue_dir_deg.map(function(x,i) {if (i % 2 == 0) {return 2;} return 1;});
	console.log("dot motion match arrow 1 or 2: ", match_arrow);
	var dot_motion_deg = cue_dir_deg.map(function(x,i) {if (i % 2 == 0) {return x + 180;} return x;});
    console.log('dot motion in degrees:', dot_motion_deg);
    var dot_motion_deg_with_angle_adjustment = dot_motion_deg.map(function(x,i) {
        modifier = Math.round(Math.random()); // pseudorandomly get a 0 or 1
        if (modifier == 0) { // use the modifier to determine whether to add or subtract the angle offset
            x = x + angle;
        } else if (modifier == 1) {
            x = x - angle;
        }
        return x;
    });
	if (dot_motion_deg_with_angle_adjustment) { // if i in the while loop isn't defined, it'll loop forever
		i = dot_motion_deg_with_angle_adjustment.length
		while (i--) { // make these circular (-360 if over 360)
			if (dot_motion_deg_with_angle_adjustment[i] > 360) {
				dot_motion_deg_with_angle_adjustment[i] -= 360;
			}
		}
	}
	console.log("dot motion direction degrees with angle adjustment: ", dot_motion_deg_with_angle_adjustment);
	// convert that into values the RDK plugin would understand (not clockface, but traditional math circle)
	var dot_motion_deg_rdk = dot_motion_deg_with_angle_adjustment.slice(0).map(x => (360 - (x - 90)) % 360); // using modulus to figure out if bigger/smaller than 360
	console.log("dot motion coverted for rdk: ", dot_motion_deg_rdk);
	// now add a code for the point values, and the point values
	var coh_point_codes = range_fun(1,coh_point_values.length,1);	
	var coh_point_code = Array.apply(null, Array(num_point_tests)).map(function(){return coh_point_codes;}).flat();
	console.log("coherence point code: ", coh_point_code);
	var coherence_value = Array.apply(null, Array(num_point_tests)).map(function(){return coh_point_values;}).flat();
	console.log("coherence values: ", coherence_value);

    // *** put the info for each trial into an object, and put these trial objects into the block info array ***
    var block_info = [];
    for (var i=0; i<num_trials_per_block; i++) {
        var trial_info = {
            cue_dir: cue_dir[i],
            cue_dir_deg: cue_dir_deg[i],
			match_arrow: match_arrow[i],
			dot_motion_deg: dot_motion_deg_with_angle_adjustment[i],
			dot_motion_deg_rdk: dot_motion_deg_rdk[i],
			coh_point_code: coh_point_code[i],
			coherence_value: coherence_value[i],
        };
        block_info.push(trial_info);
    }
    console.log("block info (before shuffling): ", block_info);

    // *** use the block info to create each block of trials ***
    // for each block, shuffle all rows/trials, then sort the shuffled rows by cue_dir
    var all_blocks = [];
    for (var j=0; j<num_blocks; j++) {
        var shuffled_block = shuffle(block_info);
        shuffled_block.sort(function(a,b) {
            return a.cue_dir - b.cue_dir;
        });
        all_blocks.push(shuffled_block);
    }
    console.log("all blocks: ", all_blocks);
    
    return all_blocks;
}
