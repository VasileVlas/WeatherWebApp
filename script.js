document.addEventListener("DOMContentLoaded", () => {
    //document.querySelector("#temperature_now").innerHTML = "0"
    
    document.querySelector("#button-addon2").onclick = function() {
        const API_key = "c41141413e694055bec202729241504"
        GetCurrentWeather(API_key)
    };
});

function GetCurrentWeather(API_key) {
    console.log(API_key)
    fetch(`http://api.weatherapi.com/v1/current.json?key=${API_key}&q=London`)
    .then(response => {
        if (response.ok){ // handle response 200
            return response.json()
            .then(data => {
                document.querySelector("#temperature_now").innerHTML = `${data.current.temp_c}°C` //change current temperature
            })
        } else { //handle case when response 200 not received
            return response.json()
            .then(error => { //Prompt user with error message
                alert(error.error.message)
            })
        }
    })
    .catch(error => console.log("Connection error"))
}