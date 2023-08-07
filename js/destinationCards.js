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

      this.responseOutput.appendChild(container);
    });
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
