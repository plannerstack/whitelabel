var planningserver = config.whitelabel_prefix+'/'+config.whitelabel_plan_path+'?';

String.prototype.lpad = function(padString, length) {
    var str = this;
    while (str.length < length)
        str = padString + str;
    return str;
};

jQuery.unparam = function (value) {
    if (value.length > 1 && value.charAt(0) == '#'){
        value = value.substring(1);
    }
    var
    // Object that holds names => values.
    params = {},
    // Get query string pieces (separated by &)
    pieces = value.split('&'),
    // Temporary variables used in loop.
    pair, i, l;

    // Loop through query string pieces and assign params.
    for (i = 0, l = pieces.length; i < l; i++) {
        pair = pieces[i].split('=', 2);
        // Repeated parameters with the same name are overwritten. Parameters
        // with no value get set to boolean true.
        params[decodeURIComponent(pair[0])] = (pair.length == 2 ?
            decodeURIComponent(pair[1].replace(/\+/g, ' ')) : true);
    }
    return params;
};

$(document).ready(function() {
  initializeForms();
  if(window.location.hash) {
    restoreFromHash(window.location.hash);
  }
});
var currentTime = new Date();

var defaultGeocoders = {};
defaultGeocoders['bag42'] = function( request, response ) {
  $.ajax({
    url: "http://bag42.nl/api/v0/geocode/json",
    dataType: "json",
    data: {
      address : request.term
    },
    success: function( data ) {
      response( $.map( data.results, function( item ) {
      return {
        label: item.formatted_address,
        value: item.formatted_address,
        latlng: item.geometry.location.lat+','+item.geometry.location.lng
        };
      }));
    }
  });
};

defaultGeocoders['bliksem'] = function( request, response ) {
  $.ajax({
    url: config.whitelabel_prefix+"/geocoder/" + request.term + '*',
    dataType: "json",
    success: function( data ) {
      response( $.map( data.features, function( item ) {
      return {
        label: item.properties.search,
        value: item.properties.search,
        latlng: item.geometry.coordinates[1]+','+item.geometry.coordinates[0]
        };
      }));
    }
  });
};


var Geocoder = Geocoder || {};
Geocoder.geocoder = defaultGeocoders[config.geocoder];

switchLocale();

function initializeForms(){
    setupAutoComplete();
    setupDatetime();
    setupSubmit();
    if ($( "#planner-options-from" ).val() === ''){
        $( "#planner-options-from-latlng" ).val('');
    }
    if ($( "#planner-options-dest" ).val() === ''){
        $( "#planner-options-dest-latlng" ).val('');
    }
}

