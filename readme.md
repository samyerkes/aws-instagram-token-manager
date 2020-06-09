# AWS Instagram Token Manager

The following deploys AWS Cloudformation resources to AWS to initiate and refresh Instagram's Access Tokens.

## Why is this needed?

Instagram requires an access token to display content from their platform on your site. This access token is only good for 60 days before it needs to be refreshed. 

This is helpful for sites that want to use [Instafeed.js](http://instafeedjs.com/) but do not have serverside capabilities.

## What is included
 
The following resources will be deployed to your AWS infrastructure as part of this CloudFormation template:

* ApiGateway (for initiate token)
* Events Rule (for scheduling the token refresh)
* IAM Role
* Lambda Function (instagram-token-manager-dev-initiate)
* Lambda Function (instagram-token-manager-dev-refresh)
* Log group (instagram-token-manager-dev-initiate)
* Log group (instagram-token-manager-dev-refresh)
* S3 Bucket (for the access token)
* S3 Bucket (for the service artifacts)
* S3 Bucket Policy

All resources will be tagged in AWS with `project`: `instagram-token-manager`

## Deploying this package

Sign up for an Instagram Developer account and set the following parameters in your Basic Display application:

* app_id, our Instagram app id, not your Facebook app
* app_secret, your Instagram app secret
* redirect_uri, this should be your AWS API gateway. Could be something like https://company.com/instagram/auth

Ensure you've copied the env.sample.yml to env.yml and edited any configuration needed. To deploy you'll want to run: `serverless deploy`

### Initiating a new token

Visit the following in a browser and walk through the Instagram login process.
https://api.instagram.com/oauth/authorize?client_id=<YOUR APP ID>&redirect_uri=<YOUR REDIRECT URI>&scope=user_profile,user_media&response_type=code

At then end you should see a "Token successfully set" message and a new token.js file in your AWS S3 bucket.

### Refreshing your token
The refresh script should run once per day on a schedule.

## How to use on your site

After the CloudFormation resources are deployed and you've installed instafeed.js all you have to do is include a script tag to:

```html
<script src="https://<BUCKET NAME>.s3.amazonaws.com/token.js">
```