require("dotenv").config();

var keys = require("./keys.js");
var request = require('request')
var moment = require('moment')
var fs = require("fs")
var media = process.argv.slice(3).join(" ")

// SPOTIFY 
// 'node liri.js spotify-this-song "<song name here>"'
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);


if (process.argv[2] == "spotify-this-song") {
    spotify
        .search({ type: 'track', query: media })
        .then(function (response) {
            var songData = response.tracks.items
            for (var i in songData) {
                console.log("----------------------")
                console.log("   ")
                console.log(i)
                console.log("The artist is: " + songData[i].artists[0].name);
                console.log("The song name is: " + songData[i].name);
                console.log("The album is called: " + songData[i].album.name)
                console.log("Here is a preview...: " + songData[i].preview_url)
                console.log("   ")
                console.log("----------------------")
            }
        })
        .catch(function (err) {
            console.log(err);
        });
}

// =============================================================================================================================
// =============================================================================================================================
// =============================================================================================================================



// OMBD 
// `node liri.js movie-this '<movie name here>'`

function ombdFunct() {
    var movieName = "";
    for (var i = 3; i < process.argv.length; i++) {
        if (i !== 3) movieName += "+"
        movieName += process.argv[i];
    }
    if (process.argv[2] == "movie-this") {
        request("http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy", function (error, response, body) {
            if (!error && response.statusCode === 200) {
                console.log("----------------------------")
                console.log("   ")
                console.log("Title: " + JSON.parse(body).Title);
                console.log("IMBD Rating: " + JSON.parse(body).imdbRating);
                console.log("Released: " + JSON.parse(body).Released)
                console.log("Country: " + JSON.parse(body).Country)
                console.log("Language: " + JSON.parse(body).Language)
                console.log("Plot: " + JSON.parse(body).Plot)
                console.log("Actors: " + JSON.parse(body).Actors)
                console.log(JSON.parse(body).Ratings[1].Source + ": " + JSON.parse(body).Ratings[1].Value)
                console.log("   ")
                console.log("----------------------------")
            }
        })
    }
}
ombdFunct();

// =============================================================================================================================
// =============================================================================================================================
// =============================================================================================================================


// BandsInTown
// `node liri.js concert-this <artist/band name here>`

function bandsFunct() {
    var artist = "";
    for (var i = 3; i < process.argv.length; i++) {
        if (i !== 3) artist += "-"
        artist += process.argv[i];
    }
    if (process.argv[2] == "concert-this") {
        request("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp", function (error, response, body) {
            var body = JSON.parse(body)
            console.log("    ")
            console.log("-------------------------------------")
            console.log("    ")
            console.log("Upcoming concerts for " + artist + ": ");
            console.log("   ")
            for (var set in body) {
                var date = moment(body[set].datetime).format("MM/DD/YYYY")
                console.log(body[set].venue.city + ", " + "at " + body[set].venue.name + ", " + "on " + date)
            }
            console.log("    ")
            console.log("-------------------------------------")
            console.log("    ")
        })
    }

}
bandsFunct();

// =============================================================================================================================
// =============================================================================================================================
// =============================================================================================================================

// Do what it says
function randomTxtFunct() {
    if (process.argv[2] == "do-what-it-says") {
        fs.readFile("random.txt", "utf8", function (error, data) {

            //declare a variable, split the text in data by ",", store it as an array
            var dataArr = data.split(", ");
            console.log(dataArr)

            var command = dataArr[0]
            if (command == "spotify-this-song") {
                console.log("Spotify")
            }

            if (command == "movie-this") {
                console.log("Movie")
            }

            if (command == "concert-this") {
                console.log("Concert")
            }
        })
    }
}
randomTxtFunct()
