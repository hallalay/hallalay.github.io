document.getElementById('loginForm').addEventListener('submit', function (event) {
  event.preventDefault();

  const formData = new FormData(this);
  const data = {};
  formData.forEach((value, key) => { data[key] = value; });

  console.log(data);
//   fetch('https://your-heroku-app-url/login', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(data),
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       if (data.success) {
//         // Handle successful login, maybe redirect to another page or show a message
//         window.location.href = '/dashboard.html';
//       } else {
//         // Handle error, show an error message to the user
//         alert(data.message);
//       }
//     })
//     .catch((error) => {
//       console.error('Error:', error);
//       alert('An error occurred. Please try again.');
//     });
});
