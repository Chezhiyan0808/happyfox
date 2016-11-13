/**
 * Created by zoram on 12/11/16.
 */


var errors = {};
var success = {};
errors.INVALID_SIGNIN = {"message": "Invalid credentials", "statusCode": 450};
errors.ALREADY_USER = {"message": "Email Already registered", "statusCode": 451};
errors.USER_ALLOCATION_FAILED = {"message": "User Creation Failed", "statusCode": 452};
errors.ADDING_GENRE_FAILED = {"message": "Adding Favourite Genres Failed", "statusCode": 453};
errors.ADDING_MOVIE_FAILED = {"message": "Adding Movie Failed", "statusCode": 454};
errors.RATING_FAILED = {"message": "Rating Movie Failed", "statusCode": 455};
errors.GET_RECOM_FAILED = {"message": "Fetching Movie Recommendations Failed", "statusCode": 456};
errors.ADDING_REVIEW_FAILED = {"message": "Adding Movie Review Failed", "statusCode": 457};
errors.MOVIE_DET_FAILED = {"message": "Cannot Fetch Movie Details", "statusCode": 458};

success.SUCCESS = {"message": "success", "statusCode": 200};

module.exports = {
    ERRORS: errors,
    SUCCESS: success
};