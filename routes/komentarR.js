const express = require('express');
const { sequelize, Komentar } = require('../models');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const Joi = require('joi');


const route = express.Router();
route.use(express.json());
route.use(express.urlencoded({ extended: true }));

function authToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (token == null) return res.status(401).json({ msg: "err" });

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    
        if (err) return res.status(403).json({ msg: err });
    
        req.user = user;
    
        next();
    });
}



route.get('/all',(req,res) => {
    Komentar.findAll({ include: ['video', 'user'] })
        .then(rows => res.json(rows) )
        .catch(err => res.status(500).json(err));
});

route.get('/byVid/:id',(req,res) => {
    Komentar.findAll({  where: { id: req.params.videoId } })
        .then(rows => res.json(rows) )
        .catch(err => res.status(500).json(err));
});

route.get('/byUsr/:id',(req,res) => {
    Komentar.findAll({  where: { id: req.params.userId } })
        .then(rows => res.json(rows) )
        .catch(err => res.status(500).json(err));
});


route.get('/:id', (req, res) => {
    Komentar.findOne({ where: { id: req.params.id } })
        .then( rows => res.json(rows) )
        .catch( err => res.status(500).json(err) );

});


route.post('/', authToken,(req, res) => {
    const schema = Joi.object().keys({
        body: Joi.string().trim().max(2048).required(),
        videoId: Joi.string().trim().required(),
        userId: Joi.string().trim().required()
     });
    const Validation = schema.validate(req.body);

    if(Validation.error){
        res.status(500).json({ msg: Validation.error.message })
    }
    else{
        Komentar.create({ 
            body: req.body.text,
        })
        .then( rows => res.json(rows) )
        .catch( err => res.status(500).json(err) );
    }
});

route.put('/:id',authToken, (req, res) => {
    const schema = Joi.object().keys({
        id: Joi.string(),
        createdAt: Joi.string(),
        updatedAt: Joi.string(),
        body: Joi.string().trim().max(2048).required(),
        videoId: Joi.string().trim().required(),
        userId: Joi.string().trim().required()
     });
    const Validation = schema.validate(req.body);

    if(Validation.error){
        res.status(500).json({ msg: Validation.error.message })
    }
    else{
        Komentar.findOne({ where: { id: req.params.id } })
        .then( kom => {
            kom.body = req.body.body,


            kom.save()
                .then( rows => res.json(rows) )
                .catch( err => res.status(500).json(err) );
        })
        .catch( err => res.status(500).json(err) );
    }
});

route.delete('/:id',authToken, (req, res) => {
    Komentar.findOne({ where: { id: req.params.id } })
        .then( kom => {
            kom.destroy()
                .then( rows => res.json(rows) )
                .catch( err => res.status(500).json(err) );
        })
        .catch( err => res.status(500).json(err) );
});


module.exports = route; 