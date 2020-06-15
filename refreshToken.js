'use strict';

const manageToken = require('./src/manageToken');

module.exports.lambdaHandler = (event, context, callback) => {
  const bucket = process.env.BUCKET;
  const tokenFile = process.env.TOKENFILE;

  manageToken.refresh(bucket, tokenFile).then(result => {
    const response = {
      statusCode: 200,
      body: 'Token successfully refreshed'
    };

    callback(null, response);
  });

};