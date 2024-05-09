from django.urls import path
from . import views

urlpatterns = [
    #Api calls:
        #currentweather - api call to send actual weather state
    path("currentweather/<str:location>", views.currentWeather, name = "currentWeather"),
        #forecasthourly - api call to send hourly forecast
    path("forecast/<str:location>/<str:time_frame>", views.forecast, name="forecast")
        #forecastdaily - api call to send daily forecast
        #searchsuggest - api call to the database. Get suggestions for locations base on user input      
]