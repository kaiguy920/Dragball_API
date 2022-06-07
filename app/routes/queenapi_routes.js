

// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

const Team = require('../models/team')
const Queen = require('../models/queen')
// pull in Mongoose model for examples
const mongoose = require('mongoose')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

const axios = require('axios')


const router = express.Router()

// INDEX
// GET /dragball
router.get('/dragball', async (req, res, next) => {
    await axios
        .get(`http://www.nokeynoshade.party/api/queens/all`)
        .then(response => {
            res.status(201).json(response.data)
        })
        .catch(next)
})

// SHOW 
// GET /dragball/89
router.get('/dragball/:id', async (req, res, next) => {
    const id = req.params.id
    await axios
        .get(`http://www.nokeynoshade.party/api/queens/${id}`)
        .then(response => {
            res.status(201).json(response.data)
        })
        .catch(next)
})

// ADD TO FAVE
// CREATE --> for favorites list route that actually calls the db and makes a new document
// POST /dragball/addfaves
router.post('/dragball/addfave', requireToken, (req, res, next) => {
    req.body.queen.owner = req.user.id

    Queen.create(req.body.queen)
        .then((queen) => {
            requireOwnership(req, queen)
            res.status(201).json({ queen: queen.toObject() })
        })
        .catch(next)
})

module.exports = router