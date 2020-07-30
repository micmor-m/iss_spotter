//const { fetchMyIP } = require('./iss');
//const { fetchCoordsByIP } = require('./iss');
//const { fetchISSFlyOverTimes } = require('./iss');
const { nextISSTimesForMyLocation } = require('./iss');

//take the arguments from the command line without the first two words, and put them into an array 9each word an element)

//cal the req function and pass the function itself as call back
// fetchMyIP((error, ip) => {
//   if (error) {
//     console.log("It didn't work!", error);
//     return; // exiting the function
//   }
//   console.log('It worked! Returned IP:' , ip);
// });

// //cal the req function and pass the function itself as call back
// fetchCoordsByIP("77.49.220.90",(error, coords) => {
//   if (error) {
//     console.log("It didn't work!", error);
//     return; // exiting the function
//   }
//   console.log('It worked! Returned coordinate:' , coords);
// });

// //cal the req function and pass the function itself as call back
// fetchISSFlyOverTimes({ latitude: '37.98330', longitude: '23.73330' },(error, passTimes) => {
//   if (error) {
//     console.log("It didn't work!", error);
//     return; // exiting the function
//   }
//   console.log('It worked! Returned flyover times:' , passTimes);
// });

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  // success, print out the deets!
  //console.log(passTimes);
  for (const passTime of passTimes) {
    const datetime = new Date(0);
    //console.log(datetime);
    datetime.setUTCSeconds(passTime.risetime);
    console.log("Next pass at " + datetime + " for " + passTime.duration + " seconds!");
  }
});
