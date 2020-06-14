function rule_stimulus_array_generator(num_blocks, num_trials_per_block, num_cues, rule_point_values, num_point_tests) {
	console.log("rule stimulus array");

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
		- rule_point_code = a code for the ascending point values
		- rule_value: the actual test values for each point
		- match_arrow: what arrow is the coherence moving toward
		- coh_direction_deg: direction of coherent motion
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
    console.log("cue directions", cue_dir);
	// make a copy of cue_dir, then use the values to get values from corresponding cue_directions
    var cue_dir_deg = cue_dir.slice(0).map(function(x,i) {return cue_directions[x-1];}); 
    console.log("cue direction degrees: ", cue_dir_deg);
	// now add a code for the point values, and the point values
	var rule_point_codes = range_fun(1,rule_point_values.length,1);	
	var rule_point_code = Array.apply(null, Array(num_point_tests)).map(function(){return rule_point_codes;}).flat();
	console.log("rule point code: ", rule_point_code);
	var rule_value = Array.apply(null, Array(num_point_tests)).map(function(){return rule_point_values;}).flat();
	console.log("rule values: ", rule_value); 
	// now we want dot motion degrees - half of the point tests to go in direction of cue, half in opposite direction and also a code to use if we need
	// var match_arrow = cue_dir_deg.map(function(x,i) {if (i % 2 == 0) {return 2;} return 1;});
	var match_arrow = [1]; // we'll loop on this entering x into the array, and the value of x changes from 1 - 2 every length of rule_point_values)
	i = 0;
	x = 1;
	checkiandj: while (match_arrow.length < num_trials_per_block) {
		j = 0;
		checkj: while (j < rule_point_values.length) {
			j++;
			match_arrow[i] = x;
			i++;
		}
		if (i/10 % 2 == 0) {x = 1;} else {x = 2;}
	}
	console.log("dot motion match arrow 1 or 2: ", match_arrow);
	// 1,1,2,2 repeated for num trials / 4 (for length of 1,1,2,2) - since we already have a 1,2 repeating, we need to do this or they'll overlap systematically
	var add_or_subtract = Array.apply(null, Array(num_trials_per_block / 4)).map(function(){return [1,1,2,2];}).flat();
	console.log("whether the trial should add (1) or subtract (2): ", add_or_subtract)
	// now we make a coherence direction, incorporating rule point distance from cue and additions/subtractions
	var coh_direction_deg_oneway = cue_dir_deg.map(function(x,i) {if (add_or_subtract[i] == 1) {return x + rule_value[i]} else if (add_or_subtract[i] == 2) {return x - rule_value[i]}});
	console.log(coh_direction_deg_oneway);
	// now we modify the coherence direction to match the appropiate arrow (instead of just the arrow the cue is named after)
	var coh_direction_deg = coh_direction_deg_oneway.map(function(x,i) {if (match_arrow[i] == 1) {return x} else if (match_arrow[i] == 2) {return x + 180}});
	if (coh_direction_deg) { // if i in the while loop isn't defined, it'll loop forever 
		i = coh_direction_deg.length
		while (i--) { // make these circular (-360 if over 360, add 360 if a minus value)
			if (coh_direction_deg[i] > 360) {
				coh_direction_deg[i] -= 360;
			} else if (coh_direction_deg[i] < 0){
				coh_direction_deg[i] += 360;
			}
		}
	}
	console.log("coherence directions: ", coh_direction_deg);

    // *** put the info for each trial into an object, and put these trial objects into the block info array ***
    var block_info = [];
    for (var i=0; i<num_trials_per_block; i++) {
        var trial_info = {
            cue_dir: cue_dir[i],
            cue_dir_deg: cue_dir_deg[i],
			rule_point_code: rule_point_code[i],
			rule_value: rule_value[i],
			match_arrow: match_arrow[i],
			coh_direction_deg: coh_direction_deg[i],
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
