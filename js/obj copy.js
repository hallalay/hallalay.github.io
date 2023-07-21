class Bot {
    constructor() {
        this.API_URL = 'https://api.openai.com/v1/completions';
        this.API_KEY = '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';  
        this.MODEL = 'text-davinci-003';

            
        this.QUESTION = 'make a plan of which 5 cities you think i should go based on this information:\\n';
        this.DEFAULT_PROMPT = "\\n\\n(Answer with a detailed motivation. Answer in a list format like this: city, country - motivation.)";
        this.USERINPUT = '';




        this.preferences = {}; // updates through sliding windows

		this.recommendedDests = [];
        this.recommendedCitys = [];
        this.chosenDests = [];
        this.chosenCitys = [];

        // Get references to HTML elements
		this.wtabout = document.getElementById('wtabout');
        this.promptInput = document.getElementById('prompt-input');
        this.responseOutput = document.getElementById('response-output');
		this.moreBtn = document.getElementById('more-btn');
    }

    // Extract destination objects from response text
    extractDestinations(text) {
            this.recommendedDests = [];
        const regex = /\d+\.\s([^,]+),\s([^-\n]+)-\s([^.\n]+)/g;
        let match;
        while ((match = regex.exec(text)) !== null) {
            const [, city, country, motivation] = match;
                    this.recommendedCitys.push(city)
            const destination = `${city.trim()}, ${country.trim()}`;
            this.recommendedDests.push({ destination, motivation });
        }
        return this.recommendedDests;
    }

    async getImageUrl(city) {
        const apiKey = 'NYwQNKoAl2WiDnkFdwaXWyMDMPwrr-OtyV4wzJ613i8';
        const apiUrl = `https://api.unsplash.com/search/photos?client_id=${apiKey}&query=${city}&per_page=1`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        const imageUrl = data.results[0].urls.regular;
        return imageUrl;
    }

    calculateDuration(arrivalDate, departureDate) {
        const arrival = new Date(arrivalDate);
        const departure = new Date(departureDate);

        const timeDiff = departure - arrival;
        const duration = Math.ceil(timeDiff / (1000 * 3600 * 24));

        return duration;
    }


    getTravelInfo() {
        const arrivalDate = document.getElementById('arrivalDateInput').value;
        const departureDate = document.getElementById('departureDateInput').value;
        const people = document.getElementById('peopleInput').value;

        if (!arrivalDate || !departureDate || !people) {
            alert('Please fill in all the fields.');
            return false;
        }

        if (new Date(arrivalDate) >= new Date(departureDate)) {
            alert('Departure date must be after arrival date.');
            return false;
        }

        return this.calculateDuration(arrivalDate, departureDate);
    }


    // This method calculates the number of days for each destination
	distributeDays(destinations) {
        // Get travel info from this object
        const duration = this.getTravelInfo();

        // If there is no travel info, return false
        if (!duration) {
            console.log('false');
            return;
        }

        // Set up variables for calculation
        const numDestinations = destinations.length;
        const distributedDays = [];

        let remainingDays = duration;
        let totalWeight = (numDestinations * (numDestinations + 1)) / 2;

        // Calculate days for each destination
        for (let i = 0; i < numDestinations - 1; i++) {
            const weight = numDestinations - i;
            const daysForDestination = Math.floor((weight / totalWeight) * duration);
            distributedDays.push(daysForDestination);
            remainingDays -= daysForDestination;
        }

        distributedDays.push(remainingDays);

        // Sort days in descending order
        distributedDays.sort((a, b) => b - a);

        // Create an object that maps each destination to its number of days
        const daysDistribution = Object.fromEntries(destinations.map((destination, i) => [destination, distributedDays[i]]));

        return daysDistribution;
    }
        
    // Generate and display clickable boxes of this.recommendedDests
    async displayDestinations(recommendedDestinations) {
        if (!Array.isArray(recommendedDestinations) || recommendedDestinations.length === 0) {
            this.responseOutput.textContent = 'No valid travel destinations found.';
            return;
        }

        this.responseOutput.innerHTML = '';

        for (let { destination, motivation } of recommendedDestinations) {
            const container = this.createDestinationContainer(destination, motivation);
            container.addEventListener('click', () => this.moveDestination(container, destination, motivation));

            const imageUrl = await this.getImageUrl(destination.split(', ')[0]);
            this.setBackgroundImage(container, imageUrl);

            const overlay = this.createOverlay();
            container.appendChild(overlay);

            const destinationElement = this.createDestinationElement(destination);
            container.appendChild(destinationElement);

            const motivationElement = this.createMotivationElement(motivation);
            container.appendChild(motivationElement);

            this.responseOutput.appendChild(container);
        }
    }

    // Display chosen destinations inside the itinerary container
    displayChosenDestinations(itineraryDests, RecommendedDests) {
		map.calculateAndDisplayRoute
		initMap();
        const itinerary = document.getElementById('itinerary');
        const destinations = itineraryDests.map(item => item.destination); // Extract destinations from itineraryDests

        itinerary.innerHTML = '';
    
        const dayDistribution = this.distributeDays(destinations);

        const duration = this.getTravelInfo()
    
        for (let { destination, motivation } of itineraryDests) {
            const container = document.createElement('div');
            container.classList.add('chosen-destination-container');

            const numberInput = document.createElement('input');
            numberInput.classList.add('days');
            numberInput.type = 'number';
            numberInput.min = '0';
            numberInput.max = duration
            numberInput.placeholder = 'days';
            numberInput.value = dayDistribution[destination]; // Set initial value based on distribution
            container.appendChild(numberInput);

            const destinationElement = document.createElement('div');
            destinationElement.classList.add('chosen-destination');
            destinationElement.textContent = destination;

            const city = destination.split(',')[0].trim(); // Extract city name
            this.chosenCitys.push(city); // Push city name into chosenCitys array	

            container.appendChild(destinationElement);

            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-button');
            deleteButton.textContent = 'x';
            container.appendChild(deleteButton);

            container.addEventListener('mouseover', () => {
            deleteButton.style.visibility = 'visible';
            });

            container.addEventListener('mouseout', () => {
            deleteButton.style.visibility = 'hidden';
            });

            deleteButton.addEventListener('click', () => {
            container.remove();
            itineraryDests = itineraryDests.filter(dest => dest.destination !== destination);
            this.chosen_dests = itineraryDests; // update the chosen destinations
            RecommendedDests.push({ destination, motivation }); // Add destination back to recommended destinations
            this.recommendedDests = RecommendedDests; 
            this.displayDestinations(RecommendedDests); // update the recommended destinations
            });

            itinerary.appendChild(container);
	}
  }

    createDestinationContainer(destination, motivation) {
        const container = document.createElement('div');
        container.classList.add('destination-container');
        return container;
    }

    moveDestination(container, destination, motivation) {
        container.classList.add('move-destination');

        setTimeout(() => {
            container.remove();
            this.recommendedDests = this.recommendedDests.filter(dest => dest.destination !== destination);
            this.chosenDests.push({ destination, motivation });
            this.displayChosenDestinations(this.chosenDests, this.recommendedDests);
        }, 500);
    }

    setBackgroundImage(container, imageUrl) {
        container.style.backgroundImage = `url('${imageUrl}')`;
        container.style.backgroundPosition = 'center';
        container.style.backgroundSize = 'cover';
    }

    createOverlay() {
        const overlay = document.createElement('div');
        overlay.classList.add('overlay');
        return overlay;
    }

    createDestinationElement(destination) {
        const destinationElement = document.createElement('div');
        destinationElement.classList.add('destination');
        destinationElement.textContent = destination;
        return destinationElement;
    }

    createMotivationElement(motivation) {
        const motivationElement = document.createElement('div');
        motivationElement.classList.add('motivation');
        motivationElement.textContent = motivation;
        return motivationElement;
    }

    async callGpt(prompt) {
            const requestBody = {
                    model: this.MODEL,
                    prompt: prompt,
                    temperature: 0.7,
                    max_tokens: 400,
                    top_p: 1,
                    frequency_penalty: 0,
                    presence_penalty: 0,
            };

            const response = await fetch(this.API_URL, {
                    method: 'POST',
                    headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${this.API_KEY}`,
                    },
                    body: JSON.stringify(requestBody),
            });
            const { choices } = await response.json();
            const [{ text }] = choices;
            return text;
    }

    
    removeDuplicates(Dests, newDestinations) {
        const duplicateDestinations = newDestinations.filter(newDest => Dests.some(dest => dest.destination === newDest.destination));
        const uniqueDestinations = newDestinations.filter(newDest => !Dests.some(dest => dest.destination === newDest.destination));
        return { duplicateDestinations, uniqueDestinations };
    }

	// Handle generate button click event
	handleGenerateButtonClick = async () => {

		const userInput = this.promptInput.value.trim();


		if (!userInput) {
			alert('Please enter a prompt.');
			return;
		}

		this.moreBtn.style.display = 'block';
		this.wtabout.textContent = 'What about theese destinations?';
		this.responseOutput.textContent = 'Loading...';

		try {
			const prompt = this.QUESTION + userInput.replace(/\n/g, '\\n') + this.DEFAULT_PROMPT;
			const text = await this.callGpt(prompt);

			// const text = `1. Barcelona, Spain - Barcelona is an amazing city with a unique culture and fascinating architecture. It is also home to many beautiful beaches and a vibrant nightlife.\n\n2. London, UK - London is a global city with world-class attractions, beautiful parks and gardens, and a lively cultural scene.\n\n3. Rio de Janeiro, Brazil - Rio de Janeiro is a vibrant city with stunning beaches and an exciting culture. It is also home to the iconic Christ the Redeemer statue.\n\n4. New York City, USA - New York City is a bustling and exciting city with plenty to see and do. It is also home to some of the world's most iconic landmarks.\n\n5. Bangkok, Thailand - Bangkok is a bustling and vibrant city with an amazing array of culture, cuisine, and attractions. It is also home to some of the most stunning temples in the world.`


			this.recommendedDests = this.extractDestinations(text);
			this.displayDestinations(this.recommendedDests);
		} catch (error) {
			console.error(error);
			alert('An error occurred. Please try again later.');
		}
	}; 

    handleMoreButtonClick = async () => {
        for (let destination of this.chosenDests) {
            this.recommendedDests = this.recommendedDests.filter(dest => dest.destination !== destination);
        }

        const bDests = this.recommendedDests.concat(this.chosenDests);

        const newPrompt = this.QUESTION + `not ${this.recommendedCitys.concat(this.chosenCitys)} \\n` + this.USERINPUT + this.DEFAULT_PROMPT;

        try {
            // const text = await this.callGpt(newPrompt);

            const text =  `1. Tokyo, Japan - Visit the vibrant city life, explore the world-famous cuisine, and enjoy the unique culture and festivals.\n2. Seoul, South Korea - Experience the cutting-edge technology, explore the ancient palaces, and marvel at the modern architecture.`


            const newDestinations = this.extractDestinations(text);
            const { duplicateDestinations, uniqueDestinations } = this.removeDuplicates(bDests, newDestinations);

            if (uniqueDestinations.length > 0) {
                this.recommendedDests = bDests.concat(uniqueDestinations);
                this.displayDestinations(this.recommendedDests);
            } else {
                this.recommendedDests = bDests;
                // await generateMoreDestinations(); //THIS SHOULD BE ON
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred. Please try again later.');
        }
    };

}

const bot = new Bot();