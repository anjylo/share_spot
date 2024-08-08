import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const index = async (request, response) => {
    response.sendFile(path.join(__dirname, '..', 'public', 'register.html'));
}

export {
    index
}