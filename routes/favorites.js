'use strict';

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();
const bcrypt = require('bcrypt');
const cookieparser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const knex = require('../knex');
const humps = require('humps');
// YOUR CODE HERE

// router.use((req,res,next)=>{
//   if(req.cookies.token){
//     let token = req.cookies.token
//     jwt.verify(token,'secret',(err,decode)=>{
//       if(err){
//         res.clearCookie('token');
//         return next(err)
//       }
//       req.user = decode
//       console.log(req.user);
//       // next()
//     })
//     // next()
//   }
//   next()
// })

router.get('/favorites',(req,res,next)=>{
  // console.log(req.user);
  // if(!req.user){
  //   return res.sendStatus(401)
  // }
  var token = req.cookies.token
  if(!token){
    return res.sendStatus(401)
  }
  jwt.verify(token, 'secret', (err, decoded) => {
    if (err) {
      return res.send(false)
    }
    knex
      .select('favorites.id','genre','title','books.created_at as createdAt','user_id as userId','author','book_id as bookId','cover_url as coverUrl','description','books.updated_at as updatedAt')
      .table('favorites')
      .join('books','favorites.book_id','books.id')
      .then(result=>{
        res.send(humps.camelizeKeys(result))
      })
  });
})

router.get('/favorites/check',(req,res,next)=>{
  var token = req.cookies.token
  if(!token){
    return res.sendStatus(401)
  }
  jwt.verify(token, 'secret', (err, decoded) => {
    if (err) {
      return res.send(false)
    }
    knex
      .select('favorites.id','genre','title','books.created_at as createdAt','user_id as userId','author','book_id as bookId','cover_url as coverUrl','description','books.updated_at as updatedAt')
      .table('favorites')
      .join('books','favorites.book_id','books.id')
      .where('book_id',req.query.bookId)
      .then(result=>{
        if (result[0]===undefined){
          return res.send(false)
        }
        res.send(true)
      })
  });
})

router.post('/favorites',(req,res,next)=>{
  var token = req.cookies.token
  if(!token){
    return res.sendStatus(401)
  }
  jwt.verify(token, 'secret', (err, decoded) => {
    if (err) {
      return res.send(false)
    }
    req.body.book_id = req.body.bookId;
    req.body.user_id = decoded.id
    delete req.body.bookId
    knex('favorites')
      .returning('*')
      .insert(req.body)
      .then(result=>{
        if (result[0]===undefined){
          return res.send(false)
        }
        delete result[0].created_at;
        delete result[0].updated_at;
        res.send(humps.camelizeKeys(result[0]))
      })
  });
})

router.delete('/favorites',(req,res,next)=>{
  var token = req.cookies.token
  if(!token){
    return res.sendStatus(401)
  }
  jwt.verify(token, 'secret', (err, decoded) => {
    if (err) {
      return res.send(false)
    }
    knex('favorites')
      .where('user_id',decoded.id)
      .returning('*')
      .del()
      .then(result=>{
        delete result[0].id
        res.send(humps.camelizeKeys(result[0]))
      })
  });
})

module.exports = router;
