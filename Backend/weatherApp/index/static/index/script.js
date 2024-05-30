document.addEventListener("DOMContentLoaded", () => {
    
    //event displaying suggestions of the typed city
    document.querySelector("#location_input").addEventListener("input", async () => {
        //Get typed user location
        const typed_location = GetUserLocation();
        const URL = `http://192.168.1.115:8000/api/suggestlocation/${typed_location}`
        //Call API to get a JSON object of places
        try {
            var suggested_location = await APICall(URL);
            console.log(suggested_location)
        }
        
        catch(error){
            alert(error.message);
        }

        finally {
            let datalist = document.createElement("datalist");
            datalist.id = "location_datalist";
            for (let i = 0; i < suggested_location.name.length; i++) {
            //for(location of dummy_data) {
                let option = document.createElement("option");
                option.value = suggested_location.name[i][0];
                datalist.appendChild(option);
            }
            document.querySelector("#location_input").setAttribute("list","location_datalist");
            document.querySelector("#location_input").appendChild(datalist);
            //give selection of places
    
        }
        


    })

    document.querySelector("#button-addon2").addEventListener("click", async () => {
        const API_key = "5xU8FaX7CHFfRzk2UIUg7humtNxQI6tf"
        const location = GetUserLocation();
        //checks if user entered a location
        if (location === "") {
            alert("Please, enter location!")
            return
        }

        //if error occurs in async functions, stops them and displays error
        try {
            await Promise.all([
                SetCurrentWeather(API_key, location),
                //SetHourlyForecast(API_key, location);
                SetForecast(API_key, location, "1h"),
                SetForecast(API_key, location, "1d")
            ]);
            
        }
        catch(error) {
            alert(error.message);
        }
        
    });
});

//Make API request and return JSON data
function APICall(URL) {
    const received_data = fetch(URL)
        .then(response => {
            if (response.ok){ // handle response 200
                return response.json()
                    .then(data => {
                    return data
                })
            } else { //handle case when response 200 not received
                return response.json()
                .then(error => { //Prompt user with error message
                    alert(error.error.message);
                })
            }
        })
        .catch(error => console.log("Connection error"));
    return received_data
}

//Get user location from the input window
function GetUserLocation() {
    return document.querySelector("#location_input").value
}

async function SetCurrentWeather(API_key, location) {
    const URL = `http://192.168.1.115:8000/api/currentweather/${location}`
    //const URL = `https://api.tomorrow.io/v4/weather/realtime?location=${location}&apikey=${API_key}`;
    const data = await APICall(URL);
    CheckWrongLocationError(data);
    document.querySelector("#temperature_now").innerHTML = `${Math.round(data.temperature)}°C`; //change current temperature in html object
    ImageDOM = document.querySelector("#weather_image");
    try {
    ImageDOM.src = GetWeatherIconSource(data.weathercode);
    }
    catch {
        throw new Error("Error while setting icon in SetCurrentWeather function");
    }

}

async function SetForecast(API_key, location, timesteps) {
    const URL = `http://192.168.1.115:8000/api/forecast/${location}/${timesteps}`
    //const URL = `https://api.tomorrow.io/v4/weather/forecast?location=${location}&timesteps=${timesteps}&&apikey=${API_key}`;
    const data = await APICall(URL);
    CheckWrongLocationError(data);
    let iter = 0
    data.data.forEach((timestep_data) => {
        iter++
        if (timesteps === "1h") {

            //update temperature
            document.querySelector(`#hour${iter}_temp`).innerHTML = `${Math.round(timestep_data.temperature)}°C`;

            // update image
            ImageDOM = document.querySelector(`#hour${iter}_cond`);
            try {
                ImageDOM.src = GetWeatherIconSource(timestep_data.weathercode);
            }
            catch {
                throw new Error("Error while setting icon in SetForecast function")
            }
            //update timeline '2024-04-25T18:00:00Z'
            document.querySelector(`#hour${iter}_time`).innerHTML = `${timestep_data.time[0]}:${timestep_data.time[1]}`;
        }
        else if (timesteps === "1d") {
            //subtractiong one from iter because day numbering starts from 0

            //update temperature
            document.querySelector(`#day${iter-1}_temp`).innerHTML = `${Math.round(timestep_data.temperature)}°C`;

            // update image
            ImageDOM = document.querySelector(`#day${iter-1}_cond`);
            try {
                ImageDOM.src = GetWeatherIconSource(timestep_data.weathercode);
            }
            catch {
                throw new Error("Error while setting icon in SetForecast function")
            }
            //update timeline '2024-04-25T18:00:00Z'
            document.querySelector(`#day${iter-1}_time`).innerHTML = `${timestep_data.time[2]}/${timestep_data.time[1]}`;
        }
        else {
            throw new Error("Forecast error")
        }


    }, timesteps)
    
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

//Check if data JSON object has a key code and there is 
function CheckWrongLocationError(data){
    if (data.hasOwnProperty("code") && data.code === 400001){
        document.querySelector("#location_input").value = ""
        throw new Error("Location not found!")
    }
}