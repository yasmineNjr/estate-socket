import {Server} from 'socket.io';

const io = new Server({
    cors: {
        // origin: 'http://localhost:5173',
        origin: 'https://estate-client-ym15.onrender.com',
    }
})

let onlineUsers= [];
const addUser = (userId, socketId) => {
    const userExists= onlineUsers.find(user => user.userId === userId);
    if(!userExists){
        onlineUsers.push({userId, socketId});
    }
}

const removeUser = (socketId) => {
    onlineUsers = onlineUsers.filter((user) => {
        user.soketId !== socketId;
    })
}

const getUser = (userId) => {
    return onlineUsers.find((user) => user.id === userId);
}

io.on('connection', (socket) => {
    // console.log(socket.id);
    // socket.on('test', data => {
    //     console.log(data);
    // })
    socket.on('newUser', (userId) => {
        addUser(userId, socket.id)
    });
    socket.on('sendMessage', ({receiverId, data}) => {
        const receiver = getUser(receiverId);
        io.to(receiver.socketId).emit("getMessage", data);
    });
    socket.on('disconnect', (socket) => {
        removeUser(socket.id);
    });
});

io.listen('4001');