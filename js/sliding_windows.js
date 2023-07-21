// JavaScript code for sliding window with different categories and choices

const categories = [
    {
      name: 'Accommodation',
      choices: [
        'Luxury hotels',
        'Budget-friendly accommodations',
        'Unique and quirky stays (e.g., treehouses, castles)',
        'All-inclusive resorts',
        'Eco-friendly or sustainable accommodations'
      ]
    },
    {
      name: 'Travel Style',
      choices: [
        'Adventure and outdoor activities',
        'Relaxation and spa retreats',
        'Cultural and historical exploration',
        'Food and culinary experiences',
        'Road trips or self-guided tours'
      ]
    },
    {
      name: 'Climate or Season',
      choices: [
        'Warm and tropical destinations',
        'Cold and snowy destinations',
        'Mild and moderate climates',
        'Springtime or cherry blossom destinations',
        'Fall foliage or autumn destinations'
      ]
    },
    // {
    //   name: 'Cuisine',
    //   choices: [
    //     'Local and traditional cuisine',
    //     'Vegetarian or vegan options',
    //     'Gluten-free or allergen-friendly choices',
    //     'Fine dining experiences',
    //     'Street food and local markets'
    //   ]
    // },
    // {
    //   name: 'Interests or Hobbies',
    //   choices: [
    //     'Wildlife and nature',
    //     'Art and museums',
    //     'Shopping and fashion',
    //     'Music festivals or concerts',
    //     'Sports or sporting events'
    //   ]
    // },
    {
      name: 'uniqueness',
      choices: [
        'Commonplace - Easily Accessible and Popular Destinations',
        'Mildly Unique - Somewhat Off the Beaten Path, Yet Tourist-friendly',
        'Moderately Unique - Emerging Gems with Growing Tourism Appeal',
        'Highly Unique - Exclusive and Unspoiled Destinations with Limited Access',
        // 'Extraordinarily Unique - Legendary and Coveted Bucket List Destinations'
      ]
      }
  ];

moreOptions = ['Sightseeing', 'Beach', 'Parks', 'Culture', 'Adventure', 'Nature', 'Relaxation', 
'Spa', 'Shopping', 'Nightlife', 'City Tour', 'History', 'Romantic', 'Museum', 'Food', 'Hiking',
'Architecture', 'Landmarks', 
] // add more if wanted

const summary = {
    name: 'Summary',
    choices: []
}
  
const slidesContainer = document.querySelector('.slide-container-questions');

// Create slides for each category
categories.forEach((category, index) => {
    const slide = document.createElement('div');
    slide.classList.add('slide');

    const categoryTitle = document.createElement('h1');
    categoryTitle.textContent = category.name;
    slide.appendChild(categoryTitle);

    const choicesContainer = document.createElement('div');
    choicesContainer.classList.add('choices-container');

    // Create buttons for choices in each category
    category.choices.forEach(choice => {
        const choiceButton = document.createElement('button');
        choiceButton.classList.add('choice-button');
        choiceButton.textContent = choice;
        choiceButton.addEventListener('click', () => {
        // Store the selected choice and move to the next slide
        storeChoice(category.name, choice);
        nextSlide();
        });

        choicesContainer.appendChild(choiceButton);
    });

    slide.appendChild(choicesContainer);
    slidesContainer.appendChild(slide);
});

backtracking = false;

const slides = document.querySelectorAll('.slide');
let currentSlide = 0;
const choices = {};

function storeChoice(category, choice) {
  choices[category] = choice;

  if (backtracking) {
    const summaryElement = document.querySelector('.slide-container-questions .slide:last-child');
    summaryElement.classList.add('active');
    const changingSlide = document.querySelector('.slide-container-questions .slide.active');
    changingSlide.classList.add('visited');
    backtracking = false;
  }
}

function showSlide(slideIndex) {
slides.forEach((slide, index) => {
    if (index === slideIndex) {
    slide.classList.add('active');
    } else if (index < slideIndex) {
    slide.classList.add('visited');
    } else {
    slide.classList.remove('active');
    }
});
}

function showSummary() {
    const summaryContainer = document.querySelector('.slide-container-questions');

    const summaryElement = document.createElement('div');
    summaryElement.classList.add('slide');

    const categoryTitle = document.createElement('h1');
    categoryTitle.textContent = summary.name;
    summaryElement.appendChild(categoryTitle);

    const choicesContainer = document.createElement('div');
    choicesContainer.classList.add('choices-container');

    console.log(summary.choices);

    Object.keys(choices).forEach((category, index) => {
      const choiceButton = document.createElement('button');
      choiceButton.classList.add('choice-button');
      choiceButton.textContent = choices[category];

    
      // Add event listener to the button
      choiceButton.addEventListener('click', () => {
        // currentSlide -= 1;

        slides[index].classList.remove('visited');
        summaryElement.classList.remove('active');

        backtracking = true;

        

      });
    
      // Enumerate the loop by adding an index to the button's id
    
      choicesContainer.appendChild(choiceButton);
    });

    summaryElement.appendChild(choicesContainer);
    summaryContainer.appendChild(summaryElement);

    return summaryElement;
}

function nextSlide() {
currentSlide++;
if (currentSlide >= slides.length) {

  const summaryElement = showSummary();

  // showSlide(currentSlide);
  const slide = slides[currentSlide-1];
  slide.classList.add('visited');

  setTimeout(function() {
    summaryElement.classList.add('active');
  }, 0);

  bot.preferences = choices; // set the preferences for the prompt

  // console.log(bot.preferences['Interests or Hobbies']); 
  var preferences = ''

  for (const category of categories) {
    const choice = choices[category.name];
    if (choice) {
      preferences += `${category.name}: ${choice}\n`;
      // console.log(choice)
    }
  }
  
  bot.preferences = preferences;

  console.log(bot.preferences);

} else {
    showSlide(currentSlide);
}
}

// Call showSlide with initial slide index to display the first slide
showSlide(currentSlide);  