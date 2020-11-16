        /////////////////
        /* set up vars */
        /////////////////

        var instructions_on = 1; // if 1, will do instructions
        var fixation_type = 1; // if 1 just a fixation, if 2 a fixation with dots
        var num_prac_trials = 10;

        ////////////////////////
        /* participant set up */
        ////////////////////////

        var participant_id = jsPsych.randomization.randomID(15);
        jsPsych.data.addProperties({
            participant_id: participant_id
        });
                
                var credentials = {
                    url: 'https://studies.mrc-cbu.cam.ac.uk/pyapps/util/', // path to post data to
                    coh: 'cthresh', // path extension for coherence thresholding
                    rule: 'rthresh', // path extension for rule thresholding
                    username: 'psignifit', // username for psignifit server
                    password: 'password' // password for psignifit server
                }

        /* use a random number generator to arbitrate between response mappings */
        if (((Math.floor(Math.random() * 100) + 1) % 2) === 0) {
            // the order of these variables are important because we index into them later, so:
            // if a random number generated between 1 and 100 is even then do this order
            /* keys */
            var resp_keys = ['o', 'p'];
            var condition = ['op',1];
            /* cues */
            var cueheight = window.innerHeight*0.65; // set the height to be a percentage of the window height
            var cues = [
                {stimulus: "stimuli/1-3.svg"},
                {stimulus: "stimuli/2-4.svg"},
                {stimulus: "stimuli/3-1.svg"},
                {stimulus: "stimuli/4-2.svg"}
            ];
            var instruction_imgs = [
                {stimulus: "stimuli/buttons.svg"},
                {stimulus: "stimuli/buttons-o.svg"},
                {stimulus: "stimuli/buttons-p.svg"}
            ];

        } else {
            // else (if the number is odd) do this order
            /* keys */
            var resp_keys = ['p', 'o'];
            var condition = ['po',2];
            /* cues */
            var cueheight = window.innerHeight*0.65; // set the height to be a percentage of the window height
            /* cues */
            var cues = [
                {stimulus: "stimuli/3-1.svg"},
                {stimulus: "stimuli/4-2.svg"},
                {stimulus: "stimuli/1-3.svg"},
                {stimulus: "stimuli/2-4.svg"}
            ];
            var instruction_imgs = [
                {stimulus: "stimuli/buttons.svg"},
                {stimulus: "stimuli/buttons-p.svg"},
                {stimulus: "stimuli/buttons-o.svg"}
            ];
        }
        jsPsych.data.addProperties({
            condition: condition
        });
        var num_cues = 4;


        /* initialise timeline array */
                var timeline = [];

                // create a reusable fixation
                if (fixation_type == 1) {
                    var fixation = { // this is an RDK block with invisible (black) dots just to have the fixation cross
                        type: 'rdk',
                        background_color: "black",
                        dot_color: "black", 
                        aperture_type: 1,
                        fixation_cross: true,
                        fixation_cross_color: "white", 
                        fixation_cross_thickness: 6,
                        post_trial_gap: 0, 
                        choices: jsPsych.NO_KEYS,
                        response_ends_trial: false,
                        correct_choice: "q",
                        trial_duration: 300,
                        data: {experiment_part: 'fixation'}
                    }
                } else if (fixation_type == 2) {
                    var fixation = { // this is an RDK block with a red fixation cross and 100% random dots
                        type: 'rdk',
                        background_color: "black",
                        dot_color: "white", 
                        aperture_type: 1,
                        fixation_cross: true,
                        fixation_cross_color: "red", 
                        fixation_cross_thickness: 6,
                        post_trial_gap: 0, 
                        choices: jsPsych.NO_KEYS,
                        response_ends_trial: false,
                        correct_choice: "q",
                        trial_duration: 300,
                        number_of_dots: 100,
                        coherence: 0, 
                        move_distance: 2.5, // I've only approximated the MATLAB experiment here - that's 5 degrees per second (like .01 Hz/fps) this is in pixel lengths per second...
                        dot_life: 7, // this is not the same as MATLAB - expressed in same units (frames of life), but MATLAB's 5 is visibly different to jsPsych's 5...
                        data: {experiment_part: 'fixation'}
                    }
                }
 
                //////////////////
                /* instructions */
                //////////////////

                var instruction_cue = {
                    type: 'image-keyboard-response',
                    stimulus_height: cueheight,
                    choices: resp_keys,
                    data: {experiment_part: 'instructions'}
                }
                var instruction_rdk = {
                    type: 'rdk', 
                    background_color: "black",
                    dot_color: "white", 
                    aperture_type: 1,
                    fixation_cross: true,
                    fixation_cross_color: "white", 
                    fixation_cross_thickness: 6,
                    post_trial_gap: 0, 
                    number_of_dots: 100,
                    response_ends_trial: false,
                    coherence: 1, 
                    move_distance: 2.5, // I've only approximated the MATLAB experiment here - that's 5 degrees per second (like .01 Hz/fps) this is in pixel lengths per second...
                    dot_life: 7, // this is not the same as MATLAB - expressed in same units (frames of life), but MATLAB's 5 is visibly different to jsPsych's 5...
                    choices: resp_keys,
                    trial_duration: 1500,
                    data: {experiment_part: 'instructions'}
                }
                var instruction_answers = {
                    type: 'image-keyboard-response',
                    stimulus_height: cueheight,
                    response_ends_trial: false,
                    trial_duration: 1000,
                    choices: jsPsych.NO_KEYS,
                    data: {experiment_part: 'instructions'}
                }
                var instruction_feedback = { // you can use this for testing, otherwise comment out
                    type: "html-keyboard-response",
                    stimulus: function() {
                        var last_rdk_accuracy = jsPsych.data.get().last(1).values()[0].correct; // dynamic var (runs throughout) asking for data.correct from last rdk block
                        if (last_rdk_accuracy) { // if true (data.correct is boolean)
                            return "<p>correct</p>";
                        } else { // else if false
                            return "<p>incorrect</p>";
                        }
                    },
                    choices: jsPsych.NO_KEYS,
                    trial_duration: 300,
                    data: {experiment_part: 'instructions'}
                }
                var instruction_noresp = {
                    type: 'html-keyboard-response',
                    choices: jsPsych.NO_KEYS,
                    trial_duration: 1000,
                    response_ends_trial: false
                }
                var instruction_resp = { // requires html stimulus entry in previous trial
                    type: 'html-keyboard-response',
                    stimulus: function() {
                        var last_stim = jsPsych.data.get().last(1).values()[0].stimulus;
                        var addcontinue = last_stim+'<p><br>Press any key to continue</p>';
                        return addcontinue;
                    }
                }

                var instructions = {
                    timeline: [
                        {
                            ...instruction_noresp,
                            stimulus: "<p>Welcome, and thanks for participating.</p><br>"+
                                    "<p>Trials will go as follows:</p>"+
                                    "<p>1. You'll see a cue</p>"+
                                    "<p>2. You'll see some moving dots on the screen</p>"+
                                    "<p>3. You'll press a button based on the cue and the moving dots</p><br>"+
                                    "<p>Let's see how that looks</p>"
                        },
                        instruction_resp,
                        {
                            ...instruction_noresp,
                            stimulus: "<p>First, let me introduce you to the buttons you'll be using. Position your hand as in the following image.</p>"
                        },
                        instruction_resp,
                        {...instruction_answers, stimulus: instruction_imgs[0].stimulus, trial_duration: 2000},
                        {
                            ...instruction_noresp,
                            stimulus: "<p>Any time you see a cue, or moving dots, use these keys to respond.<br>Now let me show you what a cue looks like.</p>"
                        },
                        instruction_resp,
                        {...instruction_cue, stimulus: cues[0].stimulus},
                        {
                            ...instruction_noresp,
                            stimulus: "<p>Here's what the moving dots look like.</p>"
                        },
                        instruction_resp,
                        fixation,
                        {...instruction_rdk, correct_choice: resp_keys[0], coherent_direction: 45},
                        {
                            ...instruction_noresp,
                            stimulus: "<p>Now together.</p>"
                        },
                        instruction_resp,
                        // example
                        {...instruction_cue, stimulus: cues[0].stimulus},
                        fixation,
                        {...instruction_rdk, correct_choice: resp_keys[0], coherent_direction: 45},
                        {
                            ...instruction_noresp,
                            stimulus: "<p>Ok. Now let me explain the task in a bit more detail.<br>In each trial, some of the moving dots are moving randomly and the rest are moving all together in one (coherent) direction.<br>The cue lets you know which button to press depending on what direction the coherent dots are moving in on that trial.<br>If the dots are moving more in the direction of 'p', you would press 'p'.<br>If they were moving more towards 'o', you would press 'o'.<br><br>Let's look again and I'll show you the answer at the end.</p>"
                        },
                        instruction_resp,
                        // example
                        {...instruction_cue, stimulus: cues[0].stimulus},
                        fixation,
                        {...instruction_rdk, correct_choice: resp_keys[0], coherent_direction: 45},
                        {...instruction_answers, stimulus: instruction_imgs[1].stimulus},
                        {
                            ...instruction_noresp,
                            stimulus: "<p>The dots can move in any direction, so make sure you pay close attention to the cue.<br>Let me show you a couple more examples.</p>"
                        },
                        instruction_resp,
                        // example
                        {...instruction_cue, stimulus: cues[0].stimulus},
                        fixation,
                        {...instruction_rdk, correct_choice: resp_keys[0], coherent_direction: 0},
                        {...instruction_answers, stimulus: instruction_imgs[1].stimulus},
                        // example
                        {...instruction_cue, stimulus: cues[0].stimulus},
                        fixation,
                        {...instruction_rdk, correct_choice: resp_keys[1], coherent_direction: 225},
                        {...instruction_answers, stimulus: instruction_imgs[2].stimulus},
                        // example
                        {...instruction_cue, stimulus: cues[0].stimulus},
                        fixation,
                        {...instruction_rdk, correct_choice: resp_keys[1], coherent_direction: 245},
                        {...instruction_answers, stimulus: instruction_imgs[2].stimulus},
                        {
                            ...instruction_noresp,
                            stimulus: "<p>The cue can also change.</p>"
                        },
                        instruction_resp,
                        // example
                        {...instruction_cue, stimulus: cues[3].stimulus},
                        fixation,
                        {...instruction_rdk, correct_choice: resp_keys[1], coherent_direction: 0},
                        {...instruction_answers, stimulus: instruction_imgs[2].stimulus},
                        {
                            ...instruction_noresp,
                            stimulus: "<p>The dots can also be easier or harder to see, because some dots will be moving in one direction and the rest will be moving in a random direction.</p>"
                        },
                        instruction_resp,
                        // example
                        {...instruction_cue, stimulus: cues[0].stimulus},
                        fixation,
                        {...instruction_rdk, correct_choice: resp_keys[0], coherent_direction: 45, coherence: 0.7},
                        {...instruction_answers, stimulus: instruction_imgs[1].stimulus},
                        {
                            ...instruction_noresp,
                            stimulus: "<p>You'll have a chance to practice a bit, but first a couple of final notes.</p>"
                        },
                        instruction_resp,
                        {
                            ...instruction_noresp,
                            stimulus: "<p>The cue will only appear every once in a while, so please pay attention.</p>"
                        }, 
                        instruction_resp,
                        {
                            ...instruction_noresp,
                            stimulus: "<p>Some trials are easy, but many trials are hard. This is on purpose—I am also interested in errors. So just do your best and don't be discouraged.</p>"
                        }, 
                        instruction_resp,
                        {
                            ...instruction_noresp,
                            stimulus: "<p>Lastly, <strong>Always answer!</strong> Try to be as <em>accurate</em> and as <em>fast</em> as possible, but please make sure you always answer.</p>"
                        },
                        instruction_resp,
                        {
                            ...instruction_noresp,
                            stimulus: "<p>Ok! Let's get started. This experiment has three parts. The first is a short five minute test, the second is about ten minutes, and the third is the full experiment and will take up the rest of the time.</p>"
                        },
                        instruction_resp,
                    ]
                }
                if (instructions_on === 1) {
                    timeline.push(instructions);
                }

        ///////////////////////
        /* coherence testing */
        ///////////////////////

        /* first define the parameters */
        var num_coherence_blocks = 1;
        var num_trials_per_block = 160;
        // requires num_cues
        var coh_point_values =  [0.10, 0.20, 0.25, 0.30, 0.35, 0.45, 0.55, 0.65, 0.75, 0.85];
        var num_point_tests = 16; 
        var num_trials_per_block = num_point_tests * coh_point_values.length; // check this is an integer, or it'll break
        
        // call stimulus_array_generator function and save output
        var coh_stim_array = coh_stimulus_array_generator(num_coherence_blocks, num_trials_per_block, num_cues, coh_point_values, num_point_tests);
        jsPsych.data.addProperties({
            coh_stim_array: coh_stim_array
        });

        /* generate coherence test procedure */
        var block;
        var trial;
        var count = 0;
        // for practice block
        var coh_prac_timeline = [];
        // for test block
        var coh_test_timeline = [];

        // let them know we're onto the first test
        var coh_start_screen = {
            type: "html-keyboard-response",
            stimulus: "<p>This is the first test.</p><br>"+
                "<p>We are testing you on different levels of coherence (the number of dots moving in one direction).</p>"+
                "<p>This will take about 5 minutes.</p><br>"+
                "<br><p>Press any key to continue.</p>"
        }
        timeline.push(coh_start_screen);
        
        // now we're going to build two timelines - one for practice and one for the test
        for (block = 0; block < coh_stim_array.length; block++) { // equivalent to number of blocks (coh_stim_array[0-n]) - should = num_blocks
            for (trial = 0; trial < coh_stim_array[0].length; trial++) { // equivalent to number of trials per block (coh_stim_array[x][0-n]) - should = num_trials_per_block
                count++; // use this to track how many trials have happened in total
                i_coh = coh_stim_array[block][trial]; // make this easier to call

                if (count === 1) {
                    var coh_prac_screen ={
                        type: "html-keyboard-response",
                        stimulus: "<p>Let's do a bit of practice first.<br><br>Press any key to begin.</p>"
                    }
                    coh_prac_timeline.push(coh_prac_screen);

                    var coh_test_screen = {
                        type: "html-keyboard-response",
                        stimulus: "<p>Good! Now we'll begin the test.<br><br>Press any key to begin.</p>"
                    }
                    coh_test_timeline.push(coh_test_screen);
                }	

                if (count === 1 || (count-1) % 8 === 0) { // show this on the first trial, then every 8 - this assumes that a cue change happens after a number divisible by 8 otherwise your participant is going to have dots corresponding to a cue they haven't seen yet 
                    var coh_cue = {
                        type: 'image-keyboard-response',
                        stimulus: cues[i_coh.cue_dir-1].stimulus, // -1 because cue_dir goes from 1-4 and javascript indexes from 0-3
                        stimulus_height: cueheight,
                        choices: resp_keys,
                    }
                    if (count <= num_prac_trials) {
                        coh_prac_timeline.push({...coh_cue, data: {experiment_part: 'cohprac_cue'}});
                    }
                    coh_test_timeline.push({...coh_cue, data: {experiment_part: 'cohtest_cue'}});
                }

                if (count <= num_prac_trials) {
                    coh_prac_timeline.push({...fixation, data: {experiment_part: 'cohprac_fixation'}});
                }
                coh_test_timeline.push({...fixation, data: {experiment_part: 'cohtest_fixation'}});

                var coh_rdk = {
                    type: 'rdk', 
                    background_color: "black",
                    dot_color: "white", 
                    aperture_type: 1,
                    fixation_cross: true,
                    fixation_cross_color: "white", 
                    fixation_cross_thickness: 6,
                    post_trial_gap: 0, 
                    number_of_dots: 100,
                    response_ends_trial: false,
                    coherence: i_coh.coherence_value, 
                    move_distance: 2.5, // I've only approximated the MATLAB experiment here - that's 5 degrees per second (like .01 Hz/fps) this is in pixel lengths per second...
                    dot_life: 7, // this is not the same as MATLAB - expressed in same units (frames of life), but MATLAB's 5 is visibly different to jsPsych's 5...
                    choices: resp_keys,
                    correct_choice: resp_keys[i_coh.match_arrow-1],
                    coherent_direction: i_coh.dot_motion_deg_rdk, 
                    trial_duration: 1500,
                }
                if (count <= num_prac_trials) {
                    coh_prac_timeline.push({...coh_rdk, data: {experiment_part: 'cohprac_rdk'}});
                }
                coh_test_timeline.push({...coh_rdk, data: {experiment_part: 'cohtest_rdk'}});

                var coh_feedback = { // you can use this for testing, otherwise comment out
                    type: "html-keyboard-response",
                    stimulus: function() {
                        var last_rdk_accuracy = jsPsych.data.get().last(1).values()[0].correct; // dynamic var (runs throughout) asking for data.correct from last rdk block
                        if (last_rdk_accuracy) { // if true (data.correct is boolean)
                            return "<p>correct</p>";
                        } else { // else if false
                            return "<p>incorrect</p>";
                        }
                    },
                    choices: jsPsych.NO_KEYS,
                    trial_duration: 300,
                }
                if (count <= num_prac_trials) {
                    coh_prac_timeline.push({...coh_feedback, data: {experiment_part: 'cohprac_feedback'}});
                }
                coh_test_timeline.push({...coh_feedback, data: {experiment_part: 'cohtest_feedback'}});
            }
        }
        // push those two blocks now by spreading them into timeline
        timeline.push(...coh_prac_timeline,...coh_test_timeline);
    
        /* collecting data for analysis */
        var coh_analysis = {
            type: "html-keyboard-response",
            stimulus: "Now we analyse - press any key and please wait",
            data: {experiment_part: 'coherence_analysis'},
            on_finish: function () {
                var payload = {
                    data_array: []
                };
                for (i = 0; i < coh_point_values.length; i++) {
                    tmp_trls = jsPsych.data.get().filter({experiment_part: 'cohtest_rdk', coherence: coh_point_values[i]}).count();
                    tmp_corr = jsPsych.data.get().filter({experiment_part: 'cohtest_rdk', correct: 1, coherence: coh_point_values[i]}).count();
                    payload['data_array'].push([coh_point_values[i],tmp_corr,tmp_trls]);
                }
                console.log("results to post: ", payload['data_array']);

                // POST the data to the psignifit function
                axios({
                    url: credentials.url.concat(credentials.coh),
                    method: 'post',
                                        data: payload,
                                        auth: {
                                            username: credentials.username,
                                            password: credentials.password
                                        }
                })
                .then(function (response) {
                    console.log(response);
                    coherence_values = response.data;
                    console.log(coherence_values);
                })
                .catch(function (error) {
                    console.log(error);
                });
            }
        }
        timeline.push(coh_analysis);
            
        // var coherence_values = [0.8, 0.3]; // we generate this from earlier psychophys -  [0] needs to be easy, [1] needs to be hard

        //////////////////
        /* rule testing */
        //////////////////

        /* first define parameters */
        var num_trials_per_block = 160;
        // requires num_cues
        var num_rule_blocks = 2; // one for each coherence level
        var rule_point_values =  [0,5,10,15,20,70,75,80,85,90];
        var num_point_tests = 16; 
        var num_trials_per_block = num_point_tests * rule_point_values.length; // check this is an integer, or it'll break

        // call stimulus_array_generator function
        var rule_stim_array = rule_stimulus_array_generator(num_rule_blocks, num_trials_per_block, num_cues, rule_point_values, num_point_tests);
        jsPsych.data.addProperties({
            rule_stim_array: rule_stim_array
        });

        /* generate rule test procedure */
        var block;
        var trial;
        var count = 0;
        var turn_off_block_indicator = 0;
        // for practice block
        var rule_prac_timeline = [];
        // for test block
        var rule_test_timeline = [];
        
        // let them know we're onto the next test
        var rule_start_screen = {
            type: "html-keyboard-response",
            stimulus: "<p>This is the second test.</p><br>"+
                "<p>We are testing you on different directions now.</p>"+
                "<p>This will take about 10 minutes.</p><br>"+
                "<br><p>Press any key to begin.</p>"
        }
        timeline.push(rule_start_screen);
        
        // now we're going to build two timelines - one for practice and one for the test
        for (block = 0; block < rule_stim_array.length; block++) { // equivalent to number of blocks (rule_stim_array[0-n]) - should = num_blocks
            for (trial = 0; trial < rule_stim_array[0].length; trial++) { // equivalent to number of trials per block (rule_stim_array[x][0-n]) - should = num_trials_per_block
                count++; // use this to track how many trials have happened in total
                i_rule = rule_stim_array[block][trial]; // make this easier to call
                if (count === 1) {
                    var rule_prac_screen ={
                        type: "html-keyboard-response",
                        stimulus: "<p>Let's do a bit of practice first.<br><br>Press any key to begin.</p>"
                    }
                    rule_prac_timeline.push(rule_prac_screen);

                    var rule_test_screen = {
                        type: "html-keyboard-response",
                        stimulus: "<p>Good! Now we'll begin the test.<br><br>Press any key to begin.</p>"
                    }
                    rule_test_timeline.push(rule_test_screen);
                }

                // indicate at start of each block what kind of dots to expect (easy or hard) for the test
                if (block === 0 && count === 1) {
                    var block_indicator = {
                        type: "html-keyboard-response",
                        stimulus: "<p> first with easy dots </p>",
                        choices: jsPsych.NO_KEYS,
                        trial_duration: 500
                    }
                    rule_test_timeline.push(block_indicator);
                } else if (block === 1 && turn_off_block_indicator === 0) {
                    turn_off_block_indicator = 1;
                    var block_indicator = {
                        type: "html-keyboard-response",
                        stimulus: "<p> now with hard dots </p>",
                        choices: jsPsych.NO_KEYS,
                        trial_duration: 500
                    }
                    rule_test_timeline.push(block_indicator);
                }

                if (count === 1 || (count-1) % 8 === 0) { // show this on the first trial, then every 8 - this assumes that a cue change happens after a number divisible by 8 otherwise your participant is going to have dots corresponding to a cue they haven't seen yet 
                    var rule_cue = {
                        type: 'image-keyboard-response',
                        stimulus: cues[i_rule.cue_dir-1].stimulus, // -1 because cue_dir goes from 1-4 and javascript indexes from 0-3
                        stimulus_height: cueheight,
                        choices: resp_keys,
                    }
                    if (count <= num_prac_trials) {
                        rule_prac_timeline.push({...rule_cue, data: {experiment_part: 'ruleprac_cue'}});
                    }
                    rule_test_timeline.push({...rule_cue, data: {experiment_part: 'ruletest_cue'}});
                }

                if (count <= num_prac_trials) {
                    rule_prac_timeline.push({...fixation, data: {experiment_part: 'ruleprac_fixation', index_value: block}}); // lets index the block value here, so we can use it to indicate coherence
                }
                rule_test_timeline.push({...fixation, data: {experiment_part: 'ruletest_fixation', index_value: block}}); // lets index the block value here, so we can use it to indicate coherence

                var rule_rdk = {
                    type: 'rdk', 
                    background_color: "black",
                    dot_color: "white", 
                    aperture_type: 1,
                    fixation_cross: true,
                    fixation_cross_color: "white", 
                    fixation_cross_thickness: 6,
                    post_trial_gap: 0, 
                    number_of_dots: 100,
                    response_ends_trial: false,
                    coherence: function () {
                        return coherence_values[jsPsych.data.get().last(1).values()[0].index_value]; // we pull the block value from the data in the last trial block to index into coherence_values
                    },
                    move_distance: 2.5, // I've only approximated the MATLAB experiment here - that's 5 degrees per second (like .01 Hz/fps) this is in pixel lengths per second...
                    dot_life: 7, // this is not the same as MATLAB - expressed in same units (frames of life), but MATLAB's 5 is visibly different to jsPsych's 5...
                    choices: resp_keys,
                    correct_choice: resp_keys[i_rule.match_arrow-1],
                    coherent_direction: i_rule.coh_direction_deg_rdk, 
                    trial_duration: 1500,
                }
                if (count <= num_prac_trials) {
                    rule_prac_timeline.push({...rule_rdk, data: {experiment_part: 'ruleprac_rdk', rule_code: i_rule.rule_point_code}});
                }
                rule_test_timeline.push({...rule_rdk, data: {experiment_part: 'ruletest_rdk', rule_code: i_rule.rule_point_code}});

                var rule_feedback = { // you can use this for testing, otherwise comment out
                    type: "html-keyboard-response",
                    stimulus: function() {
                        var last_rdk_accuracy = jsPsych.data.get().last(1).values()[0].correct; // dynamic var (runs throughout) asking for data.correct from last rdk block
                        if (last_rdk_accuracy) { // if true (data.correct is boolean)
                            return "<p>correct</p>";
                        } else { // else if false
                            return "<p>incorrect</p>";
                        }
                    },
                    choices: jsPsych.NO_KEYS,
                    trial_duration: 300,
                }
                if (count <= num_prac_trials) {
                    rule_prac_timeline.push({...rule_feedback, data: {experiment_part: 'ruleprac_feedback'}});
                }
                rule_test_timeline.push({...rule_feedback, data: {experiment_part: 'ruletest_feedback'}});
            }
        }
        // push those two blocks now by spreading them into timeline
        timeline.push(...rule_prac_timeline,...rule_test_timeline);

        /* collecting data for analysis */
        var rule_analysis = {
            type: "html-keyboard-response",
            stimulus: "Now we analyse - press any key and please wait",
            data: {experiment_part: 'rule_analysis'},
            on_finish: function () {
                var payload = {
                    data_array: []
                };
                for (i = 0; i < rule_point_values.length; i++) {
                    tmp_trls = jsPsych.data.get().filter({experiment_part: 'ruletest_rdk', rule_code: i}).count();
                    tmp_corr = jsPsych.data.get().filter({experiment_part: 'ruletest_rdk', correct: 1, rule_code: i}).count();
                    payload['data_array'].push([rule_point_values[i],tmp_corr,tmp_trls]);
                }
                console.log("results to post: ", payload['data_array']);

                // POST the data to the psignifit function
                axios({
                    url: credentials.url.concat(credentials.rule),
                    method: 'post',
                                        data: payload,
                                        auth: {
                                            username: credentials.username,
                                            password: credentials.password
                                        }
                })
                .then(function (response) {
                    console.log(response);
                    hard_rule_value = response.data;
                    console.log(hard_rule_value);
                    rule_values = [hard_rule_value, 90-hard_rule_value]; // easy rule needs to be symmetrical to rule value for decoding analysis
                })
                .catch(function (error) {
                    console.log(error);
                });
            }
        }
        timeline.push(rule_analysis);

        // var rule_values = [10, 80]; // will need to gen these also from earlier psychophys - [0] needs to be easy, [1] needs to be hard
    
        ////////////////////////
        /* experiment testing */
        ////////////////////////
       
        /* we'll run this as an 'on_finish' function, then push it all to the end of the timeline */

        var exp_start_screen = {
            type: "html-keyboard-response",
            stimulus: "<p>Now we're ready to begin the experiment.</p><br>"+
                "<p>This will take about 40 minutes.</p><br>"+
                "<p>Please wait patiently for the experiment to load based on the data so far</p><br>"+
                "<br><p>Press any key to begin.</p>",
            on_finish: function(){
                jsPsych.pauseExperiment();

                /* init a timeline for the experiment */
                exp_timeline = [];

                /* define parameters to pass into the stimulus_array_generator function */
                var easy_rule = rule_values[0];
                var hard_rule = rule_values[1];
                var num_exp_blocks = 20;
                var num_trials_per_block = 64;
                // requires num_cues
                var num_motion_coherence = 8;

                /* generate stimulus array with stimulus_array_generator function */
                var exp_stim_array = exp_stimulus_array_generator(easy_rule, hard_rule, num_exp_blocks, num_trials_per_block, num_cues, num_motion_coherence);
                jsPsych.data.addProperties({
                    exp_stim_array: exp_stim_array
                });

                /* generate experimental test procedure */
                var block;
                var trial;
                var count = 0;
                for (block = 0; block < exp_stim_array.length; block++) { // equivalent to number of blocks (exp_stim_array[0-n]) - should = num_blocks
                    for (trial = 0; trial < exp_stim_array[0].length; trial++) { // equivalent to number of trials per block (exp_stim_array[x][0-n]) - should = num_trials_per_block
                        count++; // use this to track how many trials have happened in total
                        i_exp = exp_stim_array[block][trial]; // make this easier to call

                        if (count === 1 || (count-1) % 8 === 0) { // show this on the first trial, then every 8 - this assumes that a cue change happens after a number divisible by 8 otherwise your participant is going to have dots corresponding to a cue they haven't seen yet 
                            var exp_cue = {
                                type: 'image-keyboard-response',
                                stimulus: cues[i_exp.cue_dir-1].stimulus, // -1 because cue_dir goes from 1-4 and javascript indexes from 0-3
                                stimulus_height: cueheight,
                                choices: resp_keys,
                                data: {experiment_part: 'experiment_cue'}
                            }
                            exp_timeline.push(exp_cue);
                        }

                        exp_timeline.push(fixation);

                        var exp_rdk = {
                            type: 'rdk', 
                            background_color: "black",
                            dot_color: "white", 
                            aperture_type: 1,
                            fixation_cross: true,
                            fixation_cross_color: "white", 
                            fixation_cross_thickness: 6,
                            post_trial_gap: 0, 
                            number_of_dots: 100,
                            response_ends_trial: false,
                            coherence: function(){coherence_values[i_exp.coh_difficulty-1]}, 
                            move_distance: 2.5, // I've only approximated the MATLAB experiment here - that's 5 degrees per second (like .01 Hz/fps) this is in pixel lengths per second...
                            dot_life: 7, // this is not the same as MATLAB - expressed in same units (frames of life), but MATLAB's 5 is visibly different to jsPsych's 5...
                            choices: resp_keys,
                            correct_choice: resp_keys[i_exp.match_arrow-1],
                            coherent_direction: i_exp.dot_motion_dir_deg, 
                            trial_duration: 1500,
                            data: {experiment_part: 'experiment_rdk'}
                        }
                        var exp_feedback = { // you can use this for testing, otherwise comment out
                            type: "html-keyboard-response",
                            stimulus: function() {
                                var last_rdk_accuracy = jsPsych.data.get().last(1).values()[0].correct; // dynamic var (runs throughout) asking for data.correct from last rdk block
                                if (last_rdk_accuracy) { // if true (data.correct is boolean)
                                    return "<p>correct</p>";
                                } else { // else if false
                                    return "<p>incorrect</p>";
                                }
                            },
                            choices: jsPsych.NO_KEYS,
                            trial_duration: 300,
                            data: {experiment_part: 'experiment_feedback'}
                        }
                        exp_timeline.push(exp_rdk, exp_feedback);
                    }
                }
                jsPsych.addNodeToEndOfTimeline({
                      timeline: exp_timeline // here is where we add it to the timeline
                }, jsPsych.resumeExperiment)
            }
        }
        timeline.push(exp_start_screen);
