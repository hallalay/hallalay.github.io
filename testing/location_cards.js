var data = localStorage.getItem("tripSummary");
var tripSummary = JSON.parse(data);
console.log(tripSummary);

console.log('hejsans')

let colors = ['#ff8014', '#20b37b', '#86bae0']

$(document).ready(function() {
    let trips = tripSummary.fullTrip
    let slideContainer = $(".w-slider-mask");
    let slideHTML = `<div class="location-slide w-slide"><div class="div-block paris"></div></div>`;
    let count = 0;
    let currentDate = new Date("2023-05-20"); // Initial date
    
    trips.forEach(function(trip, index) {

        if (index === 0){
            return;
        }
        // if (index === trips.length-1) {
        //     return
        // }

        if(index === trips.length-1){
            let lastHtml = `
            <div class="train">
                <h4>${currentDate.toLocaleDateString("en-US", { day: "numeric", month: "short" })}</h4>
                <img src="./train.png" loading="lazy" sizes="(max-width: 479px) 15vw, (max-width: 767px) 8vw, 50px" srcset="./train.png 500w, ./train.png 512w" alt="" class="image-3">
                <button class='book' onClick='journeyButtonClicked(${index})'>Tickets</button>
            
            </div>
            `;
    
            slideContainer.find(".location-slide.w-slide").last().find(".div-block.paris").append(lastHtml); // append to the last slide
        
            return
        }

        let tripHTML = `
        <div class="train">
            <h4>${currentDate.toLocaleDateString("en-US", { day: "numeric", month: "short" })}</h4>
            <img src="./train.png" loading="lazy" sizes="(max-width: 479px) 15vw, (max-width: 767px) 8vw, 50px" srcset="./train.png 500w, ./train.png 512w" alt="" class="image-3">
            <button class='book' onClick='journeyButtonClicked(${index})'>Tickets</button>

        </div>
        <div data-w-id="0f35f371-1ea1-c9a2-b522-b1c8daa51732" class="destination-card" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="${index * 100}">
            <input type="number" onchange="updateDates()" min="1" value="1">
            <div class="card">
                <div class="card-front" style="background-image: url('${trip.imageUrl}'); background-size: cover; background-position: center;">
                    <h2 class="card-heading">${trip.city}, ${trip.country}</h2>
                </div>
                <div class="card-back" style='background-color: ${colors[index % 3]}'>
                    <h3 style='color: white'>${trip.city}, ${trip.country}</h3>
                    <div style='color: white'>${trip.city}<br>‍</div>
                </div>
            </div>
        </div>
        `;
    
        if (count % 3 === 0) {
            slideContainer.append(slideHTML); // append a new slide
        }
        
        slideContainer.find(".location-slide.w-slide").last().find(".div-block.paris").append(tripHTML); // append to the last slide
    
        
    
        count++;
    });
    

    // Function to update the dates based on input values
    window.updateDates = function() {
        let inputs = document.querySelectorAll(".destination-card input");
        let accumulatedDays = 0;
        
        inputs.forEach(function(input, index) {
            let daysToAdd = parseInt(input.value);
            accumulatedDays += daysToAdd;
            let tripDate = new Date(currentDate.getTime());
            tripDate.setDate(currentDate.getDate() + accumulatedDays);
            let tripDateString = tripDate.toLocaleDateString("en-US", { day: "numeric", month: "short" });

            if(index < inputs.length-1) {
                document.querySelectorAll('.train h4')[index+1].textContent = tripDateString;
            }
        });

           // Add the last date after all the trips
           let lastDate = new Date(currentDate.getTime());
           lastDate.setDate(currentDate.getDate() + accumulatedDays);
           let lastDateString = lastDate.toLocaleDateString("en-US", { day: "numeric", month: "short" });
           document.querySelector('.train:last-child h4').textContent = lastDateString;
    };

    window.updateDates();


    // Function to get train details and suggestions
    
});


$.getScript("webflow1.js");


