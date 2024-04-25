document.addEventListener("DOMContentLoaded", () => {
    //document.querySelector("#temperature_now").innerHTML = "0"
    
    document.querySelector("#button-addon2").addEventListener("click", () => {
        const API_key = "5xU8FaX7CHFfRzk2UIUg7humtNxQI6tf"
        const location = GetUserLocation();
        //checks if user entered a location
        if (location === "") {
            alert("Please, enter location!")
            return
            
        }
        SetCurrentWeather(API_key, location);
        SetHourlyForecast(API_key, location);
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
    ImageDOM = document.querySelector("#weather_image");
    ImageDOM.src = GetWeatherIconSource(data.data);
    ;

}

async function SetHourlyForecast(API_key, location) {
    const URL = `https://api.tomorrow.io/v4/weather/forecast?location=${location}&timesteps=1h&&apikey=${API_key}`;
    const data = await APICall(URL);
    for (let time_diff = 1; time_diff < 6; time_diff++) {
        hour_forecast = data.timelines.hourly[time_diff];

        //update temperature
        document.querySelector(`#hour${time_diff}_temp`).innerHTML = `${Math.round(hour_forecast.values.temperature)}°C`;

        // update image
        ImageDOM = document.querySelector(`#hour${time_diff}_cond`);
        ImageDOM.src = GetWeatherIconSource(hour_forecast);

        //update timeline '2024-04-25T18:00:00Z'
        let date = hour_forecast.time;
        let time = date.split("T");
        time = time[1].replace("Z", "");
        time = time.split(":");
        document.querySelector(`#hour${time_diff}_time`).innerHTML = `${time[0]}:${time[1]}`;
    } 
    
}

//Based on weather code from API sets the appropriate weather condition image
function GetWeatherIconSource(data) {
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
    return source
}