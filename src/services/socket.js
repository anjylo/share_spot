import { Server } from "socket.io";

const socket = (server) => {
    const io = new Server(server);
    
    io.on('connection', (socket) => {
        socket.on('link', (data) => {
            io.emit('link', data);
        });

        socket.on('disconnect', (data) => {
            io.emit('unlink', data);
        });

        socket.on('message', (data) => {
            io.emit('message', data);
        });
    
    });
}

export default socket;