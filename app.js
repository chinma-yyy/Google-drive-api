const express = require('express');
const { google } = require('googleapis');
const { mongoose } = require('mongoose');
const Tokens = require('./models/tokens');
const path = require('path');
const fs = require('fs');
const scopes = [
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/drive.readonly',
    'https://www.googleapis.com/auth/drive.metadata.readonly',
    'https://www.googleapis.com/auth/drive.appdata',
    'https://www.googleapis.com/auth/drive.metadata',
    'https://www.googleapis.com/auth/drive.photos.readonly',
];



const app = express();

const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    'http://localhost:3000/oauth2callback'
);
google.options({ auth: oauth2Client });

app.get('/', (req, res, next) => {
    res.json({ mesage: 'Hello World!' });//testing purposes
    next();
});
//creating path for upload 
const filePath = path.join(__dirname, 'image.png');

app.get('/upload', async (req, res, next) => {
    /*
    I have retrieved the tokens from the database as i thought that the refresh token would change for every refresh as it was the case for twitter Oauth but you can store as an environment variable as well and is valid for 100 refreshes or 6 months but no limits for service account
    */ 
    const test = await Tokens.findOne({ user: 'Admin' }).then(user => {
        oauth2Client.setCredentials({
            refresh_token: user.refresh_token,
        })
    }).catch(err => {
        console.log(err);
    })

    //Creating a drive object
    const drive = google.drive({ version: 'v3', auth: oauth2Client });
    console.log("drive succesfully created")
    //File data we want to upload
    const fileMetadata = {
        name: 'photo.png',
        mimeType: 'image/png'
    };
    //media data
    const media = {
        mimeType: 'image/png',
        body: fs.createReadStream(filePath)
    };
    //creating a file in drive
    const response = drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id'
    }, (err, file) => {
        if (err) {
            // Handle error
            console.error(err);
        } else {
            console.log('File Id: ', file.data.id);
            console.log(file);
            console.log(file.data);
        }
    });
});

//generating a public url for the file uploaded
app.get('/generateurl', async (req, res, next) => {
    try {
        const fileId = '1jo7z1cCmAQH7sH8Kg3bOI6Za2ZRKTXsK';
        const drive = google.drive({ version: 'v3', auth: oauth2Client });
        const test = await Tokens.findOne({ user: 'Admin' }).then(user => {
            oauth2Client.setCredentials({
                refresh_token: user.refresh_token,
            })
        }).catch(err => {
            console.log(err);
        })
        console.log(oauth2Client);
        //change file permision
        await drive.permissions.create({
            fileId: fileId,
            requestBody: {
                role: 'reader',
                type: 'anyone',
            },
        });
        console.log("permission changed");

        const result = await drive.files.get({
            fileId: fileId,
            fields: 'webViewLink, webContentLink',
        });
        console.log(result.data);
        res.json({ result: result.data });
    } catch (error) {
        console.log("error");
        console.log(error.message);
        res.json({ error: error.message })
    }
});

/* 
With this endpoint you will get a url to login for oauth and will be redirected to callback 
which will store tokens in the database
*/
app.get('/login', (req, res, next) => {
    const authorizeUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes.join(' '),
    });
    console.log(authorizeUrl);
    res.json({
        url: authorizeUrl
    });

});

app.use('/oauth2callback', async (req, res, next) => {
    const code = req.query.code;
    const r = await oauth2Client.getToken(code);//Will return tokens json 
    const tokens = new Tokens({
        user: 'chinujod',
        access_token: r.tokens.access_token,
        refresh_token: r.tokens.refresh_token,
        code: code
    });
    tokens.save();
    console.log("Tokens :" + tokens);

});


mongoose.connect(process.env.MONGODB_URL).then(
    app.listen(3000, () => {
        console.log('Imagify is listening on port 3000!');
    })
).catch(err => {
    console.log(err);
});
