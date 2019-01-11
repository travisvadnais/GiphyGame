$(document).ready(() => {

  //This is a magic script I found on StackOverflow to disable the 'Submit' button when the user presses 'Enter' b/c it was causing the page to reload.  It also turns the 'Enter' keystroke into a 'Submit' button click event to run all the functionality down below.
  $(document).on('keyup keypress', 'form input[type="text"]', ((e) => {
    if(e.which == 13) {  //Checks to see if the button was 'Enter'
      e.preventDefault();  //If so, it prevents the default action, which was to reload the page
      $("#submit").click();  //Then it clicks the 'Submit' button, as that was what the user intended
      return false;
    }
  }));

  let topics = ["Tampa Bay Buccaneers", "New York Giants", "New York Jets", "Washington Redskins", "Baltimore Ravens", "Denver Broncos", "Jacksonville Jaguars", "Miami Dolphins", "New England Patriots", "Seattle Seahawks", "Philadelphia Eagles", "Green Bay Packers"];

  setupBoard(); // Global

  function setupBoard() {
    //Make sure the new user input is added alphabetically
    topics = topics.sort();
    topics.map((_val, i) => $(".button_div").append(`<button type="button" class="btn btn-danger add_button" state="still" data-team="${topics[i]}">${topics[i]}</button`));
    
    //Set up a button-click listener
    $(".add_button").on("click", function() {
        
      //Set up variable to grab the 'data-band' value of the clicked button
      let team = $(this).attr("data-team");

      //API Key / Limit / Complete URL
      let apiKey = "&api_key=7p715sLTbzL1CUqM6yIB6qMKLQ0dWXx6"
      let limit = "&limit=9"
      let queryURL = `https://api.giphy.com/v1/gifs/search?q=${team}${apiKey}${limit}`;

      // Perform an AJAX request with the queryURL
      $.ajax({
        url: queryURL,
        method: "GET"
      })
        .then((response) => {
          const results = response.data;
          results.map((_val, i) => {
            //Variables to hold div & image tags & <p> text
            let giphyDiv = $("<div class='giphy_div'>");
            let teamImg = $("<img>");
            let imgLabel = $("<span class='label'>").text(`Rating: ${results[i].rating.toUpperCase()}`);

            //Load up the <img> tag
            teamImg.attr("src", results[i].images.downsized_still.url)
                  .addClass("teamImage")
                  .attr("img-freeze", results[i].images.downsized_still.url)
                  .attr("img-active", results[i].images.downsized.url)
                  .attr("current-state", "still"); //This is a flag - you can toggle to 'active'
            //append the loaded up image tag & <p> content to the new giphy div
            giphyDiv.append(teamImg).append(imgLabel);
            //adds the gif to the top of the giphy_container div
            $(".giphy_holder").prepend(giphyDiv);
          })
        });        
    });
  }
  //Set up a giphy click event.  Note - must use document b/c img did not exist when dom loaded
  $(document).on('click', ".teamImage", function() {
    const currentState = $(this).attr("current-state");

    //Toggle between active & still giphy.  ***TERNARY***
    (currentState === "still") ? $(this).attr("src", $(this).attr("img-active")).attr("current-state", "active") : $(this).attr("src", $(this).attr("img-freeze")).attr("current-state", "still")
  });

  //set up on click function for search feature
  $("#submit").on("click", (() => {
    let newTeam = $("#user_input").val();

    //empty the search field
    $("#user_input").val("");

    //Now we need to run some validation.  First, create two a new uppercase array and convert team name to uppercase for comparison
    let convertedNewTeam = newTeam.toUpperCase();
    let convertedTopics = topics.map((_val, j) => topics[j].toUpperCase());

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
      setupBoard();
      //End the loop
      return;
    }

    //This function formats the user's input and capitalizes the first letter of each word
    function formatInput(team) {
      return team.replace(/\w\S*/g, ((txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()));
    }
  }));
});