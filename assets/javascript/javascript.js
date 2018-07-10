


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

  // Initial Values
  // let userStarRating = "";
  // let userReview = "";

  // Capture Button Click review submit btn
  $(document.body).on("click", "#reviewSubmitBtn", function (event) {
    // Don't refresh the page
    event.preventDefault();
    console.log("Review Form submit")
    // logic for storing and retrieving the reveiw
    // userStarRating = $("#userStarRating").val().trim();
    let userReview = $("#userReview").val().trim();

    database.ref().push({
      // userStarRating: userStarRating,
      userReview: userReview,
    });
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

  //mapquest api function geocode
  function geocode() {
    //get city name from user input
    let cityName = $("#city").val().trim();
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
        //run the hiking project api with the lat lon arguments
        searchCityTrails(lat, lon);
      });
  };


  // // mapquest api function directions
  // function directions(lat, lon) {
  //   let start = $("#startInput").val().trim();
  //   let end = lat, lon
  //   // Here we are building the URL we need to query the database
  //   let directionsAPIKey = "5WFYsGYGsWMThn7qZ95yH1P1s8Euc6uK";
  //   let directionsQueryURL = "https://www.mapquestapi.com/directions/v2/route?key=" + directionsAPIKey + "&from=" + start + "&to=" + end + "&outFormat=json&ambiguities=ignore&routeType=fastest&doReverseGeocode=false&enhancedNarrative=false&avoidTimedConditions=false";

  //   // Here we run our AJAX call to the mapquest API
  //   $.ajax({
  //     url: directionsQueryURL,
  //     method: "GET"
  //   })
  //     // We store all of the retrieved data inside of an object called "response"
  //     .then(function (response) {
  //       console.log("direction function working?" + response.distance)
  //       let map = L.mapquest.map('map', {
  //         center: [40.7128, -74.0059],
  //         layers: L.mapquest.tileLayer('map'),
  //         zoom: 13
  //       });
  //       $("#map").append(map);
  //     });
  //   geocode();
  // };




  function directions() {
    L.mapquest.key = '5WFYsGYGsWMThn7qZ95yH1P1s8Euc6uK';

    var map = L.mapquest.map('map', {
      center: [40.7128, -74.0059],
      layers: L.mapquest.tileLayer('map'),
      zoom: 13
    });
    //need to get these inputs in //   let start = $("#startInput").val().trim();
    //   let end = lat, lon
    L.mapquest.directions().route({
      start: "9400 east iliff ave, denver, co 80231",
      end: "18 laurel ave, binghamton, ny 13905",
    });
  }

  function submitStartCity() {
    //event handler for submit start point input
    $("#directionsSubmitBtn").on("click", function (event) {
      //prevent form from submiting
      event.preventDefault();
      let start = $("#startInput").val().trim();
      console.log("submit start city" + start);
      console.log("start submit clicking")
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
    let myModal = $('.modal');
    //which ever trail is clicked find its trail data
    let currentTrail = $(this).data('trail');
    // $(this).attr("src", $(this).attr(currentTrail.name));
    //let currentTrailReview = 

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
                            <i class="fa fa-star fa-lg" data-rating="1" aria-hidden="true"></i>
                            <i class="fa fa-star fa-lg" data-rating="2" aria-hidden="true"></i>
                            <i class="fa fa-star fa-lg" data-rating="3" aria-hidden="true"></i>
                            <i class="fa fa-star fa-lg" data-rating="4" aria-hidden="true"></i>
                            <i class="fa fa-star fa-lg" data-rating="5" aria-hidden="true"></i>
                            <br/><br/>
                            <form>
                              <div class="form-group">
                                <textarea class="form-control" id="userReview" placeholder="Share your thoughts on ${currentTrail.name}..." rows="3"></textarea>
                                <br/>
                                <button type="button" id="reviewSubmitBtn" class="btn btn-md submit-review">Submit</button>
                              </div>
                            </form>
                          </div>
                        </div>
                        
                        <div role="tabpanel" class="tab-pane" id="readReviewsTab">
                        <div class="col-md-12 savedRatingsReview">
                            <h4>Rating For ${currentTrail.name}</h4>
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
                                <textarea class="form-control" id="startInput" placeholder="Enter Starting address: street, city, state, zip code" rows="3"></textarea>
                                <br/>
                                <button type="button" id="directionsSubmitBtn" class="btn btn-md submit-review">Submit</button>
                              </div>
                            </form>
                             
                            <div id="map" style="width: 100%; height: 530px;"></div>
                          
                            </div>
                    </div>
               
            </div>
    `);
    //show its modal
    myModal.modal('show');
    console.log("click working 1");

    // Firebase watcher + initial loader 
    database.ref().on("child_added", function (snapshot) {

      // Log everything that's coming out of snapshot
      console.log(snapshot.val());

      const reviewDiv = `<div>${snapshot.val().userReview}</div>`;
      // // Change the HTML to reflect
      //this saved review maybe, or make id for saved review dynamic????????????????
      $("#savedReview").append(reviewDiv);
      // $("#").text(snapshot.val().userStarRating);

      // Handle the errors
    }, function (errorObject) {
      console.log("Errors handled: " + errorObject.code);
    });
    directions();
    submitStartCity()

  });




});

