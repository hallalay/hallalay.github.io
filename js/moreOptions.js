function toggleMoreOptions() {
  const moreOptionsButton = document.getElementById('moreOptions');
  moreOptionsButton.classList.toggle('active');

  const moreOptionsContainer = document.getElementById('moreOptions-container');
  if (moreOptionsContainer.style.display === 'none') {
    moreOptionsContainer.style.display = 'flex';
  } else {
    moreOptionsContainer.style.display = 'none';
  }
}

const moreOptions = [
  'Sightseeing', 'Beach', 'Parks', 'Culture', 'Adventure', 'Nature', 'Relaxation',
  'Spa', 'Shopping', 'Nightlife', 'City Tour', 'History', 'Romantic', 'Museum', 'Food', 'Hiking',
  'Architecture', 'Landmarks', 'Camping', 'Water Sports', 'Wildlife', 'Photography', 'Music',
  'Scenic Drives', 'Outdoor Activities', 'Art', 'Wine Tasting', 'Local Cuisine', 'Sunset Views',
  'Boating', 'Historical Sites', 'Gardens', 'Zoo', 'Birdwatching',
];

// add more if wanted

const moreOptionsContainer = document.getElementById('moreOptions-container');

moreOptions.forEach((name) => {
  const button = document.createElement('button');
  button.className = 'option-buttons';
  button.innerHTML = name.toUpperCase();
  moreOptionsContainer.appendChild(button);

  button.addEventListener('click', () => {
    button.classList.toggle('active');
    console.log('hello');
  });
});
