# Notes before starting up
1. You will need a free license key from Apryse:

https://dev.apryse.com/

Then save it in a .env file, in the client directory, as REACT_APP_WEBVIEWER_LICENSE_KEY=
Set the port there too, for the client with PORT=4000

2. You will need a fake SMTP to try the email functionality, I used Mailhog and gave it the same configuration that you can find in server/index.js.

On Mac it's just: brew install mailhog
And then it runs with "Mailhog". 

I think that it might be every so slightly more complex on Windows: 
https://github.com/mailhog/MailHog/releases

3. Run "npm i" from the client, then the server.

4. From the server dir run node.js and from the client dir, npm start

5. It should all have started for you!
