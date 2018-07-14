


$(document).ready(function () {

// sticky nav bar
$(window).on('scroll', function (){
      if($(window).scrollTop()) {
        $('nav').addClass('black');
      } else {
        $('nav').removeClass('black');
      }
    });
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
  $(document.body).on("submit", "#reviewForm", function (event) {
    // Don't refresh the page
    event.preventDefault();
    
    // logic for storing and retrieving the reveiw
    let userReview = $("#userReview").val().trim();

    //define dropdown rating input. 
    let dropdownRating = $('#starRatingInput').val()
    //get the trail data from the reviewForm attribute through the hike api and .data
    const trailId = $(this).attr('data-trailId');
    //add trails so that ID and user review will be children of trails put info in to firebase
    database.ref('trails/' + trailId).push({
      // key value pairs on firebase object
      userReview: userReview,
      dropdownRating: dropdownRating,

    });
    //empty input after retrieve the user input
    $(this)[0].reset();
  });



  //open weather api function
  function searchCityWeather() {
    //get user input from form
    let cityName = $("#city").val().trim()
    //API key from openweather
    let weatherAPIKey = "a8f2d039233b7e6b72c776b295650715";
    // Here we are building the URL we need to query the database
    let weatherQueryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + weatherAPIKey;


    // run our AJAX call to the OpenWeatherMap API want api request to be asynchronous
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
        // $(".wind").text("Summary: " + response.weather[0].description);
        $(".humidity").html("<h3>" + "Humidity: " + response.main.humidity + "%" + "</h3>");
        $(".temp").html("<h3>" + "Temperature (F) " + fTempRound + "</h3>");
        $(".wind").html("<h3>" + "Summary: " + "<img src='http://openweathermap.org/img/w/" + response.weather[0].icon + ".png'>" + "</h3>");
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
          let pSix = $(`<img src="assets/images/mainimage.jpg" class='trailImg'>`)

          if (img === "") {
            trailInfoDiv.append(pSix);
          } else {
            trailInfoDiv.append(pFive);
          }

          // Store current trail object data on the trailInfoDiv
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

        //since chaining two ajax together have to use call back so that geocode can pass lat and lon to other functions
        callback(lat, lon);
      });
  };


  //function using mapQuest.js no need for ajax call
  function directions(startAddress, endLat, endLon) {
    //empty then add fresh map area
    $("#mapArea").empty().append(`<div id="map" style="width: 100%; height: 620px;"></div>`);
    L.mapquest.key = '5WFYsGYGsWMThn7qZ95yH1P1s8Euc6uK';


    //mapquest.js
    addDirections();

    function addDirections() {
      var directions = L.mapquest.directions();
      directions.route({
        start: startAddress,
        end: [endLat, endLon],
        options: {
          enhancedNarrative: true
        }
      }, createMap);
    }

    function createMap(err, response) {

      var map = L.mapquest.map('map', {
        center: [endLat, endLon],
        layers: L.mapquest.tileLayer('map'),
        zoom: 10
      });

      var directionsLayer = L.mapquest.directionsLayer({
        directionsResponse: response
      }).addTo(map);

      var narrativeControl = L.mapquest.narrativeControl({
        directionsResponse: response,
        compactResults: false,
        interactive: true
      });

      narrativeControl.setDirectionsLayer(directionsLayer);
      narrativeControl.addTo(map);
    }
  }

  //close the map
  $('#closeMapBtn').on('click', function (event) {
    //hide map container
    $('#mapContainer').hide();
    //show search container
    $('#trailSearchContainer').show();
    //show modal
    $('.modal').modal('show');
  });



  //event handler for submit start point input
  $(document.body).on("submit", "#mapForm", function (event) {
    //prevent form from submiting
    event.preventDefault();
    // Get lat and lon data attrbutes from the mapForm where we stored the trail info
    const endLat = $(this).attr('data-lat');
    const endLon = $(this).attr('data-lon');

    const startAddress = $("#startInput").val().trim();

    //close the modal
    $('.modal').modal('hide');
    //Hide the search container
    $('#trailSearchContainer').hide();
    //show the map
    $('#mapContainer').show();
    //run directions function on click
    directions(startAddress, endLat, endLon);
    //clear address?
    $(this)[0].reset();

  });


  //event handler for submit city input
  $("#hike-form").on("submit", function (event) {
    //prevent form from submiting
    event.preventDefault();
    // This line grabs the input from the textbox
    let cityName = $("#city").val().trim()
    //run weather api function with user city input
    searchCityWeather(cityName);
    //run geocode api function with user city input and search city trails to get lat lon passed, will run searchcitytrails after get lat and lon
    geocode(cityName, searchCityTrails);
    //empty input box after collecting user input
    $("#city").val('')
  });


  //event handler for selecting a trail
  $(document.body).on("click", ".trailInfoDiv", function () {
    //take to new screen with full info on trail and link to map
    let myModal = $('.modal');
    //which ever trail is clicked find its trail data saved earlier on the div
    let currentTrail = $(this).data('trail');

    $('#trailModalLabel').text(currentTrail.name);
    $('#trailModalBody').html(`
<div role="tabpanel">
    <ul class="nav nav-tabs" role="tablist">
        <li role="presentation" class="active nav-item">
            <a class="nav-link modalTab" href="#trailTab" aria-controls="trailTab" role="tab" data-toggle="tab">Trail Information</a>
        </li>

        <li role="presentation" class="nav-item">
            <a class="nav-link modalTab" href="#leaveReviewTab" aria-controls="leaveReviewTab" role="tab" data-toggle="tab">Leave A Review</a>
        </li>

        <li role="presentation" class="nav-item">
            <a class="nav-link modalTab" href="#readReviewsTab" aria-controls="readReviewsTab" role="tab" data-toggle="tab">Read Reviews</a>
        </li>

        <li role="presentation" class="nav-item">
            <a class="nav-link modalTab" href="#navigateTab" aria-controls="navigateTab" role="tab" data-toggle="tab">Plan Your Trip</a>
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
              <h4 class="trailNames">Rate ${currentTrail.name}</h4>
              <br/>
              <div class="form-group">
                <select class="form-control" id="starRatingInput">
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>
              <br/>
              <form id="reviewForm" data-trailID="${currentTrail.id}">
                <div class="form-group">
                  <textarea class="form-control" id="userReview" placeholder="Share your thoughts on ${currentTrail.name}..." rows="3" required></textarea>
                  <br/>
                  <button type="submit" id="reviewSubmitBtn" class="btn btn-md submit-review">Submit</button>
                </div>
              </form>
            </div>
          </div>

          <div role="tabpanel" class="tab-pane" id="readReviewsTab">
            <div class="col-md-12 savedRatingsReview">
              <h4 class="trailNames">Reviews for ${currentTrail.name}</h4>
              <form>
                <div class="form-group">
                  <div id="savedReview"></div>
                </div>
              </form>
            </div>
          </div>

          <div role="tabpanel" class="tab-pane" id="navigateTab">
          <form id="mapForm" data-lat="${currentTrail.latitude}" data-lon="${currentTrail.longitude}">
                <div class="form-group">
                <br/>
                <h5>Get Directions</h5>
                  <textarea class="form-control" id="startInput" placeholder="Enter Starting Address: street, city, state, zip code" rows="3" required></textarea>
                  <br/>
                  <button type="submit" class="btn btn-md submit-review" role="button" id="directionsSubmitBtn">Submit</button>
                </div>
              </form>
            </div>
      </div>
    </div>
  </div>
        
    `);
    //show modal
    myModal.modal('show');

    //had to move firebase loader inside div click because of modal, when open new modal want to listen for reviews for that trail
    // Firebase watcher + initial loader 
    database.ref('trails/' + currentTrail.id).on("child_added", function (snapshot) {
      // retrieve info that was put in to firebase, everytime a review is added generate new div
      const reviewDiv = `
      <div>${snapshot.val().userReview}</div>
      `;
      console.log("review div: " + reviewDiv);

      //Create variables to display star ratings 
      const starRatingOne = `
        <i class="fa fa-star fa-lg filledStar" data-rating="1" aria-hidden="true"></i>
        <i class="fa fa-star fa-lg" data-rating="2" aria-hidden="true"></i>
        <i class="fa fa-star fa-lg" data-rating="3" aria-hidden="true"></i>
        <i class="fa fa-star fa-lg" data-rating="4" aria-hidden="true"></i>
        <i class="fa fa-star fa-lg" data-rating="5" aria-hidden="true"></i>
      `;
      
      const starRatingTwo = `
      <div>
        <i class="fa fa-star fa-lg filledStar" data-rating="1" aria-hidden="true"></i>
        <i class="fa fa-star fa-lg filledStar" data-rating="2" aria-hidden="true"></i>
        <i class="fa fa-star fa-lg" data-rating="3" aria-hidden="true"></i>
        <i class="fa fa-star fa-lg" data-rating="4" aria-hidden="true"></i>
        <i class="fa fa-star fa-lg" data-rating="5" aria-hidden="true"></i>
      </div>
      `;

      const starRatingThree = `
      <div>
        <i class="fa fa-star fa-lg filledStar" data-rating="1" aria-hidden="true"></i>
        <i class="fa fa-star fa-lg filledStar" data-rating="2" aria-hidden="true"></i>
        <i class="fa fa-star fa-lg filledStar" data-rating="3" aria-hidden="true"></i>
        <i class="fa fa-star fa-lg" data-rating="4" aria-hidden="true"></i>
        <i class="fa fa-star fa-lg" data-rating="5" aria-hidden="true"></i>
      </div>
      `;

      const starRatingFour = `
      <div>
        <i class="fa fa-star fa-lg filledStar" data-rating="1" aria-hidden="true"></i>
        <i class="fa fa-star fa-lg filledStar" data-rating="2" aria-hidden="true"></i>
        <i class="fa fa-star fa-lg filledStar" data-rating="3" aria-hidden="true"></i>
        <i class="fa fa-star fa-lg filledStar" data-rating="4" aria-hidden="true"></i>
        <i class="fa fa-star fa-lg" data-rating="5" aria-hidden="true"></i>
      </div>
      `;

      const starRatingFive = `
      <div>
        <i class="fa fa-star fa-lg filledStar" data-rating="1" aria-hidden="true"></i>
        <i class="fa fa-star fa-lg filledStar" data-rating="2" aria-hidden="true"></i>
        <i class="fa fa-star fa-lg filledStar" data-rating="3" aria-hidden="true"></i>
        <i class="fa fa-star fa-lg filledStar" data-rating="4" aria-hidden="true"></i>
        <i class="fa fa-star fa-lg filledStar" data-rating="5" aria-hidden="true"></i>
      </div>
      `;

      //If, Else If statement to append stars based on dropdownRating value
      if (snapshot.val().dropdownRating == 1) {
        $("#savedReview").append(starRatingOne);

      } else if (snapshot.val().dropdownRating == 2) {
        $("#savedReview").append(starRatingTwo);

      } else if (snapshot.val().dropdownRating == 3) {
        $("#savedReview").append(starRatingThree);

      } else if (snapshot.val().dropdownRating == 4) {
        $("#savedReview").append(starRatingFour);

      } else if (snapshot.val().dropdownRating == 5) {
        $("#savedReview").append(starRatingFive);
      }

      // // Change the HTML to reflect
      $("#savedReview").append(reviewDiv);

      

      // Handle the errors
    }, function (errorObject) {
      console.log("Errors handled: " + errorObject.code);
    });
  });


  //Hide map div before search
  $('#mapContainer').hide();


});

