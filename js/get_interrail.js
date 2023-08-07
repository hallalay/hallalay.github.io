const data = localStorage.getItem('tripSummary');
const tripSummary = JSON.parse(data);
console.log(tripSummary);

const origin = document.createElement('p');
origin.innerHTML = `Origin: ${tripSummary.origin}`;
document.body.appendChild(origin);

const dates = document.createElement('p');
dates.innerHTML = `Arrival Date: ${
  tripSummary.arrivalDate
}<br> Departure Date: ${
  tripSummary.departureDate}`;
document.body.appendChild(dates);

const { fullTrip } = tripSummary;

// Create button for origin to first destination

const originToFirst = document.createElement('button');
originToFirst.innerHTML = `${tripSummary.origin} to ${fullTrip[0].city} date: ${new Date(tripSummary.arrivalDate)}`;
originToFirst.addEventListener('click', () => {
  journeyButtonClicked(tripSummary.origin, fullTrip[0].city, tripSummary.arrivalDate);

  // alert("Button clicked for journey: " + tripSummary.origin + " to " + fullTrip[0].city);
  // Add your desired functionality for the button click event
});
document.body.appendChild(originToFirst);

for (let i = 0; i < fullTrip.length - 1; i++) {
  const journey1 = fullTrip[i];
  const journey2 = fullTrip[i + 1];

  (function (journey1, journey2) { // Create a new scope using a closure
    const journeyButton = document.createElement('button');
    journeyButton.innerHTML = `${journey1.city} to ${journey2.city} date: ${new Date(journey1.departureDate)}`;
    journeyButton.addEventListener('click', async () => {
      await journeyButtonClicked(journey1.city, journey2.city, journey2.arrivalDate);
    });
    document.body.appendChild(journeyButton);
  }(journey1, journey2)); // Pass journey1 and journey2 as arguments to the closure function
}

// Create button for last destination back to origin
const lastToOrigin = document.createElement('button');
lastToOrigin.innerHTML = `${fullTrip[fullTrip.length - 1].city} to ${tripSummary.origin} date: ${new Date(tripSummary.departureDate)}`;
lastToOrigin.addEventListener('click', () => {
  journeyButtonClicked(fullTrip[fullTrip.length - 1].city, tripSummary.origin, tripSummary.departureDate);
});
document.body.appendChild(lastToOrigin);

function findUIC(cityName) {
  const formattedCityName = cityName.toLowerCase().replace(/\s/g, '').replace(/[^\w\s]/g, '');

  // Fetch the CSV file
  return fetch('data/valid_uics.csv')
    .then((response) => response.text())
    .then((csvData) => {
      const rows = csvData.split('\n').slice(1);

      for (const row of rows) {
        const columns = row.split(';');
        const rowCityName = columns[0].toLowerCase().replace(/\s/g, '').replace(/[^\w\s]/g, '');

        if (rowCityName.includes(formattedCityName)) {
          return parseFloat(columns[3]);
        }
      }

      return null;
    })
    .catch((error) => {
      console.error('Error reading CSV file:', error);
      return null;
    });
}

function generateTimetableURL(origin, originCode, destination, destinationCode, date) {
  // Create a new Date object by specifying the components of the date and time
  const dateObj = new Date(date);
  const timestamp = dateObj.getTime();

  return `https://www.interrail.eu/en/plan-your-trip/interrail-timetable?ol=${encodeURIComponent(
    origin,
  )}+${encodeURIComponent(originCode)}&ov=${originCode}&dl=${encodeURIComponent(
    destination,
  )}+${encodeURIComponent(destinationCode)}&dv=${destinationCode}&vl=&vv=&t=${timestamp}&ar=false&rt=&tt=&mc=&mct=0`;
}

// const url = generateTimetableURL(origin, originCode, destination, destinationCode, date);

async function journeyButtonClicked(index) {
  try {
    const from = fullTrip[index - 1].city;
    const to = fullTrip[index].city;
    const date = new Date(tripSummary.departureDate);

    const fromUIC = await findUIC(from);
    const toUIC = await findUIC(to);

    console.log(fromUIC);

    const url = generateTimetableURL(from, fromUIC, to, toUIC, date);

    console.log(url);

    window.open(url);
    // return interrailUrl
  } catch (error) {
    console.error('Error:', error);
  }
}