function validate(){
    var valid = true;

    if ($( "#planner-options-from" ).val() === ''){
        $( "#planner-options-from-latlng" ).val('');
    }
    if ($( "#planner-options-dest" ).val() === ''){
        $( "#planner-options-dest-latlng" ).val('');
    }
    $( "#planner-options-from-error" ).remove();
    if ($( "#planner-options-from" ).val() === ''){
        $( "<div class=\"alert alert-danger\" role=\"alert\" id=\"planner-options-from-error\" for=\"planner-options-from\">"+Locale.startpointEmpty+"</div>").insertAfter("#planner-options-inputgroup-from");
        $( "#planner-options-from" ).attr('aria-invalid',true);
        valid = false;
    }else if ($( "#planner-options-from-latlng" ).val() === ''){
        $( "<div class=\"alert alert-danger\" role=\"alert\" id=\"planner-options-from-error\" for=\"planner-options-from\">"+Locale.noStartpointSelected+"</div>").insertAfter("#planner-options-inputgroup-from");
        $( "#planner-options-from" ).attr('aria-invalid',true);
        valid = false;
    }
    $( "#planner-options-dest-error" ).remove();
    if ($( "#planner-options-dest" ).val() === ''){
        $( "<div class=\"alert alert-danger\" role=\"alert\" id=\"planner-options-dest-error\" for=\"planner-options-dest\">"+Locale.destinationEmpty+"</div>").insertAfter("#planner-options-inputgroup-dest");
        $( "#planner-options-dest" ).attr('aria-invalid',true);
        valid = false;
    }else if ($( "#planner-options-dest-latlng" ).val() === ''){
        $( "<div class=\"alert alert-danger\" role=\"alert\" id=\"planner-options-dest-error\" for=\"planner-options-dest\">"+Locale.noDestinationSelected+"</div>").insertAfter("#planner-options-inputgroup-dest");
        $( "#planner-options-dest" ).attr('aria-invalid',true);
        valid = false;
    }
    if (!valid){return valid;}
    $( "#planner-options-from" ).attr('aria-invalid',false);
    $( "#planner-options-dest" ).attr('aria-invalid',false);
    $( "#planner-options-time-error" ).remove();
    if (!getTime()){
        $( "<div class=\"alert alert-danger\" role=\"alert\" id=\"planner-options-time-error\" for=\"planner-options-time\">"+Locale.noValidTime+"</div>").insertAfter("#planner-options-inputgroup-time");
        valid = false;
        $( "#planner-options-time" ).attr('aria-invalid',true);
    }
    $( "#planner-options-date-error" ).remove();
    if (!getDate()){
        $( "<div class=\"alert alert-danger\" role=\"alert\" id=\"planner-options-date-error\" for=\"planner-options-date\">"+Locale.noValidDate+"</div>").insertAfter("#planner-options-inputgroup-date");
        $( "#planner-options-date" ).attr('aria-invalid',true);
        return false;
    }
    var minDate = $( "#planner-options-date" ).attr('min');
    var maxDate = $( "#planner-options-date" ).attr('max');
    if (getDate() < minDate){
        $( "<div class=\"alert alert-danger\" role=\"alert\" id=\"planner-options-date-error\" for=\"planner-options-date\">"+Locale.dateTooEarly(minDate)+"</div>").insertAfter("#planner-options-inputgroup-date");
        valid = false;
        $( "#planner-options-date" ).attr('aria-invalid',true);
    }else if (getDate() > maxDate){
        $( "<div class=\"alert alert-danger\" role=\"alert\" id=\"planner-options-date-error\" for=\"planner-options-date\">"+Locale.dateTooLate(maxDate)+"</div>").insertAfter("#planner-options-inputgroup-date");
        $( "#planner-options-date" ).attr('aria-invalid',true);
        valid = false;
    }
    if (valid){
        $( "#planner-options-time" ).attr('aria-invalid',false);
        $( "#planner-options-date" ).attr('aria-invalid',false);
    }
    return valid;
}

function hideForm(){
  $('.plannerpanel.planner-options').removeClass('planner-form').addClass('planner-summary');
  $('#planner-options-form').attr('aria-hidden',true);
  $('#planner-options-form').hide();
  $('#planner-options-desc-row').show();
  $('#planner-options-desc-row').attr('aria-hidden',false);
  $('#planner-options-desc-row').removeClass('hidden');
  $('#planner-advice-container').show();
  $('#planner-advice-container').attr('aria-hidden',false);
  $('#planner-advice-container').removeClass('hidden');
}

function showForm(){
  $('.plannerpanel.planner-options').removeClass('planner-summary').addClass('planner-form');
  $('#planner-options-form').attr('aria-hidden',false);
  $('#planner-options-form').show();
  $('#planner-options-desc-row').hide();
  $('#planner-options-desc-row').attr('aria-hidden',true);
  $('#planner-options-desc-row').addClass('hidden');
  $('#planner-advice-container').find('.alert').remove();
  $('#planner-advice-container').hide();
  $('#planner-advice-container').attr('aria-hidden',true);
  $('#planner-advice-container').addClass('hidden');
  $('#planner-options-submit').button('reset');
}

function getPrettyDate(){
   var date = getDate().split('-');
   date = new Date(date[0],date[1]-1,date[2]);
   return Locale.days[date.getDay()] + ' ' + date.getDate() + ' ' + Locale.months[date.getMonth()];
}

