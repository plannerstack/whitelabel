Locale['fy'] = {}

Locale['fy'].direct = "streekrjocht"
Locale['fy'].dateFormat = 'mm-dd-jjjj';
Locale['fy'].timeFormat = 'hh:mm';
Locale['fy'].edit = "Wizigje reis";
Locale['fy'].plan = "Plan reis";
Locale['fy'].date = "Datum";
Locale['fy'].time = "Tiid";
Locale['fy'].arrive = "Oankomme op"
Locale['fy'].depart = "Fuortgean om"
Locale['fy'].geocoderInput = "Stasjon, halte, adres";
Locale['fy'].startpointEmpty = "Gjin startpunt ynfierd";
Locale['fy'].noStartpointSelected = "Gjin startpunt selektearre";
Locale['fy'].destinationEmpty = "Gjin bestimming ynfierd";
Locale['fy'].noDestinationSelected = "Gjin bestimming selektearre";
Locale['fy'].noValidDate = "Gjin jildige datum ynfierd";
Locale['fy'].noValidTime = "Gjin jildige tiid ynfierd";
Locale['fy'].dateTooEarly = function ( minDate8601 ) { return "De planner wurket pas fanôf "+minDate8601.split('-').reverse().join('-'); }
Locale['fy'].dateTooLate = function ( maxDate8601 ) { return "De planner hat gjin tsjinstregeling nei "+maxDate8601.split('-').reverse().join('-'); }
Locale['fy'].from = "Fan";
Locale['fy'].via = "Fia";
Locale['fy'].to = "Nei";
Locale['fy'].months = ['Jannewaris','Febrewaris','Maart','April','Maaie','Juny','July','Augustus','Septimber','Oktober','Novimber','Desimber'];
Locale['fy'].days = ['Snein','Moandei','Tiisdei','Woansdei','Tongersdei','Freed','Sneon'];
Locale['fy'].earlier = 'Earder';
Locale['fy'].later = 'Letter';
Locale['fy'].noAdviceFound = 'Gjin reisadvys fûn';
Locale['fy'].loading = 'Dwaande mei laden';
Locale['fy'].walk = 'Rinne';
Locale['fy'].platformrail = 'Spoar';
Locale['fy'].platform = 'Perron';
// Locale['fy'].loading = 'Dwaande...';
Locale['fy'].amountTransfers = function ( transfers ) { if (transfers == 0) { return 'Direct'; } else { return transfers+ 'x oerstappe';} }

Locale['fy'].autocompleteMessages = {
        noResults: "Gjin fertuten dwaan.",
        results: function( amount ) {
			return amount + ( amount > 1 ? " resultaten binne " : " resultaat is" ) + " beskikber, brûk de omheech en omleech pylktoetsen om te navigearjen.";
        }
}
Locale['fy'].CAR = 'auto';
Locale['fy'].TRANSIT = 'Transit';