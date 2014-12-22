$(document).ready(function() {
  switchLocale();
  initializeForms();
  if(window.location.hash) {
    restoreFromHash(window.location.hash);
  }
});


function initializeForms(){
    setupAutoComplete();
    setupDatetime();
    setupSubmit();
    setupModeInputGroup();
    setupRouterInputGroup();

    if ($( "#planner-options-from" ).val() === ''){
        $( "#planner-options-from-latlng" ).val('');
    }
    if ($( "#planner-options-dest" ).val() === ''){
        $( "#planner-options-dest-latlng" ).val('');
    }
}

function changeRouter(id) {
  var routerSet = Router.setRouterById(id);
  if (routerSet) {
    setupModeInputGroup();
    renderRouterInputGroup();
    submitIfValid();
  }
  return routerSet;
}

function changeGeocoder(id) {
  var geocoderSet = Geocoder.setGeocoderById(id);
  return geocoderSet;
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

  Router.doRequest(plannerreq, function (data) {
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

  Router.doRequest(plannerreq, function (data) {
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

var itineraries = null;

function legItem(leg){
    var _legItem = $('<li class="list-group-item advice-leg"><div></div></li>');
    if (leg.mode == 'WALK'){
        if (leg.from.name == leg.to.name){
            return;
        }
        _legItem.append('<div class="list-group-item-heading"><h4 class="leg-header"><b>'+Locale.walk+'</b></h4></div>');
    } else if (leg.mode === 'CAR') {
        _legItem.append('<div class="list-group-item-heading"><h4 class="leg-header"><b>'+Locale.CAR+'</b></h4>');
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

/**
 * router input rendering
 */

function setupRouterInputGroup() {
  var _routerInputGroupEl = routerInputGroupEl();
  renderRouterInputGroup();
  _routerInputGroupEl.on('change', 'input', function (e) {
    onRouterInputChange(e);
  });
}

function renderRouterInputGroup() {
  var context = Router.getContext();
  var _routerInputGroupEl = routerInputGroupEl();
  _routerInputGroupEl.html(routerInputHtml(context));
  return true;
}

function routerInputGroupEl () {
  if (!cached_routerInputGroupEl) {
    cached_routerInputGroupEl = $('#planner-options-inputgroup-router');
  }
  return cached_routerInputGroupEl;
}var cached_routerInputGroupEl = null;

function onRouterInputChange (e) {
  var id = $(e.target).attr('id');
  changeRouter(id);
}


function routerInputHtml (context) {
  var html = '<div class="btn-group">';
  for (var i = 0; i < context.routers.length; i++) {
    html += '<label class="btn btn-large">'+
      '<input type="radio" id="'+context.routers[i].id+'" name="mode" autocomplete="off" ' + ( context.routers[i].selected?'checked="true"': '' ) + '> '+ context.routers[i].name+
    '</label>';
  }
  html += '</div>';
  return html;
}

/**
 * mode input rendering
 */

function setupModeInputGroup () {
  var modes = Router.getSupportedModes();
  var _modeInputGroupEl = modeInputGroupEl();

  // Clear div
  _modeInputGroupEl.html('');

  if (!modes || modes.length < 2) {
    console.info('no modes to select:: ', modes);
    return;
  }
  
  // Fill div
  var html = '';
  for (var i = 0; i < modes.length; i++) {
    html += modeRadioButtonHtml(modes[i], modes[0]);
  }
  _modeInputGroupEl.append(html);
}


function modeInputGroupEl () {
  if (!cached_modeInputGroupEl) {
    cached_modeInputGroupEl = $('#planner-options-inputgroup-mode');
  }
  return cached_modeInputGroupEl;
}var cached_modeInputGroupEl = null;

function modeRadioButtonHtml(mode, selected_mode) {
  return '<label class="btn btn-large">'+
    '<input type="radio" id="'+mode+'" name="mode" autocomplete="off" ' + ( mode === selected_mode?'checked="true"': '' ) + '> '+ Locale[mode]+
  '</label>';
}

function checkedModeId() {
  var checked = modeInputGroupEl().find(':checked'); // find by pseudoclass 
  if (checked) {
    return checked.attr('id');
  }
  // fallback to just the first mode of the Router
  return Router.getSupportedModes()[0];
}

function setMode(mode) {
  var toBeChecked = modeInputGroupEl().find('#'+mode);
  // uncheck all
  modeInputGroupEl().find('[type="radio"]').removeAttr('checked');
  // check set mode
  toBeChecked.attr('checked',true);
}

/**
 * mode input rendering END
 */

function planItinerary(plannerreq){
  $('#planner-advice-container').prepend('<div class="progress progress-striped active">'+
  '<div class="progress-bar"  role="progressbar" aria-valuenow="100" aria-valuemin="100" aria-valuemax="100" style="width: 100%">'+
  '<span class="sr-only">'+Locale.loading+'</span></div></div>');
  $('#planner-advice-list').html('');
  $('#planner-leg-list').html('');
  Router.doRequest(plannerreq, function (data) {
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
  plannerreq.mode = checkedModeId();
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
    if ('mode' in plannerreq){
      setMode(plannerreq['mode']);
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
      submitIfValid();
    });
}

function submitIfValid () {
  var $theForm = $('form');
  if (( typeof($theForm[0].checkValidity) == "function" ) && !$theForm[0].checkValidity()) {
    return;
  }
  if (validate()){submit();}
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
    var currentTime = new Date();
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
       minDate: config.minDate,
       maxDate: config.maxDate
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
    var currentTime = new Date();
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
        source: Geocoder.requestProxy,
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
        source: Geocoder.requestProxy,
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
        source: Geocoder.requestProxy,
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
  // var _locale = $.extend({}, Locale);
  Locale = Locale[config['locale']] || Locale['en'];
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


/**
 * DEBUG STUFF
 * TODO: Make sure these bindings and functions are set through the config aka: DEBUG:true || false;
 * 
 */

var DEBUG = DEBUG || {};
DEBUG['mmri-test-input'] = function (plannerreq){
  var req = { 'to':{}, 'from':{} };

  req['id']                     = '[CHANGE ME]';
  req['comment']                = '[CHANGE ME]';
  req['timeType']               = plannerreq['arriveBy'] ? 'A' : 'D';
  req['time']                   = plannerreq['date'] + 'T' + plannerreq['time']+ ':00'; // match format '%Y-%m-%dT%H:%M:%S'
  req['from']['latitude']       = parseFloat(plannerreq['fromLatLng'].split(',')[0]);
  req['from']['longitude']      = parseFloat(plannerreq['fromLatLng'].split(',')[1]);
  req['from']['description']    = plannerreq['fromPlace'];
  req['to']['latitude']         = parseFloat(plannerreq['toLatLng'].split(',')[0]);
  req['to']['longitude']        = parseFloat(plannerreq['toLatLng'].split(',')[1]);
  req['to']['description']      = plannerreq['toPlace'];

  return req;
};
DEBUG['mrri_test_object'] = function () {
  alert(JSON.stringify(DEBUG['mmri-test-input'](makePlanRequest()), undefined, 4));
};

$(document).on("keypress", function(e) {
  if ( e.altKey && e.which === 181 ) {    /* alt-M */
    DEBUG['mrri_test_object']();
  }
});