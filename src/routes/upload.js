import express from 'express';
import multer from 'multer';
import { uploadFile } from '../controllers/Upload';

const Router = express.Router();
const upload = multer({ dest: 'uploads/' });

Router.post('/', (req, res, next) => {
    if (!req.files.files) {
        console.log('No file received');
        return res.status(400).send({ message: 'No file uploaded' });
    }
    next();
}, uploadFile);


export default Router;
