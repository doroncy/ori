'use strict';

var Promise = require("bluebird"),
    _ = require("lodash");

var MCapi = require('mailchimp-api');
var mc = new MCapi.Mailchimp('b767a6ee8cbbb75bd1137f96e4a1c0f7-us10');


module.exports = {
    addUserToMailchimp: addUserToMailchimp
};

/**
 * Add subscriber to mailchimp
 */
function addUserToMailchimp(user, callback) {

    var mcReq = {
        id: '76b91e4123',
        email: { email: user.email },
        double_optin: false,
        send_welcome: true,
        merge_vars: {
            EMAIL: user.email,
            FNAME: user.name.substring(user.name.lastIndexOf(" ")+1),
            LNAME: user.name.split(' ')[0]
        }
    };
    //console.log("mcReq", mcReq);

// submit subscription request to mail chimp
    mc.lists.subscribe(mcReq, function(data) {
        console.log('success:', data);
        _.isFunction(callback) && (callback());
    }, function(error) {
        console.log(error);
        _.isFunction(callback) && (callback());
    });
}
