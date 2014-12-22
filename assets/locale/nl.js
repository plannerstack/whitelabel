Locale['nl'] = {};

Locale['nl'].dateFormat = 'dd-mm-yy';
Locale['nl'].timeFormat = 'hh:mm';
Locale['nl'].dateAriaLabel = 'Datumkiezer, gebruik Ctrl en pijltjes om te navigeren';
Locale['nl'].loading = "Bezig...";
Locale['nl'].edit = "Wijzig reis";
Locale['nl'].plan = "Plan reis";
Locale['nl'].geocoderInput = "Station, halte, adres";
Locale['nl'].startpointEmpty = "Geen startpunt ingevoerd";
Locale['nl'].noStartpointSelected = "Geen startpunt geselecteerd";
Locale['nl'].destinationEmpty = "Geen bestemming ingevoerd";
Locale['nl'].noDestinationSelected = "Geen bestemming geselecteerd";
Locale['nl'].noValidDate = "Geen geldige datum ingevoerd";
Locale['nl'].noValidTime = "Geen geldige tijd ingevoerd";
Locale['nl'].dateTooEarly = function ( minDate8601 ) { return "De planner werkt pas vanaf "+minDate8601.split('-').reverse().join('-'); }
Locale['nl'].dateTooLate = function ( maxDate8601 ) { return "De planner heeft geen dienstregeling na "+maxDate8601.split('-').reverse().join('-'); }
Locale['nl'].from = "Van";
Locale['nl'].via = "Via";
Locale['nl'].to = "Naar";
Locale['nl'].date = "Datum";
Locale['nl'].time = "Tijd";
Locale['nl'].months = ['januari','februari','maart','april','mei','juni','juli','augustus','september','oktober','november','december'];
Locale['nl'].days = ['zondag','maandag','dinsdag','woensdag','donderdag','vrijdag','zaterdag'];
Locale['nl'].daysMin = ['zo','ma','di','wo','do','vr','za'];
Locale['nl'].earlier = 'Eerder';
Locale['nl'].later = 'Later';
Locale['nl'].noAdviceFound = 'Geen reisadvies gevonden';
Locale['nl'].walk = 'Loop';
Locale['nl'].platformrail = 'Spoor';
Locale['nl'].platform = 'Perron';
Locale['nl'].amountTransfers = function ( transfers ) { if (transfers == 0) { return 'Direct'; } else { return transfers+ 'x overstappen';} }
Locale['nl'].autocompleteMessages = {
        noResults: "Geen resultaten gevonden.",
        results: function( amount ) {
            return amount + ( amount > 1 ? " resultaten zijn " : " resultaat is" ) + " beschikbaar, gebruik de omhoog en omlaag pijltoetsen om te navigeren.";
        }
};
Locale['nl'].CAR = 'auto';
Locale['nl'].TRANSIT = 'Openbaar vervoer';