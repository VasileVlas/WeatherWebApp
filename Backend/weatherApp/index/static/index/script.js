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
        //SetHourlyForecast(API_key, location);
        SetForecast(API_key, location, "1h");
        SetForecast(API_key, location, "1d")
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
    const URL = `http://192.168.1.112:8000/api/currentweather/${location}`
    //const URL = `https://api.tomorrow.io/v4/weather/realtime?location=${location}&apikey=${API_key}`;
    const data = await APICall(URL);
    document.querySelector("#temperature_now").innerHTML = `${Math.round(data.temperature)}°C`; //change current temperature in html object
    ImageDOM = document.querySelector("#weather_image");
    console.log(data.weathercode)
    try {
    ImageDOM.src = GetWeatherIconSource(data.weathercode);
    }
    catch {
        console.error(error);
    }

}

async function SetForecast(API_key, location, timesteps) {
    const URL = `https://api.tomorrow.io/v4/weather/forecast?location=${location}&timesteps=${timesteps}&&apikey=${API_key}`;
    const data = await APICall(URL);
    for (let time_diff = 1; time_diff < 6; time_diff++) {
        let time = "0"
        if (timesteps === "1h") {
            forecast = data.timelines.hourly[time_diff];
            let date = forecast.time;
            time = date.split("T");
            time = time[1].replace("Z", "");
            time = time.split(":");

            //update temperature
            document.querySelector(`#hour${time_diff}_temp`).innerHTML = `${Math.round(forecast.values.temperature)}°C`;

            // update image
            ImageDOM = document.querySelector(`#hour${time_diff}_cond`);
            try {
                ImageDOM.src = GetWeatherIconSource(forecast.values.weatherCode);
            }
            catch {
                console.error(error);
                break;
            }
            //update timeline '2024-04-25T18:00:00Z'
            document.querySelector(`#hour${time_diff}_time`).innerHTML = `${time[0]}:${time[1]}`;
        }
        else if (timesteps === "1d") {
            
            //time_diff = time_diff - 1
            forecast = data.timelines.daily[time_diff-1];
            let date = forecast.time;
            time = date.split("T");
            time = time[0]
            time = time.split("-");
            tag_to_set = "day"

            //update temperature
            document.querySelector(`#day${time_diff-1}_temp`).innerHTML = `${Math.round(forecast.values.temperatureAvg)}°C`;

            // update image
            ImageDOM = document.querySelector(`#day${time_diff-1}_cond`);
            try {
                ImageDOM.src = GetWeatherIconSource(forecast.values.weatherCodeMax);
            }
            catch {
                console.error(error)
                break;
            }
            //update timeline '2024-04-25T18:00:00Z'
            document.querySelector(`#day${time_diff-1}_time`).innerHTML = `${time[2]}/${time[1]}`;
        }
        else {
            throw new Error("Forecast error")
        }


    } 
    
}

//Based on weather code from API sets the appropriate weather condition image
function GetWeatherIconSource(weather_code) {
    switch (String(weather_code)) {

        //sunny
        case "1000":
        case "1100":
            source ="static/index/images/sunny.png";
            break;

        //cloudy
        case "1101":
        case "1102":
        case "1001":
        case "2100":
        case "2000":
            source ="static/index/images/cloudy.png";
            break;

        //rain
        case "4000":
        case "4200":
        case "4001":
        case "4201":
            source ="static/index/images/rain.png";
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
            source ="static/index/images/snow.png";
            break;

        //storm
        case "8000":
            source ="static/index/images/storm.png";
            break;
        
        default:
            console.log(weather_code)
            console.log("Set Icon Error")
    }
    return source
}