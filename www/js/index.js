/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {


    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        var viewButtons = document.querySelectorAll('button[data-view]');
        for(var i =0; i < viewButtons.length; ++i){
            viewButtons[i].addEventListener('click', app.showView);
        }
        var actionButtons = document.querySelectorAll('button[data-action]');
        for(var i =0; i < actionButtons.length; ++i){
            actionButtons[i].addEventListener('click', app.handleClick);
        }
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        //$('input-clientid').value = app.clientId;
        //$('input-secret').value = app.secret;
        //$('input-username').value = app.user.name;
        //$('input-email').value = app.user.email;

        if(cordova.plugins.inBeacon){

            document.addEventListener('inbeacon.enterregion', app.inBeaconEvents, false);
            document.addEventListener('inbeacon.exitregion', app.inBeaconEvents, false);
            document.addEventListener('inbeacon.enterlocation', app.inBeaconEvents, false);
            document.addEventListener('inbeacon.exitlocation', app.inBeaconEvents, false);
            document.addEventListener('inbeacon.regionsupdate', app.inBeaconEvents, false);
            document.addEventListener('inbeacon.enterproximity', app.inBeaconEvents, false);
            document.addEventListener('inbeacon.exitproximity', app.inBeaconEvents, false);
            document.addEventListener('inbeacon.proximity', app.inBeaconEvents, false);
            document.addEventListener('inbeacon.appevent', app.inBeaconEvents, false);			// this is it!
            document.addEventListener('inbeacon.appaction', app.inBeaconEvents, false);

            app.initInBeacon();
        }
    },

    inBeaconEvents: function (e) {
        app.log('INBEACONEVENT!!!! event: ' + e.name + ' data: ' + JSON.stringify(e.data));
    },

    initInBeacon: function () {
		app.log('init-inbeacon is OBSOLETE');
    },

    log: function (message, type) {
        type = type || "Log";
        var now = new Date().toTimeString();
        console.log(now + ": " + message);
        //$('logger').innerHTML += "<div class='"+type.toLowerCase()+"'>[" + now + "] " + type + ":<br/>" + message + "</div>";
    },

    error: function (message) {
        app.log(message, 'Error');
    },

    showView: function (e) {
        var button = this;
        if(button.disabled) return;
        button.disabled = true;
        removeClass(document.querySelector('#footer button.active'), 'active');
        addClass(this, 'active');

        var activeView = document.querySelector('.view.active');
        //removeClass(activeView, 'slide-in');
        addClass(activeView, 'slide-out');
        var view = $(button.dataset.view);
        view.style.zIndex = 100;
        addClass(view, 'slide-in active');
        setTimeout(function () {

            removeClass(activeView, 'slide-out slide-in active');

            button.disabled = false;
        }, 1000);
    },

    handleClick: function (e) {
        app[this.dataset.action].apply(app, []);
    },

    refresh: function () {
        cordova.plugins.inBeacon.refresh(function(){
            app.log('refresh done!');
        }, function () {
            app.error('refresh failed');
        });
    },
    triggerCustomEvent: function () {
        cordova.plugins.inBeacon.triggerCustomEvent(44,'oneshot','hallo', function(){
            app.log('trigger done!');
        }, function (error) {
            app.error('trigger failed:'+error);
        });
    },
	
    putProperties: function () {
        var userInfo = {
            name  : 'pietje puk',
            email : 'pietje@pukuniversity.com',
			afstand : 20.7,
			hoogte: 14
        };
        cordova.plugins.inBeacon.putProperties(userInfo, function () {
            app.log('Succesfully put properties: '+userInfo);
        }, function () {
            app.error('Failed to put properties');
        });
    },
    getProperty: function () {

        cordova.plugins.inBeacon.getProperty('name', function (value) {
            app.log('Succesfully get property name:'+value);
        }, function () {
            app.error('Failed to get property name. Does not exist');
        });
        cordova.plugins.inBeacon.getProperty('afstand', function (value) {
            app.log('Succesfully get property afstand:'+value);
        }, function () {
            app.error('Failed to get property afstand. Does not exist');
        });
        cordova.plugins.inBeacon.getProperty('hoogte', function (value) {
            app.log('Succesfully get property hoogte:'+value);
        }, function () {
            app.error('Failed to get property hoogte. Dioes not exist');
        });
    },
    detachUser: function () {
        cordova.plugins.inBeacon.detachUser(function () {
            app.log('OBSOLETE detachUser');
        }, function () {
            app.error('Failed to detach user');
        });
    },

    askPermissions: function() {
        cordova.plugins.inBeacon.askPermissions(function () {
            app.log('askPermissions has been called succesfully');
        }, function (error) {
            app.error('askPermissions failed: ' + error);
        });
    },

    checkCapabilitiesAndRights: function () {
        cordova.plugins.inBeacon.checkCapabilitiesAndRights(function () {
            app.log('checkCapabilitiesAndRights: Everything is awesome');
        }, function (error) {
            app.error('Oops, we have a problem: ' + error);
        });
    },

    checkCapabilitiesAndRightsWithAlert: function () {
        cordova.plugins.inBeacon.checkCapabilitiesAndRightsWithAlert(function () {
            app.log('checkCapabilitiesAndRightsWithAlert has been called succesfully');
        }, function (error) {
            app.error('Oops, we have a problem: ' + error);
        });
    },

    getInRegions: function () {
        cordova.plugins.inBeacon.getInRegions(function (regions) {
            app.log('Regions ' + JSON.stringify(regions));
        }, function (error) {
            app.error('Oops, we have a problem: ' + error);
        });
    },

    getBeaconState: function () {
        cordova.plugins.inBeacon.getBeaconState(function (beacons) {
            app.log('Beacons ' + JSON.stringify(beacons));
        }, function (error) {
            app.error('Oops, we have a problem: ' + error);
        });
    },
	
	setLogLevel: function () {
        cordova.plugins.inBeacon.setLogLevel(cordova.plugins.inBeacon.LOG_INFO, function () {
            app.log('set loglevel to INFO');
        }, function (error) {
            app.error('Oops, we have a problem: ' + error);
        });
	}
};

function $(id){
    return document.getElementById(id);
}

function addClass(el, className){
    var classNames = className.split(" ");
    if(el != "[object NodeList]"){
        el = [el];
    }

    for(var i = 0; i < el.length; ++i){
        for(var j =0 ; j < classNames.length; ++j) {
            if (!el[i].classList.contains(classNames[j])) {
                el[i].classList.add(classNames[j]);
            }
        }
    }
}
function removeClass(el, className){
    var classNames = className.split(" ");
    if(el != "[object NodeList]"){
        el = [el];
    }

    for(var i = 0; i < el.length; ++i){
        for(var j =0 ; j < classNames.length; ++j) {
            if (el[i].classList.contains(classNames[j])) {
                el[i].classList.remove(classNames[j]);
            }
        }
    }
}

app.initialize();
