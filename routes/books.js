'use strict';

const express = require('express');
const knex = require('../knex');
const parser = require('body-parser');
const humps = require('humps');



// eslint-disable-next-line new-cap
const router = express.Router();

// YOUR CODE HERE

// router.use(parser.text());

router.get('/books',(req,res,next)=>{
  knex('books')
    .select('id','genre','title','author','description','cover_url as coverUrl','created_at as createdAt','updated_at as updatedAt').orderBy('title')
    .then((result)=>{
    res.send(result);
  })
})

router.get('/books/:id',(req,res,next)=>{
  knex('books')
    .select('id','genre','title','author','description','cover_url as coverUrl','created_at as createdAt','updated_at as updatedAt').first()
    .then((result)=>{
    res.send(result);
  })
})

router.post('/books',(req,res,next)=>{
  knex('books')
    .returning('*')
    .insert(humps.decamelizeKeys(req.body))
    .then(result=>{
      res.send(humps.camelizeKeys(result[0]))
    })
})

router.patch('/books/:id',(req,res,next)=>{
  req.body['id']=req.params.id
  knex('books')
    .where('id','=',req.params.id)
    .update(req.body)
    res.send(req.body)
})

router.delete('/books/:id',(req,res,next)=>{
  knex('books')
    .returning('*')
    .where('id','=',req.params.id)
    .del()
    .then(result=>{
      // console.log(result);
      delete result[0].id
      delete result[0].created_at
      delete result[0].updated_at
      // result = humps.camelize(result[0])
      res.send(humps.camelizeKeys(result[0]))
    })
})

module.exports = router;
