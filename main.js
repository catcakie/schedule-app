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
const { Client, GatewayIntentBits, REST, Routes, Collection, Events, SlashCommandBuilder } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// commands
const commands = [];
// Grab all the command files from the commands directory
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

// slash commands related to app here
const test = {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription('Replies with test!'),
	async execute(interaction) {
		await interaction.reply("Test!");
	},
};
commands.push(test.data.toJSON())

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(token);

// deploy the commands
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// make sure to catch and log any errors
		console.error(error);
	}
})();

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

// slash commands related to app here
client.commands.set(test.data.name, test)

client.once(Events.ClientReady, () => {
	console.log('Ready!');
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(token);