var defaultRequestGenerators = {};

defaultRequestGenerators['bliksem'] = function (plannerreq){
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
};

defaultRequestGenerators['otp'] = function (plannerreq){
  // TODO: Just use $.extend()
  // ?fromPlace=52.008978039788076%2C4.3608856201171875&toPlace=51.918861649083915%2C4.478302001953125&time=10%3A11am&date=11-06-2014&mode=BICYCLE_PARK%2CWALK%2CTRANSIT&maxWalkDistance=804.672&arriveBy=false&wheelchair=false&showIntermediateStops=false
  var otpReq = {};
  otpReq['arriveBy']              = plannerreq['arriveBy'];
  otpReq['fromPlace']             = plannerreq['fromLatLng'];
  otpReq['toPlace']               = plannerreq['toLatLng'];
  otpReq['date']                  = plannerreq['date'];
  otpReq['time']                  = plannerreq['time'];
  otpReq['showIntermediateStops'] = plannerreq['showIntermediateStops'];
  // TODO: Allow these to be set through the UI
  otpReq['maxWalkDistance']       = 2000;
  otpReq['mode']                  = 'TRANSIT,WALK';
  return otpReq;
};

var requestGenerator = defaultRequestGenerators[config.requestGenerator];

function epochtoIS08601date(epoch){
  var d = new Date(epoch);
  var date = String(d.getFullYear())+'-'+String((d.getMonth()+1)).lpad('0',2)+'-'+String(d.getDate()).lpad('0',2);
  return date;
}

function epochtoIS08601time(epoch){
  var d = new Date(epoch);
  var time = d.getHours().toString().lpad('0',2)+':'+d.getMinutes().toString().lpad('0',2)+':'+d.getSeconds().toString().lpad('0',2);
  return time;
}

function earlierAdvice(){
  if (!itineraries){
     return false;
  }
  $('#planner-advice-earlier').button('loading');
  var minEpoch = 9999999999999;
  $.each( itineraries , function( index, itin ){
      if (itin.endTime < minEpoch){
          minEpoch = itin.endTime;
      }
  });
  var plannerreq = makePlanRequest();
  plannerreq.arriveBy = true;
  minEpoch -= 60*1000;
  console.log(minEpoch);
  plannerreq.date = epochtoIS08601date(minEpoch);
  plannerreq.time = epochtoIS08601time(minEpoch);

  var url = planningserver + jQuery.param(requestGenerator(plannerreq));
  $.get( url, function( data ) {
    if ( !itineraryDataIsValid(data) ){
        return;
    }
    var startDate = $('#planner-advice-list').find('.planner-advice-dateheader').first().html();
    $.each( data.plan.itineraries , function( index, itin ){
        var prettyStartDate = prettyDateEpoch(itin.startTime);
        if (startDate != prettyStartDate){
            $('<div class="planner-advice-dateheader">'+prettyStartDate+'</div>').insertAfter('#planner-advice-earlier');
            startDate = prettyStartDate;
        }
        itinButton(itin).insertAfter($('#planner-advice-list').find('.planner-advice-dateheader').first());
    });
    $('#planner-advice-earlier').button('reset');
  });
  return false;
}

function itinButton(itin){
    var _itinButton = $('<button type="button" class="btn btn-default" onclick="renderItinerary('+itineraries.length+',true)"></button>');
    itineraries.push(itin);
    _itinButton.append('<b>'+timeFromEpoch(itin.startTime)+'</b>  <span class="glyphicon glyphicon-arrow-right"></span> <b>'+timeFromEpoch(itin.endTime)+'</b>');
    _itinButton.append('<div>'+Locale.amountTransfers(itin.transfers)+'</div>');
    return _itinButton;
}

function itineraryDataIsValid (data) {
  if (data['error'] && data['error'] !== null && data['error'] !== 'null' ) {
    return false;
  }
  if ( !('itineraries' in data.plan) || data.plan.itineraries.length === 0 ) {
    return false;
  }
  return  true;
}

