let recommendedDests = [];
const chosenDests = [];

class UIHandler {
  constructor(apiHandlerInstance, destinationCardHandlerInstance) {
    this.USERINPUT = '';

    this.preferences = ''; // updates through sliding windows
    this.NOT = ''; // adds when user clicks more

    this.apiHandler = apiHandlerInstance;
    this.destinationCardHandler = destinationCardHandlerInstance;

    // recommendedDests = [];
    this.recommendedCitys = [];
    this.chosenCitys = [];

    // Get references to HTML elements
    this.wtabout = document.getElementById('wtabout');
    this.promptInput = document.getElementById('prompt-input');
    this.responseOutput = document.getElementById('response-output');
  }

  getCountries() {
    const countryIdList = [];
    const regions = document.querySelectorAll('.region-group.active');

    regions.forEach((region) => {
      const countries = region.querySelectorAll('path');
      countries.forEach((country) => {
        if (country.id) {
          countryIdList.push(country.id);
        }
      });
    });

    console.log(countryIdList);
    return countryIdList;
  }

  getStartMessage() {
    const countries = this.getCountries();
    let countryStr;

    if (countries.length > 0) {
      countryStr = `Only inside these countries ${countries}`;
    } else {
      countryStr = 'Only places in Europe';
    }

    const message = [
      {
        'role': 'system',
        'content': 'you are a professional travel advisor and will give a personalized trip in Europe based on the provided information. \n\nAnswer in a numbered list like this: "1. city, country - detailed motivation based on the information", maximum 40 words. give only 5 destinations at a time.',
      },
      {
        'role': 'user',
        'content': `User's Travel Style: ${document.querySelector('select[name="travel-style"]').value.trim()}\n\nSpecial Interests: Beach, culture, hiking, adventure, nature\n\nTravel Expectations: ${document.getElementById('prompt-input').value.trim()}\n\nBased on the above information, please suggest the best cities for the user to visit and a brief explanation as to why each city is a good fit.\n\n !!!!Important: ${countryStr}!!!`,
        // 'content': `Preferences:\n${document.querySelector('select[name="travel-style"]').value.trim()}\n My travel expectations:\n${document.getElementById('prompt-input').value.trim()}`,
      },
    ];
    console.log(message);
    return message;
  }

  // Extract destination objects from response text
  extractDestinations(text) {
    const regex = /\d+\.\s([^,]+),\s([^-\n]+)-\s([^.\n]+)/g;

    // Use matchAll to get all matches
    // Use the spread operator (...) to convert the iterator returned by matchAll() into an array for easier processing.
    const matches = [...text.matchAll(regex)];

    console.log(matches);

    recommendedDests = matches.map((match) => {
      const [, city, country, motivation] = match;
      return { destination: `${city.trim()}, ${country.trim()}`, motivation };
    });

    this.recommendedCitys = recommendedDests.map((dest) => dest.destination.split(',')[0].trim());

    return recommendedDests;
  }

  removeDuplicates(Dests, newDestinations) {
    const uniqueDestinations = newDestinations.filter((newDest) => !Dests.some((dest) => dest.destination === newDest.destination));
    return uniqueDestinations;
  }

  // Handle generate button click event
  handleGenerateButtonClick = async () => {
    this.USERINPUT = this.promptInput.value.trim();

    if (!this.USERINPUT) {
      alert('Please enter a prompt.');
      return;
    }

    document.getElementById('more-btn').style.display = 'block';
    this.wtabout.textContent = 'What about theese destinations?';
    this.responseOutput.textContent = 'Loading...';

    try {
      this.messages = this.getStartMessage();

      const data = await this.apiHandler.callGpt(this.messages);
      const text = data.choices[0].message.content;

      this.messages.push(data.choices[0].message);

      console.log('answer: ', text);

      // const text = '1. Barcelona, Spain - Barcelona is an amazing city with a unique culture and fascinating architecture. It is also home to many beautiful beaches and a vibrant nightlife.\n\n2. London, UK - London is a global city with world-class attractions, beautiful parks and gardens, and a lively cultural scene.\n\n3. Paris, France - Rio de Janeiro is a vibrant city with stunning beaches and an exciting culture. It is also home to the iconic Christ the Redeemer statue.\n\n4. Prague, Czech - New York City is a bustling and exciting city with plenty to see and do. It is also home to some of the world\'s most iconic landmarks.\n\n5. Berlin, Germany - Bangkok is a bustling and vibrant city with an amazing array of culture, cuisine, and attractions. It is also home to some of the most stunning temples in the world.';

      recommendedDests = this.extractDestinations(text);

      this.NOT += `${this.recommendedCitys},`;

      this.destinationCardHandler.displayDestinations(recommendedDests);
    } catch (error) {
      console.error(error);
      alert('An error occurred. Please try again later.');
    }
  };

  handleMoreButtonClick = async () => {
    // Filter out destinations from recommendedDests that are already in chosenDests.
    recommendedDests = recommendedDests.filter((dest) => !chosenDests.some((destination) => dest.destination === destination));

    const bDests = [...recommendedDests];

    try {
      this.messages.push({
        'role': 'user',
        'content': 'more',
      });

      const data = await this.apiHandler.callGpt(this.messages);
      const text = data.choices[0].message.content;

      this.messages.push(data.choices[0].message);

      console.log(this.messages);

      // const text = '1. Tokyo, Japan - Visit the vibrant city life, explore the world-famous cuisine, and enjoy the unique culture and festivals.\n2. Seoul, South Korea - Experience the cutting-edge technology, explore the ancient palaces, and marvel at the modern architecture.';

      const newDestinations = this.extractDestinations(text);
      const uniqueDestinations = this.removeDuplicates(bDests.concat(chosenDests), newDestinations);

      if (uniqueDestinations.length > 0) {
        recommendedDests = bDests.concat(uniqueDestinations);

        this.NOT += `${this.recommendedCitys},`;

        this.destinationCardHandler.displayDestinations(recommendedDests);
      } else {
        recommendedDests = bDests;
        // await generateMoreDestinations(); //THIS SHOULD BE ON
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred. Please try again later.');
    }
  };
}

const apiHandlerInstance = new APIHandler();
const destinationCardHandlerInstance = new DestinationCardHandler(apiHandlerInstance);

const uiHandler = new UIHandler(apiHandlerInstance, destinationCardHandlerInstance);

document.getElementById('generate-btn').addEventListener('click', uiHandler.handleGenerateButtonClick);
document.getElementById('more-btn').addEventListener('click', uiHandler.handleMoreButtonClick);
