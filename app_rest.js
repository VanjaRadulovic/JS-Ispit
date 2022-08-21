const express = require('express');
const { sequelize, User } = require('./models');
const cors = require('cors');
const userapi = require('./routes/userR');
const kanalapi = require('./routes/kanalR');
const videoapi = require('./routes/videoR');
const komentarapi = require('./routes/komentarR');

const app = express();

var corsOptions = {
    origin: 'https://ispit-js.herokuapp.com/',
    optionsSuccessStatus: 200
}

app.use(express.json());
app.use(cors(corsOptions));


app.use('/admin/user', userapi);
app.use('/admin/kanal', kanalapi);
app.use('/admin/video', videoapi);
app.use('/admin/komentar', komentarapi);


app.listen({ port: 8500 }, async () => {
    await sequelize.authenticate();
    console.log("povezan app za restapi");
});