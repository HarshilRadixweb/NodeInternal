//googleapis
const { google } = require('googleapis');

//path module
const path = require('path');

//file system module
const fs = require('fs');

//client id
const CLIENT_ID = '1053082741370-koe6ck4u758ge2ub1jiha6phcbhb3p1t.apps.googleusercontent.com'

//client secret
const CLIENT_SECRET = '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';

//redirect URL
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';

//refresh token
const REFRESH_TOKEN = 'YOUR REFRESH TOKEN'; 

//intialize auth client
const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN,access_type: 'offline',});

//initialize google drive
const drive = google.drive({
    version: 'v3',
    auth: oauth2Client,
    access_type: 'offline',
});

//file path for out file
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

//delete file function
async function deleteFile() {
    try {
        const response = await drive.files.delete({
            fileId: 'File_id',// file id
        });
        console.log(response.data, response.status);
    } catch (error) {
        console.log(error.message);
    }
  }

  //create a public url
async function generatePublicUrl() {
    try {
        const fileId = '19VpEOo3DUJJgB0Hzj58E6aZAg10MOgmv';
        //change file permisions to public.
        await drive.permissions.create({
            fileId: fileId,
            requestBody: {
            role: 'reader',
            type: 'anyone',
            },
        });

        //obtain the webview and webcontent links
        const result = await drive.files.get({
            fileId: fileId,
            fields: 'webViewLink, webContentLink',
        });
      console.log(result.data);
    } catch (error) {
      console.log(error.message);
    }
  }
  uploadFile();