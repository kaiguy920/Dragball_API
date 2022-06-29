// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

const Team = require('../models/team')
const Queen = require('../models/queen')
const TeamName = require('../models/teamName')

const customErrors = require('../../lib/custom_errors')

const handle404 = customErrors.handle404

const requireOwnership = customErrors.requireOwnership

const removeBlanks = require('../../lib/remove_blank_fields')

const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()


// CREATE
// POST /dragball/teamname
router.post('/dragball/teamname', requireToken, (req, res, next) => {
    console.log('req.body.teamName', req.body.teamName)
    TeamName.create(req.body.teamName)
        .then((teamName) => {
            console.log('this was returned from create', teamName)
            res.status(201).json({ teamName: teamName.toObject() })
        })
        .catch(next)
})


// UPDATE
// PATCH /dragball/teamname/624470c12ed7079ead53d4df
router.patch('/dragball/teamname/:id', (req, res, next) => {
    console.log("update req.body", req.body);
    const teamNameId = req.body.teamName._id
    console.log("team name id", teamNameId);
    const { type, roomLocation, material, accomodates } = req.body.furniture
    Furniture.findByIdAndUpdate(furnitureId, { type, roomLocation, material, accomodates }, { new: true })
        .then(() => res.sendStatus(204))
        .catch((error) => res.json(error))
})

module.exports = router