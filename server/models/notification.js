const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    message: {
        Type: String
    },
    Discussion: {
        type: Schema.Types.ObjectId,
        ref: 'Discussion',
    },
    Status: {   //Status if the notifcation has been read. 
        type: Boolean,
        default: True
    }
}, {
    timestamps: true // Automatically creates timestamps. 
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Discussion;