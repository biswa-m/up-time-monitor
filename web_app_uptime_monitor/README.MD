# Description
The requirements of the application should be as follow.

### REST API
*  The API listens on a PORT and accepts incoming HTTP requests for POST, GET, PUT, DELETE and HEAD
*  The API allows a client to connect, then create a new user, then edit and delete that user.
*  Users are able to "sign in" which gives them a token that they can use for subsequent authenticated reauests.
*  Users are able to "sign out" which will invalidate their token.
*  The API allows a signed-in user to use their token to create a new task to monitor status of an user defines URL.
*  A signed-in user is able edit and delete any of their task.
*  In the background, workers perform all the tasks at the appropiate times and send alert SMS to the users when an URL change status from "up" to "down" or visa versa. Alert SMS will be sent via Twilio.

### Frontend GUI
*  Index page
*  Signup page
*  Login page
*  Page to show succussfull logout
*  Account setting page
*  Create check page
*  Edit check page
*  Dashboard to show all checks

### CLI for app management by admin
* Interaction with this program (inputs and outputs) via the console.
* Event driven design pattern
* Response to a number of different requests.

# Starting the app
Start the app by following command

	node index.js

Before starting the app for the first time do the following
	Make sure the ports 3000, 3001, 5000 and 5001 is currently free. If any of them are not available configure the ports at 'lib/config.js' file.

# Modes
Run the app in stagging environment
	NODE_ENV=staging node index.js

Run the app in production environment
	NODE_ENV=production node index.js

Run the app in debugging modes
1. Debug background workers
	NODE_DEBUG=workers node index.js

2. Debug servers
	NODE_DEBUG=server node index.js

# CLI Commands for admin
1.	Exit
2.	Man/Help
3.	Stats
4.	List Users
5.	More User Info
6.	List Checks
7.	More Check Info
8.	List Logs
9.	More Log Info