function laterAdvice(){
  if (!itineraries){
     return false;
  }
  $('#planner-advice-later').button('loading');
  var maxEpoch = 0;
  $.each( itineraries , function( index, itin ){
      if (itin.startTime > maxEpoch){
          maxEpoch = itin.startTime;
      }
  });
  maxEpoch += 120*1000;
  var plannerreq = makePlanRequest();
  plannerreq.arriveBy = false;
  plannerreq.date = epochtoIS08601date(maxEpoch);
  plannerreq.time = epochtoIS08601time(maxEpoch);
  var url = planningserver + jQuery.param(requestGenerator(plannerreq));
  console.log(decodeURIComponent(url));
  $.get( url, function( data ) {
    if (!itineraryDataIsValid(data)){
        return;
    }
    var startDate = $('#planner-advice-list').find('.planner-advice-dateheader').last().html();
    $.each( data.plan.itineraries , function( index, itin ){
        var prettyStartDate = prettyDateEpoch(itin.startTime);
        if (startDate != prettyStartDate){
            $(('<div class="planner-advice-dateheader">'+prettyStartDate+'</div>')).insertAfter($('#planner-advice-list').find('.planner-advice-itinbutton').last());
            itinButton(itin).insertAfter($('#planner-advice-list').find('.planner-advice-dateheader').last());
            startDate = prettyStartDate;
        }else{
            itinButton(itin).insertAfter($('#planner-advice-list').find('.planner-advice-itinbutton').last());
        }
    });
    $('#planner-advice-later').button('reset');
  });
  return false;
}

function prettyDateEpoch(epoch){
  var date = new Date(epoch);
  return Locale.days[date.getDay()] + ' ' + date.getDate() + ' ' + Locale.months[date.getMonth()];
}

function timeFromEpoch(epoch){
  var date = new Date(epoch);
  var minutes = date.getMinutes();
  var hours = date.getHours();
  if (date.getSeconds()>= 30){
      minutes += 1;
  }
  if (minutes >= 60){
      hours += minutes / 60;
      minutes = minutes % 60;
  }
  if (hours >= 24){
      hours = hours % 24;
  }
  return String(hours).lpad('0',2)+':'+String(minutes).lpad('0',2);
}

var itineraries = null;

function legItem(leg){
    var _legItem = $('<li class="list-group-item advice-leg"><div></div></li>');
    if (leg.mode == 'WALK'){
        if (leg.from.name == leg.to.name){
            return;
        }
        _legItem.append('<div class="list-group-item-heading"><h4 class="leg-header"><b>'+Locale.walk+'</b></h4></div>');
    } else {
        _legItem.append('<div class="list-group-item-heading"><h4 class="leg-header"><b>'+leg.route+'</b> '+leg.headsign.replace(" via ", " "+Locale.via.toLowerCase()+" ")+'<span class="leg-header-agency-name"><small>'+leg.agencyName+'</small></span></h4>');
    }
    var startTime = timeFromEpoch(leg.startTime-(leg.departureDelay ? leg.departureDelay : 0)*1000);
    var delayMin = (leg.departureDelay/60)|0;
    if ((leg.departureDelay%60)>=30){
        delayMin += 1;
    }
    if (delayMin > 0){
        startTime += '<span class="delay"> +'+ delayMin+'</span>';
    }else if (delayMin > 0){
        startTime += '<span class="early"> '+ delayMin+'</span>';
    }else if (leg.departureDelay !== null){
        startTime += '<span class="ontime"> ✓</span>';
    }

    var endTime = timeFromEpoch(leg.endTime-(leg.arrivalDelay ? leg.arrivalDelay : 0)*1000);
    delayMin = (leg.arrivalDelay/60)|0;
    if ((leg.arrivalDelay%60)>=30){
        delayMin += 1;
    }
    if (delayMin > 0){
        endTime += '<span class="delay"> +'+ delayMin+'</span>';
    }else if (delayMin > 0){
        endTime += '<span class="early"> '+ delayMin+'</span>';
    }else if (leg.arrivalDelay !== null){
        endTime += '<span class="ontime"> ✓</span>';
    }

    if (leg.from.platformCode && leg.mode == 'RAIL'){
        _legItem.append('<div><b>'+startTime+'</b> '+leg.from.name+' <small class="grey">'+Locale.platformrail+'</small> '+leg.from.platformCode+'</div>');
    }else if (leg.from.platformCode && leg.mode != 'WALK'){
        _legItem.append('<div><b>'+startTime+'</b> '+leg.from.name+' <small class="grey">'+Locale.platform+'</small> '+leg.from.platformCode+'</div>');
    }else{
        _legItem.append('<div><b>'+startTime+'</b> '+leg.from.name+'</div>');
    }
    if (leg.to.platformCode && leg.mode == 'RAIL'){
        _legItem.append('<div><b>'+endTime+'</b> '+leg.to.name+' <small class="grey">'+Locale.platformrail+'</small> '+leg.to.platformCode+'</div>');
    }else if (leg.to.platformCode && leg.mode != 'WALK'){
        _legItem.append('<div><b>'+endTime+'</b> '+leg.to.name+' <small class="grey">'+Locale.platform+'</small> '+leg.to.platformCode+'</div>');
    }else{
        _legItem.append('<div><b>'+endTime+'</b> '+leg.to.name+'</div>');
    }
    return _legItem;
}

