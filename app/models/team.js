const mongoose = require('mongoose')
const User = require('./user')

const teamSchema = new mongoose.Schema(
    {
        teamMembers:
            [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Queen'
                }
            ],

        owner: {
            type: mongoose.Schema.Types.ObjectID,
            ref: 'User',
        }
    },
    { timestamps: true }
)



module.exports = mongoose.model('Team', teamSchema)