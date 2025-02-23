# Notes before starting up

Before doing anything:
I over-excitedly used the thumbnail generation without loading the whole WebViewer. Didn't have enough time to figure out whether or not it was possible to use the full API without loading the WebViewer, but there was no optimization available with the partial API, as far as I could tell.

This is all to say, the gigantic 64-base strings will take about 10 or 20 seconds upon first load, and then it's much quicker as they will save on your browser under an indexed DB. FYI on Incognito, this will actually cause an error. 

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
