"use strict";
var request = require('request'),
    endPoints = require("./endpoint.js"),
    utils = require("./utility.js"),
    config = require("config"),
    logger = require("log4js").getLogger();


module.exports = {
    getTweetsWithHashTagHandler: function (req, res) {
        utils.getAuthorisationToken().then(
            function (authorizationToken) {
                if (authorizationToken && authorizationToken.token_type && authorizationToken.access_token) {
                    request.get(
                        {
                            url: config.twitter.url + endPoints.search.url + "?" + utils.getQueryString(req.query),
                            headers: {
                                "Authorization": authorizationToken.token_type + " " + authorizationToken.access_token,
                                "Content-Type": "application/json"
                            },
                            json: true
                        },
                        function (err, httpResponse, body) {
                            if (err) {
                                res.status("500").send(err);
                                logger.error(err);
                            }
                            else if (httpResponse.statusCode == 200) {
                                res.status(httpResponse.statusCode).send(utils.searchResultFilter(body,req.body));
                            }
                            else {
                                res.status(httpResponse.statusCode).send(httpResponse.body);
                            }
                            logger.info("getTweetsWithHashTagHandler: StatusCode:",httpResponse.statusCode," body:",httpResponse.body);

                        }
                    )
                }
                else {
                    res.status("500").send("getTweetsWithHashTagHandler: INVALID AUTH TOKEN");
                }
            }
            ,
            function (err) {
                res.status("500").send("getTweetsWithHashTagHandler : ERROR IN GETTING AUTH TOKEN");
            }
        )
    }
}