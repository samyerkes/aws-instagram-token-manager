'use strict';

const AWS = require('aws-sdk');
const S3 = new AWS.S3;
const axios = require('axios');
const qs = require('querystring');

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.baseURL = 'https://api.instagram.com';

module.exports.init = (bucket, tokenFile, app_id, app_secret, redirect_uri, accessCode) => {
    console.log(accessCode);
    return exchangeCodeForToken(app_id, app_secret, redirect_uri, accessCode)
        .then(token => storeToken(bucket, tokenFile, token));
}

module.exports.refresh = (bucket, tokenFile) => {
    return getCurrentToken(bucket, tokenFile)
        .then(token => refreshToken(token))
        .then(token => storeToken(bucket, tokenFile, token));
}

/**
 * 
 * s3 interactions
 * 
 */

function getCurrentToken(bucket, key) {
    return S3.getObject({
        Bucket: bucket,
        Key: key
    }).promise();
}

function storeToken(bucket, key, body) {
    let token = `const InstagramToken = '${ body.data.access_token }';`;
    return S3.putObject({
        Body: token,
        Bucket: bucket,
        ContentType: 'application/javascript',
        Key: key
    }).promise();
}

/**
 * 
 * Instagram interactions
 * 
*/
function exchangeCodeForToken(app_id, app_secret, redirect_uri, accessCode) {
    
    let params = qs.stringify({
        'client_id': app_id,
        'client_secret': app_secret,
        'grant_type': 'authorization_code',
        'redirect_uri': redirect_uri,
        'code': accessCode
    });

    return axios.post('/oauth/access_token', params)
        .catch(function (error) {
            console.log(error);
        });
}

function refreshToken(oldToken) {
    let token = oldToken.Body.toString().match(/\'([\w]+)\'/).pop();
    let params = {
        "grant_type": "ig_refresh_token",
        "access_token": token
    };
    return axios.get('https://graph.instagram.com/refresh_access_token', { params });
}