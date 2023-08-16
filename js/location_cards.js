const colors = ['#ff8014', '#20b37b', '#86bae0'];

const globalTripSummaryData = localStorage.getItem('tripSummary');
const globalSummary = JSON.parse(globalTripSummaryData);
// Function to get train details and suggestions
const moreDestinations = function (index) {
  currentlySelectedIndex = index; // Store the index for later use when adding to trip
  document.getElementById('destinationModal').style.display = 'block';
};

const addToTrip = function () {
  const tripSummaryData = localStorage.getItem('tripSummary');
  const Summary = JSON.parse(tripSummaryData);
  const trips = Summary.fullTrip;

  const newDestination = {
    city: 'Paris',
    country: 'France',
    imageUrl: 'path_to_paris_image.jpg',
  };

  trips.splice(currentlySelectedIndex, 0, newDestination);

  // Update local storage
  localStorage.setItem('tripSummary', JSON.stringify({ fullTrip: trips }));

  // Reload the page
  location.reload();
};

function renderSlider(trips, departure) {
  const slideContainer = $('.w-slider-mask');

  const slideHTML = '<div class="location-slide w-slide"><div class="div-block paris"></div></div>';
  const currentDate = new Date('2023-05-20'); // Initial date

  slideContainer.empty();

  slideContainer.append(slideHTML);

  console.log(trips);
  console.log(slideContainer);

  trips.forEach((trip, index) => {
    if (index === 0) {
      return;
    }

    if (index === trips.length - 1) {
      const lastHtml = `
            <div class="train">
                <h4>${currentDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</h4>
                <img src="images/train.png" loading="lazy" sizes="(max-width: 479px) 15vw, (max-width: 767px) 8vw, 50px" srcset="images/train.png 500w, images/train.png 512w" alt="" class="image-3">
                <button class='book' onClick='journeyButtonClicked(${index})'>Tickets</button>
            
            </div>
            `;

      slideContainer.find('.location-slide.w-slide').last().find('.div-block.paris').append(lastHtml); // append to the last slide

      return;
    }

    const tripHTML = `
        <div class="train">
            <button class='more' onClick='moreDestinations(${index})'>More Destinations</button>
            <h4>${currentDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</h4>
            <img src="images/train.png" loading="lazy" sizes="(max-width: 479px) 15vw, (max-width: 767px) 8vw, 50px" srcset="images/train.png 500w, images/train.png 512w" alt="" class="image-3">
            <button class='book' onClick='journeyButtonClicked(${index})'>Tickets</button>

        </div>
        <div data-w-id="0f35f371-1ea1-c9a2-b522-b1c8daa51732" class="destination-card" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="${index * 100}">
            <input type="number" onchange="updateDates()" min="1" value="1">
            <div class="card">
                <div class="card-front" style="background-image: url('${trip.imageUrl}'); background-size: cover; background-position: center;">
                    <h2 class="card-heading">${trip.city}, ${trip.country}</h2>
                </div>
                <div class="card-back" style='background-color: ${colors[index % 3]}'>
                    <h3 style='color: white'>${trip.city}, ${trip.country}</h3>
                    <div style='color: white'>${trip.city}<br>‍</div>
                </div>
            </div>
        </div>
        `;

    // If the last slide has 3 cities, append a new slide
    if (slideContainer.find('.location-slide.w-slide').last().find('.destination-card').length === 3) {
      slideContainer.append(slideHTML);
    }

    slideContainer.find('.location-slide.w-slide').last().find('.div-block.paris').append(tripHTML); // append to the last slide
  });
}

// Function to update the dates based on input values
const updateDates = function () {
  const currentDate = new Date('2023-05-20'); // Initial date

  const inputs = document.querySelectorAll('.destination-card input');
  let accumulatedDays = 0;

  inputs.forEach((input, index) => {
    const daysToAdd = parseInt(input.value);
    accumulatedDays += daysToAdd;
    const tripDate = new Date(currentDate.getTime());
    tripDate.setDate(currentDate.getDate() + accumulatedDays);
    const tripDateString = tripDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });

    if (index < inputs.length - 1) {
      document.querySelectorAll('.train h4')[index + 1].textContent = tripDateString;
    }
  });

  // Add the last date after all the trips
  const lastDate = new Date(currentDate.getTime());
  lastDate.setDate(currentDate.getDate() + accumulatedDays);
  const lastDateString = lastDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  document.querySelector('.train:last-child h4').textContent = lastDateString;
};

$(document).ready(() => {
  const tripSummaryData = localStorage.getItem('tripSummary');
  const Summary = JSON.parse(tripSummaryData);

  const trips = Summary.fullTrip;

  renderSlider(trips, Summary.departureDate);
  updateDates();
  $.getScript('js/webflowForView.js');
});
