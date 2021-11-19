const express = require('express'); //used for initialisting our express prsoject
const app = express(); //for initialising our project app
const server = require('http').Server(app); //runs our server
const io = require ('socket.io')(server) // importing socket.io
const { v4: uuidv4 } = require('uuid');  //importing uuid for creating unique room ids

//this is how we run peer server 
const {ExpressPeerServer} = require('peer');
const peerServer = ExpressPeerServer(server, {  //peer server working together with express to give us this functionality
    debug: true
});

  
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use('/peerjs',peerServer); //species to peerServer that we're going to use /peerjs URL
app.get('/', (req,res) => {
    res.redirect(`/${uuidv4()}`); //this line of code reflects our room id on URL portion
}) //basically this will enable our project to live on server on browser

app.get('/:room', (req,res)=>{
    res.render('room',{ roomId: req.params.room})
})
 
io.on('connection',socket =>{
    socket.on('join-room',(roomId, userId)=>{
        socket.join(roomId); 
        socket.to(roomId).broadcast.emit('user-connected',userId);  //broadcasts 'user connected' to everybody else inside room
    })
})






server.listen(3030);  //server is our local host and it's using 3030 port