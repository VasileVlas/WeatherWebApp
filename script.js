document.addEventListener("DOMContentLoaded", () => {
    //document.querySelector("#temperature_now").innerHTML = "0"
    
    document.querySelector("#button-addon2").addEventListener("click", () => {
        const API_key = "5xU8FaX7CHFfRzk2UIUg7humtNxQI6tf"
        const location = GetUserLocation();
        SetCurrentWeather(API_key, location);
        //SetHourlyForecast(API_key,location);
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
    document.querySelector("#temperature_now").innerHTML = `${Math.round(data.data.values.temperature)}°C`; //change current temperature in html object
    SetWeatherIcon(data.data);

}

async function SetHourlyForecast(API_key, location) {
    const URL = `https://api.tomorrow.io/v4/weather/realtime?location=${location}&apikey=${API_key}`;
    const data = await APICall(URL);
    console.log(data);
}

//Based on weather code from API sets the appropriate weather condition image
function SetWeatherIcon(data) {
    weather_code = data.values.weatherCode
    switch (String(data.values.weatherCode)) {

        //sunny
        case "1000":
        case "1100":
            source = "images/sunny.png";
            break;

        //cloudy
        case "1101":
        case "1102":
        case "1001":
        case "2100":
        case "2000":
            source = "images/cloudy.png";
            break;

        //rain
        case "4000":
        case "4200":
        case "4001":
        case "4201":
            source = "images/rain.png";
            break;

        //snow
        case "5001":
        case "5100":
        case "5000":
        case "5101":
        case "6000":
        case "6200":
        case "6001":
        case "6201":
        case "7102":
        case "7000":
        case "7101":
            source = "images/snow.png";
            break;

        //storm
        case "8000":
            source = "images/storm.png";
            break;
        
        default:
            console.log("Set Icon Error")
    }

    ImageDOM = document.querySelector("#weather_image");
    ImageDOM.src = source;
    ImageDOM.height = "200";
    ImageDOM.width = "200";
}