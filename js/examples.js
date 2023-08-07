const examplePrompts = [
  {
    name: 'Adventure and Nightlife',
    prompt: 'I\'m an adventurous traveler who loves exploring vibrant cities and experiencing the local nightlife. I enjoy trying different cuisines and discovering hidden culinary gems. Alongside city adventures, I\'m also interested in outdoor activities like biking or kayaking. I appreciate a mix of cultural landmarks and natural beauty. Based on these preferences, what destinations would you recommend for an exciting and diverse trip?',
  },
  {
    name: 'Cultural Immersion',
    prompt: 'I\'m a culture enthusiast seeking immersive experiences. I enjoy visiting historical sites, exploring local traditions, and interacting with the local community. I\'m particularly interested in destinations with rich cultural heritage and authentic experiences. Where should I go to immerse myself in the local culture and traditions?',
  },
  {
    name: 'Relaxation and Wellness',
    prompt: 'I\'m in need of relaxation and rejuvenation. I\'m interested in wellness retreats, spa destinations, and places known for their tranquil atmosphere. I seek destinations that offer opportunities for self-care, mindfulness, and rejuvenation. Where can I go to nourish my mind, body, and soul?',
  },
  {
    name: 'Food Exploration',
    prompt: 'I\'m a foodie on a culinary journey. I love exploring different food cultures, trying local delicacies, and discovering hidden gastronomic gems. Whether it\'s street food, Michelin-starred restaurants, or food markets, I\'m always seeking memorable dining experiences. Which destinations should be on my food lover\'s itinerary?',
  },
  {
    name: 'Offbeat Adventures',
    prompt: 'I\'m an adventurous traveler looking for off-the-beaten-path destinations and unique experiences. I enjoy exploring remote locations, discovering hidden gems, and getting away from the crowds. If I want to embark on extraordinary adventures and discover lesser-known destinations, where should I go to satisfy my wanderlust?',
  },
  {
    name: 'Family-Friendly Fun',
    prompt: 'I\'m a family traveler planning a memorable trip with my children. I\'m looking for family-friendly destinations that offer a range of activities suitable for kids, such as theme parks, interactive museums, and outdoor adventures. If I want to create unforgettable memories with my family, where should we go for a fun-filled and kid-friendly vacation?',
  },
  {
    name: 'Culinary Exploration',
    prompt: 'I\'m a foodie on a culinary journey. I love exploring different food cultures, trying local delicacies, and discovering hidden gastronomic gems. Whether it\'s street food, Michelin-starred restaurants, or food markets, I\'m always seeking memorable dining experiences. Which destinations should be on my food lover\'s itinerary?',
  },
  {
    name: 'Budget Adventures',
    prompt: 'I\'m a budget-conscious traveler looking for affordable adventures. I enjoy finding great deals, exploring off-the-beaten-path destinations, and immersing myself in the local culture without breaking the bank. If I want to experience unforgettable adventures on a budget, where should I go to maximize value for money?',
  },
  {
    name: 'Wellness Retreat',
    prompt: 'I\'m a wellness seeker in need of relaxation and rejuvenation. I\'m interested in wellness retreats, yoga and meditation centers, and spa destinations. I seek destinations that offer a peaceful environment, holistic healing practices, and opportunities for self-care. Where can I go to nourish my mind, body, and soul?',
  },
  {
    name: 'Music and Arts Exploration',
    prompt: 'I\'m a music and arts lover looking for vibrant cultural experiences. I enjoy attending music festivals, visiting art galleries, and exploring creative neighborhoods. I\'m interested in destinations known for their music scenes, street art, and artistic communities. Which cities or events should be on my itinerary to immerse myself in the world of arts and culture?',
  },
  {
    name: 'Family Fun',
    prompt: 'I\'m a family traveler planning a memorable trip with my children. I\'m looking for family-friendly destinations that offer a range of activities suitable for kids, such as theme parks, interactive museums, and outdoor adventures. If I want to create unforgettable memories with my family, where should we go for a fun-filled and kid-friendly vacation?',
  },

];

const exampleContainer = document.querySelector('.example-container');

// Create example buttons
examplePrompts.forEach((example, index) => {
  const button = document.createElement('button');
  button.classList.add('example-button');

  const name = document.createElement('h3');
  name.textContent = example.name;

  const prompt = document.createElement('p');
  prompt.textContent = example.prompt;

  button.appendChild(name);
  button.appendChild(prompt);

  button.addEventListener('click', () => {

  });
  exampleContainer.appendChild(button);
});

// Get reference to the prompt input textarea
const promptInput = document.getElementById('prompt-input');

// Add click event listener to each example button
const exampleButtons = document.querySelectorAll('.example-button');
exampleButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const buttonText = button.querySelector('p').textContent;
    promptInput.value = buttonText;
  });
});
