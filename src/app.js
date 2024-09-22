import 'dotenv/config';
import http from "http";
import express from 'express';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import { authenticate } from './middlewares/authMiddleware.js';
import socket from './services/socket.js';
import web from './routes/web.js';
import api from './routes/api.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

// Configs
app.use(express.static('src/public'));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use("/js", express.static("./node_modules/bootstrap/dist/js"));
app.use("/css",express.static("./node_modules/bootstrap/dist/css"));
app.use('/bootstrap-icons', express.static('./node_modules/bootstrap-icons'));

// websocket
socket(server);

// Routes
app.use(web);
app.use('/api/', api);

app.get('/', (request, response) => response.redirect('/home'));
app.get('/home', authenticate, (request, response) => response.sendFile(path.join(__dirname, 'public', 'home.html')))

app.use((request, response) => response.status(404).sendFile(path.join(__dirname, 'public', '404.html')));

(async () => {
    try {
        const DB_HOST = process.env.DB_HOST;
        const DB_PORT = process.env.DB_PORT;
        const DB_NAME = process.env.DB_NAME;
        const DB_URI = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`;
        
        const APP_PORT = process.env.APP_PORT;
        
        await mongoose.connect(DB_URI);
        
        console.log('Database connected');

        server.listen(APP_PORT, () => console.log(`Server running on port ${APP_PORT}`));
    
    } catch (error) {
        console.log(error);
    }
})();