// lets you save your credentials in a file you can gitignore
// first copy file to "tools/credentials.js"
// that is called in html like so:
// <script src="tools/credentials.js"></script>
// or place this variable directly into exp.js
var credentials = {
    url: 'https://studies.mrc-cbu.cam.ac.uk/pyapps/util/', // path to post data to
    coh: 'cthresh', // path extension for coherence thresholding
    rule: 'rthresh', // path extension for rule thresholding
    username: 'psignifit', // username for psignifit server
    password: 'password' // password for psignifit server
}

