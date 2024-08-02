import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import fileUpload from "express-fileupload";
import morgan from "morgan";
import bodyParser from "body-parser";
import { google } from "googleapis";
import opn from "opn";

import config from "./config";
import v1Router from "./routes/index.js";

const app = new express();

// Setup middlewares
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan("tiny"));
app.use(
  fileUpload({
    limits: { fileSize: 2500 * 1024 * 1024 },
    useTempFiles: true,
    abortOnLimit: true,
    responseOnLimit: "Maximum upload size is 200MB",
  })
);
app.use(
  bodyParser.json()
);
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/v1", v1Router);

app.use(function (req, res, next) {
  res
    .status(404)
    .send({ responseCode: 404, message: "Invalid resource URL", data: [] });
  next();
});


const CLIENT_ID = '';
const CLIENT_SECRET = '';
const REDIRECT_URI = 'http://localhost:3000/oauth2callback';

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

const SCOPES = ['https://www.googleapis.com/auth/drive'];

app.get('/oauth2callback', async (req, res) => {
  try {
    console.log('Authorization code received:', req.query.code);
    
    const { tokens } = await oauth2Client.getToken(req.query.code);
    oauth2Client.setCredentials(tokens);

    console.log('Access Token:', tokens.access_token);
    console.log('Refresh Token:', tokens.refresh_token);

    res.send('Authorization successful! You can close this tab.');
  } catch (error) {
    console.error('Error retrieving access token:', error);

    if (error.response && error.response.data) {
      console.error('Error details:', error.response.data);
    }

    res.status(500).send('Error retrieving access token');
  }
});



app.get('/', (req, res) => {
  // const authUrl = oauth2Client.generateAuthUrl({
  //   access_type: 'offline',
  //   scope: SCOPES,
  // });

  // console.log("Opening authorization URL...")

  // opn(authUrl);
  res.send('Success');
});


export default app;
