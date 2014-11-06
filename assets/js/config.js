var whitelabel_minDate = new Date();
var whitelabel_maxDate = new Date();
whitelabel_maxDate.setDate(whitelabel_maxDate.getDate()+31);

var bliksemConfig = {
    whitelabel_prefix   : 'https://1313.nl',
    whitelabel_plan_path: 'rrrr',
    route_planner       : 'bliksem',
    geocoder            : 'bliksem',
    requestGenerator    : 'bliksem'
};

var otpConfig = {
    whitelabel_prefix   : 'http://opentripplanner.nl',
    whitelabel_plan_path: 'otp/routers/default/plan',
    route_planner       : 'otp',
    geocoder            : 'bag42',
    requestGenerator    : 'otp'
};



var config = otpConfig; // TODO: do something with defaults and $.extend ;)
// config = bliksemConfig;