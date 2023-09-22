import { RequestHandler } from '../../helpers/requestHandler.helper.js';
import constant from '../../utils/constant.js';
import sendToken from '../../utils/jwtToken.js';
import User from './user.model.js'
import sendEmail from '../../utils/sendEmail.js'
import crypto from 'crypto'


export default {
    
    // Register a user

    registerUser: async ( req, res ) => {
        const { username, email, password } = req.body;
        const user = await User.create( {
            username,
            email,
            password,
            
        } );
        sendToken( user, 201, res );
    },

    // User Login

    loginUser: async ( req, res ) => {
      const { username, password } = req.body;

      const user = await User.findOne({ username }).select("+password");
      // checking that user has given the credentials or not
      if (!username || !password) {
        return RequestHandler.Error({
          res,
          statusCode: 400,
          error: constant.CREDENTIAL_MISSING,
        });
      }
      if (!user) {
        return RequestHandler.Unauthorized({
          res,
          statusCode: 401,
          error: constant.NO_USER_AVAILABLE_WITH_THIS_ID,
        });
      }
      const isPasswordMatched = await user.comparePassword(password);
      if(!isPasswordMatched){
          return RequestHandler.Unauthorized({
              res,
              statusCode:401,
              error: constant.CREDENTIAL_MISMATCH
          });
      } 

    //   if (!(await bcrypt.compareSync(password, user.password))) {
    //     return RequestHandler.Error({
    //       res,
    //       statusCode: 400,
    //       error: constant.CREDENTIAL_MISMATCH,
    //     });
    //   }

      sendToken(user, 200, res);
    },

    


    // User logout
    logoutUser: async ( req, res ) => {
        res.cookie( 'token', null, {
            expires: new Date( Date.now() ),
            httpOnly: true
        } )

        res.send( { statusCode: 200, message: 'Logged out' } )
    },

    // Forgot Password
    forgotPassword: async ( req, res ) => {
        const { email } = req.body
        const user = await User.findOne( { email } );

        if ( !user ) {
            return RequestHandler.Error( { res, statusCode: 404, message: constant.NO_USER_AVAILABLE } );
        }
        const resetToken = user.getResetPasswordToken();
        await user.save( { validateBeforeSave: false } );

        const resetPasswordUrl = `${ req.protocol }://${ req.get( 'host' ) }/api/v1/user/password/reset/${ resetToken }`;
        const message = `Your password reset URL is:- \n\n${ resetPasswordUrl }\n\nIf you have not requested this email then, please ignore it. `;

        try {
            await sendEmail( {
                email: user.email,
                subject: `Password Recovery`,
                message
            } );

            res.send( { success: true, statusCode: 200, message: `Reset password link sent to ${ user.email } successfully ` } )
        } catch ( error ) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save( { validateBeforeSave: false } );
            return RequestHandler.Error( { res, statusCode: 500, error: error.message } )
        }
    },

    // Reset Password
    resetPassword: async ( req, res ) => {

        // creating hash token
        const resetPasswordToken = crypto.createHash( 'sha256' ).update( req.params.token ).digest( 'hex' );

        const user = await User.findOne( {
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        } );
        console.log(user)
        if ( !user ) {
            return RequestHandler.Error( { res, statusCode: 400, message: constant.INVALID_RESET_TOKEN } );
        }

        if ( req.body.password !== req.body.confirmPassword ) {
            return RequestHandler.Error( { res, statusCode: 400, message: constant.PASSWORD_NOT_MATCHED } );
        }
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        sendToken( user, 200, res );
    },


   

}