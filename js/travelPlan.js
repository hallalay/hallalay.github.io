class Map {
  constructor(options) {
    const {
      directionsService, directionsRenderer, mapElement, searchBoxElement,
    } = options;

    this.directionsService = directionsService || new google.maps.DirectionsService();
    this.directionsRenderer = directionsRenderer || new google.maps.DirectionsRenderer();

    this.map = new google.maps.Map(mapElement, {
      zoom: 100,
      center: { lat: 50.8503, lng: 4.3517 },
      disableDefaultUI: true,
    });

    this.directionsRenderer.setMap(this.map);
    this.fullTrip = [];

    const searchBox = new google.maps.places.SearchBox(searchBoxElement);
    this.initializeSearchBox(searchBox);
  }

  initializeSearchBox(searchBox) {
    this.map.addListener('bounds_changed', () => {
      searchBox.setBounds(this.map.getBounds());
    });

    searchBox.addListener('places_changed', () => {
      initMap();
      const places = searchBox.getPlaces();
      if (places.length === 0) return;
      console.log(places[0]);
    });
  }

  createCityCard(route, i) {
    const cityCard = document.createElement('div');
    cityCard.classList.add('route-card');
    const paragraph = document.createElement('p');
    paragraph.textContent = route.legs[i].start_address;
    cityCard.appendChild(paragraph);

    if (i !== 0) {
      cityCard.addEventListener('click', () => {
        const originCity = route.legs[i].start_address.split(', ')[0];
        console.log(originCity);
        console.log(`Selected Route Segment: ${i + 1}`);
      });
    }

    return cityCard;
  }

  calculateAndDisplayRoute(start, waypts) {
    const request = {
      origin: start,
      destination: start,
      waypoints: waypts,
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.DRIVING,
      language: 'en',
    };

    this.directionsService.route(request, (response, status) => {
      if (status === 'OK') {
        this.directionsRenderer.setDirections(response);
        const route = response.routes[0];
        const summaryPanel = document.getElementById('directions-panel');
        summaryPanel.innerHTML = '';

        // console.log('summary roue', route.legs)

        const places = route.legs.map((place) => place.end_address);
        console.log(places);

        this.destinations(places);

        // Display the route summary information between each city
        for (let i = 0; i < route.legs.length; i++) {
          // Create the city card
          const cityCard = this.createCityCard(route, i);

          // Append the city card to the summary panel
          summaryPanel.appendChild(cityCard);

          // Display the distance between the cities
          if (i < route.legs.length - 1) {
            const distanceCard = document.createElement('div');
            distanceCard.classList.add('distance');

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
        window.alert(`Directions request failed due to ${status}`);
      }
    });
  }

  async destinations(waypoints) {
    waypoints.unshift(waypoints[waypoints.length - 1]);

    // this.fullTrip = [];
    for (let i = 0; i < waypoints.length; i++) {
      console.log(waypoints[i]);
      const destination = {
        city: waypoints[i].split(', ')[0],
        country: waypoints[i].split(', ')[1],
        imageUrl: await APIHandler.getImageUrl(waypoints[i].split(', ')[0]),
      };

      this.fullTrip.push(destination);
    }

    const tripSummary = {
      fullTrip: this.fullTrip,
      origin: document.getElementById('originInput').value,
      arrivalDate: document.getElementById('arrivalDateInput').value,
      // departureDate: document.getElementById("departureDateInput").value,
    };
    localStorage.setItem('tripSummary', JSON.stringify(tripSummary));

    console.log(this.fullTrip);
  }
}

function initMap() {
  const mapOptions = {
    mapElement: document.getElementById('map'),
    searchBoxElement: document.getElementById('originInput'),
  };

  const map = new Map(mapOptions);

  const origin = document.getElementById('originInput').value;
  const start = origin || 'Brussels';
  const waypts = chosenDests.map((dest) => ({
    location: dest.destination.split(', ')[0],
    stopover: true,
  }));

  map.calculateAndDisplayRoute(start, waypts);
}

window.initMap = initMap;
