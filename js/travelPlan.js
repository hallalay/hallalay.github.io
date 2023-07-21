class Map {
  constructor() {
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer();
    this.map = new google.maps.Map(document.getElementById("map"), {
      zoom: 100,
      center: { lat: 50.8503, lng: 4.3517 },
      disableDefaultUI: true,
    });
    this.directionsRenderer.setMap(this.map);
    
    this.fullTrip = [];

    // Initialize the Places Autocomplete search box
    const originInput = document.getElementById("originInput");
    const searchBox = new google.maps.places.SearchBox(originInput);

    // Bias the search box results towards the current map's viewport
    this.map.addListener("bounds_changed", () => {
      searchBox.setBounds(this.map.getBounds());
    });

    // Handle the places_changed event to update autocomplete predictions
    searchBox.addListener("places_changed", () => {
      initMap();
      const places = searchBox.getPlaces();
      if (places.length === 0) {
        return;
      }
      // Perform any necessary operations with the selected place
      console.log(places[0]);
    });
  }

  createCityCard(route, i) {
    if(i === 0) {
      const cityCard = document.createElement("div");
      cityCard.classList.add("route-card");

      const paragraph = document.createElement("p");
      paragraph.textContent = route.legs[i].start_address;

      cityCard.appendChild(paragraph);

      return cityCard;
    }

    // Create an information card element for the city
    const cityCard = document.createElement("div");
    cityCard.classList.add("route-card");

    // Set the content of the city card
    const paragraph = document.createElement("p");
    paragraph.textContent = route.legs[i].start_address; // writes city, country

    cityCard.appendChild(paragraph);

    // Add a click event listener to the city card
    cityCard.addEventListener("click", () => {
      const originCity = route.legs[i].start_address.split(", ")[0];
      console.log(originCity);

      // Handle the click event, perform necessary actions for the selected route segment
      console.log("Selected Route Segment: " + (i + 1));
    });

    return cityCard;
  }

  updateDates(startIndex, newDays) {
    // Get all the city cards
    const cityCards = Array.from(document.getElementsByClassName("route-card"));

    startIndex -= 1;

    console.log('startIndex', startIndex)

    
    // Start updating from the city that was changed
    for (let i = startIndex; i < cityCards.length; i++) {
        // Get the current city card
        const cityCard = cityCards[i];

        // Get the number of nights for this city


        const nightsElement = cityCard.getElementsByClassName('city-nights');
        const nights = parseInt(nightsElement.value);

        // Calculate the new departure date for this city
        let cityDepartureDate;

        if (i === startIndex) {
            console.log(startIndex)
            // If this is the city that was changed, set the new number of days
            // console.log('fulltrip', this.fullTrip);
            cityDepartureDate = new Date(this.fullTrip[startIndex].arrivalDate.getTime() + newDays * 24 * 60 * 60 * 1000);
            // Update the date display
            const dateElement = cityCard.getElementsByTagName('h3');
            console.log('dateElement', dateElement)
            dateElement.textContent = `${this.fullTrip[i].arrivalDate.toDateString()} - ${cityDepartureDate.toDateString()}`;
            console.log('cityDepartureDate', cityDepartureDate)
        } else {
            // Otherwise, calculate the departure date based on the previous city's departure date
            cityDepartureDate = new Date(this.fullTrip[i-1].departureDate.getTime() + nights * 24 * 60 * 60 * 1000);
            // Update the date display
            const dateElement = cityCard.getElementsByTagName('h3');
            dateElement.textContent = `${this.fullTrip[i-1].departureDate.toDateString()} - ${cityDepartureDate.toDateString()}`;
        }

        // Update the departure date in the fullTrip array
        // this.fullTrip[i].departureDate = cityDepartureDate;




    }
}

  calculateAndDisplayRoute(start, waypts) {
    const request = {
      origin: start,
      destination: start,
      waypoints: waypts,
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.DRIVING,
      language: 'en'
    };

    this.directionsService.route(request, (response, status) => {
      if (status === "OK") {
        this.directionsRenderer.setDirections(response);
        const route = response.routes[0];
        const summaryPanel = document.getElementById("directions-panel");
        summaryPanel.innerHTML = "";

        // console.log('summary roue', route.legs)

        var places = route.legs.map(place => place.end_address)
        console.log(places)

        this.destinations(places)

        // Display the route summary information between each city
        for (let i = 0; i < route.legs.length; i++) {

          // Create the city card
          const cityCard = this.createCityCard(route, i);

          // Append the city card to the summary panel
          summaryPanel.appendChild(cityCard);

          // Display the distance between the cities
          if (i < route.legs.length - 1) {
            const distanceCard = document.createElement("div");
            distanceCard.classList.add("distance");

            // Set the content of the distance card

            distanceCard.innerHTML = `
              <hr class="distance-line" />
              <h3 class="distance-text">${route.legs[i].distance.text}</h3>
              <hr class="distance-line" />
            `;

            // Append the distance card to the summary panel
            summaryPanel.appendChild(distanceCard);
          }
        }
      } else {
        window.alert("Directions request failed due to " + status);
      }
    });
  }

  async getImageUrl(city) {

    const apiKey = 'NYwQNKoAl2WiDnkFdwaXWyMDMPwrr-OtyV4wzJ613i8';
    const apiUrl = `https://api.unsplash.com/search/photos?client_id=${apiKey}&query=${city}&per_page=1`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    const imageUrl = data.results[0].urls.regular;
    return imageUrl;
  }

  async destinations(waypoints) {
    waypoints.unshift(waypoints[waypoints.length-1]);

    // this.fullTrip = [];
    for(let i = 0; i < waypoints.length; i++) {

      console.log(waypoints[i])
      const destination = {
        city: waypoints[i].split(', ')[0],
        country: waypoints[i].split(', ')[1],
        imageUrl: await this.getImageUrl(waypoints[i].split(', ')[0])
      }

      this.fullTrip.push(destination);
    }

    const tripSummary = {
      fullTrip: this.fullTrip,
      origin: document.getElementById("originInput").value,
      arrivalDate: document.getElementById("arrivalDateInput").value,
      departureDate: document.getElementById("departureDateInput").value,
    }
    localStorage.setItem("tripSummary", JSON.stringify(tripSummary));

    console.log(this.fullTrip);

  }

}

function initMap() {
  var map = new Map();

  const origin = document.getElementById("originInput").value;
  const arrivalDate = new Date(document.getElementById("arrivalDateInput").value);
  // const departureDate = new Date(document.getElementById("departureDateInput").value);

  const start = origin || "Brussels";

  const waypts = bot.chosenDests.map((dest) => {
    return {
      location:dest.destination.split(", ")[0],
      stopover: true,
    };
  });

  // map.destinations(waypts, arrivalDate);

  map.calculateAndDisplayRoute(start, waypts);
}

window.initMap = initMap;
