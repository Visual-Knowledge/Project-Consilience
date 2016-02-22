//Metadata Information ONLY

/***Script Outline***
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
1 - Declare Individual MetaData Variables
 1.1 - Create Object of MetaData Keys    
   2 - Dynamically Genereate MetaData Property Values in Object    
     3 - Log MetaData Info to Console  **Multiple Lines    
       4 - Print MetaData Info to Page In Footer  **Single Line/Formated
::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::   */

//1 - Declare Individual MetaData Variables
var versionNum = '0.01';
var stageOfDev = 'Alpha';
var consoleNotes = 'Work In Progress!';

var versionPrint = 'VERSION:   ' + versionNum;
var stageOfDevPrint = 'Stage Of Development:   ' + stageOfDev
var consoleNotesPrint = 'Notes----' + consoleNotes

//1.1 - Create Object of MetaData Keys
//var metaObj = {};

//2 - Dynamically Genereate MetaData Property Values in Object
//var injectData = function() { }

//3 - Log MetaData Info to Console  **Multiple Lines
//var metaConsole = function() { from object }
var metaConsole = function() {
    console.log(versionPrint);
    console.log(stageOfDevPrint);
    console.log(consoleNotesPrint);
}
metaConsole();

//4 - Print MetaData Info to Page In Footer  **Single Line/Formated
//var printToDoc = function() { from object }
var printToDoc = function() {
    for (i = 1; i < 9; i += 1) {
        document.write("<p class='pageVert'>|</p>");
    };
    document.write("<footer>Version:</footer>");
    
};
printToDoc();
