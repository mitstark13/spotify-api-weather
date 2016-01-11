// Loading GIF

$( document ).ajaxStart(function() {
    $('.loading').fadeIn(1000);
});

//Splash screen buttons and inputs
$('.splash .btn2').click(function() {
  $('.splash').css('display', 'none');
  $('section, aside, header').removeClass('hide');
  getWeatherInfoCity(cityChoice);
  weatherToMusic();
});

$('.newCity').click(function() {
  if ($('.options input').val().indexOf(',') != -1) {
    var newCity = $('.options input').val();
    $('.splash i').css('opacity', '0');
    getWeatherInfoCity($('.options input').val());
    $('.splash').css('display', 'none');
    $('section, aside, header').removeClass('hide');
    weatherToMusic();
  } else {
    $('.splash i').css('opacity', '1');
  };
})

var templateSource = document.getElementById('results-template').innerHTML,
    template = Handlebars.compile(templateSource),
    resultsPlaceholder = document.getElementById('results'),
    playingCssClass = 'playing',
    audioObject = null;

var echoURL = "http://developer.echonest.com/api/v4/playlist/static?";
var echoApiKey = "api_key=FIBUHDRKELAT3EEOJ";

var weatherURL = "http://api.openweathermap.org/data/2.5/weather?"
var weatherApiKey = "appid=316a2b2cad6f5950838210609c099692";

var latLong = [];
var cityChoice;
var currentCity = true;

getLocation();

function getLocation() {
  if(navigator.geolocation) {
    	navigator.geolocation.getCurrentPosition(function(position) {
        console.log(position);
    		latLong.lat = position.coords.latitude;
    		latLong.lng = position.coords.longitude;
        getWeatherInfo();
    	});
  };
};

function getWeatherInfo() {
  $.ajax({
    url: "http://api.openweathermap.org/data/2.5/weather?lat="+ latLong.lat +"&lon="+ latLong.lng + "&" + weatherApiKey,
    jsonp:"showWeatherInfo",
    success: showWeatherInfo
  });
  console.log("http://api.openweathermap.org/data/2.5/weather?lat="+ latLong.lat +"&lon="+ latLong.lng + "&" + weatherApiKey)
}

function getWeatherInfoCity(newCity) {
  $.ajax({
    url: "http://api.openweathermap.org/data/2.5/weather?q="+ newCity + "&" + weatherApiKey,
    jsonp:"showWeatherInfo",
    success: showWeatherInfo
  });
  currentCity = false;
  console.log("http://api.openweathermap.org/data/2.5/weather?p="+ newCity + "&" + weatherApiKey)
}

function showWeatherInfo(data) {
  console.log(data);
  $('.currentCity').html(data.name);
  cityChoice = data.name;
  temp = ((data.main.temp * (9 / 5)) - 459.67).toFixed(0);
  $('.weather b').html(temp);
  weather = data.weather[0].main;
  weatherDescription = data.weather[0].description;
  hour = new Date($.now()).getHours();
  if (currentCity) {
    $('.loading').fadeOut(1000);
  }

  if (weather == 'Clear') {
    if (hour < 18) {
      $('.weatherImg').attr('src', 'img/sun.png');
      $('main').css('background-image', 'url(img/sunbackground.jpg)')
    } else {
      $('.weatherImg').attr('src', 'img/moon.png');
      $('main').css('background-image', 'url(img/nightbackground.jpg)')
    }
  } else if (weather == 'Rain') {
    $('.weatherImg').attr('src', 'img/rain.png');
    $('main').css('background-image', 'url(img/rainbackground.jpg)')
  } else if (weather == 'Snow') {
    $('.weatherImg').attr('src', 'img/snow.png');
    $('main').css('background-image', 'url(img/snowbackground.jpg)')
  } else if (weather == 'Fog') {
    $('.weatherImg').attr('src', 'img/cloud.png');
    $('main').css('background-image', 'url(img/cloudbackground.jpg)')
  } else {
    $('.weatherImg').attr('src', 'img/cloud.png');
    $('main').css('background-image', 'url(img/cloudbackground.jpg)')
  }
  setTitle(data.name);
}

//Set Title
function setTitle(city) {
  if (hour < 12) {
    time = "Morning";
  } else if (hour < 18) {
    time = "Afternoon";
  } else if (hour < 22) {
    time = "Evening"
  } else {
    time = "Late-Night"
  }
  $('.playlist .title').text(city + " " + time + ' ' + weather + ' Mix');
}


var temp;
var weather;
var weatherDescription;
var hour;


// getLocation();

var dance = 0.5;
var energy = 0.5;
var familiar = 0.64;
var genre = 'pop';
var genre2 = 'rock';
var variety = ((Math.random() * 0.7) + 0.2).toFixed(2);

function weatherToMusic() {
  if ((weather == 'Rain') || (weather == 'Snow')) {
    dance -= 0.1;
    energy -= 0.1;
  } else {
    dance += 0.1;
    energy += 0.1;
  }
  if ((temp < 40) || (temp > 75)) {
    dance -= 0.05;
    energy -= 0.05;
  } 
  if (hour < 5) {
    dance -= 0.1;
    energy -= 0.1;
  } else if ((5 <= hour) && (hour <= 10) || (15<= hour) && (hour <= 18)) {
    dance += 0.1;
    energy += 0.1;
  } else if (hour > 18){
    dance += 0.2;
    energy += 0.2;
  }

  console.log('energy: ' + energy);
  console.log('dance: ' + dance);

  if (energy < 0.1) {
    energy = 0.1;
  }
  if (dance < 0.1) {
    dance = 0.1;
  }
  if (energy > 0.9) {
    energy = 0.9;
  }
  if (dance > 0.9) {
    dance = 0.9;
  }

  getSpotifyPlaylist();
}

var previews = [];

function getSpotifyPlaylist() {
  $.ajax({
      url: echoURL + echoApiKey + "&genre=" + genre + "&genre=" + genre2,
      data: {
        format: 'json',
        results: '20',
        type: 'genre-radio',
        artist_min_familiarity: familiar,
        min_danceability: (dance - 0.1),
        max_danceability: (dance + 0.1),
        min_energy: (energy - 0.1),
        max_energy: (energy + 0.1),
        bucket: 'audio_summary',
        variety: variety
      },
      success: function (response) {
          console.log(response);
          resultsPlaceholder.innerHTML = template(response);
          // previews.append()
      }
  });
  console.log(variety);
  $('.loading').fadeOut(1000);
}

