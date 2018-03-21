$(document).ready(function () {

    //This is a magic script I found on StackOverflow to disable the 'Submit' button when the user presses 'Enter' b/c it was causing the page to reload.  It also turns the 'Enter' keystroke into a 'Submit' button click event to run all the functionality down below.
    $(document).on('keyup keypress', 'form input[type="text"]', function(e) {
        //Checks to see if the button was 'Enter'
        if(e.which == 13) {
            //If so, it prevents the default action, which was to reload the page
            e.preventDefault();
            //Then it clicks the 'Submit' button, as that was what the user intended
            $("#submit").click();
            return false;
        }
    });

    //array to hold the initial list of bands
    var topics = ["Tampa Bay Buccaneers", "New York Giants", "New York Jets", "Washington Redskins", "Baltimore Ravens", "Denver Broncos", "Jacksonville Jaguars", "Miami Dolphins", "New England Patriots", "Seattle Seahawks", "Philadelphia Eagles", "Green Bay Packers"];

    //Alphabetize the array
    topics = topics.sort();

    //Run the function to generate all the buttons
    setupBoard();

    function setupBoard() {

        //Make sure the new user input is added alphabetically
        topic = topics.sort();
    
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
            var limit = "&limit=9"

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
                        var giphyDiv = $("<div class='giphy_div'>");
                        var teamImg = $("<img>");
                        
                        //Variable to hold paragraph text
                        var imgLabel = $("<span class='label'>").text("Rating: " + results[i].rating.toUpperCase());

                        //add the image source attr to the image tag
                        teamImg.attr("src", results[i].images.downsized_still.url);
                        teamImg.addClass("teamImage");
                        teamImg.attr("img-freeze", results[i].images.downsized_still.url);
                        teamImg.attr("img-active", results[i].images.downsized.url);
                        
                        //This is essentially a flag.  We're starting on 'still' but can toggle to active
                        teamImg.attr("current-state", "still");

                        //append the loaded up image tag to the new giphy div
                        giphyDiv.append(teamImg);
                        
                        //append the paragraph content to the new div
                        giphyDiv.append(imgLabel);
                        
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

        //Now we need to run some validation.  First, create two a new uppercase array and convert team name to uppercase for comparison
        var convertedTopics = [];
        var convertedNewTeam = newTeam.toUpperCase();

        //Run a loop to convert all array elements to uppercase and push to the new array
        for (var j = 0; j < topics.length; j++) {
            convertedTopics[j] = topics[j].toUpperCase();
            convertedTopics.push(convertedTopics[j]);
        }

        //if the new team matches anything in the array or it's too short, we'll stop this function
        if ((convertedTopics.indexOf(convertedNewTeam) != -1) || (newTeam.length < 4)) {
            return;
        }            

        // If both tests pass
        else {    
            //we're going to format the input and push that value to the topics array
            topics.push(formatInput(newTeam));
            //Clear out all the existing buttons
            $(".button_div").empty();
            //Run the setup function again
            setupBoard();
            //End the loop
            return;
        }

        //This function formats the user's input and capitalizes the first letter of each word
        function formatInput(team) {
            return team.replace(/\w\S*/g, function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
        }
    });


    //TO-DO LIST
    // 1. Fix Input Check Loop b/c it's still adding a button even if it fails the duplicate check - DONE
    // 2. Disable 'Enter' key on the form b/c it's causing the page to reload - DONE
    // 3. Try to make the Giphy pulls random instead of always pulling the same 10
    // 4. Add Media Query for mobile so GIFs take up 100% of the div - DONE
    // 5. Add rating beneath the GIF - DONE




});