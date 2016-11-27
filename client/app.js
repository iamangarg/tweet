"use strict";
$( document ).ready(function() {
    var tweets = new twitter("#custserv");
    tweets.loadTweets("#tweets",true);
});