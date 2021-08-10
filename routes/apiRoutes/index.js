// This file works as middleware so that our app knows about the routes in animalRoutes.js
// Here we are e,ploying Router as before, but this time we're having it use the module exported from animalRoutes.js 
// Doing it this way, we are using apiRoutes/index.js as a central hub for all routing functions as we may want to add to the application.

const router = require('express').Router(); //Imports the Express.js feature called Router. Router allows us to declare routes in any file as long as we use the proper middlware.
const animalRoutes = require('../apiRoutes/animalRoutes'); //Imports the routes that are in the animalRoutes.js file. 
//Note that the .js extension is implied when supplying file names in require()
const zookeeperRoutes = require('../apiRoutes/zookeeperRoutes');

router.use(animalRoutes); //Will use the routes in the animalRoutes.js file
router.use(zookeeperRoutes);

module.exports = router; //Exports the router to allow us to refer to these routes in another file.