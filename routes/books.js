'use strict';

const express = require('express');
const knex = require('../knex');
const parser = require('body-parser');
const humps = require('humps');



// eslint-disable-next-line new-cap
const router = express.Router();

// YOUR CODE HERE

router.get('/books', (req, res, next) => {
  knex('books')
    .select('id', 'genre', 'title', 'author', 'description', 'cover_url as coverUrl', 'created_at as createdAt', 'updated_at as updatedAt').orderBy('title')
    .then((result) => {
      res.send(result);
    })
})

router.get('/books/:id', (req, res, next) => {
  if (parseInt(req.params.id) * 0 !== 0) {
    return res.sendStatus(404)
  }
  knex('books')
    .select('id')
    .where('id', '=', req.params.id)
    .then(total => {
      if (total.length === 0) {
        return res.sendStatus(404)
      }
      knex('books')
        .select('id', 'genre', 'title', 'author', 'description', 'cover_url as coverUrl', 'created_at as createdAt', 'updated_at as updatedAt').where('id', '=', req.params.id)
        .then((result) => {
          res.send(result[0]);
        })
    })
})

router.post('/books', (req, res, next) => {
  if (req.body.title === undefined) {
    res.status(400);
    res.setHeader('content-type', 'text/plain');
    return res.send('Title must not be blank');
  } else if (req.body.author === undefined) {
    res.status(400);
    res.setHeader('content-type', 'text/plain');
    return res.send('Author must not be blank');
  } else if (req.body.genre === undefined) {
    res.status(400);
    res.setHeader('content-type', 'text/plain');
    return res.send('Genre must not be blank');
  } else if (req.body.description === undefined) {
    res.status(400);
    res.setHeader('content-type', 'text/plain');
    return res.send('Description must not be blank');
  } else if (req.body.coverUrl === undefined) {
    res.status(400);
    res.setHeader('content-type', 'text/plain');
    return res.send('Cover URL must not be blank');
  }
  knex('books')
    .returning('*')
    .insert(humps.decamelizeKeys(req.body))
    .then(result => {
      res.send(humps.camelizeKeys(result[0]))
    })
})

router.patch('/books/:id', (req, res, next) => {
  if (parseInt(req.params.id) * 0 !== 0) {
    return res.sendStatus(404)
  }
  knex('books')
    .select('id')
    .where('id', '=', req.params.id)
    .then(total => {
      if (total.length === 0) {
        return res.sendStatus(404)
      }
      req.body['id'] = req.params.id
      knex('books')
        .where('id', '=', req.params.id)
        .update(req.body)
      res.send(req.body)
    })
})

router.delete('/books/:id', (req, res, next) => {
  if (parseInt(req.params.id) * 0 !== 0) {
    return res.sendStatus(404)
  }
  knex('books')
    .select('id')
    .where('id', '=', req.params.id)
    .then(total => {
      if (total.length === 0) {
        return res.sendStatus(404)
      }
      knex('books')
        .returning('*')
        .where('id', '=', req.params.id)
        .del()
        .then(result => {
          delete result[0].id
          delete result[0].created_at
          delete result[0].updated_at
          res.send(humps.camelizeKeys(result[0]))
        })
    })
})

module.exports = router;
