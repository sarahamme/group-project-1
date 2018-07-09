


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
  let userName = "";
  let userStarRating = "";
  let userReview = "";

  // Capture Button Click review submit btn
  $(document.body).on("click", "#reviewSubmitBtn", function (event) {
    // Don't refresh the page
    event.preventDefault();
    console.log("Review Form submit")
    // logic for storing and retrieving the reveiw
    userName = $("#userName").val().trim();
    userStarRating = $("#starRating").val().trim();
    userReview = $("#review").val().trim();

    database.ref().set({
      userName: userName,
      userStarRating: userStarRating,
      userReview: userReview,
    });

  });

  // Firebase watcher + initial loader 
  database.ref().on("value", function (snapshot) {

    // Log everything that's coming out of snapshot
    console.log(snapshot.val());
    console.log(snapshot.val().userName);


    // // Change the HTML to reflect
    // $("#name-display").text(snapshot.val().userName);
    // $("#email-display").text(snapshot.val().userStarRating);
    // $("#age-display").text(snapshot.val().userReview);

    // Handle the errors
  }, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
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
    let myModal = $('.modal');
    //which ever trail is clicked find its trail data
    let currentTrail = $(this).data('trail');

    $('#trailModalLabel').text(currentTrail.name);
    $('#trailModalBody').html(`
    <div role="tabpanel">
                    <ul class="nav nav-tabs nav-justified" role="tablist">
                        <li role="presentation" class="active nav-item"><a class="nav-link" href="#trailTab" aria-controls="trailTab" role="tab" data-toggle="tab">Trail Information</a>
                        </li>

                        <li role="presentation" class="nav-item"><a class="nav-link" href="#leaveReviewTab" aria-controls="leaveReviewTab" role="tab" data-toggle="tab">Write A Review</a>
                        </li>

                        <li role="presentation" class="nav-item"><a class="nav-link" href="#readReviewsTab" aria-controls="readReviewsTab" role="tab" data-toggle="tab">Reviews</a>
                        </li>
                        
                        <li role="presentation" class="nav-item"><a class="nav-link" href="#navigateTab" aria-controls="navigateTab" role="tab" data-toggle="tab">Navigate</a>
                        </li>

                    </ul>

                    <div class="tab-content">
                        <div role="tabpanel" class="tab-pane active" id="trailTab">    
                        <p>${currentTrail.summary}</p>
                        <p>Stars: ${currentTrail.stars}</p>
                        
                        <p>Trail Length (miles): ${currentTrail.length}</p>
                        <p>Condition Status: ${currentTrail.conditionStatus}</p>
                        <p>Condition Details: ${currentTrail.conditionDetails}</p>
                        <img class="trailImg" src="${currentTrail.imgMedium}"></div>
                        <div role="tabpanel" class="tab-pane" id="leaveReviewTab"> <div class="form-group">
                       
                        <form id="reviewForm">
                        <label for="userName">Name</label>
                        <input id="userName" class="form-control" type="text" placeholder="User Name">
                        <label for="starRating">Star Rating</label>
                        <select class="form-control" id="starRating">
                          <option>1</option>
                          <option>2</option>
                          <option>3</option>
                          <option>4</option>
                          <option>5</option>
                        </select>
                      </div>
                      <div class="form-group">
                      <label for="review">Review</label>
                      <textarea class="form-control" id="review" rows="3"></textarea>
                      <button type="submit" id="reviewSubmitBtn" class="btn btn-primary mb-2">Submit</button>
                    </div>
                  </form>
                      </div>
                        <div role="tabpanel" class="tab-pane" id="readReviewsTab">we will add a place to read reviews here</div>
                        <div role="tabpanel" class="tab-pane" id="navigateTab">we will add a place to navigate here</div>
                    </div>
                </div>
            </div>
    `);

    //show its modal
    myModal.modal('show');
    console.log("click working 1");

  });

  /* <button type="button" class="btn btn-outline-primary readReviewBtn">Read Reviews</button>
        <button type="button" class="btn btn-outline-primary leaveReviewBtn">Leave Review</button> */
  // <button type="button" class="btn btn-outline-primary navigateBtn">Navigate to ${currentTrail.name}</button>


  // //on click event for read review
  // $(document.body).on("click", ".readReviewBtn", function () {
  //   console.log("clck is working on read review btn")

  // });

  // //on click event for leave review
  // $(document.body).on("click", ".leaveReviewBtn", function () {
  //   console.log("clck is working on leave review btn")

  // });

  // // on click event for map
  // $(document.body).on("click", ".navigateBtn", function () {
  //   console.log("clck is working on navigate btn")

  // });

});

