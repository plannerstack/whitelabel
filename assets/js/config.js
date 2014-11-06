var whitelabel_minDate = new Date();
var whitelabel_maxDate = new Date();
whitelabel_maxDate.setDate(whitelabel_maxDate.getDate()+31);

var config = {
    whitelabel_prefix   : 'https://1313.nl',
    whitelabel_plan_path: 'rrrr',
    route_planner       : 'bliksem',    // bliksem || otp
    geocoder            : 'bliksem',    // bliksem || bag42
    requestGenerator    : 'bliksem',    // bliksem || otp
    modes               : ['TRANSIT'],  // TRANSIT && CAR
    default_mode        : 'TRANSIT',    // TRANSIT || CAR
    locale              : 'nl'          // nl || fy || en
};


var otpConfig = {
    whitelabel_prefix   : 'http://opentripplanner.nl',
    whitelabel_plan_path: 'otp/routers/default/plan',
    route_planner       : 'otp',
    geocoder            : 'bag42',
    requestGenerator    : 'otp',
    modes               : ['TRANSIT', 'CAR'],
    default_mode        : 'TRANSIT',
    locale              : 'en'
};


config = otpConfig;