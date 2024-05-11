from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
import requests, json

# Create your views here.
API_key = "5xU8FaX7CHFfRzk2UIUg7humtNxQI6tf"

def currentWeather (request, location):
    #Get Json file with current weather from tomorrow.io API
    CurrentWeatherJSON = requests.get(f"https://api.tomorrow.io/v4/weather/realtime?location={location}&apikey={API_key}") 
    current_weather_dict = CurrentWeatherJSON.json()

    #Return Json with code 400001 when incorrect location provided
    if "code" in current_weather_dict and current_weather_dict["code"] == 400001: 
        return JsonResponse({"code":400001})
    
    #Get current weather key:value pairs
    data = current_weather_dict["data"]["values"]

    #creating empty dictionary to insert weather data and send response
    response = {}
    response["temperature"] = data["temperature"]
    response["weathercode"] = data["weatherCode"]
    return JsonResponse(response)

def forecast(request, location, time_frame):
    #Get forecast based on location and desired time_frame, either hourly forecast or daily forecast
    ForecastWeatherJSON = requests.get(f"https://api.tomorrow.io/v4/weather/forecast?location={location}&timesteps={time_frame}&&apikey={API_key}") 
    forecast_weather_dict = ForecastWeatherJSON.json()
    
    #Return Json with code 400001 when incorrect location provided
    if "code" in forecast_weather_dict and forecast_weather_dict["code"] == 400001: 
        return JsonResponse({"code":400001})
    #Get and array of forecast data
    data = forecast_weather_dict["timelines"]

    #creating empty dictionary to insert weather data of next 5 time steps and initialize array to store time steps
    response = {
        "code":200,
        "data":[]
    }
    #response["code"] = 
    #response["data"] = []

    #Iterate over next 5 time_steps and copy desired data into new directory 
    for time_step in range(5):

        #Create dictionary to store one time step data
        data_time_step = {}

        #Handles data for hourly forecast. Different response data structure compared to daily foracast, so need to handle in if statement 
        if time_frame == "1h":
            forecast = data["hourly"][time_step+1] #time_step+1 to skip actual hour
            data_time_step["temperature"] = forecast["values"]["temperature"] #Copy temperature
            data_time_step["weathercode"] = forecast["values"]["weatherCode"] #Copy weather code

            #Change time format
            time_list = forecast["time"].split("T")
            time = time_list[1].replace("Z","").split(":")
            data_time_step["time"] = time #time si and array

        #Handles data for daily forecast
        elif time_frame == "1d":
            forecast = data["daily"][time_step] #Start iterating from actual day
            data_time_step["temperature"] = forecast["values"]["temperatureAvg"] #Copy average temperature
            data_time_step["weathercode"] = forecast["values"]["weatherCodeMax"] #Copy weather code

            #Change time format
            time_list = forecast["time"].split("T")
            time = time_list[0].split("-")
            data_time_step["time"] = time
        else:
            return HttpResponse("Error in forecast view")
        
        #Append one time step data to the response dict list
        response["data"].append(data_time_step)

    return JsonResponse(response)

def incorrectLocation(data_dict):
    ...