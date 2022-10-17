function get_demographics(timeline){

    var demographics_one = { 
        type: 'survey-text',
        questions: [
            {prompt: '<scan>Write something here that I can use to identify you (e.g. name)</scan>',rows: 1, columns: 10,name: 'surveyID', required: true},
        ],
        button_label: ['->'],
    }
    timeline.push(demographics_one);

}
