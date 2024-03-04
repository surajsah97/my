const express = require("express");
const router = express.Router();

const productOrder = require("../../controller/productOrder_C");
const Auth = require("../../middleware/auth");
const errorfun = require("../../middleware/catchAsyncErrors");

router
  .route("/")
  .post( errorfun(productOrder.orderListByAdmin));
//   .post(Auth.adminValidateToken, errorfun(productOrder.orderListByAdmin));

module.exports = router;




// {
//     "success": true,
//     "message": "get AllCartList by Admin Succesfully",
//     "rangers": "Showing 1 – 2 of 2 totalData",
//     "totalData": 2,
//     "totalPage": 1,
//     "totalLeftdata": 0,
//     "dataPerPage": 2,
//     "data": [
//         {
//             "_id": "65e167c914a9006f29152e3d",
//             "userId": "65dddfc76b9372995c94d73a",
//             "product": [
//                 {
//                     "productId": "65d720a5405b87fd6e0a7b7e",
//                     "qty": 3,
//                     "_id": "65e167c914a9006f29152e3e"
//                 }
//             ],
//             "activeStatus": "Active",
//             "price": 135,
//             "createdAt": "2024-03-01T05:29:45.853Z",
//             "updatedAt": "2024-03-01T05:29:45.853Z"
//         },
//         {
//             "_id": "65e1a3e728962a4adba697e2",
//             "userId": "65e0682d8c94f7f2330c397c",
//             "product": [
//                 {
//                     "productId": "65d720a5405b87fd6e0a7b7e",
//                     "qty": 2,
//                     "_id": "65e1a3e728962a4adba697e3"
//                 },
//                 {
//                     "productId": "65d7285ecf03ebe77eebfdd9",
//                     "qty": 8,
//                     "_id": "65e1a40528962a4adba697ea"
//                 }
//             ],
//             "activeStatus": "Active",
//             "price": 450,
//             "createdAt": "2024-03-01T09:46:15.502Z",
//             "updatedAt": "2024-03-01T12:19:45.722Z"
//         }
//     ]
// }