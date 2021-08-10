const $animalForm = document.querySelector('#animal-form');
const $zookeeperForm = document.querySelector('#zookeeper-form');

const handleAnimalFormSubmit = event => {
  event.preventDefault();

  // get animal data and organize it
  const name = $animalForm.querySelector('[name="animal-name"]').value;
  const species = $animalForm.querySelector('[name="species"]').value;
  const dietRadioHTML = $animalForm.querySelectorAll('[name="diet"]');
  let diet;

  for (let i = 0; i < dietRadioHTML.length; i += 1) {
    if (dietRadioHTML[i].checked) {
      diet = dietRadioHTML[i].value;
    }
  }

  if (diet === undefined) {
    diet = '';
  }

  const selectedTraits = $animalForm.querySelector('[name="personality"').selectedOptions;
  const personalityTraits = [];
  for (let i = 0; i < selectedTraits.length; i += 1) {
    personalityTraits.push(selectedTraits[i].value);
  }
  const animalObject = { name, species, diet, personalityTraits };

  fetch('/api/animals', { //Uses the animal route that was established with our POST route in server.js
    method: 'POST', //Declares the type of HTTP method, in this case a POST method
    headers: { //The headers property is set up to inform the request that this is going to be JSON data
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(animalObject) //This takes the data entered by the user and converts it to string. This allows us to add our stringified JSON data for our animalObject to the body property of the request.
  })
    .then(response => { 
      if (response.ok) { //checks to see if the response is ok (No errors) and if it is, it returns the data, if not, the user is alerted with an Error message
        return response.json();
      }
      alert(`Error: ${response.statusText}`);
    })
    .then(postResponse => { //If the response is deemed ok, the data is then stored as postResponse and sent to the console log
      console.log(postResponse);
      alert('Thank you for adding an animal!'); //The user is alerted that the animal creation is successful
    });
};

const handleZookeeperFormSubmit = event => {
  event.preventDefault();

  // get zookeeper data and organize it
  const name = $zookeeperForm.querySelector('[name="zookeeper-name"]').value;
  const age = parseInt($zookeeperForm.querySelector('[name="age"]').value);
  const favoriteAnimal = $zookeeperForm.querySelector('[name="favorite-animal"]').value;

  const zookeeperObj = { name, age, favoriteAnimal };
  console.log(zookeeperObj);
  fetch('api/zookeepers', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(zookeeperObj)
  })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      alert('Error: ' + response.statusText);
    })
    .then(postResponse => {
      console.log(postResponse);
      alert('Thank you for adding a zookeeper!');
    });
};

$animalForm.addEventListener('submit', handleAnimalFormSubmit);
$zookeeperForm.addEventListener('submit', handleZookeeperFormSubmit);
