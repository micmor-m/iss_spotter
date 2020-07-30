/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */

const request = require('request');


const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API with https://api.ipify.org?format=json
  request("https://api.ipify.org?format=json", (error, response, body) => {
    
    //error = "fake error";

    //if any error from request
    if (error) {
      //if request return an error pass it to the call function
      callback(error, null);
      return;
    }
    //to simulate error response code chamge URL to make invalid
    
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    
    //console.log('body:', body); // Print the HTML for the Google homepage.
    //parse the sting from the request in to an object
    const ip = JSON.parse(body);
    //console.log(ip);
    callback(null, ip.ip);
  });
};

const fetchCoordsByIP = function(ip, callback) {
  // use request to fetch IP address from JSON API with https://api.ipify.org?format=json
  request("https://ipvigilante.com/" + ip, (error, response, body) => {
    
    //error = "fake error";

    //if any error from request
    if (error) {
      //if request return an error pass it to the call function
      callback(error, null);
      return;
    }
        
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    
    //console.log('body:', body); // Print the HTML for the Google homepage.
    //parse the sting from the request in to an object
    const latitude = JSON.parse(body).data.latitude;
    const longitude = JSON.parse(body).data.longitude;
   
    callback(null, {latitude: latitude, longitude: longitude});
  });
};

const fetchISSFlyOverTimes = function(coords, callback) {
  //http://api.open-notify.org/iss-pass.json?lat=LAT&lon=LON
  // use request to fetch IP address from JSON API with https://api.ipify.org?format=json
  request("http://api.open-notify.org/iss-pass.json?lat=" + coords.latitude + "&lon=" + coords.longitude, (error, response, body) => {
    
    //error = "fake error";

    //if any error from request
    if (error) {
      //if request return an error pass it to the call function
      callback(error, null);
      return;
    }
        
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching ISS pass times: ${body}`;
      callback(Error(msg), null);
      return;
    }
    
    //parse the sting from the request in to an object
    const array = JSON.parse(body).response;
    //console.log(array);
    callback(null, array);
  });

};

/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results.
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */
const nextISSTimesForMyLocation = function(callback) {
  
  fetchMyIP((error, ip) => {
    if (error) {
      //console.log("It didn't work!", error);
      return callback(error, null); // exiting the function
    }
    //console.log('It worked! Returned IP:' , ip);
      
    fetchCoordsByIP(ip,(error, coords) => {
      if (error) {
        //console.log("It didn't work!", error);
        return callback(error, null); // exiting the function
      }
      //console.log('It worked! Returned coordinate:' , coords);

      fetchISSFlyOverTimes(coords,(error, passTimes) => {
        if (error) {
          //console.log("It didn't work!", error);
          return callback(error, null); // exiting the function
        }
        //console.log('It worked! Returned flyover times:' , passTimes);
        callback(null, passTimes);
        
      });
    });
  });
};

module.exports = { nextISSTimesForMyLocation };

