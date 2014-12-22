/**
 * 
 * Router
 * 
 * First router in array of sources is set as default when opened
 * After that you can can get and set the current router with
 *
 * getCurrentRouter
 * getAllRouters
 * getRouterById
 * setRouterById
 * requestParamsTransform (general requestParams) => (router specific requestParams)
 * getSupportedModes
 * getUrl
 * doRequest
 *
 * 
 */

var Router = Router || {};

Router['sources'] = [
    {
        name: "OTP",
        id: 'demo-otp',
        url: 'http://demo.planner.plannerstack.org/otp/routers/default/plan',
        modes: ['TRANSIT','CAR'],
        requestParamsTransform: function (plannerreq) {
            // TODO: Just use $.extend()
            // ?fromPlace=52.008978039788076%2C4.3608856201171875&toPlace=51.918861649083915%2C4.478302001953125&time=10%3A11am&date=11-06-2014&mode=BICYCLE_PARK%2CWALK%2CTRANSIT&maxWalkDistance=804.672&arriveBy=false&wheelchair=false&showIntermediateStops=false
            var otpReq = {};
            otpReq['arriveBy']              = plannerreq['arriveBy'];
            otpReq['fromPlace']             = plannerreq['fromLatLng'];
            otpReq['toPlace']               = plannerreq['toLatLng'];
            otpReq['date']                  = plannerreq['date'];
            otpReq['time']                  = plannerreq['time'];
            otpReq['showIntermediateStops'] = plannerreq['showIntermediateStops'];
            otpReq['mode']                  = plannerreq['mode'];
            // TODO: Allow these to be set through the UI?
            otpReq['maxWalkDistance']       = 2000;
            return otpReq;
        }
    },
    {
        name: "Bliksem",
        id: "bliksem",
        url: 'https://1313.nl/rrrr',
        modes: ['TRANSIT'],
        requestParamsTransform: function (plannerreq) {
            var bliksemReq = {};
            if (plannerreq['arriveBy']){
                bliksemReq['arrive'] = true;
            }else{
                bliksemReq['depart'] = true;
            }

            bliksemReq['from-latlng'] = plannerreq['fromLatLng'];
            bliksemReq['to-latlng'] = plannerreq['toLatLng'];
            bliksemReq['date'] = plannerreq['date'] + 'T' + plannerreq['time'];
            bliksemReq['showIntermediateStops'] = true;
            return bliksemReq;
        }
    }
];

Router['currentId'] = null;

Router['getCurrentRouter'] = function () {
    if (!Router['currentId']) {
        return null;
    }
    return Router['getRouterById'](Router['currentId']);
};

Router['getRouterById'] = function (id) {
    if (!id) {
        console.error("getRouterById:: Couldn't get router, no id passed along");
        return null;
    }

    for (var i = Router['sources'].length - 1; i >= 0; i--) {
        if (Router['sources'][i].id === id){
            return Router['sources'][i];
        }
    }
    console.error("getRouterById:: Couldn't set router, no router found with id");
    return null;
};

Router['getAllRouters'] = function () {
    return Router['sources'];
};

// Returns null or succesfully set router object
Router['setRouterById'] = function (id) {
    if (!id) {
        return null;
    }
    if (Router.getCurrentRouter() && Router.getCurrentRouter().id === id ) {
        return null;
    }
    for (var i = Router['sources'].length - 1; i >= 0; i--) {
        if (Router['sources'][i].id === id){
            Router['currentId'] = Router['sources'][i].id;
            return Router['currentId'];
        }
    }
    console.error("setRouterById:: Couldn't set router, no router found with id");
    return null;
};


// returns object
Router['requestParamsTransform'] = function (plannerreq) {
    var router = Router.getCurrentRouter();
    if (router) {
        return router.requestParamsTransform(plannerreq);
    } else {
        console.error('no router set up');
        return plannerreq;
    }
};

// returns array of strings
Router['getSupportedModes'] = function () {
    var router = Router.getCurrentRouter();
    if (router) {
        return router.modes;
    } else {
        console.error('no router set up');
        return [];
    }
};

// returns string
Router['getUrl'] = function () {
    var router = Router.getCurrentRouter();
    if (router) {
        return router.url;
    } else {
        console.error('no router set up');
        return [];
    }
};

Router['getContext'] = function () {
    var current = Router.getCurrentRouter();
    var all = Router.getAllRouters();
    var context = {
        'routers' : [],
        'current' : $.extend({}, current)
    };
    var _router = {};
    for (var i = 0; i < all.length; i++) {
        _router = {
            'name': all[i]['name'],
            'id': all[i]['id'],
            'selected': all[i]['id'] === current.id
        };
        context['routers'].push(_router);
    }
    return context;
};

// callback(data)
Router['doRequest'] = function (generalParams, callback) {
    var requestUrl = Router.getUrl() +'?'+ jQuery.param(Router.requestParamsTransform(generalParams));
    $.get( requestUrl, function( data ) {
        if (callback) {
            callback(data);
        }
    });
};

// 'init'
Router['setRouterById'](Router['sources'][0].id);