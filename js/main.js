var templateSource = document.getElementById('results-template').innerHTML,
    template = Handlebars.compile(templateSource),
    resultsPlaceholder = document.getElementById('results'),
    playingCssClass = 'playing',
    audioObject = null;

var weatherSource = document.getElementById('weather-template').innerHTML,
    weathertemplate = Handlebars.compile(weatherSource),
    weatherPlaceholder = document.getElementById('title');

var echoURL = "http://developer.echonest.com/api/v4/";
var echoApiKey = "api_key=FIBUHDRKELAT3EEOJ";

var weatherURL = "http://api.openweathermap.org/data/2.5/weather?"
var weatherApiKey = "appid=316a2b2cad6f5950838210609c099692";

var latLong = {};
if(navigator.geolocation) {
  	navigator.geolocation.getCurrentPosition(function(position) {
  		latLong.lat = position.coords.latitude;
  		latLong.long = position.coords.longitude;
  	});
};