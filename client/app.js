$(document).load = function(){
    var tweets = new twitter("#custserv");
    tweets.loadTweets(true);
};
$( document ).ready(function() {
    var tweets = new twitter("#custserv");
    tweets.loadTweets("#tweets",true);
});