var templateSource = document.getElementById('results-template').innerHTML,
    template = Handlebars.compile(templateSource),
    resultsPlaceholder = document.getElementById('results'),
    playingCssClass = 'playing',
    audioObject = null;

var weatherSource = document.getElementById('weather-template').innerHTML,
    weathertemplate = Handlebars.compile(weatherSource),
    weatherPlaceholder = document.getElementById('title');

var echoURL = "http://developer.echonest.com/api/v4/playlist/static?";
var echoApiKey = "api_key=FIBUHDRKELAT3EEOJ";

var weatherURL = "http://api.openweathermap.org/data/2.5/weather?"
var weatherApiKey = "appid=316a2b2cad6f5950838210609c099692";

var latLong = [];
var currentCity;
var newCity;

var temp;
var weather;
var weatherDescription;
var hour;

function getLocation() {
  if(navigator.geolocation) {
    	navigator.geolocation.getCurrentPosition(function(position) {
    		latLong.lat = position.coords.latitude;
    		latLong.lng = position.coords.longitude;
        getWeatherInfo();
    	});
  };
};

$('.newCity').click(function() {
  if ($('.options input').val().indexOf(',') != -1) {
    var newCity = $('.options input').val();
    $('.splash i').css('opacity', '0');
  } else {
    $('.splash i').css('opacity', '1');
  };
})

function getWeatherInfo() {
  $.ajax({
    url: "http://api.openweathermap.org/data/2.5/weather?lat="+ latLong.lat +"&lon="+ latLong.lng + "&" + weatherApiKey,
    contentType: "application/json",
    dataType: "json",
    success: showWeatherInfo
  });
  console.log("http://api.openweathermap.org/data/2.5/weather?lat="+ latLong.lat +"&lon="+ latLong.lng + "&" + weatherApiKey)
}

function showWeatherInfo(data) {
  console.log(data);
  $('.currentCity').html(data.name);
  temp = data.main.temp;
  weather = data.weather[0].main;
  weatherDescription = data.weather[0].description;
  hour = new Date($.now()).getHours();
}

getLocation();

var dance = '.6';
var energy = '.5';
var familiar = '.65';
var duration;
var tempo;


function getSpotifyPlaylist() {
  $.ajax({
      url: echoURL + echoApiKey,
      data: {
        genre: 'dance%2Bpop',
        format: 'json',
        results: '20',
        type: 'genre-radio'
        // start: '900'
      },
      success: function (response) {
          console.log(response);
          // resultsPlaceholder.innerHTML = template(response);
      }
  });
}

getSpotifyPlaylist();




// http://developer.echonest.com/api/v4/playlist/static?api_key=FIBUHDRKELAT3EEOJ&genre=dance%2Bpop&format=json&results=20&type=genre-radio
// http://developer.echonest.com/api/v4/playlist/static?api_key=FIBUHDRKELAT3EEOJ&genre=dance+pop&format=json&results=20&type=genre-radio



