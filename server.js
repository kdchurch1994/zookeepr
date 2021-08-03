const { animals } = require('./data/animals.json'); // importing this file to be called by the server
const express = require('express'); //Allows us to use the Express NPM package

const PORT = process.env.PORT || 3001; // This line of code sets the PORT variable to either process.env.PORT, which is telling the app to use that port (environment variable set by Heroku) if it is set up, and if not, default to port 80. If ran locally, it will use port 3001
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
        personalityTraitsArray.forEach(trait => { //Check the trait against each animal in the filteredResults array. Remember, it is initially a copy of the animalsArray, but here we're updating it for each trait in the .forEach() loop.
            filteredResults = filteredResults.filter( //For each trait beging targeted by the filter, the filteredResults array will then contain only the entries that contain the trait,
                animal => animal.personalityTraits.indexOf(trait) !== -1  //so at the end we'll have an array of animals that have every one of the traits when the .forEach() loop is finished.     
            );
        });
    }
    if (query.diet) { //Provides info on an animal based on diet (a particular food choice that is particular to that animal) (utilizes the ? parameter in the URL)
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) { //Provides info on an animal based on the species. (utilizes the ? parameter in the URL)
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) { //Provides info on an animal based on the animal's name. (utilizes the ? parameter in the URL)
        filteredResults = filteredResults.filter(animal => animal.name === query.name); 
    }
    return filteredResults;
}

function findById(id, animalsArray) { //Finds the id of a particular animal in the array being filtering through the array
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
}

app.get('/api/animals', (req, res) => { //A get route to pull data from the animals api and respond with the whole animals.json file or allow you to search using the ? parameter in the url
    let results = animals;              //That particular datatype must be listed in the json file or it will not return any working results. 
    if (req.query) {                     
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

app.get('/api/animals/:id', (req, res) => { //Gets and returns an animal to the webpage based on the animals id. This is possible due to using the findById function and using re.params.id to represent the id of each animal in the array
    const result = findById(req.params.id, animals);
    if (result) {
        res.json(result); //Returns a result if the animal's id exists. 
    } else {
        res.send(404); //Responds with a 404 status error if the Id does not exist. Remember that the 404 status code is meant to communicate to the client that the requested resource could not be found. 
    }
});

app.listen(PORT, () => { //The listen() method tells the server to listen on either the port being used by Heroku (if deployed to Heroku) or to Port 3001 if ran locally
    console.log(`API server now on port ${PORT}!`); //The server sends the message "API server now on port ..." either port 3001 if local, or whatever Port is being utilized by Heroku, to the console log (Tells us the server is on and listening for requests)
})


