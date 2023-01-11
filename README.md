
# Google Drive API

Tested and used the Google API for uploading and downloading the files from Googledrive using Oauth.




## Explanation about the API

1. So in google cloud console, You must first enable the API service you want to use. 
2. After enabling the API in API and Services , create your credentials with callback url and all the scopes you may need for your project.
3. Google will provide you Client ID and Client Secret for Oauth and API key for public APIs.
4. Now using the `googleapis` npm library we can create an Oauth client and by setting the refresh token we will make it a client for which we generated the access and refresh token.
5. Google does not need `accessToken` to validate a user but the refrsh token and idk why?
6. Now you can also get the `accessToken` by the `getAccessToken()` method on the client.
7. Your client is now generated do the further task as you need.

**This Explanation is totally for my understanding! Thank you!!  **
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`CLIENT_ID`

`CLIENT_SECRET`

And optional

`MONGODB_URL`
## 🔗 Links


[![twitter](https://img.shields.io/badge/twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/chinma_yyy)

