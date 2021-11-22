$(document).ready(function(){
    var now = new Date(),
    // minimum date the user can choose, in this case now and in the future
    minDate = now.toISOString().substring(0,10);

    $('#date').prop('min', minDate);
});