const mongoose = require('mongoose')
const User = require('./user')

const teamNameSchema = new mongoose.Schema(
    {

        name: { type: String },

        owner: {
            type: Schema.Types.ObjectID,
            ref: 'User',
        }
    },
    { timestamps: true }
)


module.exports = mongoose.model('teamName', teamNameSchema)