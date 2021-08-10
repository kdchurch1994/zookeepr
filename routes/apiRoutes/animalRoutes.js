// Reason for using router instead of app - The variable that we use to create endpoints, app, is set to express(). 
// This means that if we were to move the app routes from server.js to another file, we'd need to make sure we're using the same app the entire time.
// If we were to add const app = express(); at the top of this new file, then app would not be referring to the same app that our server is listening to in server.js
// It would be a completely new app.
const router = require('express').Router(); //Imports the Express.js feature called Router. Router allows us to declare routes in any file as long as we use the proper middlware.

const { filterByQuery, findById, createNewAnimal, validateAnimal } = require('../../lib/animals'); // Imports the functions from lib/animals.js
const { animals } = require('../../data/animals'); // Imports the animal object from data/animals.json

router.get('/animals', (req, res) => { //A get route to pull data from the animals api and respond with the whole animals.json file or allow you to search using the ? parameter in the url
    let results = animals;              //That particular datatype must be listed in the json file or it will not return any working results. 
    if (req.query) {                     
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

router.get('/animals/:id', (req, res) => { //Gets and returns an animal to the webpage based on the animals id. This is possible due to using the findById function and using re.params.id to represent the id of each animal in the array
    const result = findById(req.params.id, animals);
    if (result) {
        res.json(result); //Returns a result if the animal's id exists. 
    } else {
        res.send(404); //Responds with a 404 status error if the Id does not exist. Remember that the 404 status code is meant to communicate to the client that the requested resource could not be found. 
    }
});

router.post('/animals', (req, res) => {
    // set id based on what the next index of the array will be
    req.body.id = animals.length.toString(); 

    // if any data in req.body is incorrect, send 400 error back
    if (!validateAnimal(req.body)) {
        res.status(400).send('The animal is not properly formatted.');
    }   else {
        // add animal to json file and animals array in this function
        const animal = createNewAnimal(req.body, animals);
        res.json(animal);
    }
});

module.exports = router; //Exports the router to allow us to refer to these routes in another file.