function renderItinerary(idx,moveto){
    $('#planner-leg-list').html('');
    var itin = itineraries[idx];
    $.each( itin.legs , function( index, leg ){
        $('#planner-leg-list').append(legItem(leg));
    });
    if ( moveto && $(this).width() < 981 ) {
        $('#planner-leg-list').ScrollTo({
            duration: 500,
            easing: 'linear'
        });
    }
    $('#planner-advice-list').find('.btn').removeClass('active');
    $(this).addClass('active');
}

function itinButton(itin){
    var _itinButton = $('<button type="button" class="btn btn-default planner-advice-itinbutton" onclick="renderItinerary('+itineraries.length+',true)"></button>');
    itineraries.push(itin);
    _itinButton.append('<b>'+timeFromEpoch(itin.startTime)+'</b>  <span class="glyphicon glyphicon-arrow-right"></span> <b>'+timeFromEpoch(itin.endTime)+'</b>');
    _itinButton.append('<div>'+Locale.amountTransfers(itin.transfers)+'</div>');
    return _itinButton;
}

function planItinerary(plannerreq){
  var url = planningserver + jQuery.param(requestGenerator(plannerreq));
  $('#planner-advice-container').prepend('<div class="progress progress-striped active">'+
  '<div class="progress-bar"  role="progressbar" aria-valuenow="100" aria-valuemin="100" aria-valuemax="100" style="width: 100%">'+
  '<span class="sr-only">'+Locale.loading+'</span></div></div>');
  $('#planner-advice-list').html('');
  $('#planner-leg-list').html('');
  $.get( url, function( data ) {
    $('#planner-leg-list').html('');
    itineraries = [];
    $('#planner-advice-list').html('');
    $('.progress.progress-striped.active').remove();
    if (!itineraryDataIsValid(data)){
        $('#planner-advice-container').prepend('<div class="row alert alert-danger" role="alert">'+Locale.noAdviceFound+'</div>');
        return;
    }
    $('#planner-advice-container').find('.alert').remove();
    var startDate = null;
    $('#planner-advice-list').append('<button type="button" class="btn btn-primary" id="planner-advice-earlier" data-loading-text="'+Locale.loading+'" onclick="earlierAdvice()">'+Locale.earlier+'</button>');
    $.each( data.plan.itineraries , function( index, itin ){
        var prettyStartDate = prettyDateEpoch(itin.startTime);
        if (startDate != prettyStartDate){
            $('#planner-advice-list').append('<div class="planner-advice-dateheader">'+prettyStartDate+'</div>');
            startDate = prettyStartDate;
        }
        $('#planner-advice-list').append(itinButton(itin));
    });
    $('#planner-advice-list').append('<button type="button" class="btn btn-primary" id="planner-advice-later" data-loading-text="'+Locale.loading+'" onclick="laterAdvice()">'+Locale.later+'</button>');
    $('#planner-advice-list').find('.planner-advice-itinbutton').first().click();
    $('#planner-options-submit').button('reset');
    earlierAdvice();
    laterAdvice();
  });
}

