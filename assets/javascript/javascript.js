


$(document).ready(function () {

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAnkB5LXjeLkSHzKilnnDUwbT3ouMgyP14",
    authDomain: "group-project-1-aa136.firebaseapp.com",
    databaseURL: "https://group-project-1-aa136.firebaseio.com",
    projectId: "group-project-1-aa136",
    storageBucket: "group-project-1-aa136.appspot.com",
    messagingSenderId: "495847653658"
  };
  firebase.initializeApp(config);

  let database = firebase.database();


  // Capture Button Click review submit btn
  $(document.body).on("click", "#reviewSubmitBtn", function (event) {
    // Don't refresh the page
    event.preventDefault();
    // logic for storing and retrieving the reveiw
    let userReview = $("#userReview").val().trim();

    //
    let dropdownRating = $('#starRatingInput').val()
    //grab the trail id from the reviewSubmitBtn through the hike api and .data
    const trailId = $(this).attr('data-trailId');
    //add trails so that ID and user review will be children of trails
    database.ref('trails/' + trailId).push({
      // userStarRating: userStarRating,
      userReview: userReview,
      dropdownRating: dropdownRating,

    });
    //empty input after retrieve the user input
    $("#userReview").val("");
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
        $(".city").html("<h2>" + response.name + " Weather Details</h2>");
        $(".wind").text("Summary: " + response.weather[0].description);
        $(".humidity").text("Humidity: " + response.main.humidity + "%");
        $(".temp").text("Temperature (F) " + fTempRound);
      });
  };

  //hiking project api function
  //we will be grabbing the lat and lon from the mapquest api to use here
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
          let trailInfoDiv = $("<div class='col-md-6 col-sm-12 trailInfoDiv'>");

          let name = currentTrail.name
          let pOne = $("<h2>").text(name);
          trailInfoDiv.append(pOne);

          let summary = currentTrail.summary
          let pTwo = $("<p>").text(summary);
          trailInfoDiv.append(pTwo);

          let img = currentTrail.imgSmallMed
          let pFive = $("<img class='trailImg'>").attr({ src: img });
          trailInfoDiv.append(pFive);

          // Store current trail data in the trailInfoDiv
          trailInfoDiv.data('trail', currentTrail);

          trailInfo.append(trailInfoDiv);
        }
      });
  }

  //mapquest api function geocode pass in user input city and a callback function
  function geocode(cityName, callback) {
    // Here we are building the URL we need to query the database
    let geocodeAPIKey = "5WFYsGYGsWMThn7qZ95yH1P1s8Euc6uK";
    let geocodeQueryURL = "https://www.mapquestapi.com/geocoding/v1/address?key=" + geocodeAPIKey + "&location=" + cityName;

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

        callback(lat, lon);
      });
  };


  //function using mapQuest.js no need for ajax call
  function directions(startAddress, endLat, endLon) {
    L.mapquest.key = '5WFYsGYGsWMThn7qZ95yH1P1s8Euc6uK';

    let map = L.mapquest.map('map', {
      center: [endLat, endLon],
      layers: L.mapquest.tileLayer('hybrid'),
      zoom: 10,
    });

    L.mapquest.directions().route({
      start: startAddress,
      end: [endLat, endLon],
    });

  }

  $('#closeMapBtn').on('click', function (event) {
    //hide map container
    $('#mapContainer').hide();
    //show search container
    $('#trailSearchContainer').show();
    //show modal
    $('.modal').modal('show');
  });



  //function to run when click on submit for the start city directions
  function submitStartCity() {
    //event handler for submit start point input
    $("#directionsSubmitBtn").on("click", function (event) {
      //prevent form from submiting
      event.preventDefault();

      // Get lat and lon data attrbutes from the navigation button
      const endLat = $(this).attr('data-lat');
      const endLon = $(this).attr('data-lon');

      const startAddress = $("#startInput").val().trim();

      //close the modal
      $('.modal').modal('hide');
      //Hide the search container
      $('#trailSearchContainer').hide();
      //show the map
      $('#mapContainer').show();
      directions(startAddress, endLat, endLon);
      $("#startInput").val('')

    });
  };

  //event handler for submit city input
  // $("#submit-button").on("submit", function (event) {
  $("#hike-form").on("submit", function (event) {
    //prevent form from submiting
    event.preventDefault();
    // This line grabs the input from the textbox
    let cityName = $("#city").val().trim()
    //run weather api function with user city input
    searchCityWeather(cityName);
    //run geocode api function with user city input and search city trails to get lat lon passed
    geocode(cityName, searchCityTrails);
    //empty input box after collecting user input
    $("#city").val('')
  });


  //event handler for selecting a trail
  $(document.body).on("click", ".trailInfoDiv", function () {
    //take to new screen with full info on trail and link to map
    let myModal = $('.modal');
    //which ever trail is clicked find its trail data
    let currentTrail = $(this).data('trail');

    $('#trailModalLabel').text(currentTrail.name);
    $('#trailModalBody').html(`
    <div role="tabpanel">
                    <ul class="nav nav-tabs" role="tablist">
                        <li role="presentation" class="active nav-item"><a class="nav-link modalTab" href="#trailTab" aria-controls="trailTab" role="tab" data-toggle="tab">Trail Information</a>
                        </li>

                        <li role="presentation" class="nav-item"><a class="nav-link modalTab" href="#leaveReviewTab" aria-controls="leaveReviewTab" role="tab" data-toggle="tab">Leave A Review</a>
                        </li>

                        <li role="presentation" class="nav-item"><a class="nav-link modalTab" href="#readReviewsTab" aria-controls="readReviewsTab" role="tab" data-toggle="tab">Read Reviews</a>
                        </li>

                        <li role="presentation" class="nav-item"><a class="nav-link modalTab" href="#navigateTab" aria-controls="navigateTab" role="tab" data-toggle="tab">Plan Your Trip</a>
                        </li>

                    </ul>

                    <div class="tab-content">
                        <div role="tabpanel" class="tab-pane active" id="trailTab">    
                        <br/>
                        <p>${currentTrail.summary}</p>
                        <p>Stars: ${currentTrail.stars}</p>
                        <p>Trail Length: ${currentTrail.length} miles</p>
                        <p>Condition Status: ${currentTrail.conditionStatus}</p>
                        <p>Condition Details: ${currentTrail.conditionDetails}</p>
                        <img class="trailImg" src="${currentTrail.imgMedium}"></div>
                        <div role="tabpanel" class="tab-pane" id="leaveReviewTab">

                        <div class="col-md-12 ratingsReview">
                            <h4>Rate ${currentTrail.name}</h4>
                            <br/>
                            <div class="form-group">
                              <select class="form-control" id="starRatingInput">
                                <option value="5">5 Stars</option>
                                <option value="5">4 Stars</option>
                                <option value="5">3 Stars</option>
                                <option value="5">2 Stars</option>
                                <option value="5">1 Stars</option>
                              </select>
                            </div>
                            <br/>
                            <form>
                              <div class="form-group">
                                <textarea class="form-control" id="userReview" placeholder="Share your thoughts on ${currentTrail.name}..." rows="3" required></textarea>
                                <br/>
                                <button type="button" id="reviewSubmitBtn" class="btn btn-md submit-review"
                                  data-trailId="${currentTrail.id}">Submit</button>
                              </div>
                            </form>
                          </div>
                        </div>

                        <div role="tabpanel" class="tab-pane" id="readReviewsTab">
                        <div class="col-md-12 savedRatingsReview">
                            <h4>Reviews For ${currentTrail.name}</h4>
                            <i class="fa fa-star fa-lg" data-rating="1" aria-hidden="true"></i>
                            <i class="fa fa-star fa-lg" data-rating="2" aria-hidden="true"></i>
                            <i class="fa fa-star fa-lg" data-rating="3" aria-hidden="true"></i>
                            <i class="fa fa-star fa-lg" data-rating="4" aria-hidden="true"></i>
                            <i class="fa fa-star fa-lg" data-rating="5" aria-hidden="true"></i>
                            <br/><br/>
                            <form>
                              <div class="form-group">
                                <p class="savedReviewTitle"></p>
                                <p id="savedReview"></p>
                        </div>
                        </div>
                        </div>
                        <div role="tabpanel" class="tab-pane" id="navigateTab">
                        <form>
                              <div class="form-group">
                              <br/>
                              <h5>Get Directions</h5>
                                <textarea class="form-control" id="startInput" placeholder="Enter Starting Address: street, city, state, zip code" rows="3" required></textarea>
                                <br/>
                                <a href="map.html" class="btn btn-md submit-review" role="button" id="directionsSubmitBtn"
                                  data-lat="${currentTrail.latitude}" data-lon="${currentTrail.longitude}" >Submit</a>
                              </div>
                            </form>
                          </div>
                    </div>
            </div>
    `);
    //show modal
    myModal.modal('show');

    //had to move firebase loader inside div click because of modal
    // Firebase watcher + initial loader 
    database.ref('trails/' + currentTrail.id).on("child_added", function (snapshot) {
      // Log everything that's coming out of snapshot
      console.log(snapshot.val());
      const reviewDiv = `
      <div><h4>Rating: ${snapshot.val().dropdownRating}</h4></div>
      <div>${snapshot.val().userReview}</div>`;
      // // Change the HTML to reflect
      $("#savedReview").append(reviewDiv);
      // Handle the errors
    }, function (errorObject) {
      console.log("Errors handled: " + errorObject.code);
    });
    submitStartCity()

  });



  // <div id="map" style="width: 100%; height: 300px;"></div>


  //Hide map div
  $('#mapContainer').hide();


});

