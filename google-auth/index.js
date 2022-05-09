const { google } = require('googleapis');
const express = require('express')
const OAuth2Data = require('./google_key.json');
//path module
const path = require('path');

//file system module
const fs = require('fs');


const app = express()

const CLIENT_ID = OAuth2Data.web.client_id;
const CLIENT_SECRET = OAuth2Data.web.client_secret;
const REDIRECT_URL = OAuth2Data.web.redirect_uris[0];

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL)
var authed = false;
//file path for out file
const drive = google.drive({
  version: 'v3',
  auth: oAuth2Client,
  access_type: 'offline',
});

const filePath = path.join(__dirname, 'hero.png');

//function to upload the file
async function uploadFile() {
    try{
      const response = await drive.files.create({
            requestBody: {
                name: 'hero.png', //file name
                mimeType: 'image/png',
            },
            media: {
                mimeType: 'image/png',
                body: fs.createReadStream(filePath),
            },
        });  
        // report the response from the request
        console.log("DATA",response.data);
    }catch (error) {
        //report the error message
        console.log("data1",error.message);
    }
}  

app.get('/', async (req, res) => {
    if (!authed) {
        // Generate an OAuth URL and redirect there
        const url = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: 'https://www.googleapis.com/auth/drive.file',
        });
        res.redirect(url);
    } else {
      const newData = await uploadFile();
      console.log("FINAL RESULT", newData);
  //       const service = google.people({version: 'v1', auth:oAuth2Client});
  // service.people.connections.list({
  //   resourceName: 'people/me',
  //   pageSize: 10,
  //   personFields: 'names,emailAddresses',
  // }, (err, res) => {
  //   if (err) return console.error('The API returned an error: ' + err);
  //   const connections = res.data.connections;
  //   if (connections) {
  //     console.log('Connections:');
  //     connections.forEach((person) => {
  //       if (person.names && person.names.length > 0) {
  //         console.log(person.names[0].displayName);
  //       } else {
  //         console.log('No display name found for connection.');
  //       }
  //     });
  //   } else {
  //     console.log('No connections found.');
  //   }
  // });
  //       res.send('Logged in')
    }
})

app.get('/auth/google/callback', function (req, res) {
    const code = req.query.code
    if (code) {
        // Get an access token based on our OAuth code
        oAuth2Client.getToken(code, function (err, tokens) {
            if (err) {
                console.log('Error authenticating')
                console.log(err);
            } else {
                console.log('Successfully authenticated');
                oAuth2Client.setCredentials(tokens);
                authed = true;
                res.redirect('/')
            }
        });
    }
});


const port = process.env.port || 3000
app.listen(port, () => console.log(`Server running at ${port}`));
