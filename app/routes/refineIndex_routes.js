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
// require axios for api calls
const axios = require('axios')

const requireOwnership = customErrors.requireOwnership
const requireToken = passport.authenticate('bearer', { session: false })

const router = express.Router()

// INDEX by season
// GET /dragball/season/1
router.get('/dragball/season/:season', async (req, res, next) => {
    const season = req.params.season
    await axios
        .get(`http://www.nokeynoshade.party/api/seasons/${season}/queens`)
        .then(response => {
            res.status(201).json(response.data)
        })
        .catch(next)
})

// INDEX by winners
// GET /dragball/winners
router.get('/dragball/winners', async (req, res, next) => {
    await axios
        .get(`http://www.nokeynoshade.party/api/queens/winner`)
        .then(response => {
            res.status(201).json(response.data)
        })
        .catch(next)
})

// INDEX by miss congenialities
// GET /dragball/congeniality
router.get('/dragball/congeniality', async (req, res, next) => {
    await axios
        .get(`http://www.nokeynoshade.party/api/queens/congeniality`)
        .then(response => {
            res.status(201).json(response.data)
        })
        .catch(next)
})


module.exports = router