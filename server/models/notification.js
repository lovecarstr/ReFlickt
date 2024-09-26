const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    message: {
        Type: String
    },
    Discussion: {
        type: Schema.Types.ObjectId,
        ref: "Discussion",
    },
}, {
    timestamps: true // Automatically creates timestamps. 
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Discussion;