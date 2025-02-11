var mongoose = require("mongoose");
mongoose.Promise = global.Promise;

var connectMongoose = function () {
  // mongoose.set('useNewUrlParser', true);
  // mongoose.set('useUnifiedTopology', true);
  mongoose
    .connect(process.env.DBURI, { maxPoolSize: 10 })
    .then((connection) => {
      console.log("Connected to MongoDB");
    })
    .catch((error) => {
      console.log(error.message);
    });
};

connectMongoose();

// Error handler
mongoose.connection.on("error", function (err) {
  console.log("MongoDB connection error :", err);
});

// Reconnect when closed
mongoose.connection.on("disconnected", function () {
  setTimeout(function () {
    connectMongoose();
  }, 1000);
});

var helper = {
  importAllModels: function () {
    require("./modelBootstrap.js");
  },
};

helper.importAllModels();
// DBURI="mongodb://devuser:Ugnacab%40123@3.234.230.128:27017/UgnaCab"