function makePlanRequest(){
  var plannerreq = {};
  plannerreq.fromPlace = $('#planner-options-from').val();
  plannerreq.fromLatLng = $('#planner-options-from-latlng').val();
  plannerreq.toPlace = $('#planner-options-dest').val();
  plannerreq.toLatLng = $('#planner-options-dest-latlng').val();
  plannerreq.time = getTime();
  plannerreq.date = getDate();
  plannerreq.arriveBy = false;
  return plannerreq;
}

function submit(){
  $('#planner-options-submit').button('loading');
  hideForm();
  $('#planner-options-desc').html('');
  var plannerreq = makePlanRequest();
  var summary = $('<h4></h4>');
  summary.append('<b>'+Locale.from+'</b> '+plannerreq.fromPlace+'</br>');
  summary.append('<b>'+Locale.to+'</b> '+plannerreq.toPlace);
  $('#planner-options-desc').append(summary);
  $('#planner-options-desc').append('<h5>'+getPrettyDate() +', '+getTime()+'</h5>');
  if (parent && Modernizr.history){
    parent.location.hash = jQuery.param(plannerreq);
    history.pushState(plannerreq, document.title, window.location.href);
    planItinerary(plannerreq);
  }
}

function restoreFromHash(){
    var plannerreq = jQuery.unparam(window.location.hash);
    if ('time' in plannerreq){
      setTime(plannerreq['time']);
    }
    if ('date' in plannerreq){
      setDate(plannerreq['date']);
    }
    if ('fromPlace' in plannerreq){
        $('#planner-options-from').val(plannerreq['fromPlace']);
    }
    if ('fromLatLng' in plannerreq){
        $('#planner-options-from-latlng').val(plannerreq['fromLatLng']);
    }
    if ('toPlace' in plannerreq){
        $('#planner-options-dest').val(plannerreq['toPlace']);
    }
    if ('toLatLng' in plannerreq){
        $('#planner-options-dest-latlng').val(plannerreq['toLatLng']);
    }
    if ('arriveBy' in plannerreq && plannerreq['arriveBy'] == "true"){
        $('#planner-options-arrivebefore').click();
    }else{
        $('#planner-options-departureafter').click();
    }
    if (validate()){submit();}
}

function setupSubmit(){
    $(document).on('submit','.validateDontSubmit',function (e) {
        //prevent the form from doing a submit
        e.preventDefault();
        return false;
    });
    $('#planner-options-submit').click(function(e){
       var $theForm = $(this).closest('form');
       if (( typeof($theForm[0].checkValidity) == "function" ) && !$theForm[0].checkValidity()) {
           return;
       }
       if (validate()){submit();}
    });
}

function setTime(iso8601){
    if(Modernizr.inputtypes.time){
        $('#planner-options-time').val(iso8601.slice(0,5));
    }else{
        var val = iso8601.split(':');
        var secs = parseInt(val[0],10)*60*60+parseInt(val[1],10)*60;
        var hours = String(Math.floor(secs / (60 * 60)) % 24);
        var divisor_for_minutes = secs % (60 * 60);
        var minutes = String(Math.floor(divisor_for_minutes / 60));
        var time = hours.lpad('0',2)+':'+minutes.lpad('0',2);
        $('#planner-options-time').val(time);
    }
}


