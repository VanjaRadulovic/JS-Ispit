const express = require('express');
const { sequelize, Kanal} = require('../models');
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
    Kanal.findAll()
        .then(rows => res.json(rows) )
        .catch(err => res.status(500).json(err));
});


route.get('/:id', (req, res) => {
    Kanal.findOne({ where: { id: req.params.id } })
        .then( rows => res.json(rows) )
        .catch( err => res.status(500).json(err) );

});


route.post('/',authToken, (req, res) => {
    const schema = Joi.object().keys({
        name: Joi.string().trim().min(4).max(15).required(),
        subs: Joi.string().trim().required()
     });
    const Validation = schema.validate(req.body);
  
    if(Validation.error){
        res.status(422).json({ msg: Validation.error.message })
    }
    else{
        Kanal.create({ 
            name: req.body.name, 
            subs: req.body.subs
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
        name: Joi.string().trim().min(4).max(15).required(),
        subs: Joi.string().trim().required()
     });
    const Validation = schema.validate(req.body);
  
    if(Validation.error){
        res.status(422).json({ msg: Validation.error.message })
    }
    else{
        Kanal.findOne({ where: { id: req.params.id } })
        .then( kan => {
            kan.name = req.body.name, 
            kan.subs = req.body.subs

            kan.save()
                .then( rows => res.json(rows) )
                .catch( err => res.status(500).json(err) );
        })
        .catch( err => res.status(500).json(err) );
    }
});

route.delete('/:id', authToken,(req, res) => {
    Kanal.findOne({ where: { id: req.params.id } })
        .then( kan => {
            kan.destroy()
                .then( rows => res.json(rows) )
                .catch( err => res.status(500).json(err) );
        })
        .catch( err => res.status(500).json(err) );
});


module.exports = route; 