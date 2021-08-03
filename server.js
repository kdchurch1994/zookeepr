const { animals } = require('./data/animals.json'); // importing this file to be called by the server
const express = require('express'); //Allows us to use the Express NPM package

const app = express(); //Instantiates (starts) the Express.js server
// Line 3 Note: We assign express() to the app variable so that we can later chain on methods to the Express.js server.

function filterByQuery(query, animalsArray) { //This function will take in req.query as an argument and filter through the animals accordingly, returning the new filtered array. 
    let personalityTraitsArray = [];
    // Note that we save the animalsArray as filteredResults here:
    let filteredResults = animalsArray;
    if (query.personalityTraits) {
        //Save personalityTraits as a dedicated arry.
        //If personatlityTraits is a string, place it into a new array and save. 
        if (typeof query.personalityTraits === 'string') {
            personalityTraitsArray = [query.personalityTraits];
        } else {
            personalityTraitsArray = query.personalityTraits;
        }
        //Loop through each trait in the personalityTraits array:
        personalityTraitsArray.forEach(trait => {
            //Check the trait against each animal in the filteredResults array.
            //Remember, it is initially a copy of the animalsArray,
            //but here we're updating it for each trait in the .forEach() loop.
            //For each trait beging targeted by the filter, the filteredResults
            //array will then contain only the entries that contain the trait,
            //so at the end we'll have an array of animals that have every one
            //of the traits when the .forEach() loop is finished. 
            filteredResults = filteredResults.filter(
                animal => animal.personalityTraits.indexOf(trait) !== -1
            );
        });
    }
    if (query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    return filteredResults;
}

app.get('/api/animals', (req, res) => { //A get route to pull data from the animals api and respond with the whole animals.json file or allow you to search using the ? parameter in the url
    let results = animals;              //That particular datatype must be listed in the json file or it will not return any working results. 
    if (req.query) {                     
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});


app.listen(3001, () => { // The listen() method tells the server to listen on port 3001
    console.log(`API server now on port 3001!`); //The server sends the message "API server now on port 3001!" to the console log (Tells us the server is on and listening for requests)
})


