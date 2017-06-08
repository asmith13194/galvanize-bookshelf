'use strict';

const express = require('express');
const knex = require('../knex');
const humps = require('humps');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
function hash(plaintext) {
  return bcrypt.hashSync(plaintext,8);
}

// eslint-disable-next-line new-cap
const router = express.Router();

// YOUR CODE HERE

router.post('/users',(req,res,next)=>{
  if (!req.body) {
    res.status(400);
    res.setHeader('content-type', 'text/plain');
    return res.send('Body must not be blank');
  } else if (req.body.email === undefined){
    res.status(400);
    res.setHeader('content-type', 'text/plain');
    return res.send('Email must not be blank');
  } else if (req.body.password === undefined){
    res.status(400);
    res.setHeader('content-type', 'text/plain');
    return res.send('Password must be at least 8 characters long');
  }
  knex('users')
    .select('email')
    .where('email','=',req.body.email)
    .then(result=>{
      if (result.length>0){
        res.status(400);
        res.setHeader('content-type', 'text/plain');
        return res.send('Email already exists');
      }
      req.body.hashed_password = hash(req.body.password);
      delete req.body.password;
      knex('users')
        .returning('*')
        .insert(humps.decamelizeKeys(req.body))
        .then(result=>{
          delete result[0].hashed_password;
          var token = jwt.sign(req.body, process.env.JWT_KEY);
          res.cookie('token', token, {
            httpOnly: true
          });
          res.send(humps.camelizeKeys(result[0]));
        })
    })
})

module.exports = router;
