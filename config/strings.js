/**
 * Created by zoram on 12/11/16.
 */


var errors = {};
var success = {};
errors.INVALID_SIGNIN = {"message": "Invalid credentials", "statusCode": 450};
errors.ALREADY_USER = {"message": "Email Already registered", "statusCode": 451};
errors.USER_ALLOCATION_FAILED = {"message": "User Creation Failed", "statusCode": 452};

success.SUCCESS = {"message": "success", "statusCode": 200};

module.exports = {
    ERRORS: errors,
    SUCCESS: success
};