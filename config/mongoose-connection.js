const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_DB_URI).then(function(){
    console.log("connected to mongodb");
}).catch(err=>{
    console.error(`Initial connection error: ${err}`);

})

mongoose.connection.on('error', err => {
    console.error(`MongoDB error: ${err}`);
  });
  
  mongoose.connection.on('disconnected', () => {
    console.error('MongoDB disconnected. Attempting to reconnect...');
    mongoose.connect(process.env.MONGO_DB_URI);
  });
  
  mongoose.connection.on('connected', () => {
    console.log('MongoDB reconnected');
  });

let db = mongoose.connection;
module.exports=db;