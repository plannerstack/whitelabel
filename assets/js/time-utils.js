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

function getPrettyDate(){
   var date = getDate().split('-');
   date = new Date(date[0],date[1]-1,date[2]);
   return Locale.days[date.getDay()] + ' ' + date.getDate() + ' ' + Locale.months[date.getMonth()];
}