# Pirple Assignment #2
API for a pizza delivery company.
## Starting the API
To start the API simply type following command.

    node index.js

On this command a http and a https server will run in staging environment and start listening to port 3000 and 3001 respectively. 
This can be tested by following URI
    
    localhost:3000/ping
    https://localhost:3001/ping
### Starting in different Modes and environments
Start the API in stagging environment 
    
    NODE_ENV=stagging node index.js

Start the API in production environment
    
    NODE_ENV=production node index.js

The API supports following debuging modes

    NODE_DEBUG=server node index.js
    NODE_DEBUG=orders node index.js
    NODE_DEBUG=workers node index.js

## Configuration
Modify values in lib/config.js for custom configuration.
## Specs
The API supports following functions
### 1. User
New users can be created, their information can be edited and they can be deleted.

*  #### User Creation
    Path : /user
    Method: POST
    Required data on payload: firstName, lastName, email, address, password, tosAgreement.
    
    Where firstName, lastName, email, address and password are string. Type of tosAgreement is boolean, which must be true.
*   #### Read User Information
    Path: /user
    Method: GET
    Required data on querystring: email
    Required data on headers: token
    
    Where token is a string which is obtained on payload on successfull login

*   #### Modify User Information
    Path: /user
    Method: PUT
    Required data on payload: email
    Requred data on headers: token
    Optional data on payload: firstName, lastName, address, password. (Atleast one optional data must be provided)
    
    Where token is a string which is obtained on payload on successfull login.
    The value provided by optional data will replace the existing value of the user data object.

*   #### Delete User
    Path: /user
    Method: DELETE
    Required data on payload: email
    Required data on headers: token

    Where token is a string which is obtained on payload on successfull login
    This will delete the user and all the associated files.

### 2. Login and Logout
User can login and logout by creating and destroying a token. This token is used for authentication of user. The token is valid only for an hour. The token must be extended within an hour to avoid login again.

*   #### Login (Token Creation)
    Path: /token
    Method: POST
    Required data on payload: email, password
    
    This will return a payload containing email, tokenId, and expire.

*   #### Reading Token data
    Path: /token
    Method: GET
    Required data on query string: tokenId

    This will return email, tokenid and expire on payload.
    
*   #### Extending Token
    Path: /token
    Method: PUT
    Required data on payload: tokenId, extend.

    Where type of extend is boolean and must be true. This will extend the validity of token by an hour.

*   #### Logout (Deleting Token)
    Path: /token
    Method: DELETE
    Required data on payload: tokenId

### 3. Item Menu
The menu is a json object. Each product is identified by its productId. The price, name and descriptions can be obtained by productId.price, productId.name and productId.description respectively. The menu item can be changed by manually edit the .data/menus/menu.json file. 
* #### Getting The Menu
    Path: /menu
    Method: GET
    Required data on headers: email, token
    
    This will return the menu on payload.

### 4. Shopping Cart
A logged in user can fill shopping cart with menu items.
* #### Create Shopping Cart
    Path: /cart
    Method: POST
    Required data on headers: email, token
    Required data on payload: cartItems
    
    Where cartItems is an object with instance of array. Each element of cartItems must contains productId and quantity.

* #### Read Shopping Cart
    Path: /cart
    Method: GET
    Required data on headers: token
    Required data on querystring: email

    This will return a payload containing the cartData.

* #### Delete Shopping Cart
    Path: /cart
    Method: DELETE
    Required data on payload: email
    Required data on headers: token

### 5. Placing Order
A logged in user can create an order. A payment gateway of stripe.com is integrated to accept their payment. When payment confirmation is obtained from the payment gateway, order will be created and a confirmation email will be sent to the user. Mailgun.com is integrated to send emails.
* #### Create Order
    Path: /checkout
    Method: POST
    Required data on headers: token, email.
    Required data on payload: currency, source.

    Where currency is a string containg the currency on which user wants to make the payment and source is also a string containg the payment method.
    
    On valid data the API will calculate the total amount from the user's cart and initiate the transaction via payment gateway. An confirmation email will be sent to user on successful transaction.

### 6. Log Maintainance
Background workers will compress all the existing log files on starting the API. The background workers will continue compressing the log files periodically with an intervel of 24 hours.
