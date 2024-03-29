### My Personal Schedule App

As my responsibilities grew, I needed better tools to manage everything.

#### What I personally use this for

Keeping track of:

- Skincare progress (with pics)
- Money spent
- My wish list
- Medication
- Pet health
- Deadlines

#### Features

- Live Search
- Spreadsheet that saves to Google Sheets
  - Also saves the title, sheet data, & link into a record in the program
- Discord Bot functionality:
  - Displays current activity as the bot's status
  - Auto-backups on every save
  - Item notifier
- A simple textbox (sometimes you need it)

#### How to set up

1. Download [Node.js](https://nodejs.org/en) (choose the recommended version)
2. Download the project in a zip folder
3. Extract it
4. Copy the folder's filepath
5. Open **Command Prompt**
6. Type `cd PASTE_FILE_PATH_HERE` to navigate to the folder
7. Type `npm install` to install the dependencies needed for the project

**Optional Discord Bot functionality:**

8. On your browser, go to [Developer Portal](https://discord.com/developers/applications)
9. Click **New Application**
10. Type any name
11. Click **Create**
12. In the **Schedule App folder**, create a new file named `config.json`
13. Open the **config.json** file for editing
14. Copy & paste the text below into the file:

```json
  {
      "token": "",
      "clientId": "",
      "guildId": ""
  }
```
15. Fill in between the quotation marks. Here's where to find each thing:

**Client ID**

- In **Developer Portal**, Click on **OAuth2**

**Token**

- In **Developer Portal**, Click on **Bot**
- Click **Reset Token**

**Guild ID**

- Open **Discord**
- Go to **User Settings**
- Scroll down to **Advanced** (under **APP SETTINGS**)
- Enable **Developer Mode**
- Exit **User Settings**
- Right-click your **Server icon**
- Click **Copy Server ID**

16. Type `npm start` to run the application


If you want to save your spreadsheets to Google Sheets, you must have a `credentials.json` file


###### Some Pics

<img src="https://github.com/catcakie/schedule-app/assets/60787559/309d55a7-b0b4-47fa-b356-2018c76740ed" alt="image" style="zoom: 33%;" />
<img src="https://user-images.githubusercontent.com/60787559/221429315-8852a1fb-0c50-47ae-9e37-2b060f60af94.png" alt="image" style="zoom: 33%;" />
<img src="https://user-images.githubusercontent.com/60787559/221429328-86bba8c3-d358-44ca-9f0d-dac442f3c1c9.png" alt="image" style="zoom: 33%;" />
<img src="https://user-images.githubusercontent.com/60787559/221429345-ca650e98-6421-43e4-997a-59810d4690ba.png" alt="image" style="zoom: 33%;" />
