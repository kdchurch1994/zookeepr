const fs = require('fs'); //imports the use of the fs library, which is used to write to files
const path = require('path'); //Imports the path module built into the Node.js API that provides utilities for working with file and directory paths.
const { animals } = require('./data/animals.json'); // importing this file to be called by the server
const express = require('express'); //Allows us to use the Express NPM package

const PORT = process.env.PORT || 3001; // This line of code sets the PORT variable to either process.env.PORT, which is telling the app to use that port (environment variable set by Heroku) if it is set up, and if not, default to port 80. If ran locally, it will use port 3001
const app = express(); //Instantiates (starts) the Express.js server
// Line 3 Note: We assign express() to the app variable so that we can later chain on methods to the Express.js server.

// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());

app.use(express.static('public')); // Express middlware that uses the express.static() method. We provide a file path to the location in our application and instruct the server to make these files static resources. 
                                   // This means that all of our front-end code can now be access without having a specific server endpoint created for it. 

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

function createNewAnimal(body, animalsArray) { //This function accepts the POST route's req.body value and the array we want to add the data to.
    const animal = body;
    animalsArray.push(animal); //saves the new data in the local server.js copy of our animal data
    fs.writeFileSync( 
        path.join(__dirname, './data/animals.json'), //Writes the new animal data to our animals.json file in the data subdirectory by using the method path.join() to join the value of __dirname, which represents the directory of the file we execute the code in, with the path to the animals.json file
        JSON.stringify({ animals: animalsArray }, null, 2) //Converts the JavaScript array data to JSON. The other two arguments used in the method, null and 2, are means of keeping the data formatted
    );                                                     //The null argument means we don't want to edit any of our existing data; if we did, we could pass something in there. The 2 indicates we want to create white space between our values to make it more readable. 
    return animal;
}

function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== 'string') { //if animal.name is not a string, the function will return false
        return false;
    }
    if (!animal.species || typeof animal.species !== 'string') { //if animal.species is not a string, the function will return false
        return false;
    }
    if (!animal.diet || typeof animal.diet !== 'string') { //if animal.diet is not a string, the function will return false
        return false;
    }
    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) { //if animal.personalityTraits is not an array, the function will return false
        return false;
    }
    return true; //If all the validators do not return false, return true
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

app.post('/api/animals', (req, res) => {
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

app.get('/', (req, res) => { //This route directs us to the index.html page, which will display our webpage. 
    res.sendFile(path.join(__dirname, './public/index.html')); //This allows us to display the contents of the index.html page at the server route / while the file doesn't get to the browser
}); //Uses relative path as opposed to absolute path

app.get('/animals', (req, res) => {  //This route directs us to the animals.html page. The user would need to naviagate to the server route / and type animals at the end. In other words https://localhost:3001/animals
    res.sendFile(path.join(__dirname, './public/animals.html')); //This allows us to display the contents of the animals.html page at the server route /animals, while the file doesn't get to the browser
});

app.get('/zookeepers', (req, res) => { //This route directs us to the zookeepers.html page. The user would need to naviagate to the server route / and type zookeepers at the end. In other words https://localhost:3001/zookeepers
    res.sendFile(path.join(__dirname, './public/zookeepers.html')); //This allows us to display the contents of the zookeepers.html page at the server route /zookeepers, while the file doesn't get to the browser
});

app.get('*', (req, res) => { //This is a wildcard route that will be used if the user tries to navigate to a route that has not been specified. For example, if the user went to https://localhost:3001/about, they would be redirected to this route.
    res.sendFile(path.join(__dirname, './public/index.html')); //This allows us to display the contents of the index.html page at the server route / while the file doesn't get to the browser
}); //This wildcard route will display to users the index.html page.

app.listen(PORT, () => { //The listen() method tells the server to listen on either the port being used by Heroku (if deployed to Heroku) or to Port 3001 if ran locally
    console.log(`API server now on port ${PORT}!`); //The server sends the message "API server now on port ..." either port 3001 if local, or whatever Port is being utilized by Heroku, to the console log (Tells us the server is on and listening for requests)
})


