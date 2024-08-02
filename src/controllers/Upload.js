import fs from 'fs';
import { google } from 'googleapis';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({ version: 'v3', auth: oauth2Client });

async function refreshAccessToken() {
    try {
        const { credentials } = await oauth2Client.refreshAccessToken();
        oauth2Client.setCredentials(credentials);
        return credentials.access_token;
    } catch (error) {
        console.error('Error refreshing access token:', error);
        throw error;
    }
}

export const uploadFile = async (req, res) => {
    try {
        let files = req.files.files;

        // Ensure files is an array
        if (!Array.isArray(files)) {
            files = [files];
        }

        for (const file of files) {
            console.log(file)
            const filePath = file.tempFilePath;
            const fileMetadata = { name: file.name };
            const media = {
                mimeType: file.mimetype,
                body: fs.createReadStream(filePath),
            };

            await refreshAccessToken();

            const drive = google.drive({ version: 'v3', auth: oauth2Client });

            const response = await drive.files.create({
                resource: fileMetadata,
                media: media,
                fields: 'id',
            });

            // Delete the file from the local directory
            fs.unlinkSync(filePath);
        }

        res.status(200).send({
            message: 'File uploaded successfully',
        });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).send(error);
    }
};