var citySubmit = $("#citySubmit");

var date = new Date();
var month = date.getMonth()+1;
var day = date.getDate();
const today = (month<10 ? '0' : '') + month  + '/' + (day<10 ? '0' : '') + day + '/' + date.getFullYear();

var numForcasts = 5;

var cityName = "toronto";

function initForcast(){
    var counter = 1;
    $('.forcasts').find('h5').each(function() {
        var newDate = new Date();
        newDate.setDate(newDate.getDate() + counter);
        var m = newDate.getMonth()+1;
        var d = newDate.getDate();
        var t = (m<10 ? '0' : '') + m  + '/' + (d<10 ? '0' : '') + d + '/' + newDate.getFullYear();
        $(this).append(t);
        counter++;
    });    
}
initForcast();

function getLocation(url) {
  var requestUrl = url;

  fetch(requestUrl)
    .then(function(response) {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Could not find city coordinates');
    })
    .then(function(data) {
        if (localStorage.getItem(cityName) === null) {
            $('#searchHist').prepend('<p class="p-1 text-center text-capitalize city-search-item">'+cityName+'</p>');
            window.localStorage.setItem(cityName, cityName);
        }else{
            $('.city-search-item').each(function() {
                if($(this).text()===cityName) $(this).remove();
            });
            $('#searchHist').prepend('<p class="p-1 text-center text-capitalize city-search-item">'+cityName+'</p>');
            window.localStorage.setItem(cityName, cityName);
        }
        $('#cityInput').val("");

        var lat = data.coord.lat;
        var long = data.coord.lon;
        var newURL = 'https://api.openweathermap.org/data/2.5/onecall?lat='+lat+'&lon='+long+'&exclude=hourly,minutely,alerts&units=metric&appid=91194225c8684f1d0c0bd2ac735e27ab';
        getAPI(newURL);
    })
    .catch((error) => {
        $('#cityInput').val("");
        $('#cityInput').attr("placeholder", "Could Not Find City");
        console.log(error)
    });
}

$('#cityInput').click(function() {
    $(this).attr("placeholder", "Find City");
});

function getAPI(url) {
    var requestUrl = url;
  
    fetch(requestUrl)
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        $('#cityHeader').empty();
        $('#currentInfo').empty();
        $('#cityHeader').append(cityName+' '+today+" <img src='http://openweathermap.org/img/wn/"+data.current.weather[0].icon+"@2x.png' alt='icon'>");
        $("#currentInfo").append("Temp: "+data.current.temp+"°C<br>");
        $("#currentInfo").append("Wind: "+data.current.wind_speed+"m/s<br>");
        $("#currentInfo").append("Humidity: "+data.current.humidity+"%<br>");
        $("#currentInfo").append("UV Index: "+getUVI(data.current.uvi));


        var index = 0;
        $('.forcasts').find('section').each(function() {
            $(this).empty();
            var instance = data.daily[index];
            $(this).append("<img src='http://openweathermap.org/img/wn/"+instance.weather[0].icon+"@2x.png' alt='icon'><br>");
            $(this).append("Temp: "+instance.temp.day+"°C<br>");
            $(this).append("Wind: "+instance.wind_speed+"m/s<br>");
            $(this).append("Humidity: "+instance.humidity+"%");
            index++;
        });    
      });
}

function getUVI(value){
    if (value<3) {
        return "<span class='bg-success py-1 px-3 text-white rounded'>"+value+"</span>";
    }else if(value>=3 && value<6){
        return "<span class='bg-warning py-1 px-3 text-white rounded'>"+value+"</span>";
    }else{
        return "<span class='bg-danger py-1 px-3 text-white rounded'>"+value+"</span>";
    }
}

citySubmit.on("click", function(event){
    event.preventDefault();
    cityName = $('#cityInput').val().toLowerCase();;

    if(cityName.length > 1){    
        getLocation('https://api.openweathermap.org/data/2.5/weather?q='+cityName+'&appid=91194225c8684f1d0c0bd2ac735e27ab');
    }
});

$("#searchHist").on('click', '.city-search-item', function(){
    cityName = $(this).text().toLowerCase();
    getLocation('https://api.openweathermap.org/data/2.5/weather?q='+cityName+'&appid=91194225c8684f1d0c0bd2ac735e27ab');
});


function getSavedCities(){
    var values = [];
    var keys = Object.keys(localStorage);
    var i = keys.length;
    while ( i-- ) {
        values.push( localStorage.getItem(keys[i]));
    }
    return values;
}

function loadCities(){
    var cities = getSavedCities();
    console.log(cities);
    if(cities.length>0){
        for (let i = 0; i < cities.length; i++) {     
            $('#searchHist').prepend('<p class="p-1 text-center text-capitalize city-search-item">'+cities[i]+'</p>');
        }
        cityName = cities[0];
    }
    getLocation('https://api.openweathermap.org/data/2.5/weather?q='+cityName+'&appid=91194225c8684f1d0c0bd2ac735e27ab');
}
loadCities();