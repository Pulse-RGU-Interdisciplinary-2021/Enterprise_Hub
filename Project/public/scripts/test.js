$(document).ready(()=> {
    addEventListeners();
});

function addEventListeners() {
    let dropdown = $('#bookingType_select');
    dropdown.val(0);
    let fullBooking = $('#numbDesks');
    fullBooking.val(fullBooking[0].max);
    dropdown.on('change', () => {
        let dropdown = $('#bookingType_select');
        let desks = $('#deskSelectWrapper');
        let fullBooking = $('#numbDesks');
        if(+dropdown[0].value === 0) {
            desks.hide();
            fullBooking.val(fullBooking[0].max);
        }else if(+dropdown[0].value === 1) {
            fullBooking.val(0);
            desks.show();
        }
    });
};