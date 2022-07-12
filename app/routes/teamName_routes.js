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
router.post('/dragball/teamname/:userId', requireToken, async (req, res, next) => {
    const userId = req.params.userId
    const { teamName } = req.body
    console.log('use and abuse', req.body)
    teamName.owner = userId

    const newTeamName = await TeamName.create(teamName);

    await Team.updateOne({ owner: userId }, { $push: { name: newTeamName._id } })
    return res.send(newTeamName)
})


// UPDATE
// PATCH /dragball/teamname/edit
router.patch('/dragball/teamname/:id', requireToken, (req, res, next) => {
    console.log("update req.body", req.body);
    const teamNameId = req.params.id
    console.log("team name id", teamNameId);
    const { name } = req.body.name
    TeamName.findByIdAndUpdate(teamNameId, { name }, { new: true })
        .then(() => res.sendStatus(204))
        .catch(next)
})

module.exports = router