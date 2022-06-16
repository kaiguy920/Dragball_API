// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for examples
const Team = require('../models/team')
const Queen = require('../models/queen')

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
// GET /myfaves/<user_id>
router.get('/dragball/myfaves/:userId', (req, res, next) => {
    const userId = req.params.userId
    Queen.find({ owner: userId })
        .populate('owner')
        .then((queens) => {
            return queens.map((queens) => queens.toObject())
        })
        // respond with status 200 and JSON of the outfits
        .then((queens) => res.status(200).json({ queens: queens }))
        // if an error occurs, pass it to the handler
        .catch(next)

})

// ADD to team
// POST /dragball/myteam/89
// router.post('/dragball/addteam/:id', requireToken, async (req, res, next) => {
//     const userId = req.user.id
//     const queenId = req.params.id
//     req.body.owner = userId
//     req.body.teamMembers = queenId
//     console.log('req.user.id', req.user.id);
//     console.log("queenId in api add to team", queenId);

//     Queen.findById(queenId)
//         .then(queen => {
//             console.log('this is queen', queen)

//             Team.updateOne({ owner: userId }, { $push: { teamMembers: queenId } })

//                 .then(() => res.sendStatus(204))
//                 .catch(next)
//         })
// })

router.post('/dragball/addteam/:id', requireToken, async (req, res, next) => {
    const userId = req.user.id
    const queenId = req.params.id
    req.body.owner = userId
    req.body.teamMembers = queenId
    console.log('req.user.id', req.user.id);
    console.log("queenId in api add to team", queenId);

    await Team.find({ owner: userId })
    if (!Team.owner) {
        Team.create(req.body)
            .then((team) => {
                res.status(201).json({ team: team.toObject() })
            })
    } else if (Team.owner === userId) {
        console.log("this is team", Team);
        Queen.findById(queenId)
            .then(queen => {
                console.log('this is queen', queen)

                Team.updateOne({ owner: userId }, { $push: { teamMembers: queenId } })

                    .then(() => res.sendStatus(204))
                    .catch(next)

            })
    }
})
// DELETE route
router.delete('/dragball/myfaves/:id', requireToken, (req, res, next) => {
    // get the queen id
    const queenId = req.params.id
    // delete the queen
    Queen.findById(queenId)

        .then(handle404)
        .then((queen) => {
            requireOwnership(req, queen)
            queen.remove()
        })
        // send 204 no content
        .then(() => res.sendStatus(204))
        .catch(next)
})

module.exports = router