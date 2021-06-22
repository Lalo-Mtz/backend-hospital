const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

io.on('connection', (socket) => {
    const idHandShake = socket.id;
    const { nameRoom } = socket.handshake.query;

    socket.join(nameRoom); /// sala de leifer

    console.log(`Hola dispositivo ${idHandShake} conectado a --> ${nameRoom}`);

    socket.on('event', (res) => {
        console.log(res);
        socket.to(nameRoom).emit('event', res); ///Emitir todo los datos a todos los dispositivos unidos al grupo exepo al emisor
    });

    socket.on('disconnect', () => {
        console.log('user disconected');
    });
});

server.listen(3200, () => {
    console.log('>> Socket listo y escuchando por el puerto: 3200');
})