'use strict';

const manageToken = require('./manageToken');

module.exports.lambdaHandler = (event, context, callback) => {
    const bucket = process.env.BUCKET;
    const tokenFile = process.env.TOKENFILE;
    const app_id = process.env.APP_ID;
    const app_secret = process.env.APP_SECRET;
    const redirect_uri = process.env.REDIRECT_URI;
    const accessCode = event.queryStringParameters.code;

    manageToken.init(bucket, tokenFile, app_id, app_secret, redirect_uri, accessCode)
        .then(result => {
            const response = {
                statusCode: 200,
                body: JSON.stringify('Token successfully set')
            };
        
            callback(null, response);
        });

};