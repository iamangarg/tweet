var config = require("config"),
    request = require("request"),
    endPoints = require("./endpoint.js"),
    base64 = require("base-64"),
    utf8 = require('utf8'),
    Promise = require("promise"),
    _ = require('lodash'),
    logger = require("log4js").getLogger();

var globalVariables = {
    authorisationToken: ""
};

//create Encoded string from tokenObject and type, in a format specified by property object
var getBase64EncodedToken = function (type, propertyObject, tokenObject) {
    var encodedString = type + " ";
    var token = "";
    if (Object.keys(propertyObject).length == 1) {
        token = token + tokenObject[Object.keys(propertyObject)[0]];
        token = token + ":" + tokenObject[
                propertyObject[
                    Object.keys(propertyObject)[0]
                    ]
                ];
    }
    else {
        logger.error("getBase64EncodedToken:ERROR in Creating encoded String");
        return -1;
    }
    encodedString = encodedString + base64.encode(utf8.encode(token));
    return encodedString;

};

module.exports = {
    getAuthorisationToken: function () {
        if (!globalVariables.authorisationToken) {
            var promise = new Promise(function (resolve,reject) {
                request.post(
                    {
                        url: config.twitter.url + endPoints.authorisationToken.url,
                        headers: {
                            "Authorization": getBase64EncodedToken("Basic", {"Consumer_Key": "Consumer_Secret"}, config.twitter.auth),
                            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
                        },
                        form: {
                            "grant_type": "client_credentials"
                        },
                        json: true
                    },
                    function (err, httpResponse, body) {
                        if (err) {
                            logger.error("getAuthorisationToken:",err);
                            reject(err);
                        }
                        else if (httpResponse.statusCode == 200) {
                            logger.info("getAuthorisationToken: StatusCode:",httpResponse.statusCode," body:",httpResponse.body);
                            globalVariables.authorisationToken = body;
                            resolve(globalVariables.authorisationToken);
                        }
                        else {
                            logger.error("getAuthorisationToken: StatusCode:",httpResponse.statusCode," body:",httpResponse.body);
                            reject(httpResponse.body);
                        }
                    }
                )
            });
            return promise;
        }
        else {
            return Promise.resolve(globalVariables.authorisationToken);
        }
    },
    getQueryString: function (params) {
        var queryString = "";
        var count = 1;
        for (var i in params) {
            if (count < Object.keys(params).length) {
                queryString = queryString + encodeURIComponent(i) + "=" + encodeURIComponent(params[i]) + "&";
            }
            else {
                queryString = queryString + encodeURIComponent(i) + "=" + encodeURIComponent(params[i]);
            }
            count++;

        }
        logger.info("getQueryString:",queryString);
        return queryString;
    },
    searchResultFilter: function (result, filterObject) {
        if(result && result.statuses){
            var output = result.statuses;
        }
        for(var i in filterObject){
            if (output && filterObject[i]["comparator"] && filterObject[i]["key"] && filterObject[i]["value"]) {
                return _.filter(output, function (o) {
                    if(filterObject[i]["comparator"] < 0){
                        return o[filterObject[i]["key"]] < filterObject[i]["value"];
                    }
                    else if(filterObject[i]["comparator"] == 0){
                        return o[filterObject[i]["key"]] = filterObject[i]["value"];
                    }
                    else {
                        return o[filterObject[i]["key"]] > filterObject[i]["value"];
                    }
                });
            }
            else {
                logger.error("searchResultFilter: Unable to filter Results, invalid filter");
                return;
            }
        }
        logger.info("searchResultFilter: ",output);
        return output;

    }
}