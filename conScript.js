//**Try to use CSS for most animation

//Use JS for data/looping

//Write program overview first

//1
    //1.1
    //1.2
//2
    //2.1
    //2.2
//-----------------------
var versionNum = '0.01';
var stageOfDev = 'Alpha';
var consoleNotes = 'Work In Progress!';

var versionPrint = 'VERSION:   ' + versionNum;
var stageOfDevPrint = 'Stage Of Development:   ' + stageOfDev
var consoleNotesPrint = 'Notes----' + consoleNotes

var metaDataArr = [
    ["VERSION:  ", versionNum],
    ["Stage Of Development:  ", stageOfDev],
    ["---Notes---", consoleNotes]
    ];

var metaDataObj = {
    Version: 0.01,
    Stage Of Development: "Alpha",
    Notes: "---Work In Progress!---"
};

var metalog() = function() {
    console.log(versionPrint);
}

var metaPrintToDoc = function() {
    document.write(versionPrint);
}

metaLog();
metaPrintToDoc();