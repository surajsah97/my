const moment= require("moment")

const randomNumber = () => {
    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    return randomNumber;
}

const datediff = (date) => {
    var oldDate = moment(date);
    console.log(oldDate)
    var newDate = moment(new Date());
    console.log(newDate)
    var minutes = parseInt(moment.duration(newDate.diff(oldDate)).asMinutes()+1);
    return minutes;
}

module.exports = {
    randomNumber,
    datediff
}