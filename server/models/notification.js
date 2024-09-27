const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    message: {
        type: Schema.Types.ObjectId,
        ref: 'Message',
    },
    discussion: {
        type: Schema.Types.ObjectId,
        ref: 'Discussion',
    },
    status: {   //Status if the notifcation has been read. 
        type: Boolean,
        default: true
    }
}, {
    timestamps: true // Automatically creates timestamps. 
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;