function setupDatetime(){
    if(Modernizr.inputtypes.time){
        $('#planner-options-timeformat').hide();
        $('#planner-options-timeformat').attr('aria-hidden',true);
    }
    setTime(String(currentTime.getHours()).lpad('0',2)+':'+String(currentTime.getMinutes()).lpad('0',2));
    function pad(n) { return n < 10 ? '0' + n : n; }
    var date = currentTime.getFullYear() + '-' + pad(currentTime.getMonth() + 1) + '-' + pad(currentTime.getDate());
    setDate(date);
    $("#planner-options-date").datepicker( {
       dateFormat: Locale.dateFormat,
       dayNames: Locale.days,
       dayNamesMin : Locale.daysMin,
       monthNames: Locale.months,
       defaultDate: 0,
       hideIfNoPrevNext: true,
       minDate: whitelabel_minDate,
       maxDate: whitelabel_maxDate
    });

    /* Read aloud the selected dates */
    $(document).on("mouseenter", ".ui-state-default", function() {
        var text = $(this).text()+" "+$(".ui-datepicker-month",$(this).parents()).text()+" "+$(".ui-datepicker-year",$(this).parents()).text();
        $("#planner-options-date-messages").text(text);
    });

    if(Modernizr.inputtypes.date){
        $('#planner-options-dateformat').hide();
        $('#planner-options-dateformat').attr('aria-hidden',true);
    }
}

function setDate(iso8601){
    parts = iso8601.split('-');
    var d = new Date(parts[0],parseInt(parts[1],10)-1,parts[2]);
    $('#planner-options-date').val(String(d.getDate()).lpad('0',2)+'-'+String((d.getMonth()+1)).lpad('0',2)+'-'+String(d.getFullYear()));
}

function getDate(){
    var elements = $('#planner-options-date').val().split('-');
    var month = null;
    var day = null;
    var year = String(currentTime.getFullYear());
    if (elements.length == 3){
      if (elements[2].length == 2){
        year = year.slice(0,2) + elements[2];
      }else if (elements[2].length == 4){
        year = elements[2];
      }
      if (parseInt(year,10) < 2013){
        return null;
      }
    }
    if (parseInt(elements[1],10) >= 1 && parseInt(elements[1],10) <= 12){
      month = elements[1];
    }else{
      return null;
    }
    if (parseInt(elements[1],10) >= 1 && parseInt(elements[1],10) <= 31){
      day = elements[0];
    }else{
      return null;
    }
    setDate(year+'-'+month+'-'+day);
    return year+'-'+month+'-'+day;
}

function getTime(){
    if(Modernizr.inputtypes.time){
        return $('#planner-options-time').val();
    } else {
        var val = $('#planner-options-time').val().split(':');
        var hours;
        var time;
        if (val.length === 1 && val[0].length <= 2 && !isNaN(parseInt(val[0],10))){
            hours = val[0];
            time = hours.lpad('0',2)+':00';
            $('#planner-options-time').val(time);
            return time;
        }else if (val.length == 2 && !isNaN(parseInt(val[0],10)) && !isNaN(parseInt(val[1],10))){
            var secs = parseInt(val[0],10)*60*60+parseInt(val[1],10)*60;
            hours = String(Math.floor(secs / (60 * 60)) % 24);
            var divisor_for_minutes = secs % (60 * 60);
            var minutes = String(Math.floor(divisor_for_minutes / 60));
            time = hours.lpad('0',2)+':'+minutes.lpad('0',2);
            $('#planner-options-time').val(time);
            return time;
        }
        return null;
    }
}

