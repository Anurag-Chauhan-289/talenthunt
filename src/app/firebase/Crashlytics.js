// import crashlytics from '@react-native-firebase/crashlytics';

export const catchError = (error, errorId) => {
    let errMsg = error.hasOwnProperty('message') ? error.message : error;

    if (errorId) {
        console.log(errorId, " ==> ", errMsg);
        // crashlytics().log(errorId);
        // crashlytics().log(errMsg);
    } else {
        console.log("Error ==> ", errMsg);
        // crashlytics().log(errMsg);
    }
    // crashlytics().recordError(errMsg);
}