document.addEventListener('DOMContentLoaded', () => {
  const BASE_URL = 'https://bonvoyai-176378383e73.herokuapp.com';
  //   const BASE_URL = 'http://localhost:3000';

  const loginForm = document.getElementById('login-form');
  const messageDiv = document.getElementById('message');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('log-in-email').value;
    const password = document.getElementById('log-in-password').value;

    const response = await sendRequest(`${BASE_URL}/auth/login`, { username, password });

    const feedbackMessage = response.error ? response.error : response.message;

    displayMessage(feedbackMessage);
  });

  async function sendRequest(url, data) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      return await response.json();
    } catch (err) {
      return { message: 'Error occurred. Please try again.' };
    }
  }

  function displayMessage(message) {
    messageDiv.innerText = message;
    setTimeout(() => {
      messageDiv.innerText = '';
    }, 3000); // Clear message after 3 seconds
  }
});
