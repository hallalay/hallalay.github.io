// Function to load SVG content into the modal
function loadSvgIntoModal(svgData) {
  const svgContainer = document.getElementById('svgContainer');
  svgContainer.innerHTML = svgData;

  // Add the 'modal-open' class to the body to disable scrolling
  document.body.classList.add('modal-open');
}

// Function to close the modal and enable scrolling
function closeModal() {
  // Remove the 'modal-open' class from the body to enable scrolling
  document.body.classList.remove('modal-open');

  // Hide the modal
  mapModal.style.display = 'none';
}

// Fetch the SVG content and load it into the modal when the button is clicked
const openModalBtn = document.getElementById('openModalBtn');
const mapModal = document.getElementById('mapModal');

openModalBtn.addEventListener('click', () => {
  // Show the modal
  mapModal.style.display = 'block';
});

// Add click event listener to the modal close button (if you have one)
const closeButton = document.getElementById('closeModalBtn'); // Replace with the ID of your close button
if (closeButton) {
  closeButton.addEventListener('click', () => {
    closeModal();
  });
}

function handleRegionClick(regionName) {
  console.log('Clicked on region:', regionName);

  // Toggle the 'active' class on the clicked region
  const region = document.getElementById(regionName);
  region.classList.toggle('active');
}

// Add click event listeners to each region
const regions = document.querySelectorAll('.region-group');
regions.forEach((region) => {
  const regionName = region.getAttribute('id');
  region.addEventListener('click', () => {
    handleRegionClick(regionName);
  });
});
