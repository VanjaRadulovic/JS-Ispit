const express = require('express');
const { sequelize, User } = require('./models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const Joi = require('joi');
require('dotenv').config();

const app = express();

var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
}


app.use(express.json());
app.use(cors(corsOptions));


app.post('/api_register', (req, res) => {

    const schema = Joi.object().keys({
        name: Joi.string().min(4).max(15).required(),
        lastname: Joi.string().min(4).max(15).required(),
        email: Joi.string().trim().email().required(),
        username: Joi.string().min(4).max(10).required(),
        password: Joi.string().min(5).max(25).required(),
        admin: Joi.string().trim(),
        moderator: Joi.string().trim(),
        creator: Joi.string().trim()    
     });
    const Validation = schema.validate(req.body);

  
    if(Validation.error){
        res.status(422).json({ msg: Validation.error.message })
    }
    else{
        User.create({ 
            name: req.body.name, 
            lastname: req.body.lastname, 
            email: req.body.email,
            username: req.body.username, 
            password: bcrypt.hashSync(req.body.password, 10),
            admin: req.body.admin, 
            moderator: req.body.moderator,
            creator: req.body.creator,
        })
            .then( rows => {
                const userInfo = {
                    userId: rows.id,
                    username: rows.username
                };
                const token = jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET);
                res.json({ token: token }) 
            })
            .catch( err => res.status(500).json(err) );

    }
});

app.post('/api_login', (req, res) => {

    const schema = Joi.object().keys({
        username: Joi.string().trim().required(),
        password: Joi.string().min(2).max(10).required()
    });
    const Validation = schema.validate(req.body);

  
    if(Validation.error){
        res.status(422).json({ msg: Validation.error.message })
    }
    else{
        User.findOne({ where: { username: req.body.username } })
        .then( cryptedUser => { 
            
        if (bcrypt.compareSync(req.body.password, cryptedUser.password)){

                const userInfo = {
                    userId: cryptedUser.id,
                    username: cryptedUser.username 
                };
                const token = jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET);

                res.json({ token: token, userId: cryptedUser.id})
        
            }
            else{
                res.status(400).json({ msg: 'Lose uneseni username ili sifra' })
            }
        })
        .catch( err => res.status(500).json({ msg: 'Lose uneseni username ili sifra' }));
    }
});

app.listen({ port: 9000 }, async () => {
    await sequelize.authenticate();
    console.log("povezan app za autentifikaciju");
});