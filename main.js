const fs = require('fs');

// ---------------------- CLASSES BELOW --------------------- \\
class Item {
    // # means private

    #dateStarted;
    #timeStarted;

    #completion; // options: "success", "not started", "in-progress", "skipped", "fail"

    #dateCompleted;
    #timeCompleted;
    
    constructor(_dateStarted, _timeStarted) {
        this.dateStarted = _dateStarted;
        this.timeStarted = _timeStarted;
        this.completion = "not started";
    }
    get _timeStarted() {
        return this.timeStarted;
    }
    get _dateStarted() {
        return this.dateStarted;
    }
    get _completion() {
        return this.completion;
    }
    get _timeCompleted() {
        return this.timeCompleted;
    }
    get _dateCompleted() {
        return this.dateCompleted;
    }
    set _timeStarted(value) {
        this.timeStarted = value;
    }
    set _dateStarted(value) {
        this.dateStarted = value;
    }
    set _completion(value) {
        this.completion = value;
    }
    set _timeCompleted(value) {
        this.timeCompleted = value;
    }
    set _dateCompleted(value) {
        this.dateCompleted = value;
    }
}
class Activity extends Item {
    #recid

    #category;
    #requirement;

    #frequency; // options: "once", "daily", "weekly", "monthly"

    #design;
    #development;
    #testing;
    #results;
    
    constructor(_date, _time) {
        super(_date, _time);
        this.category = "";
        this.requirement = "";
        this.frequency = "Once";
        this.design = "";
        this.development = "";
        this.testing = "";
        this.results = "";
        this.recid = 0
        
    }
    get _category() {
        return this.category;
    }
    get _requirement() {
        return this.requirement;
    }
    get _frequency() {
        return this.frequency;
    }
    get _design() {
        return this.design;
    }
    get _development() {
        return this.development;
    }
    get _testing() {
        return this.testing;
    }
    get _results() {
        return this.results;
    }

    set _category(value) {
        this.category = value;
    }
    set _requirement(value) {
        this.requirement = value;
    }
    set _frequency(value) {
        this.frequency = value;
    }
    set _design(value) {
        this.design = value;
    }
    set _development(value) {
        this.development = value;
    }
    set _testing(value) {
        this.testing = value;
    }
    set _results(value) {
        this._results = value;
    }
    
}
class Note extends Item {
    #summary;
    constructor(date, time, summary) {
        super(date, time);
        this._summary = summary;
    }
    get summary() {
        return this._summary;
    }
    set summary(value) {
        this._summary = value;
    }
}
// ---------------------- FUNCTIONS BELOW --------------------- \\
function saveObjectsToJSONFile(objectsArray, fileName) {
    const JSONArray = JSON.stringify(objectsArray, null, 4);
    // write JSON string to a file
    fs.writeFile(fileName+'.json', JSONArray, err => {
        if (err) {
            throw err
        }
        console.log('JSON data is saved.')
    })
}
function readObjectsFromJSONFile(fileName) {
    fs.readFile(fileName+'.json', 'utf-8', (err, data) => {
        if (err) {
            throw err
        }
        // parse JSON object (javascript array of objects)
        const parsedJSON = JSON.parse(data.toString())
        // print JSON object
        parsedJSON.forEach(object => console.log(object));
    })	
}
function getDate() {
    return (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear();
}
function getTime() {
    return date.toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
}
// ---------------------- SAVE/READ FROM FILE BELOW --------------------- \\

const activityFileName = "activities";
const date = new Date();

let newdate = getDate();
let newtime = getTime();
/*
let test = new Activity(newdate, newtime);
test._timeCompleted = "4:00pm";
let test2 = new Activity(newdate, newtime);

const testArray = [test, test2];
saveObjectsToJSONFile(testArray, activityFileName);
*/

readObjectsFromJSONFile(activityFileName);


// ---------------------- ELECTRON CODE BELOW --------------------- \\

const { app, BrowserWindow, ipcMain, Menu, MenuItem } = require('electron')
const path = require('path')

let win

function createWindow () {
    win = new BrowserWindow({
    width: 1200,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      //contextIsolation: false,
      //nodeIntegration: true,
      //sandbox: false
    }
  })
  ipcMain.on('saveToFile', (event, records) => {
    console.log(records)
    saveObjectsToJSONFile(records, activityFileName)
  })

  win.loadFile('index.html')
}

const menu = new Menu()
menu.append(new MenuItem({
    label: 'File',
    submenu: [{
      role: 'Save',
      accelerator: process.platform === 'darwin' ? 'Ctrl+S' : 'Ctrl+S',
      click: () => {
          win.webContents.send('save')
       },
      
    },
    {
        role: 'Add row',
        accelerator: process.platform === 'darwin' ? 'Ctrl+Enter' : 'Ctrl+Enter',
        click: () => { 
            win.webContents.send('addRow')
         },
        
      },
      {
        role: 'Duplicate row',
        accelerator: process.platform === 'darwin' ? 'Ctrl+D' : 'Ctrl+D',
        click: () => {
            win.webContents.send('duplicateRow')
         },
        
      }
    ]
}))

Menu.setApplicationMenu(menu)

app.whenReady().then(() => {  
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// ---------------------- TEST CODE BELOW --------------------- \\

