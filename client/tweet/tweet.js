function twitter (hashtag,retweeted){
    this.api = "/twitter/search";
    this.hashTag = hashtag;
    this.retweeted = retweeted || true;
}

twitter.prototype.loadTweets = function(selector,retweeted)
{
    this.retweeted = retweeted;
    $.ajax({
        method: "POST",
        url: this.api+"?"+this.getQueryString(),
        data: JSON.stringify(this.getSearchRequestBody()),
        headers: {"Content-Type":"application/json"}
    }).
    done(function(resp) {
        var html = "";
        for (var i in resp){
            html = html +  "<div class='tweet'>"+resp[i].text+"</div>";
        }
        if(resp.length <=0){
            html = html +  "<div>"+"Couldn't get any results for given criteria"+"</div>"
        }
        $(selector).html(html);
    });
};

twitter.prototype.getQueryString = function(){
    var queryString = "";
    if(this.hashTag){
        queryString = "q="+encodeURIComponent(this.hashTag)+"&";
    }
    queryString = queryString + "&result_type=recent&count=100";
    return queryString;
}

twitter.prototype.getSearchRequestBody = function(){
    var body = [];
    if(this.retweeted){
        body[0]={};
        body[0].key = "retweet_count";
        body[0].value = "0";
        body[0].comparator = "1";
    }
    else {
        body[0]={};
        body[0].key = "retweet_count";
        body[0].value = "0";
        body[0].comparator = "0";
    }
    return body;
}