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

        // socket.on('chat message', (msg) => {
        //     console.log('message: ' + msg);
        //     io.emit('chat message', msg);
        // });
        
        // socket.on('disconnect', () => {
        //     console.log('user disconnected');
        // });
    });
}

export default socket;