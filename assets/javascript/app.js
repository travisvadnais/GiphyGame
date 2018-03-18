$(document).ready(function () {

    //array to hold the initial list of bands
    var topics = ["Tampa Bay Buccaneers", "Seattle Seahawks", "Philadelphia Eagles", "Green Bay Packers"];
    setupBoard();

    function setupBoard() {
    
        //Loop through each array element
        for (var i = 0; i < topics.length; i++) {
            //Generate a button for each array element and add it to the div.  Note I am appending the 'data-band' attribute here as well
            $(".button_div").append("<button type='button' class='btn btn-danger add_button' state='still' data-team='" + topics[i] + "'>" + topics[i] + "</button>");
        }
        
        //Set up a button-click listener
        $(".add_button").on("click", function() {
            
            //Set up variable to grab the 'data-band' value of the clicked button
            var team = $(this).attr("data-team");

            //Variable to hold API Key
            var apiKey = "&api_key=7p715sLTbzL1CUqM6yIB6qMKLQ0dWXx6"

            //Variable to hold the # of results
            var limit = "&limit=10"

            //Set up a variable to hold the entire query URL
            var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + team + apiKey + limit;

            // Perform an AJAX request with the queryURL
            $.ajax({
                url: queryURL,
                method: "GET"
            })

                // After data comes back from the request
                .then(function(response) {
                    console.log(queryURL);
        
                    console.log(response);
                    // storing the data from the AJAX request in the results variable
                    var results = response.data;

                    // Loops through the 10 results
                    for (var i = 0; i < results.length; i++) {
                        
                        //Variables to hold div & image tags
                        var giphyDiv = $("<div>");
                        var teamImg = $("<img>");
                        
                        //Variable to hold paragraph text
                        var p = $("<p>").text("Rating: " + results[i].rating).attr("display", "inline");

                        //add the image source attr to the image tag
                        teamImg.attr("src", results[i].images.fixed_width_still.url);
                        teamImg.addClass("teamImage");
                        teamImg.attr("img-freeze", results[i].images.fixed_width_still.url);
                        teamImg.attr("img-active", results[i].images.fixed_width.url);
                        
                        //This is essentially a flag.  We're starting on 'still' but can toggle to active
                        teamImg.attr("current-state", "still");

                        //append the loaded up image tag to the new giphy div
                        giphyDiv.append(teamImg);
                        
                        //append the paragraph content to the new div
                        giphyDiv.append(p);
                        
                        //adds the gif to the top of the giphy_container div
                        $(".giphy_holder").prepend(giphyDiv);
                    }
                });        
        });
    }
    //Set up a giphy click event.  Note - must use document b/c img did not exist when dom loaded
    $(document).on('click', ".teamImage", function() {
        
        //store the current state in a variable for convenience
        var currentState = $(this).attr("current-state");
        
        //check current state of the giphy
        if (currentState === "still") {
            //if it's 'still', we'll change the img scr to the active URL
            $(this).attr("src", $(this).attr("img-active"));
            //and we'll also set the flag to 'active'
            $(this).attr("current-state", "active");
        }
        else {
            $(this).attr("src", $(this).attr("img-freeze"));
            $(this).attr("current-state", "still");
        }
    });

    //set up on click function for search feature
    $("#submit").on("click", function() {
        
        //set up variable to capture the user input
        var newTeam = $("#user_input").val();
        console.log(newTeam);

        //empty the search field
        $("#user_input").val("");

        //push the new team into the array of teams
        topics.push(newTeam);

        //Clear out all the existing buttons
        $(".button_div").empty();

        //Run the setupBoard function again to populate the new button
        setupBoard();
    });





});