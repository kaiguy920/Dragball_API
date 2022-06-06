const mongoose = require('mongoose')
const User = require('./user')

const queenSchema = new mongoose.Schema(
    {
        queenId: {
            type: String, required: true
        },
        name: {
            type: String, required: true,
            unique: true
        },
        image: { type: String, required: true },
        owner: {
            type: mongoose.Schema.Types.ObjectID,
            ref: 'User',
        }
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('Queen', queenSchema)