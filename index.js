import dotenv from 'dotenv'
dotenv.config()

import express from 'express';
import mongoose from 'mongoose';
import indexRouter from './app.router.js'
import cookieParser from "cookie-parser";
import errorMiddleware from './middleware/error.js';
import morgan from 'morgan';



// Handling Uncaught Execption
process.on('uncaughtException',(err)=>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Uncaught Execption`);
    process.exit(1);
})

const app = express();
const port = process.env.PORT;
const dbURL =process.env.DB_URL;
mongoose.connect(dbURL); 

const db = mongoose.connection;
db.on("error", console.log.bind("connection error:"));
db.once("open", ()=> {
    console.log("Database connected successfully!")
});

app.use(morgan('dev'))
app.use(express.json());
app.use( express.urlencoded( { extended: true } ) );
app.use(cookieParser());

app.use('/api/v1',indexRouter)
app.get("/", (req, res) => {
  res.send("Welcome To Homepage!");
} );

// Middleware for errors
app.use(errorMiddleware)

const server = app.listen(port, (req, res)=> {
    console.log(`Server Is Running On Port ${port}`)
} )

// Unhandled Promise Rejections
process.on('unhandledRejection',(err)=>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Unhandled Promise Rejection`);

    server.close(()=>{
        process.exit(1);
    })
})