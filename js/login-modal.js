function loadLoginModal() {
  fetch('login-modal.html')
    .then((response) => response.text())
    .then((content) => {
      document.body.insertAdjacentHTML('beforeend', content);
      attachModalListeners();
    });
}

function attachModalListeners() {
  const loginModal = document.getElementById('loginModal');
  const registerModal = document.getElementById('registerModal');
  const closeBtns = document.querySelectorAll('.login-close-btn');
  const goToRegister = document.getElementById('go-to-register');
  const goToLogin = document.getElementById('go-to-login');
  const togglePasswordButtons = document.querySelectorAll('.toggle-password');

  togglePasswordButtons.forEach((btn) => {
    btn.addEventListener('click', function () {
      const passwordInput = document.querySelector(this.getAttribute('toggle'));
      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        this.classList.remove('fa-eye');
        this.classList.add('fa-eye-slash');
      } else {
        passwordInput.type = 'password';
        this.classList.remove('fa-eye-slash');
        this.classList.add('fa-eye');
      }
    });
  });

  // Show the modal when the login button is clicked
  const loginButtons = document.querySelectorAll('.loginButton');
  loginButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      loginModal.style.display = 'block';
    });
  });

  // Close the modal when the close button (x) is clicked
  closeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      loginModal.style.display = 'none';
      registerModal.style.display = 'none';
    });
  });

  // switch to register modal
  goToRegister.addEventListener('click', () => {
    loginModal.style.display = 'none';
    registerModal.style.display = 'block';
  });

  // switch to register modal
  goToLogin.addEventListener('click', () => {
    loginModal.style.display = 'block';
    registerModal.style.display = 'none';
  });

  // Close the modal if clicked outside of the modal content
  window.addEventListener('click', (event) => {
    if (event.target === loginModal) {
      loginModal.style.display = 'none';
    }
    if (event.target === registerModal) {
      registerModal.style.display = 'none';
    }
  });
  loginSendToServer();
  registerSendToServer();
}

// Load the modal when the document is ready (or at another appropriate time)
document.addEventListener('DOMContentLoaded', loadLoginModal);

function loginSendToServer() {
  // const BASE_URL = 'https://bonvoyai-176378383e73.herokuapp.com';
  const BASE_URL = 'http://localhost:3000';

  const loginForm = document.getElementById('login-form');
  const messageDiv = document.getElementById('server-login-message');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('log-in-email').value;
    const password = document.getElementById('log-in-password').value;

    console.log(email, password);

    const response = await sendRequest(`${BASE_URL}/auth/login`, { email, password });

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
}

function registerSendToServer() {
  // const BASE_URL = 'https://bonvoyai-176378383e73.herokuapp.com';
  const BASE_URL = 'http://localhost:3000';

  const registerForm = document.getElementById('register-form');
  const messageDiv = document.getElementById('server-register-message');

  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('register-email').value;
    const name = document.getElementById('register-name').value;
    const password = document.getElementById('register-password').value;
    const acceptPrivacy = document.getElementById('accept-terms').checked;
    const acceptCommunication = document.getElementById('accept-communication').checked;

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
}
