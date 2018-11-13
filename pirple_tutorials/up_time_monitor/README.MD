# Description
The requirements of the application should be as follow.
*  The API listens on a PORT and accepts incoming HTTP requests for POST, GET, PUT, DELETE and HEAD
*  The API allows a client to connect, then create a new user, then edit and delete that user.
*  Users are able to "sign in" which gives them a token that they can use for subsequent authenticated reauests.
*  Users are able to "sign out" which will invalidate their token.
*  The API allows a signed-in user to use their token to create a new task to monitor status of an user defines URL.
*  A signed-in user is able edit and delete any of their task.
*  In the background, workers perform all the tasks at the appropiate times and send alert SMS to the users when an URL change status from "up" to "down" or visa versa. Alert SMS will be sent via Twilio.

## Starting the app
Start the app by following command

	node index.js

Before starting the app for the first time do the following
1.	If not already present, create two new directory '.data' and '.logs', on the same directory where 'index.js' is located. '.data' holds all the user data and '.logs' holds all the log files of the application. 
2.	Make sure the ports 3000, 3001, 5000 and 5001 is currently free. If any of them are not available configure the ports at 'lib/config.js' file.

## Modes
Run the app in stagging environment
	
	NODE_ENV=staging node index.js

Run the app in production environment

	NODE_ENV=production node index.js

Run the app in debugging modes
1. Debug background workers
	
	NODE_DEBUG=workers node index.js

2. Debug servers
	
	NODE_DEBUG=server node index.js
