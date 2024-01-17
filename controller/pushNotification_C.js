// var FCM = require('fcm-node');
// var serverKey = process.env.PUSH_API_SERVER_KEY
// var fcm = new FCM(serverKey);
// var apn = require('apn');
var fs = require('fs')
// var logger = require('../configs/logger');
// var newfun = require('')

var { userAppMessaging, driverAppMessaging } = require('../service/firebase/notification');




module.exports = {
    testnotification : async (req, res, next) => {
        // var driverdetails = await UserModel.findOne({ _id: driverId });
        // console.log("driverdetails", driverdetails, driverId);
        var tokenArray = ["eFLegB0rQk6QZyjxavntYm:APA91bGaITiAwCeKwov5MRxMwVygXZDDuPl2P0iuEepJHe7Wb4T6e46gbw-7FgaTfXzOnkm51oWNmkMjkWFQiknAEknfj6FjCN3dBi4TG-2Fz--wIKFygZw4fkDvBgHy5VYzOa9e4i2J"];
        // if (driverdetails.userToken) {
        //     tokenArray.push(driverdetails.userToken);
        // }
        if (tokenArray.length > 0) {
            var data = {
                key: tokenArray[0],
                notificationTitle:
                    "test",
                notificationBody:
                    "test",
                click_action:
                    "OPEN_HOME",
                notificationData: JSON.stringify({ status: 1, name: "test" }),
            };
            console.log("data", data);
            sendPush(data);
            // sendDriverPushNotification(data);
        } else {
            console.log("error in send push", error);
        }

    }
}
async function sendPush(data) {
        message = {
            //this may vary according to the message type (single recipient, multicast, topic, et cetera)
            data: {  //you can send only notification or only data(or include both)
                value: data.notificationData,
            },
            token: data.key,
            notification: {
                title: data.notificationTitle,
                body: data.notificationBody,
                // click_action: data.click_action,
                // priority: "high",
                // sound: "src/res/raw/clearly.mp3",
                // android_channel_id: "com.dhudhu"
            },
            android: {
                notification: {
                    click_action: data.click_action, // Replace with the action to be performed when the notification is clicked
                    channel_id: "com.dhudhu"// Replace with the Android channel ID
                },
                
            },
            apns: {
                payload: {
                    aps: {
                        sound: 'default',
                        badge: 1
                    }
                }
            },
            // priority: 'high' // Set the priority to 'high' or 'normal'

            
        };
        userAppMessaging( message);
};
async function sendDriverPushNotification (data) {
        message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
            notification: {
                title: data.notificationTitle,
                body: data.notificationBody,
                click_action: data.click_action,
                // click_action: "OPEN_HOME", click_action
                // silent:false,
                priority: "high",
                // sound: "src/res/raw/clearly.mp3",
                android_channel_id: "com.aks.ugnaDriver"
            },

            data: {  //you can send only notification or only data(or include both)
                value: data.notificationData,

            }
        };
        logger.info("Push notification message" + JSON.stringify(message));
        driverAppMessaging(data.key, message);
};

    // sendPushIos: function (data) {


    //     try{

    //     var note = new apn.Notification();

    //    // note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
    //    // note.badge = 3;
    //    // note.sound = "ping.aiff";
    //     note.alert = data.notificationBody;
    //     note.payload = { 'messageFrom':data.notificationTitle };
    //     note.mutableContent = 1;
    //     note.aps['content-available'] = 1;
    //     note.topic = "com.aks.ugnaUser";

    //     apnProvider.send(note, data.key).then((result) => {
    //         console.log("iosResult", result);

    //         // see documentation for an explanation of result
    //     });
    // }catch(err){
    //     console.log("err",err);
    // }
    // }

    // sendPushIos: function (data) {


    //     try{

    //     var note = new apn.Notification();

    //    // note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
    //    // note.badge = 3;
    //    // note.sound = "ping.aiff";
    //     note.alert = "Hello You have a new message";
    //     note.payload = { 'messageFrom': 'John Appleseed' };
    //     note.mutableContent = 1;
    //     note.aps['content-available'] = 1;
    //     note.topic = "com.aks.ugnaDriver";

    //     apnProvider.send(note, '004a4b69c166b75b87028daf4a7e9eb9760fa8be2edf3298d974b2ef3019326f').then((result) => {
    //         console.log("iosResult", result);

    //         // see documentation for an explanation of result
    //     });
    // }catch(err){
    //     console.log("err",err);
    // }
    // }






