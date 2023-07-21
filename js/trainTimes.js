function findUIC(cityName) {
    const formattedCityName = cityName.toLowerCase().replace(/\s/g, '').replace(/[^\w\s]/g, '');
  
    return fetch('./files/filtered_data.csv')
      .then(response => response.text())
      .then(csvData => {
        const rows = csvData.split('\n').slice(1);
        console.log (formattedCityName);
  
        for (const row of rows) {
          const columns = row.split(';');
          const rowCityName = columns[0].toLowerCase().replace(/\s/g, '').replace(/[^\w\s]/g, '');
    
          if (rowCityName === formattedCityName) {
            console.log (columns[3]);
            return parseFloat(columns[3]);
          } else if (rowCityName.includes(formattedCityName)) {
            console.log (columns[3]);
            return parseFloat(columns[3]);
          }
        }
  
        return null;
      })
      .catch(error => {
        console.error('Error loading CSV file:', error);
        return null;
      });
  }
  
  function generateTimetableURL(origin, originCode, destination, destinationCode, date) {
    const dateObj = new Date(date);
    const timestamp = dateObj.getTime();
  
    return `https://www.interrail.eu/en/plan-your-trip/interrail-timetable?ol=${encodeURIComponent(
      origin
    )}+${encodeURIComponent(originCode)}&ov=${originCode}&dl=${encodeURIComponent(
      destination
    )}+${encodeURIComponent(destinationCode)}&dv=${destinationCode}&vl=&vv=&t=${timestamp}&ar=false&rt=&tt=&mc=&mct=0`;
  }
  
// Usage example
const originCity = 'Paris';
const destinationCity = 'Berlin';

findUIC(originCity)
.then(originUICCode => {
    if (originUICCode !== null) {
    return findUIC(destinationCity)
        .then(destinationUICCode => {
        if (destinationUICCode !== null) {
            const timetableURL = generateTimetableURL(originCity, originUICCode, destinationCity, destinationUICCode, '2023-07-15');
            console.log('Timetable URL:', timetableURL);
        } else {
            console.log('Destination city not found.');
        }
        });
    } else {
    console.log('Origin city not found.');
    }
})
.catch(error => {
    console.error('Error:', error);
});
  