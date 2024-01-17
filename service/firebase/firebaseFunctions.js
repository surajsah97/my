const admin = require('firebase-admin');
const serviceAccount = require('./dhuduUser.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // databaseURL: 'https://your-project-id.firebaseio.com',
});
module.exports = {
    firebasesms :async (req, res) => {
        const phoneNumber = '+916396553061'; 

        admin
            .auth()
            .getUserByPhoneNumber(phoneNumber)
            .then((userRecord) => {
                const uid = userRecord.uid;
                console.log(`User already exists with UID: ${uid}`);

                // Send SMS verification
                return admin.auth().generatePhoneVerificationCode(phoneNumber)
                    .then((verificationCode) => {
                        console.log(`Verification code sent to ${phoneNumber}: ${verificationCode}`);
                    });
            })
            .catch((error) => {
                // If the user doesn't exist, create a new user
                if (error.code === 'auth/user-not-found') {
                    return admin.auth().createUser({
                        phoneNumber: phoneNumber,
                    })
                        .then((userRecord) => {
                            const uid = userRecord.uid;
                            console.log(`New user created with UID: ${uid}`);

                            // Send SMS verification
                            return admin.auth().generatePhoneVerificationCode(phoneNumber)
                                .then((verificationCode) => {
                                    console.log(`Verification code sent to ${phoneNumber}: ${verificationCode}`);
                                });
                        })
                        .catch((error) => {
                            console.error('Error creating new user:', error);
                        });
                } else {
                    console.error('Error getting user record:', error);
                }
            });
    },

    
}


// firebasesms();

