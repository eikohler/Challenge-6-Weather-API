var citySubmit = $("#citySubmit");

var date = new Date();
var month = date.getMonth()+1;
var day = date.getDate();
var today = (month<10 ? '0' : '') + month  + '/' + (day<10 ? '0' : '') + day + '/' + date.getFullYear();

var numForcasts = 5;

function initForcast(){
    var counter = 1;
    $('.forcasts').find('div').each(function() {
        var newDate = new Date();
        newDate.setDate(newDate.getDate() + counter);
        var m = newDate.getMonth()+1;
        var d = newDate.getDate();
        var t = (m<10 ? '0' : '') + m  + '/' + (d<10 ? '0' : '') + d + '/' + newDate.getFullYear();
        $(this).append("<h6>"+t+"</h6>");
        counter++;
    });    
}
initForcast();

function getLocation(url) {
  var requestUrl = url;

  fetch(requestUrl)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      var lat = data.coord.lat;
      var long = data.coord.lon;
      var newURL = 'https://api.openweathermap.org/data/2.5/onecall?lat='+lat+'&lon='+long+'&exclude=hourly,minutely,alerts&units=metric&appid=91194225c8684f1d0c0bd2ac735e27ab';
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
        console.log(data.current.weather[0].icon);
        $('#cityHeader').append($('#cityInput').val()+' '+today+" <img src='http://openweathermap.org/img/wn/"+data.current.weather[0].icon+"@2x.png' alt='icon'>");
        $("#currentInfo").append("Temp: "+data.current.temp+"°C<br>");
        $("#currentInfo").append("Wind: "+data.current.wind_speed+"m/s<br>");
        $("#currentInfo").append("Humidity: "+data.current.humidity+"%<br>");
        $("#currentInfo").append("UV Index: "+data.current.uvi+"");
        
        for (let index = 0; index < numForcasts; index++) {
            var instance = data.daily[index];
            
        }

        var index = 0;
        $('.forcasts').find('div').each(function() {
            var instance = data.daily[index];
            $(this).append("<img src='http://openweathermap.org/img/wn/"+instance.weather[0].icon+"@2x.png' alt='icon'><br>");
            $(this).append("Temp: "+instance.temp.day+"°C<br>");
            $(this).append("Wind: "+instance.wind_speed+"m/s<br>");
            $(this).append("Humidity: "+instance.humidity+"%");
            index++;
        });    
        
      });
}

citySubmit.on("click", function(event){
    event.preventDefault();
    var cityName = $('#cityInput').val();

    if(cityName.length > 1){
        // $('#cityInput').val('');
        $('#searchHist').append('<p class="p-1 bg-light text-center text-capitalize">'+cityName+'</p>');
        window.localStorage.setItem('search-entry-'+Math.floor(Math.random() * 10000), cityName);
     
        getLocation('https://api.openweathermap.org/data/2.5/weather?q='+cityName+'&appid=91194225c8684f1d0c0bd2ac735e27ab');
    }

});