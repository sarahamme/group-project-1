
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
        // let fTemp = (((response.main.temp) * 1.8) + 32);
        let fTemp = 1.8 * ((response.main.temp) - 273) + 32;
        let fTempRound = Math.round(fTemp);
        // Transfer content to HTML
        $(".city").html("<h1>" + response.name + " Weather Details</h1>");
        $(".wind").text("Summary: " + response.weather[0].description);
        $(".humidity").text("Humidity: " + response.main.humidity);
        $(".temp").text("Temperature (F) " + fTempRound);
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
          let pOne = $("<p>").text(name);
          trailInfoDiv.append(pOne);

          let summary = currentTrail.summary
          let pTwo = $("<p>").text(summary);
          trailInfoDiv.append(pTwo);

          let img = currentTrail.imgSmallMed
          let pFive = $("<img>").attr({ src: img });
          trailInfoDiv.append(pFive);

          let modal = $(`
          <div id="trailModal_${i}" class="modal fade" role="dialog">
            <div class="container-fluid">
                <div class="row">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title">${currentTrail.name}</h4>
                        </div>
                        <div class="modal-body">
                            <p>${currentTrail.summary}</p>
                            <p>Stars: ${currentTrail.stars}</p>
                            <p>Trail Length (miles): ${currentTrail.length}</p>
                            <p>Condition Status: ${currentTrail.conditionStatus}</p>
                            <p>Condition Details: ${currentTrail.conditionDetails}</p>
                            <img src="${currentTrail.imgMedium}">
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      `);

          trailInfoDiv.append(modal);

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
    let cityName = $("#city").val().trim()
    // This line grabs the input from the textbox
    // let cityName = $("#city").val().trim()
    searchCityWeather(cityName);
    geocode(cityName);
    // searchCityTrails();
    $("#city").val('')

  });



  $(document.body).on("click", ".trailInfoDiv", function () {
    //take to new screen with full info on trail and link to map

    let myModal = $(this).find('.modal');
    myModal.modal('show');
    console.log("click worked");

  });



});