function findUIC(cityName) {
  const formattedCityName = cityName.toLowerCase().replace(/\s/g, '').replace(/[^\w\s]/g, '');

  // Fetch the CSV file
  return fetch('data/valid_uics.csv')
    .then((response) => response.text())
    .then((csvData) => {
      const rows = csvData.split('\n').slice(1);

      const foundRow = rows.find((row) => {
        const columns = row.split(';');
        const rowCityName = columns[0].toLowerCase().replace(/\s/g, '').replace(/[^\w\s]/g, '');
        return rowCityName.includes(formattedCityName);
      });

      if (foundRow) {
        return parseFloat(foundRow.split(';')[3]);
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

    // console.log(fromUIC);

    const url = generateTimetableURL(from, fromUIC, to, toUIC, date);

    // console.log(url);

    window.open(url);
    // return interrailUrl
  } catch (error) {
    console.error('Error:', error);
  }
}
