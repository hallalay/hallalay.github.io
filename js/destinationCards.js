class DestinationCardHandler {
  constructor(uiHandlerInstance) {
    this.responseOutput = document.getElementById('response-output');
    this.uiHandler = uiHandlerInstance;
  }

  moveDestination(container, destination, motivation) {
    container.classList.add('move-destination');

    setTimeout(() => {
      container.remove();
      recommendedDests = recommendedDests.filter((dest) => dest.destination !== destination);
      chosenDests.push({ destination, motivation });
      // this.displayChosenDestinations(chosenDests, recommendedDests);
    		initMap();
    }, 500);
  }

  // Generate and display clickable boxes of this.recommendedDests
  async displayDestinations(recommendedDestinations) {
    if (!Array.isArray(recommendedDestinations) || recommendedDestinations.length === 0) {
      this.responseOutput.textContent = 'No valid travel destinations found.';
      return;
    }

    this.responseOutput.innerHTML = '';

    recommendedDestinations.forEach(async ({ destination, motivation }) => {
      const container = this.createDestinationContainer(destination, motivation);
      container.addEventListener('click', () => this.moveDestination(container, destination, motivation));

      const imageUrl = await APIHandler.getImageUrl(destination.split(', ')[0]);
      this.setBackgroundImage(container, imageUrl);

      const overlay = this.createOverlay();
      container.appendChild(overlay);

      const destinationElement = this.createDestinationElement(destination);
      container.appendChild(destinationElement);

      const motivationElement = this.createMotivationElement(motivation);
      container.appendChild(motivationElement);

      const infoButton = this.createInformationButton(destination);
      container.appendChild(infoButton);

      this.responseOutput.appendChild(container);
    });
  }

  openModalWithSummary(summary) {
    const modal = document.getElementById('infoModal');
    const citySummaryElement = document.getElementById('citySummary');
    const closeModalButton = document.querySelector('.close-button');

    // Add event listener to close the modal
    closeModalButton.onclick = () => {
      modal.style.display = 'none';
    };

    // Add event listener to close the modal when clicking outside of it
    window.onclick = (event) => {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    };

    citySummaryElement.textContent = summary;
    modal.style.display = 'block';
  }

  async fetchCitySummary(destination) {
    try {
      const cityName = destination.split(',')[0].trim();
      const endpoint = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&format=json&origin=*&titles=${cityName}`;
      const response = await fetch(endpoint);
      const jsonData = await response.json();

      console.log(response);

      // Extract the summary from the JSON response
      const { pages } = jsonData.query;
      const pageId = Object.keys(pages)[0];
      return pages[pageId].extract;
    } catch (error) {
      console.error('Error fetching city summary:', error);
      return null;
    }
  }

  async informationClick(destination, event) {
    event.stopPropagation();
    const summary = await this.fetchCitySummary(destination); // Notice the "this." here
    this.openModalWithSummary(summary); // Open modal with the summary
    // You can then populate this summary in a modal or display it as needed
  }

  createInformationButton(destination) {
    const infoButton = document.createElement('button');
    infoButton.textContent = 'i';
    infoButton.classList.add('info-button');
    infoButton.addEventListener('click', (event) => this.informationClick(destination, event));
    return infoButton;
  }

  createDestinationContainer() {
    const container = document.createElement('div');
    container.classList.add('destination-container');
    return container;
  }

  setBackgroundImage(container, imageUrl) {
    container.style.setProperty('background-image', `url('${imageUrl}')`);
    container.style.setProperty('background-position', 'center');
    container.style.setProperty('background-size', 'cover');
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
}
