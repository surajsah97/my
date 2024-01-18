var admin = require("firebase-admin");
var userAppServiceAccount = require("./dhuduUser.json");

const userAppAdmin = admin.initializeApp({
    credential: admin.credential.cert(userAppServiceAccount),
}, 'DhuduUser');

const notification_options = {
    priority: "high",
    timeToLive: 60 * 60 * 24,
};

let userAppMessaging = ( message) => {
    console.log("----------------message ", message);
    userAppAdmin
        .messaging()
        .send(message)
        .then((response) => {
            console.log("Custonmer Notification sent successfully", (response));
        })
        .catch((error) => {
            console.log(error);
        });
};

module.exports = { userAppMessaging };

