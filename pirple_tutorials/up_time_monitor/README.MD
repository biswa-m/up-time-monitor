# Description
	
This application is under development.

The requirements of the application should be as follow.
	1. The API listens on a PORT and accepts incoming HTTP requests for POST, GET, PUT, DELETE and HEAD
	2. The API allows a client to connect, then create a new user, then edit and delete that user.
	3. Users are able to "sign in" which gives them a token that they can use for subsequent authenticated reauests.
	4. Users are able to "sign out" which will invalidate their token.
	5. The API allows a signed-in user to use their token to create a new task to monitor status of an user defines URL.
	6. A signed-in user is able edit and delete any of their task.
	7. In the background, workers perform all the tasks at the appropiate times and send alert SMS to the users when an URL change status from "up" to "down" or visa versa. Alert SMS will be sent via Twilio.
