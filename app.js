const express = require("express")
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash')
const app = express();
const path = require('path');
const cookieParser = require("cookie-parser")


require('dotenv').config();

const indexRouter = require('./routes/index-router')
const hisaabRouter = require('./routes/hisaab-router')
const db = require('./config/mongoose-connection')

const store = new MongoDBStore({
  uri: process.env.MONGO_DB_URI,
  collection: 'sessions'
});

app.use(session({
    secret: process.env.JWT_KEY, // replace with a secure secret key
    resave: false,
    saveUninitialized: true,
    store:store
  }));
  app.use(flash());
  
  app.use((req, res, next) => {
    res.locals.error = req.flash('error');
    next();
  });

app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));
app.use(cookieParser());



app.use('/',indexRouter);
app.use('/hisaab',hisaabRouter);


app.listen(3000,()=>{
    console.log('server started');
});