const fs = require('fs');

// ---------------------- CLASSES BELOW --------------------- \\
class Item {
    // # means private

    #dateStarted;
    #timeStarted;

    #completion; // options: "success", "not started", "in-progress", "skipped", "fail"

    #dateCompleted;
    #timeCompleted;
    
    constructor(dateStarted, timeStarted) {
        this._dateStarted = dateStarted;
        this._timeStarted = timeStarted;
        this._completion = "not started";
    }
    get timeStarted() {
        return this._timeStarted;
    }
    get dateStarted() {
        return this._dateStarted;
    }
    get completion() {
        return this._completion;
    }
    get timeCompleted() {
        return this._timeCompleted;
    }
    get dateCompleted() {
        return this._dateCompleted;
    }
    set timeStarted(value) {
        this._timeStarted = value;
    }
    set dateStarted(value) {
        this._dateStarted = value;
    }
    set completion(value) {
        this._completion = value;
    }
    set timeCompleted(value) {
        this._timeCompleted = value;
    }
    set dateCompleted(value) {
        this._dateCompleted = value;
    }
}
class Activity extends Item {
    #category;
    #requirement;

    #frequency; // options: "once", "daily", "weekly", "monthly"

    #design;
    #development;
    #testing;
    #testing_results;
    
    constructor(date, time) {
        super(date, time);
        this._category = "";
        this._requirement = "";
        this._frequency = "once";
        this._design = "";
        this._development = "";
        this._testing = "";
        this._testing_results = "";
    }
    get category() {
        return this._category;
    }
    get requirement() {
        return this._requirement;
    }
    get frequency() {
        return this._frequency;
    }
    get design() {
        return this._design;
    }
    get development() {
        return this._development;
    }
    get testing() {
        return this._testing;
    }
    get testing_results() {
        return this._testing_results;
    }

    set category(value) {
        this._category = value;
    }
    set requirement(value) {
        this._requirement = value;
    }
    set frequency(value) {
        this._frequency = value;
    }
    set design(value) {
        this._design = value;
    }
    set development(value) {
        this._development = value;
    }
    set testing(value) {
        this._testing = value;
    }
    set testing_results(value) {
        this._testing_results = value;
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

let test = new Activity(newdate, newtime);
test._timeCompleted = "4:00pm";
let test2 = new Activity(newdate, newtime);

const testArray = [test, test2];
saveObjectsToJSONFile(testArray, activityFileName);
readObjectsFromJSONFile(activityFileName);


// ---------------------- ELECTRON CODE BELOW --------------------- \\

/* we are importing two Electron modules with CommonJS module syntax:
 * app: controls your application's event lifecycle.
 * BrowserWindow: creates and manages app windows.
 */
const { app, BrowserWindow, ipcMain, nativeTheme, dialog } = require('electron')
const path = require('path')

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')

  ipcMain.handle('dark-mode:toggle', () => {
    if (nativeTheme.shouldUseDarkColors) {
      nativeTheme.themeSource = 'light'
    } else {
      nativeTheme.themeSource = 'dark'
    }
    return nativeTheme.shouldUseDarkColors
  })

  ipcMain.handle('dark-mode:system', () => {
    nativeTheme.themeSource = 'system'
  })

  ipcMain.handle('dialog:openFile', handleFileOpen)
}

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
async function handleFileOpen() {
    const { canceled, filePaths } = await dialog.showOpenDialog()
    if (canceled) {
      return
    } else {
      return filePaths[0]
    }
}
