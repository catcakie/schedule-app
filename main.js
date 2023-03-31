// ---------------------- SAVE TO FILE & READ FROM FILE FUNCTIONS BELOW --------------------- \\
const fs = require('fs');

function saveObjectsToJSONFile(objectsArray, fileName) {
    const JSONArray = JSON.stringify(objectsArray, null, 4);
    // write JSON string to a file
    fs.writeFile(fileName + '.json', JSONArray, err => {
        if (err) {
            throw err
        }
        console.log('JSON data is saved.')
    })
}

function readObjectsFromJSONFile(fileName) {
    fs.readFile(fileName + '.json', 'utf-8', (err, data) => {
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

const {
    app,
    BrowserWindow,
    ipcMain,
    Menu,
    MenuItem
} = require('electron')
const path = require('path')

let win

function createWindow() {
    win = new BrowserWindow({
        width: 1200,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        }
    })

    // renderer.js event handlers
    ipcMain.on('saveToGoogleSheets', (event, args) => {
        spreadsheetTitle = args[0]
        items = args[1]
        console.log(items[0])
        authorize().then(createSheet).catch(console.error)
    })
    ipcMain.on('saveToFile', (event, records) => {
        saveObjectsToJSONFile(records, "activities")

        client.channels.cache.get(`1045591102897532958`).send({
            files: [{
                attachment: 'activities.json'
            }]
        })

    })
    ipcMain.on('selectedRow', (event, record) => {
        let discordMsg = "---\nCurrent Activity: " + record.development

        if (record.completion === false && record.development.includes("sleep") || record.completion === false && record.development.includes("nap")) {
            client.channels.cache.get(`496763131977007106`).send("Danielle went to bed to try to sleep or nap\nGoodnight bae, I love you")
        }

        if (typeof record === "string" || record.completion === true) {
            if (record.completion === true) {
                discordMsg += "\nCompleted: " + record.end + "\nResults: " + record.testing
                discordMsg += "\n---"
                client.channels.cache.get(`814647500459343892`).send(discordMsg)
            }

            client.user.setPresence({
                activities: [{
                    name: `probably yt/reddit`,
                    type: ActivityType.Watching
                }],
                status: 'idle',
            })
        } else {
            discordMsg += "\nStart time: " + record.start

            discordMsg += "\n---"

            client.channels.cache.get(`814647500459343892`).send(discordMsg)

            client.user.setPresence({
                activities: [{
                    name: '[' + record.start + '] ' + record.development,
                    type: ActivityType.Playing
                }],
                status: 'online'
            })
        }
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

        },
        {
            role: 'Duplicate row 5 times',
            accelerator: process.platform === 'darwin' ? 'Ctrl+E' : 'Ctrl+E',
            click: () => {
                win.webContents.send('duplicateRowFourTimes')
            },

        },
        {
            role: 'Clear Grid',
            accelerator: process.platform === 'darwin' ? 'Ctrl+N' : 'Ctrl+N',
            click: () => {
                win.webContents.send('refreshGrid')
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
const {
    Client,
    GatewayIntentBits,
    REST,
    Routes,
    Collection,
    Events,
    SlashCommandBuilder,
    ActivityType
} = require('discord.js');
const {
    clientId,
    guildId,
    token
} = require('./config.json');

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

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
const rest = new REST({
    version: '10'
}).setToken(token);

// deploy the commands
(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.put(
            Routes.applicationGuildCommands(clientId, guildId), {
                body: commands
            },
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
    client.user.setPresence({
        activities: [{
            name: `probably yt/reddit`,
            type: ActivityType.Watching
        }],
        status: 'idle',
    })
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: 'There was an error while executing this command!',
            ephemeral: true
        });
    }
});

client.login(token);

// ---------------------- WEBSCRAPING CODE BELOW --------------------- \\
const axios = require("axios")
const cheerio = require("cheerio")
const puppeteer = require("puppeteer")
const YAML = require('yaml')

const shopgoodwillBathAndBodyLink = "https://shopgoodwill.com/categories/bath-body"
let shopgoodwillCache = []


getShopGoodwillPostTitles(shopgoodwillBathAndBodyLink)

function getAveragePrice(postTitle, currentPrice, link) {
    puppeteer
    .launch ()
    .then (async browser => {
    
      //open a new page for puppeteer, go to the website, then wait for the site's body contents to load
      const page = await browser.newPage ();
      await page.goto ('https://www.google.com/search?q='+postTitle+'&tbm=shop');
      await page.waitForSelector ('.QIrs8');
    
      //Get the "viewport" of the page, as reported by the page (page.evaluate)
      let averagePrice = await page.evaluate (() => {
      
      let allPosts = document.body.querySelectorAll ('.QIrs8');
      
      let sum = 0
        let numberOfItems = 0
      
      for (let i=0; i<allPosts.length; ++i) {
  
        let unsanitizedPrice = allPosts[i].firstChild.innerText
    
        if (unsanitizedPrice) {
    
          const currentPrice = (unsanitizedPrice.match(/\$((?:\d|\,)*\.?\d+)/g) || [])[0]
    
          if (currentPrice) {
          
            const priceValue = Number(currentPrice.replace(/[^0-9.-]+/g,""))
          
            sum += priceValue
            ++numberOfItems
            
          }
        }
      }
  
        return (sum / numberOfItems)
      });
      //output the scraped data
      
      if (currentPrice/averagePrice < 1/3) {
        client.channels.cache.get(`1077663232564678686`).send("\nAVG PRICE: $"+ Math.round(averagePrice) +"\nCURRENT PRICE: $"+Math.round(currentPrice)+"\n"+link)
      }
      //closs the browser
      await browser.close ();
    })
    //handling any errors
    .catch (function (err) {
      console.error (err);
    });
  }

function getShopGoodwillPostTitles(link) {
  puppeteer
  .launch()
  .then(async browser => {
      //open a new page for puppeteer, go to the website, then wait for the site's body contents to load

      const page = await browser.newPage();

      await page.goto(link);
      await page.waitForSelector('.feat-item_price');

      //Get the "viewport" of the page, as reported by the page (page.evaluate)

      let grabPosts = await page.evaluate(async (shopgoodwillCache) => {
          // find the very first element's classes. scroll to the right to try to find an english word
          let postLinks = [];

              let allPosts = document.body.querySelectorAll('a.feat-item_name')
              
              if (allPosts.length != 0) {
                  allPosts.forEach(async item => {
                      let postPrice = parseFloat(item.nextElementSibling.innerHTML.replace(/[^0-9\.]+/g, ""))
                      let postTitle = item.text
                      let postLink = "https://shopgoodwill.com" + item.getAttribute('href')
                      let postImage = item.parentElement.parentElement.previousElementSibling.firstChild.firstChild.src

                      if (!shopgoodwillCache.includes(item[postTitle])) { // && postPrice/averagePrice < 1/3
                        postLinks.push({
                          title: postTitle,
                          link: postLink,
                          price: postPrice
                        })
                      }
                  });
              }

          return postLinks
      }, shopgoodwillCache)
      

      await Promise.all(grabPosts).then((results) => {
          if (grabPosts.length > 0) {
              results.forEach(result => {
                shopgoodwillCache.push(result)
                
                //console.log(result["title"])

              })
          } else {
              //client.channels.cache.get(`893294534820257852`).send("No new posts from ShopGoodwill")
          }

          
      }).catch(function(err) {
          console.error(err);
      })

      for (let i=0; i<10; ++i) {
        let item = shopgoodwillCache[i]

        getAveragePrice(item["title"], item["price"], item["link"])
      }

      setInterval(() => {
        for (let i=0; i<10; ++i) {
          let item = shopgoodwillCache[i]
  
          getAveragePrice(item["title"], item["price"], item["link"])
        }
      }, 300000)
      
      await browser.close();
    }
  )
  //handling any errors
  .catch(function(err) {
      console.error(err);
  });
}

let postTitleCache = []

function getNewRedditPosts() {
  puppeteer
  .launch ()
  .then (async browser => {
  
    //open a new page for puppeteer, go to the website, then wait for the site's body contents to load
    const page = await browser.newPage ();
    await page.goto ('https://www.reddit.com/r/fragranceswap/new/');
    await page.waitForSelector ('body');
  
    //Get the "viewport" of the page, as reported by the page (page.evaluate)
    let grabPosts = await page.evaluate (async (postTitleCache) => {
    // find the very first element's classes. scroll to the right to try to find an english word
    let allPosts = document.body.querySelectorAll ('.Post');
      
    //store the post items in an array then select to get the descriptions from each
    scrapeItems = [];
    allPosts.forEach (item => {
      let postTitle = ''

      if (item.querySelector ('h3').innerText.toLocaleLowerCase().includes("wts") && 
      item.querySelector ('h3').innerText.toLocaleLowerCase().includes("bottle")) {
        postTitle = item.querySelector ('h3').innerText
      }

      let postDescription = '';
        try {
          let postDescriptions = item.querySelectorAll ('p');
          let tempString = ""
          
          postDescriptions.forEach(desc => tempString += (desc.innerText.match(/\$((?:\d|\,)*\.?\d+)/g) || []) + ", " )

          postDescription = tempString
        } catch (err) {}
        
        if (postTitle !== '' && postDescription !== '' && !postTitleCache.includes(postTitle)) {
          scrapeItems.push ({
            title: postTitle,
            prices: postDescription,
          });
        }
      });

      return scrapeItems;
    }, postTitleCache);
    //output the scraped data
    grabPosts.forEach(item => {
        client.channels.cache.get(`1077663232564678686`).send("**"+ item.title + "**\n" + item.prices)
        postTitleCache.push(item.title)
        console.log(item)
    })
    //closs the browser
    await browser.close ();
  })
  //handling any errors
  .catch (function (err) {
    console.error (err);
  });
}

getNewRedditPosts()

setInterval(getNewRedditPosts, 600000)

setInterval(() => { postTitleCache = [] }, 3600000*3)

// ----------------------------- GOOGLE SHEETS CODE ----------------------

const GSfs = require('fs').promises;
const GSprocess = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(GSprocess.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(GSprocess.cwd(), 'credentials.json');

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await GSfs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await GSfs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await GSfs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

let spreadsheetTitle = 'Untitled'
let items = []

/**
 * Create a new spreadsheet
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client
 */
async function createSheet(auth) {
  const service = google.sheets({version: 'v4', auth})
  const resource = {
    properties: {
      title: spreadsheetTitle
    }
  }

  try {
    const spreadsheet = await service.spreadsheets.create({
      resource,
      fields: 'spreadsheetId',
    });
    console.log(`Spreadsheet ID: ${spreadsheet.data.spreadsheetId}`);
    win.webContents.send('sendSpreadsheetID', [spreadsheetTitle, spreadsheet.data.spreadsheetId])

    const request = {
        // The ID of the spreadsheet to update.
        spreadsheetId: spreadsheet.data.spreadsheetId,  // TODO: Update placeholder value.
    
        // The A1 notation of a range to search for a logical table of data.
        // Values are appended after the last row of the table.
        range: 'A:C',  // TODO: Update placeholder value.
    
        // How the input data should be interpreted.
        valueInputOption: 'RAW',  // TODO: Update placeholder value.
    
        // How the input data should be inserted.
        insertDataOption: 'INSERT_ROWS',  // TODO: Update placeholder value.
    
        resource:
            {
                "values": items
            },
          // TODO: Add desired properties to the request body.
    
      };

      try {
        const response = (await service.spreadsheets.values.append(request)).data;
        // TODO: Change code below to process the `response` object:
        console.log(JSON.stringify(response, null, 2));
      } catch (err) {
        console.error(err);
      }

    return spreadsheet.data.spreadsheetId;
  } catch (err) {
    // TODO (developer) - Handle exception
    throw err;
  }
}
