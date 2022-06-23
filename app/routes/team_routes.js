// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for examples
const Team = require('../models/team')
const Queen = require('../models/queen')
const TeamName = require('../models/teamName')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { example: { title: '', text: 'foo' } } -> { example: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()


// INDEX
// GET /myteam/<user_id>
router.get('/dragball/myteam/:userId', (req, res, next) => {
    const userId = req.params.userId
    Team.find({ owner: userId })
        .populate('teamMembers')
        .then((team) => {
            return team.map((team) => team.toObject())
        })
        .then((team) => res.status(200).json({ team: team }))
        .catch(next)

})

// PUT route to add teamName to Team object
router.put('/dragball/teamname', requireToken, (req, res, next) => {
    Team.updateOne({ owner: userId }, { $push: { teamName: req.body.name } })
        .then((team) => res.status(200).json({ team: team }))
        .catch(next)

})

// DELETE route
// delete queen from teamMembers
router.delete('/dragball/myteam/:queenId', requireToken, (req, res, next) => {

    const queenId = req.params.queenId
    const userId = req.user.id
    // delete the queen
    Team.updateOne({ owner: userId }, { $pull: { teamMembers: queenId } })
        .then(() => res.sendStatus(204))
        .catch(next)
})

module.exports = router