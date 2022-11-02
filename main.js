const fs = require('fs');

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
// ---------------------- SAVE/READ FROM FILE BELOW --------------------- \\

const activityFileName = "activities";
/*
let test = new Activity(newdate, newtime);
test._timeCompleted = "4:00pm";
let test2 = new Activity(newdate, newtime);

const testArray = [test, test2];
saveObjectsToJSONFile(testArray, activityFileName);
*/


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
    let discordMsg = "Current Activity: "+records[0].development
    if (records[0].completion == true)
      discordMsg = "Completed at "+records[0].end+"\nResults: "+records[0].results
    else
      discordMsg += "\nStart time: "+records[0].start
    client.channels.cache.get(`814647500459343892`).send(discordMsg)
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

// ---------------------- DISCORD.JS CODE BELOW --------------------- \\
// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, () => {
	console.log('Ready!');
    //client.channels.cache.get(`496763131977007106`).send(`Text`)
});

client.login(token);
