// var constants = require('./modelConstants');
// var mongoose = require('mongoose');
// var Schema = mongoose.Schema;
// var aboutSchema = new Schema(
//     {
//         description: {
//             type: String,
//             require: true
//         },
//         activeStatus: {
//             type: String,
//             enum: ['0', '1', '2'],
//             default: '0'
//         }
//     },
//     {
//         collection: constants.AboutModel,
//         versionKey: false,
//         autoIndex: false,
//         timestamps: true
//     }
// );
// let about_cms = mongoose.model(constants.AboutModel, aboutSchema);
// module.exports = about_cms;