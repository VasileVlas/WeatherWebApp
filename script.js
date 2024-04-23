document.addEventListener("DOMContentLoaded", () => {
    //document.querySelector("#temperature_now").innerHTML = "0"
    
    document.querySelector("#button-addon2").addEventListener("click", () => {
        const API_key = "5xU8FaX7CHFfRzk2UIUg7humtNxQI6tf"
        const location = GetUserLocation();
        SetCurrentWeather(API_key, location);
        SetHourlyForecast(API_key,location);
        //GetHourForecast(API_key)
    });
});

//Make API request and return JSON data
function APICall(URL) {
    const weather_data = fetch(URL)
        .then(response => {
            if (response.ok){ // handle response 200
                return response.json()
                    .then(data => {
                    return data
                })
            } else { //handle case when response 200 not received
                return response.json()
                .then(error => { //Prompt user with error message
                    alert(error.error.message)
                })
            }
        })
        .catch(error => console.log("Connection error"))
    return weather_data
}

//Get user location from the input window
function GetUserLocation() {
    return document.querySelector("#location_input").value
}

async function SetCurrentWeather(API_key, location) {
    const URL = `https://api.tomorrow.io/v4/weather/realtime?location=${location}&apikey=${API_key}`;
    const data = await APICall(URL);
    document.querySelector("#temperature_now").innerHTML = `${data.data.values.temperature}°C`; //change current temperature in html object
    //SetWeatherIcon(data);

}

async function SetHourlyForecast(API_key, location) {
    const URL = `https://api.tomorrow.io/v4/weather/realtime?location=${location}&apikey=${API_key}`;
    const data = await APICall(URL);
    console.log(data);
}

function SetWeatherIcon(current_weather) {
    ImageDOM = document.querySelector("#weather_image");
    ImageDOM.src = `http:${current_weather.current.condition.icon}`;
    ImageDOM.height = "200";
    ImageDOM.width = "200";
}