function setupAutoComplete(){
    $( "#planner-options-from" ).autocomplete({
        autoFocus: true,
        minLength: 3,
        //appendTo: "#planner-options-from-autocompletecontainer",
        messages : Locale.autocompleteMessages,
        source: Geocoder.geocoder,
        search: function( event, ui ) {
            $( "#planner-options-from-latlng" ).val( "" );
        },
        focus: function( event, ui ) {
            //$( "#planner-options-from" ).val( ui.item.label );
            //$( "#planner-options-from-latlng" ).val( ui.item.latlng );
            return false;
        },
        select: function( event, ui ) {
            $( "#planner-options-from" ).val( ui.item.label );
            $( "#planner-options-from-latlng" ).val( ui.item.latlng );
            return false;
        },
        response: function( event, ui ) {
           if ( ui.content.length === 1 &&
                ui.content[0].label.toLowerCase().indexOf( $( "#planner-options-from" ).val().toLowerCase() ) === 0 ) {
              $( "#planner-options-from" ).val( ui.content[0].label );
              $( "#planner-options-from-latlng" ).val( ui.content[0].latlng );
           }
        }
    });
    $( "#planner-options-via" ).autocomplete({
        autoFocus: true,
        minLength: 3,
        //appendTo: "#planner-options-via-autocompletecontainer",
        messages : Locale.autocompleteMessages,
        source: Geocoder.geocoder,
        search: function( event, ui ) {
            $( "#planner-options-from-latlng" ).val( "" );
        },
        focus: function( event, ui ) {
            //$( "#planner-options-via" ).val( ui.item.label );
            //$( "#planner-options-via-latlng" ).val( ui.item.latlng );
            return false;
        },
        select: function( event, ui ) {
            $( "#planner-options-via" ).val( ui.item.label );
            $( "#planner-options-via-latlng" ).val( ui.item.latlng );
            return false;
        },
        response: function( event, ui ) {
           if ( ui.content.length === 1 &&
                ui.content[0].label.toLowerCase().indexOf( $( "#planner-options-via" ).val().toLowerCase() ) === 0 ) {
              $( "#planner-options-via" ).val( ui.content[0].label );
              $( "#planner-options-via-latlng" ).val( ui.content[0].latlng );
           }
        }
    });
    $( "#planner-options-dest" ).autocomplete({
        autoFocus: true,
        minLength: 3,
        //appendTo: "#planner-options-dest-autocompletecontainer",
        messages : Locale.autocompleteMessages,
        source: Geocoder.geocoder,
        search: function( event, ui ) {
            $( "#planner-options-dest-latlng" ).val( "" );
        },
        focus: function( event, ui ) {
            //$( "#planner-options-dest" ).val( ui.item.label );
            //$( "#planner-options-dest-latlng" ).val( ui.item.latlng );
            return false;
        },
        select: function( event, ui ) {
            $( "#planner-options-dest" ).val( ui.item.label );
            $( "#planner-options-dest-latlng" ).val( ui.item.latlng );
            return false;
        },
        response: function( event, ui ) {
           if ( ui.content.length === 1 &&
                ui.content[0].label.toLowerCase().indexOf( $( "#planner-options-dest" ).val().toLowerCase() ) === 0 ) {
              $( "#planner-options-dest" ).val( ui.content[0].label );
              $( "#planner-options-dest-latlng" ).val( ui.content[0].latlng );
           }
        }
    });
}

function switchLocale() {
	$(".label-from").text(Locale.from);
	$(".label-via").text(Locale.via);
	$(".label-dest").text(Locale.to);
	$(".label-time").text(Locale.time);
	$(".label-date").text(Locale.date);
	$(".label-edit").text(Locale.edit);
	$(".label-plan").text(Locale.plan);

	$(".planner-options-timeformat").text(Locale.timeFormat);

  $("#planner-options-date").datepicker('option', {
      dateFormat: Locale.dateFormat, /* Also need this on init */
      dayNames: Locale.days,
      dayNamesMin : Locale.daysMin,
      monthNames: Locale.months
  });

  $("#planner-options-date").attr('aria-label', Locale.dateAriaLabel);
	$("#planner-options-from").attr('placeholder', Locale.geocoderInput).attr('title', Locale.from);
	$("#planner-options-via").attr('placeholder', Locale.geocoderInput).attr('title', Locale.via);
	$("#planner-options-dest").attr('placeholder', Locale.geocoderInput).attr('title', Locale.to);
	$("#planner-options-submit").attr('data-loading-text', Locale.loading);
}
