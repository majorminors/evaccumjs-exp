function stimulus_array_generator(easy_rule, hard_rule, num_blocks, num_trials_per_block, num_cues, num_motion_coherence) {

	/* requires:
		easy_rule: degrees of difference between cue orientation
		hard_rule: same as above, but for hard (i.e. closer to the decision boundary between the two
		num_blocks: how many times you want to repeat your trial sets
		num_trials_per_block: how many trials you want - i have as many trials as conditions
		num_cues: how many cues there are
		num_motion_coherence: how many coherent motion directions will there be - i use 8 which are static throughout the experiment (although their value will change with the cue) 
	*/

    /* output:
		array with length equal to num_blocks. assume you called the function into 'array':
		array[0][0] = array[block 1][trial 1]
		each element in the array is a nested array of objects. This nested array length is equal to num_trials_per_block.
		each object in the nested array contains all the info for a single trial. Objects contain the following keys:
    
     	- cue_dir = cue direction (1-4)
     	- cue_dir_deg = cue direction (in degrees)
     	- dot_motion_dir_cond = dot motion direction condition (1-8)
     	- dot_motion_dir_deg = dot motion direction (in degrees)
     	- coh_difficulty = coherence difficulty (1 or 2)
     	- match_dist_cue_dir = match distance from cue direction (degrees abs value)
     	- match_arrow = match arrow (1 or 2)
     	- match_difficulty = matching difficulty (1 or 2)
     	- trial_cond_num = unique number for each trial condition
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
	// pull in the coherence directions passed into it and then add those to the cue directions
    var dot_motion_directions = cue_directions.map(function(x,i) {return x + easy_rule;}).concat(cue_directions.map(function(x,i) {return x + hard_rule;}));
    sort_num_array(dot_motion_directions);
    console.log("dot motion directons: ", dot_motion_directions);
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
    var conditions = range_fun(1,num_motion_coherence,1);
    var dot_motion_dir_cond_1 = sort_num_array(Array.apply(null, Array(num_trials_per_block/num_cues/num_motion_coherence)).map(function() {return conditions;}).flat());
    var dot_motion_dir_cond = Array.apply(null, Array(num_cues)).map(function() {return dot_motion_dir_cond_1;}).flat();
    console.log("dot motion direction conditions: ", dot_motion_dir_cond);
	// copy the dot motion condition array and replace each element with the corresponding dot motion directions
	// the the while loop goes through and makes sure anything over 360, we subtract 360 (since we're dealing with a circle)
    var dot_motion_dir_deg = dot_motion_dir_cond.slice(0).map(function(x,i) {return dot_motion_directions[x-1]});
	if (dot_motion_dir_deg) { // if i in the while loop isn't defined, it'll loop forever 
		i = dot_motion_dir_deg.length
		while (i--) { 
			if (dot_motion_dir_deg[i] > 360) {
				dot_motion_dir_deg[i] -= 360;
			}
		}
    console.log("dot motion direction degrees: ", dot_motion_dir_deg);
	}
    var difficulty_levels = range_fun(1,2,1);
    var coh_difficulty_1 = sort_num_array(Array.apply(null, Array(num_trials_per_block/num_cues/num_motion_coherence/2)).map(function() {return difficulty_levels;}).flat());
    var coh_difficulty = Array.apply(null, Array(num_cues*num_motion_coherence)).map(function() {return coh_difficulty_1;}).flat();
    console.log("coherence difficulty: ", coh_difficulty);
    // for calculating the dist values, in JS it's easier to do this as 3 separate arrays, rather than as a matrix
    var dot_motion_dir_minus360 = dot_motion_dir_deg.map(function(x) {return x - 360;});
    var dot_motion_dir_plus360 = dot_motion_dir_deg.map(function(x) {return x + 360;});
    var cue_dot_diff = dot_motion_dir_deg.slice(0).map(function(x,i) {
        return Math.abs(x - cue_dir_deg[i]);
    });
    var cue_dot_diff_minus360 = dot_motion_dir_minus360.slice(0).map(function(x,i) {
        return Math.abs(x - cue_dir_deg[i]);
    });
    var cue_dot_diff_plus360 = dot_motion_dir_plus360.slice(0).map(function(x,i) {
        return Math.abs(x - cue_dir_deg[i]);
    });
    var match_dist_cue_dir = cue_dot_diff.slice(0).map(function (x,i) {
        return Math.min(x, cue_dot_diff_minus360[i], cue_dot_diff_plus360[i]);
    });
    console.log("match distance from cue direction: ", match_dist_cue_dir);
    var match_arrow = match_dist_cue_dir.slice(0).map(function(x) {
        if (x > 90) {
            return 2;
        } else {
            return 1;
        }
    });
    console.log("match arrow: ", match_arrow);
    // min and max values are 1, all other values are 2 so we just do this
    var match_difficulty = match_dist_cue_dir.slice(0).map(function(x) {
        if (x == Math.min.apply(null, match_dist_cue_dir) || x == Math.max.apply(null, match_dist_cue_dir)) {
            return 1;
        } else {
            return 2;
        }
    });
    console.log("matching difficulty: ", match_difficulty);
    var trial_cond_num = range_fun(1,cue_dir.length,1);
    console.log("trial condition number: ", trial_cond_num);

    // *** put the info for each trial into an object, and put these trial objects into the block info array ***
    var block_info = [];
    for (var i=0; i<num_trials_per_block; i++) {
        var trial_info = {
            cue_dir: cue_dir[i],
            cue_dir_deg: cue_dir_deg[i],
            dot_motion_dir_cond: dot_motion_dir_cond[i],
            dot_motion_dir_deg: dot_motion_dir_deg[i],
            coh_difficulty: coh_difficulty[i],
            match_dist_cue_dir: match_dist_cue_dir[i], 
            match_arrow: match_arrow[i],
            match_difficulty: match_difficulty[i],
            trial_cond_num: trial_cond_num[i],
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
