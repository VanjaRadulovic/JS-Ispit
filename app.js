const express = require('express');
const { sequelize, Video, Komentar } = require('./models');
const path = require('path');
const { raw } = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
const history = require('connect-history-api-fallback');
require('dotenv').config();
const Joi = require('joi');


const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT'],
        credentials: true
    },
    allowEIO3: true
});

var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
}

app.use(express.json());
app.use(cors(corsOptions));

function getCookies(req) {
    if (req.headers.cookie == null) return {};

    const rawCookies = req.headers.cookie.split('; ');
    const parsedCookies = {};
    

    rawCookies.forEach( rawCookie => {
        const parsedCookie = rawCookie.split('=');
        parsedCookies[parsedCookie[0]] = parsedCookie[1];
    });

    return parsedCookies;
}; 

function authToken(req, res, next) {
    const cookies = getCookies(req); 
    console.log('cookie',cookies);
    const token = cookies['token'];
  
    if (token == null) return res.redirect(301, '/login');
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    
        if (err) return res.redirect(301, '/login');
    
        req.user = user;
    
        next(); 
    });
}


function authSocket(msg, next) {
    if (msg[1].token == null) {
        next(new Error("Not authenticated"));
    } else {
        jwt.verify(msg[1].token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                next(new Error(err));
            } else {
                msg[1].user = user;
                next();
            }
        });
    }
}

io.on('connection', socket => {
    socket.use(authSocket);
 
    socket.on('updateVideo', msg => {
        const schema = Joi.object().keys({
            id: Joi.string(),
            // createdAt: Joi.string(),
            // updatedAt: Joi.string(),
            name: Joi.string().trim().min(4).max(15).required(),
            relesedate: Joi.string().trim().required(),
            userId: Joi.string().trim().required(),
            kanalId: Joi.string().trim().required()

         });
         const Validation = schema.validate(msg.body);
     
        if(Validation.error){
            res.status(500).json({ msg: Validation.error.message })
        }
        else{
            Video.findOne({ where: { id: msg.body.id } })
            .then( video => {
                video.name = msg.body.name,
                video.relesedate = msg.body.relesedate,

                video.save()
                    .then( rows => {
                        Video.findOne({ where: { id: rows.id }})
                            .then(msg => io.emit('updateVideo', JSON.stringify(msg)) ) 
                    }).catch( err => res.status(500).json(err) );
            })
            .catch( err => res.status(500).json(err) );
        }
    });

    socket.on('comment', msg => {
        Komentar.create({ body: msg.body, videoId: msg.videoId, userId: msg.user.userId })
            .then( rows => {
                Komentar.findOne({ where: { id: rows.id }, include: ['user'] })
                    .then( msg => io.emit('comment', JSON.stringify(msg)) ) 
            }).catch( err => res.status(500).json(err) );
    });

    socket.on('error', err => socket.emit('error', err.message) );
});

const staticMdl = express.static(path.join(__dirname, 'dist'));
app.use(staticMdl);
app.use(history({ index: '/index.html' }));
app.use(staticMdl);

server.listen({ port: process.env.PORT || 8000 }, async () => {
    await sequelize.authenticate();
    console.log("startovan app");
});