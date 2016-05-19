# API Basejump: URL Shortener Microservice

A NodeJS App that allows a user to pass a url as a parameter and the app will respond with a shortened version of the url.

You can view the live demo here: https://damp-meadow-51229.herokuapp.com/

### The Web App Does the Following:
* I can pass a URL as a parameter and I will receive a shortened URL in the JSON response.
* If I pass an invalid URL that doesn't follow the valid http://www.example.com format, the JSON response will contain an error instead.
* When I visit that shortened URL, it will redirect me to my original link.
 
### Example Usage:
https://damp-meadow-51229.herokuapp.com/?url=https://www.freecodecamp.com/
            
### Example output:
<code>
{
	"unix": 1451606400,
	"natural": "December 15, 2015"
}
</code>

### If you visit:
https://damp-meadow-51229.herokuapp.com/10

### It will redirect to:
https://www.freecodecamp.com/