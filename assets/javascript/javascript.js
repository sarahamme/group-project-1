


$(document).ready(function () {
  // hides nav bar until you start to scroll
  var $nav = $('.navbar');
  $nav.hide();
  //fade in .navbar
  $(function () {
    $(window).scroll(function () {
      // set distance user needs to scroll before we start fadeIn
      if ($(this).scrollTop() > 100) { //For dynamic effect use $nav.height() instead of '100'
        $nav.fadeIn();
      } else {
        $nav.fadeOut();
      }
    });
  });

  //open weather api function
  function searchCityWeather() {
    //get user input from form
    let cityName = $("#city").val().trim()
    //API key from openweather
    let weatherAPIKey = "a8f2d039233b7e6b72c776b295650715";
    // Here we are building the URL we need to query the database
    let weatherQueryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + weatherAPIKey;


    // run our AJAX call to the OpenWeatherMap API
    $.ajax({
      url: weatherQueryURL,
      method: "GET"
    })
      // We store all of the retrieved data inside of an object called "response"
      .then(function (response) {
        //change temp to fahrenheit
        let fTemp = 1.8 * ((response.main.temp) - 273) + 32;
        //round to whole number
        let fTempRound = Math.round(fTemp);
        // Transfer content to HTML
        $(".city").html("<h1>" + response.name + " Weather Details</h1>");
        $(".wind").text("Summary: " + response.weather[0].description);
        $(".humidity").text("Humidity: " + response.main.humidity);
        $(".temp").text("Temperature (F) " + fTempRound);
      });
  };

  //hiking project api function
  //we will be grabbing the lat and lon from the mapquest api
  function searchCityTrails(lat, lon) {
    // Here we are building the URL we need to query the database
    let hikeAPIKey = "200303527-f280c2c52a126cb1818bd9a9a56661fd";
    let hikeQueryURL = "https://www.hikingproject.com/data/get-trails?lat=" + lat + "&lon=" + lon + "&maxDistance=10&key=" + hikeAPIKey;
    // Here we run our AJAX call to the hiking project data API
    $.ajax({
      url: hikeQueryURL,
      method: "GET"
    })
      // We store all of the retrieved data inside of an object called "response"
      .then(function (response) {
        let trailInfo = $(".trailInfo")
        //empty trail info div when we search new trail
        trailInfo.empty();
        //loop through response to create a div for each trail
        for (let i = 0; i < response.trails.length; i++) {
          let currentTrail = response.trails[i];
          let trailInfoDiv = $("<div class='trailInfoDiv'>");

          let name = currentTrail.name
          let pOne = $("<p>").text(name);
          trailInfoDiv.append(pOne);

          let summary = currentTrail.summary
          let pTwo = $("<p>").text(summary);
          trailInfoDiv.append(pTwo);

          let img = currentTrail.imgSmallMed
          let pFive = $("<img>").attr({ src: img });
          trailInfoDiv.append(pFive);

          // Store current trail data in the trailInfoDiv
          trailInfoDiv.data('trail', currentTrail);

          trailInfo.append(trailInfoDiv);


        }

      });
  }

  //mapquest api function
  function geocode() {
    //get city name from user input
    let cityName = $("#city").val().trim()
    // Here we are building the URL we need to query the database
    let geocodeAPIKey = "5WFYsGYGsWMThn7qZ95yH1P1s8Euc6uK";
    let geocodeQueryURL = "http://www.mapquestapi.com/geocoding/v1/address?key=" + geocodeAPIKey + "&location=" + cityName;

    // Here we run our AJAX call to the mapquest API
    $.ajax({
      url: geocodeQueryURL,
      method: "GET"
    })
      // We store all of the retrieved data inside of an object called "response"
      .then(function (response) {
        //store the latitude and longitude in variables to be used in hiking api to convert city input to lat lon
        let lat = response.results[0].locations[0].latLng.lat
        let lon = response.results[0].locations[0].latLng.lng
        //run the hiking project api with the lat lon arguments
        searchCityTrails(lat, lon);
      });
  };



  //event handler for submit city input
  $("#submit-button").on("click", function (event) {
    //prevent form from submiting
    event.preventDefault();
    // This line grabs the input from the textbox
    let cityName = $("#city").val().trim()
    //run api functions with user city input
    searchCityWeather(cityName);
    geocode(cityName);
    //empty input box after collecting user input
    $("#city").val('')
  });


  //event handler for selecting a trail
  $(document.body).on("click", ".trailInfoDiv", function () {
    //take to new screen with full info on trail and link to map
    //whicher trail is clicked find its modal
    let myModal = $('.modal');

    let currentTrail = $(this).data('trail');

    $('#trailModalLabel').text(currentTrail.name);
    $('#trailModalBody').html(`
      <p>${currentTrail.summary}</p>
      <p>Stars: ${currentTrail.stars}</p>
      <p>Trail Length (miles): ${currentTrail.length}</p>
      <p>Condition Status: ${currentTrail.conditionStatus}</p>
      <p>Condition Details: ${currentTrail.conditionDetails}</p>
      <img src="${currentTrail.imgMedium}">
    `);

    //show its modal
    myModal.modal('show');
    console.log("click working 1");

  });

});

