import express from 'express';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

import { authenticate } from './middlewares/authMiddleware.js';

import web from './routes/web.js';
import api from './routes/api.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Configs
app.use(express.static('src/public'));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use("/js", express.static("./node_modules/bootstrap/dist/js"));
app.use("/css",express.static("./node_modules/bootstrap/dist/css"));
app.use('/bootstrap-icons', express.static('./node_modules/bootstrap-icons'));

// Routes
app.use(web);
app.use('/api/', api);

app.get('/', (request, response) => response.redirect('/home'));
app.get('/home', authenticate, (request, response) => response.sendFile(path.join(__dirname, 'public', 'home.html')))

app.use((request, response) => response.status(404).sendFile(path.join(__dirname, 'public', '404.html')));

(async () => {
    try {
        const uri = 'mongodb://mongo:27017/app';
        const port = 3000;
        
        await mongoose.connect(uri);
        
        console.log('Database connected');

        app.listen(port, () => console.log(`Server running on port ${port}`));
    
    } catch (error) {
        console.log(error);
    }
})();