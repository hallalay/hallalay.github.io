class APIHandler {
  constructor() {
    this.HEROKU_URL = 'https://bonvoyai-176378383e73.herokuapp.com/openai';
  }

  async callGpt(message) {
    const requestBody = {
      message,
    };

    // Post the request to your Heroku backend
    const response = await fetch(this.HEROKU_URL, { // assuming this.HEROKU_URL contains the endpoint on your Heroku app
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    // Parse the response
    const data = await response.json();
    // console.log('Data from server:', data);

    // Extract the relevant text. You might need to adjust this based on the exact structure of the response from your server

    // const text = data.choices[0].message.content;

    return data;
  }

  static async getImageUrl(city) {
    const apiKey = 'NYwQNKoAl2WiDnkFdwaXWyMDMPwrr-OtyV4wzJ613i8';
    const apiUrl = `https://api.unsplash.com/search/photos?client_id=${apiKey}&query=${city}&per_page=1`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    const imageUrl = data.results[0].urls.regular;
    return imageUrl;
  }
}
