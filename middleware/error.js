import ErrorHandler from "../utils/errorHandler.js";

const errorMiddleware = (err, req, res, next)=> {
        err.statusCode = err.statusCode;
        err.message = err.message || "Internal Server Error";

        // mongodb Cast Error handling
        if(err.name === "CastError"){
            const message = `Resource Not Found. Invalid: ${err.path}`;
            err = new ErrorHandler(message, 400);
        }

         // Mongoose duplicate key error
      if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        err = new ErrorHandler(message, 400);
    }

        // Wrong JWT error
        if(err.name === 'JsonWebTokenError'){
            const message = `Json Web Token is invalid, Please try again !`;
            err = new ErrorHandler(message, 400);
        }

        // Wrong JWT error
        if(err.name === 'TokenExpiredError'){
            const message = `Json Web Token is expired, Please try again !`;
            err = new ErrorHandler(message, 400);
        }
        res.send({
            statusCode: err.statusCode,
            success: false,
            message: err.message
        })
}

export default errorMiddleware;