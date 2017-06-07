'use strict';

const express = require('express');
const knex = require('../knex');
const humps = require('humps');
const bcrypt = require('bcrypt')
function hash(plaintext) {
  return bcrypt.hashSync(plaintext,8)
}



// eslint-disable-next-line new-cap
const router = express.Router();

// YOUR CODE HERE

router.post('/users',(req,res,next)=>{
  // console.log(req.body);
  req.body.hashed_password = hash(req.body.password)
  delete req.body.password
  knex('users')
    .returning('*')
    .insert(humps.decamelizeKeys(req.body))
    .then(result=>{
      delete result[0].hashed_password
      res.send(humps.camelizeKeys(result[0]))
    })
})

module.exports = router;
