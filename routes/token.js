'use strict';

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();
const bcrypt = require('bcrypt');
const cookieparser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const knex = require('../knex');
// YOUR CODE HERE

router.get('/token', (req, res, next) => {
  var token = req.cookies.token
  jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
    if (err) {
      return res.send(false)
    }
    res.send(true)
  });
})

router.post('/token', (req, res, next) => {
  if (!req.body) {
    res.send(false)
  }
  if (req.body.email===undefined){
    res.status(400);
    res.setHeader('content-type', 'text/plain');
    return res.send('Email must not be blank')
  }else if (req.body.password===undefined){
    res.status(400);
    res.setHeader('content-type', 'text/plain');
    return res.send('Password must not be blank')
  }
    knex('users')
      .select('id', 'email', 'first_name as firstName', 'last_name as lastName', 'hashed_password as hash')
      .where('email','=', req.body.email)
      .first()
      .then(userInfo => {
        if (userInfo === undefined) {
          res.status(400)
          res.setHeader('Content-Type', 'text/plain')
          return res.send("Bad email or password")
        }
        bcrypt.compare(req.body.password, userInfo.hash, (err, response) => {
          if (response) {
            delete userInfo.hash;
            var token = jwt.sign(userInfo, process.env.JWT_KEY);
            res.cookie('token', token, {
              httpOnly: true
            });
            return res.send(userInfo)
          }
          res.status(400)
          res.setHeader('Content-Type', 'text/plain')
          res.send('Bad email or password')
        })
      })

})

router.delete('/token', (req, res, next) => {
  res.cookie('token', '')
  res.send(true)
})

module.exports = router;
