Locale['en'] = {}

Locale['en'].dateFormat = 'dd-mm-yy';
Locale['en'].timeFormat = 'hh:mm';
Locale['en'].dateAriaLabel = 'Date, use Ctrl en arrow keys to navigate, enter to choose';
Locale['en'].loading = "Loading...";
Locale['en'].edit = "Change trip";
Locale['en'].plan = "Plan trip";
Locale['en'].geocoderInput = "Train station, stop or address";
Locale['en'].startpointEmpty = "No starting point entered";
Locale['en'].noStartpointSelected = "No starting point selected";
Locale['en'].destinationEmpty = "No destination entered";
Locale['en'].noDestinationSelected = "No destination selected";
Locale['en'].noValidDate = "Enter a valid date";
Locale['en'].noValidTime = "Enter a valid time";
Locale['en'].dateTooEarly = function ( minDate8601 ) { return "This trip planner works for travel dates starting "+minDate8601.split('-').reverse().join('-'); }
Locale['en'].dateTooLate = function ( maxDate8601 ) { return "This trip planner works for travel dates till "+maxDate8601.split('-').reverse().join('-'); }
Locale['en'].from = "From";
Locale['en'].via = "Via";
Locale['en'].to = "To";
Locale['en'].date = "Date";
Locale['en'].time = "Time";
Locale['en'].months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
Locale['en'].days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saterday'];
Locale['en'].daysMin = ['Su','Mo','Tu','We','Th','Fr','Sa'];
Locale['en'].earlier = 'Earlier';
Locale['en'].later = 'Later';
Locale['en'].noAdviceFound = 'No valid trips found';
Locale['en'].walk = 'Walk';
Locale['en'].platformrail = 'Platform';
Locale['en'].platform = 'Platform';
Locale['en'].amountTransfers = function ( transfers ) { if (transfers == 0) { return 'Direct'; } else { return transfers+ ' transfers';} }
Locale['en'].autocompleteMessages = {
        noResults: "No results found.",
        results: function( amount ) {
            return amount + ( amount > 1 ? " results are " : " result is" ) + " available, use the up and down arrow keys to navigate them.";
        }
};
Locale['en'].CAR = 'Car';
Locale['en'].TRANSIT = 'Transit';
