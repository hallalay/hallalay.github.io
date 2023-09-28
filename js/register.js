document.addEventListener('DOMContentLoaded', () => {
  const BASE_URL = 'https://bonvoyai-176378383e73.herokuapp.com';
  //   const BASE_URL = 'http://localhost:3000';

  const registerForm = document.getElementById('register-form');
  const messageDiv = document.getElementById('message');

  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('sign-up-email').value;
    const name = document.getElementById('sign-up-name').value;
    const password = document.getElementById('sign-up-password').value;
    const acceptPrivacy = document.getElementById('sign-up-accept-privacy').checked;
    const acceptCommunication = document.getElementById('sign-up-accept-communications').checked;

    const requestData = {
      email,
      name,
      password,
      acceptPrivacy,
      acceptCommunication,
    };

    const response = await sendRequest(`${BASE_URL}/auth/register`, requestData);

    // Check if the response has an "error" property and use it; otherwise, use "message"
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
