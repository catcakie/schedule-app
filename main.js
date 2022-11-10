// ---------------------- SAVE TO FILE & READ FROM FILE FUNCTIONS BELOW --------------------- \\
const fs = require('fs');

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

// ---------------------- ELECTRON CODE BELOW --------------------- \\

const { app, BrowserWindow, ipcMain, Menu, MenuItem } = require('electron')
const path = require('path')

let win

function createWindow () {
    win = new BrowserWindow({
    width: 1200,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    }
  })

  // renderer.js event handlers
  ipcMain.on('saveToFile', (event, records) => {
    saveObjectsToJSONFile(records, "activities")
  })
  ipcMain.on('selectedRow', (event, record) => {
    let discordMsg = "---\nCurrent Activity: "+record.development
    discordMsg += "\nStart time: "+record.start
    if (record.completion == true)
      discordMsg += "\nCompleted: "+record.end+"\nResults: "+record.testing
    discordMsg += "\n---"
    client.channels.cache.get(`814647500459343892`).send(discordMsg)
  })

  win.loadFile('index.html')
}

// keyboard shortcut code
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
        role: 'Clear Images',
        accelerator: process.platform === 'darwin' ? 'Ctrl+R' : 'Ctrl+R',
        click: () => { 
            win.webContents.send('clearImages')
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

// create application window when ready
app.whenReady().then(() => {  
  createWindow()
  console.log("Electron App Ready!")

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
const { Client, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// console log when bot is ready
client.once(Events.ClientReady, () => {
	console.log('Discord Bot Ready!');
});

client.login(token);
