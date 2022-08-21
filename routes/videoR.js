const express = require('express');
const { sequelize, Video } = require('../models');
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
    Video.findAll()
        .then(rows => res.json(rows) )
        .catch(err => res.status(500).json(err));
});


route.get('/:id', (req, res) => {
    Video.findOne({ where: { id: req.params.id } })
        .then( rows => res.json(rows) )
        .catch( err => res.status(500).json(err) );

});

route.get('/byKan/:id',(req,res) => {
    Video.findAll({  where: { id: req.params.kanalId } })
        .then(rows => res.json(rows) )
        .catch(err => res.status(500).json(err));
});


route.post('/', authToken,(req, res) => {
    const schema = Joi.object().keys({
        name: Joi.string().trim().min(4).max(15).required(),
        relesedate: Joi.string().trim().required(),
        kanalId: Joi.string().trim().required(),
        userId: Joi.string().trim().required(),
     });
    const Validation = schema.validate(req.body);
  
    if(Validation.error){
        res.status(422).json({ msg: Validation.error.message })
    }
    else{
        Video.create({ 
            name: req.body.name,
            relesedate: req.body.relesedate,
            kanalId: req.body.kanalId,  
            userId: req.body.userId, 
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
        relesedate: Joi.string().trim().required(),
        kanalId: Joi.string().trim().required(),
        userId: Joi.string().trim().required(),
     });
    const Validation = schema.validate(req.body);
  
    if(Validation.error){
        res.status(422).json({ msg: Validation.error.message })
    }
    else{
        Video.findOne({ where: { id: req.params.id } })
        .then( vid => {
            vid.name = req.body.name,
            vid.relesedate = req.body.relesedate

            vid.save()
                .then( rows => res.json(rows) )
                .catch( err => res.status(500).json(err) );
        })
        .catch( err => res.status(500).json(err) );
    }
    
});

route.delete('/:id',authToken, (req, res) => {

    Video.findOne({ where: { id: req.params.id } })
        .then( vid => {
            vid.destroy()
                .then( rows => res.json(rows) )
                .catch( err => res.status(500).json(err) );
        })
        .catch( err => res.status(500).json(err) );
});


module.exports = route; 