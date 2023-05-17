### My Personal Schedule App

As my responsibilities grew, I needed better tools to manage everything.

#### What I personally use this for

Keeping track of:

- Skincare progress (with pics)
- Money spent
- My wish list
- My clothes
- Pet health
- Deadlines
)
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

1. Download the project in a zip folder
2. Extract it
3. Copy the folder's filepath
4. Download [Node.js](https://nodejs.org/en) (choose the recommended version)
6. Open **Command Prompt**
7. Type `cd PASTE_FILE_PATH_HERE` to navigate to the folder
8. Type `npm install` to install the dependencies needed for the project

**Optional Discord Bot functionality:**

10. Create a new file named `config.json` (make sure you have file extensions unhidden, especially if setting this up on a new PC)
12. Open **Discord**
13. Go to **User Settings**
14. Scroll down to **Advanced** (under **APP SETTINGS**)
15. Enable **Developer Mode**
16. On your browser, go to [Developer Portal](https://discord.com/developers/applications)
17. Click **New Application**
18. Type any name
19. Click **Create**
20. Open the **config.json** file for editing
21. Copy & paste the text below into the file:

```json
  {
      "token": "",
      "clientId": "",
      "guildId": ""
  }
```
22. Fill in between the quotation marks. Here's where to find each thing:

**Client ID**

- In **Developer Portal**, Click on **OAuth2**

**Token**

- In **Developer Portal**, Click on **Bot**
- Click **Reset Token**

**Guild ID**

- On **Discord**, right-click your **Server icon**
- Click **Copy Server ID**

12. Type `npm start` to run the application


###### Some Pics

<img src="https://github.com/catcakie/schedule-app/assets/60787559/309d55a7-b0b4-47fa-b356-2018c76740ed" alt="image" style="zoom: 33%;" />
<img src="https://user-images.githubusercontent.com/60787559/221429315-8852a1fb-0c50-47ae-9e37-2b060f60af94.png" alt="image" style="zoom: 33%;" />
<img src="https://user-images.githubusercontent.com/60787559/221429328-86bba8c3-d358-44ca-9f0d-dac442f3c1c9.png" alt="image" style="zoom: 33%;" />
<img src="https://user-images.githubusercontent.com/60787559/221429345-ca650e98-6421-43e4-997a-59810d4690ba.png" alt="image" style="zoom: 33%;" />
