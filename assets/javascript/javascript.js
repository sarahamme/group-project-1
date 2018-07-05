
$(document).ready(function () {



function searchCity(){
    // Here we are building the URL we need to query the database
    let cityName = $("#city").val().trim()
    let APIKey = "a8f2d039233b7e6b72c776b295650715";

    let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;
    
    console.log(cityName);
    // Here we run our AJAX call to the OpenWeatherMap API
    $.ajax({
      url: queryURL,
      method: "GET"
    })
      // We store all of the retrieved data inside of an object called "response"
      .then(function(response) {

        // Transfer content to HTML
        $(".city").html("<h1>" + response.name + " Weather Details</h1>");
        $(".wind").text("Wind Speed: " + response.wind.speed);
        $(".humidity").text("Humidity: " + response.main.humidity);
        $(".temp").text("Temperature (F) " + response.main.temp);

  
      });
    };

      $("#submit-button").on("click", function(event) {
        event.preventDefault();
        // This line grabs the input from the textbox
        let cityName = $("#city").val().trim()
        searchCity();

      });

  

    });