const fs = require("fs"); //imports the use of the fs library, which is used to write to files
const path = require("path"); //Imports the path module built into the Node.js API that provides utilities for working with file and directory paths.


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
        path.join(__dirname, '../data/animals.json'), //Writes the new animal data to our animals.json file in the data subdirectory by using the method path.join() to join the value of __dirname, which represents the directory of the file we execute the code in, with the path to the animals.json file
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
 
module.exports = { //Exports these functions to be used by other files (i.e. server.js)
        filterByQuery,
        findById,
        createNewAnimal,
        validateAnimal
};