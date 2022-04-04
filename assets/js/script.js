var citySubmit = $("#citySubmit");

function getLocation(url) {
  var requestUrl = url;

  fetch(requestUrl)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      var lat = data.coord.lat;
      var long = data.coord.lon;
      var newURL = 'https://api.openweathermap.org/data/2.5/onecall?lat='+lat+'&lon='+long+'&exclude=hourly,minutely,alerts&appid=91194225c8684f1d0c0bd2ac735e27ab';
      getAPI(newURL);
    });
}

function getAPI(url) {
    var requestUrl = url;
  
    fetch(requestUrl)
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        console.log(data);
        
      });
}

citySubmit.on("click", function(event){
    event.preventDefault();
    var cityName = $('#cityInput').val();

    if(cityName.length > 1){
        console.log(cityName);
        $('#cityInput').val('');
        $('#searchHist').append('<p class="p-1 bg-light text-center text-capitalize">'+cityName+'</p>');

        window.localStorage.setItem('search-entry-'+Math.floor(Math.random() * 10000), cityName);
    }

});

// getLocation('https://api.openweathermap.org/data/2.5/weather?q=london&appid=91194225c8684f1d0c0bd2ac735e27ab');
