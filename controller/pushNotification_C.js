var { userAppMessaging } = require('../service/firebase/notification');

module.exports = {
    testnotification : async (req, res, next) => {
        
        var tokenArray = ["dbPBdLwASM-8YP5R7WwB-J:APA91bFSIZN4Ji6PJtEQzxqWMK-HHOayWsPfsmTouSmT6WawUZgSflpZ86wm8ncgv2ehvlmSCjyCpxvtRRBn_rrF5cKtkpSEe8puiGTXGgVZ8q8Y0xW8psqXDqCLnwGZm8OEyCGXibp8"];
        
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
                    imageUrl: 'https://i.postimg.cc/BbK4N6QR/winter-hat-3662360.png',
                    click_action: data.click_action, // Replace with the action to be performed when the notification is clicked
                    channel_id: "com.dhudhu"// Replace with the Android channel ID
                },
                
            },
            apns: {
                payload: {
                    aps: {
                        sound: 'default',
                        badge: 1,
                        'mutable-content': 1
                    }
                },
                fcm_options: {
                    image: 'https://i.postimg.cc/BbK4N6QR/winter-hat-3662360.png'
                }
            },
            webpush: {
                headers: {
                    image: 'https://i.postimg.cc/BbK4N6QR/winter-hat-3662360.png'
                }
            },
            // priority: 'high' // Set the priority to 'high' or 'normal'

            
        };
        userAppMessaging( message);
};







