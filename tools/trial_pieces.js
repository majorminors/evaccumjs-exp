function trial_pieces(){
    // requires from JATOS studySessionData:
    // - dots_fixation
    // - iti_duration
    // - iti_range


    var iti_range = jatos.studySessionData.iti_range;
    var iti_duration = jatos.studySessionData.iti_duration;

    // create a reusable fixation
    if (jatos.studySessionData["dots_fixation"] == 0) {
        fixation = { // this is an RDK block with invisible (black) dots just to have the fixation cross
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
            trial_duration: function(){ // lil function to randomise the iti between a range
                var min = iti_range[0];
                var max = iti_range[1];
                var random_iti = Math.random() * (max - min) + min;
                // console.log(random_iti);
                return random_iti;
            },
            data: {experiment_part: 'fixation'}
        }
    } else if (jatos.studySessionData["dots_fixation"] == 1) {
        fixation = { // this is an RDK block with a red fixation cross and 100% random dots
            type: 'rdk',
            background_color: "black",
            dot_color: "white", 
            aperture_type: 1,
            fixation_cross: true,
            fixation_cross_color: "lightpink", 
            fixation_cross_thickness: 6,
            post_trial_gap: 0, 
            choices: jsPsych.NO_KEYS,
            response_ends_trial: false,
            correct_choice: "q",
            trial_duration: function(){ // lil function to randomise the iti between a range
                var min = iti_range[0];
                var max = iti_range[1];
                var random_iti = Math.random() * (max - min) + min;
                // console.log(random_iti);
                return random_iti;
            },
            number_of_dots: 100,
            coherence: 0, 
            move_distance: 2.5, // I've only approximated the MATLAB experiment here - that's 5 degrees per second (like .01 Hz/fps) this is in pixel lengths per second...
            dot_life: 7, // this is not the same as MATLAB - expressed in same units (frames of life), but MATLAB's 5 is visibly different to jsPsych's 5...
            data: {experiment_part: 'fixation'}
        }
    } else if (jatos.studySessionData["dots_fixation"] == 2 ) {
        fixation = {
            timeline: [
                { // blank interval
                    type: 'html-keyboard-response',
                    stimulus: '<div></div>',
                    choices: jsPsych.NO_KEYS,
                    trial_duration: iti_duration,
                    response_ends_trial: false
                },
                { // rdk with random dots
                    type: 'rdk',
                    background_color: "black",
                    dot_color: "white", 
                    aperture_type: 1,
                    fixation_cross: true,
                    fixation_cross_color: "lightpink", 
                    fixation_cross_thickness: 6,
                    post_trial_gap: 0, 
                    choices: jsPsych.NO_KEYS,
                    response_ends_trial: false,
                    correct_choice: "q",
                    trial_duration: function(){ // lil function to randomise the iti between a range
                        var min = iti_range[0];
                        var max = iti_range[1];
                        var random_iti = Math.random() * (max - min) + min;
                        return random_iti;
                    },
                    number_of_dots: 100,
                    coherence: 0, 
                    move_distance: 2.5, // I've only approximated the MATLAB experiment here - that's 5 degrees per second (like .01 Hz/fps) this is in pixel lengths per second...
                    dot_life: 7, // this is not the same as MATLAB - expressed in same units (frames of life), but MATLAB's 5 is visibly different to jsPsych's 5...
                    data: {experiment_part: 'fixation'}
                }
            ]
        }
    }

    return fixation;
} 
