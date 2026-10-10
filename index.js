// WEATHER API APP

const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");
const apiKey = "ed2c98311d6a9755524b78dc3c4bd9e8";

weatherForm.addEventListener("submit", async event => { // async function allows await keyword
    
    event.preventDefault(); // stops site from refreshing by default

    const city = cityInput.value;

    if(city){
        try{
            const weatherData = await getWeatherData(city);
            displayWeatherInfo(weatherData);
        }
        catch(error){
            console.error(error);
            displayError(error);
        }
    }
    else{
        displayError("Please Enter a City");
    }
});

// function which talks to the internet
async function getWeatherData(city){

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    const response = await fetch(apiUrl);

    console.log(response);

    // ok = true: status 200 - 299 (reply success code), this instance, a correctly spelled city
    if(!response.ok){ 
        throw new Error("Could not fetch weather data");
    }
    else{
        return await response.json(); // converts raw response to a js object I can use
    }
}

// Take the data object and builds the HTML to show it
function displayWeatherInfo(data){

    //https://openweathermap.org/api/current?collection=current_forecast
    // open console log and see that the object is in an array, I will deconstruct this and save data as variables

    // destructuring the data object
    const {name: city,
           main: {temp, humidity},
           weather: [{description, id}]} = data;

        card.textContent = ""; // clears old data results
        card.style.display = "flex";

        // create element in the memory, not added to page yet
        const cityDisplay = document.createElement("h1");
        const tempDisplay = document.createElement("p");
        const humidityDisplay = document.createElement("p");
        const descDisplay = document.createElement("p");
        const weatherEmoji = document.createElement("p");

        cityDisplay.textContent = city;
        tempDisplay.textContent = `${(temp - 273.15).toFixed(1)}°C` // Celsius formula & rounded to 1dp
        humidityDisplay.textContent = `Humidity: ${humidity}%`;
        descDisplay.textContent = description;
        weatherEmoji.textContent = getWeatherEmoji(id);

        // add css styling I created in styles.css
        cityDisplay.classList.add("cityDisplay"); 
        tempDisplay.classList.add("tempDisplay");
        humidityDisplay.classList.add("humidityDisplay");
        descDisplay.classList.add("descDisplay");
        weatherEmoji.classList.add("weatherEmoji");

        // variable created above (const)
        // puts the elements visibly on  page, inside the card
        card.appendChild(cityDisplay);
        card.appendChild(tempDisplay);
        card.appendChild(humidityDisplay);
        card.appendChild(descDisplay);
        card.appendChild(weatherEmoji);
       
}

function getWeatherEmoji(weatherId){

    switch(true){
        case (weatherId >= 200 && weatherId < 300):
            return "🌩️"
        case (weatherId >= 300 && weatherId < 400):
            return "☔";
        case (weatherId >= 500 && weatherId < 600):
            return "🌧️";
        case (weatherId >= 600 && weatherId < 700):
            return "🌨️";     
        case (weatherId >= 700 && weatherId < 800):
            return "🌫️";     
        case (weatherId == 800):
            return "☀️";  
        case (weatherId >= 801 && weatherId < 810):
            return "☁️";
        default:
            return "❔";
    }

    // https://openweathermap.org/api/weather-conditions
}


function displayError(message){

    const errorDisplay = document.createElement("p");
    errorDisplay.textContent = message;
    errorDisplay.classList.add("errorDisplay");

    card.textContent = "";
    card.style.display = "flex";
    card.appendChild(errorDisplay);
}