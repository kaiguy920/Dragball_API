const mongoose = require('mongoose')
const User = require('./user')

const teamSchema = new mongoose.Schema(
    {
        teamName: { type: String },
        teamMembers:
            [
                {
                    type: Schema.Types.ObjectId,
                    ref: 'Queen'
                }
            ],

        owner: {
            type: Schema.Types.ObjectID,
            ref: 'User',
        }
    },
    { timestamps: true }
)



module.exports = mongoose.model('Team', teamSchema)