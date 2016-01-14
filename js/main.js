
//Splash screen buttons and inputs
$('.splash .btn2').click(function() {
  $('.splash').css('display', 'none');
  $('section, aside, header').removeClass('hide');
  getWeatherInfoCity(cityChoice);
  weatherToMusic();
});

$('.newCity').click(function() {
  if ($(this).siblings('input').val().indexOf(',') != -1) {
    var newCity = $(this).siblings('input').val();
    $('.splash i').css('opacity', '0');
    getWeatherInfoCity(newCity);
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
}

function getWeatherInfoCity(newCity) {
  $.ajax({
    url: "http://api.openweathermap.org/data/2.5/weather?q="+ newCity + "&" + weatherApiKey,
    jsonp:"showWeatherInfo",
    success: showWeatherInfo
  });
  currentCity = false;
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
    $('.loader, .loading').fadeOut(100);
  }

  if ((weather == 'Clear') || (weather == 'Haze')) {
    weather = 'Sunny';
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
  $('.playlist .title').text(city + "'s " + time + ' ' + weather + ' Mix');
  getCityPhoto();
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
var genre2 = 'dance pop';
var genre3 = 'country';
var genre4 = 'chamber pop';
var genre5 = 'indietronica';
var variety = ((Math.random() * 0.7) + 0.2).toFixed(2);

function weatherToMusic() {
  if ((weather == 'Rain') || (weather == 'Snow')) {
    genre = 'chamber pop';
    genre2 = 'country rock';
    genre3 = 'neo mellow';
    dance -= 0.2;
    energy -= 0.2;
  } else {
    dance += 0.1;
    energy += 0.1;
  }
  if (weather == 'Clouds') {
    genre = 'pop';
    genre2 = 'rock';
    genre3 = 'mellow gold';
  } else if (weather == 'Sunny') {
    genre = 'dance pop';
    genre2 = 'pop rock';
    genre3 = 'hip hop';
  } else if (weather == 'Snow') {
    genre = 'singer-songwriter';
    genre2 = 'indie rock';
    genre3 = 'folk-pop';
  }
  if ((temp < 40) || (temp > 75)) {
    dance -= 0.1;
    energy -= 0.1;
  } 
  if (hour < 5) {
    dance -= 0.15;
    energy -= 0.15;
    genre4 = 'country';
    genre5 = 'neo mellow';
  } else if (((5 <= hour) && (hour <= 10)) || ((15<= hour) && (hour <= 18))) {
    dance += 0.1;
    energy += 0.1;
    genre4 = 'pop rock';
    genre5 = 'hip pop';
  } else if (((10 <= hour) && (hour <= 15)) || (18<= hour)){
    dance += 0.2;
    energy += 0.2;
    genre4 = 'singer-songwriter';
    genre5 = 'pop rock';
  }
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
  $('.loading').fadeIn(1000);
  $.ajax({
      url: echoURL + echoApiKey + "&genre=" + genre + "&genre=" + genre2 + "&genre=" + genre3 + "&genre=" + genre4 + "&genre=" + genre5,
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
          console.log(response)
          resultsPlaceholder.innerHTML = template(response);
          $('#results li').filter(":contains('(')").remove();
          getSpotifyId($('#results li:first-child p').html(), $('#results li:first-child b').html());
          $('.loading').fadeOut(300);
          playPreview($('#results li:first-child p').html(), $('#results li:first-child b').html());
          $('#results li:first-child img').attr('src', 'img/pause.png');
      }
  });
}

//Get album cover on click of play button
var playing = false;


$(document).on('click','#results div',function(){
  $('li').removeClass('active');
  $(this).parent().addClass('active');
  var track = $(this).siblings('p').html();
  var artist = $(this).siblings('b').html();
  $('.equalizer').html(' ');
  $(this).siblings('.equalizer').html('<img  src="img/equalizer.gif" />');
  $('.playpause').attr('src', 'img/play.png');
  $('.playpauseblue').attr('src', 'img/playblue.png');
  $(this).find('.playpause').attr('src', 'img/pause.png');
  $(this).find('.playpauseblue').attr('src', 'img/pauseblue.png');
  getSpotifyId(track, artist);
  playPreview(track, artist);
});

function getSpotifyId(track, artist) {
  $.ajax({
      url: "http://developer.echonest.com/api/v4/song/search?" + echoApiKey + "&format=json&artist=" + artist + "&title=" + track + "&bucket=id:spotify&limit=true",

    success: function(data) {
      console.log(data);
      var string = JSON.stringify(data);
      var spotID = string.split("spotify:artist:");
      var finalId = spotID[1].split('"')[0];
      getAlbumCover(finalId);
    }
  });
}

function getAlbumCover(id) {
  $.ajax({
    url: "https://api.spotify.com/v1/artists/" + id,

    success: function(data) {
      var pic = data.images[0].url;
      $('#albumCover').attr('src', pic);
      $(".albumCover img").reflect();
    }
  })
};

function playPreview(track, artist) {
  $.ajax({
    url: "https://api.spotify.com/v1/search?q=track:" + track + "&artist:" + artist + "&type=track",

    success: function(response) {
      console.log(response.tracks.items[0].preview_url)
      if (playing) {
        audioObject.pause();
      }
      audioObject = new Audio(response.tracks.items[0].preview_url);
      audioObject.play();
      playing = true;
    }
  })
}

function getCityPhoto() {
$.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?",
  {
    tags:  currentCity,
    geo_context: 2,
    accuracy: 11,
    tagmode: "any",
    format: "json"
  },
  function(data) {
    console.log(data);
    $.each(data.items, function(i,item){
      $("<img />").attr("src", item.media.m).prependTo(".logo");
      if ( i == 3 ) return false;
    });
  });
}