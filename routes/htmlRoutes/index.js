const path = require('path'); //Imports the path module built into the Node.js API that provides utilities for working with file and directory paths.
const router = require('express').Router() //Imports the Express.js feature called Router. Router allows us to declare routes in any file as long as we use the proper middlware.

router.get('/', (req, res) => { //This route directs us to the index.html page, which will display our webpage. 
    res.sendFile(path.join(__dirname, './public/index.html')); //This allows us to display the contents of the index.html page at the server route / while the file doesn't get to the browser
}); //Uses relative path as opposed to absolute path

router.get('/animals', (req, res) => {  //This route directs us to the animals.html page. The user would need to naviagate to the server route / and type animals at the end. In other words https://localhost:3001/animals
    res.sendFile(path.join(__dirname, './public/animals.html')); //This allows us to display the contents of the animals.html page at the server route /animals, while the file doesn't get to the browser
});

router.get('/zookeepers', (req, res) => { //This route directs us to the zookeepers.html page. The user would need to naviagate to the server route / and type zookeepers at the end. In other words https://localhost:3001/zookeepers
    res.sendFile(path.join(__dirname, './public/zookeepers.html')); //This allows us to display the contents of the zookeepers.html page at the server route /zookeepers, while the file doesn't get to the browser
});

router.get('*', (req, res) => { //This is a wildcard route that will be used if the user tries to navigate to a route that has not been specified. For example, if the user went to https://localhost:3001/about, they would be redirected to this route.
    res.sendFile(path.join(__dirname, './public/index.html')); //This allows us to display the contents of the index.html page at the server route / while the file doesn't get to the browser
}); //This wildcard route will display to users the index.html page.

module.exports = router; //Exports the router to allow us to refer to these routes in another file.