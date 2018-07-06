
$(document).ready(function () {



  function searchCityWeather() {
    // Here we are building the URL we need to query the database
    let cityName = $("#city").val().trim()
    let weatherAPIKey = "a8f2d039233b7e6b72c776b295650715";

    let weatherQueryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + weatherAPIKey;
    console.log(weatherQueryURL);


    // Here we run our AJAX call to the OpenWeatherMap API
    $.ajax({
      url: weatherQueryURL,
      method: "GET"
    })
      // We store all of the retrieved data inside of an object called "response"
      .then(function (response) {

        // Transfer content to HTML
        $(".city").html("<h1>" + response.name + " Weather Details</h1>");
        $(".wind").text("Wind Speed: " + response.wind.speed);
        $(".humidity").text("Humidity: " + response.main.humidity);
        $(".temp").text("Temperature (F) " + response.main.temp);
      });
  };


  function searchCityTrails(lat, lon) {
    let hikeAPIKey = "200303527-f280c2c52a126cb1818bd9a9a56661fd";
    let hikeQueryURL = "https://www.hikingproject.com/data/get-trails?lat=" + lat + "&lon=" + lon + "&maxDistance=10&key=" + hikeAPIKey;
    //  let lat =
    //  let lon =
    // Here we run our AJAX call to the hiking project data API
    $.ajax({
      url: hikeQueryURL,
      method: "GET"
    })
      // We store all of the retrieved data inside of an object called "response"
      .then(function (response) {
       
        let trailInfo = $(".trailInfo")
        trailInfo.empty();

        for (let i = 0; i < response.trails.length; i++) {
          let currentTrail = response.trails[i];
          let trailInfoDiv = $("<div class='trailInfoDiv'>");
         


          let name = currentTrail.name
          let pOne = $("<p>").text("TrailName:" + name);
          trailInfoDiv.append(pOne);

          let summary = currentTrail.summary
          let pTwo = $("<p>").text("Summary:" + summary);
          trailInfoDiv.append(pTwo);
          
          let stars = currentTrail.stars
          let pThree = $("<p>").text("Star Rating:" + stars);
          trailInfoDiv.append(pThree);
          
          let length = currentTrail.length
          let pFour = $("<p>").text("Trail Length:" + length);
          trailInfoDiv.append(pFour);
          
          let img = currentTrail.imgSmallMed
          let pFive = $("<img>").attr({src: img});
          trailInfoDiv.append(pFive);

          
          trailInfo.append(trailInfoDiv);
          

        }
      });
  }


function geocode() {
  let cityName = $("#city").val().trim()
  let geocodeAPIKey = "5WFYsGYGsWMThn7qZ95yH1P1s8Euc6uK";
  let geocodeQueryURL = "http://www.mapquestapi.com/geocoding/v1/address?key=" + geocodeAPIKey + "&location=" + cityName;
 
 console.log(geocodeQueryURL);
  // Here we run our AJAX call to the mapquest API
  $.ajax({
    url: geocodeQueryURL,
    method: "GET"
  })
    // We store all of the retrieved data inside of an object called "response"
    .then(function (response) {
      console.log(response);


      let lat = response.results[0].locations[0].latLng.lat
      let lon = response.results[0].locations[0].latLng.lng
      console.log(lat);
      console.log(lon);
      searchCityTrails(lat, lon);
    });
};




$("#submit-button").on("click", function (event) {
  event.preventDefault();
  // This line grabs the input from the textbox
  // let cityName = $("#city").val().trim()
  searchCityWeather();
  geocode();
  // searchCityTrails();

});


});