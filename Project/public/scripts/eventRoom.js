var startDateTime = new Date();
var endDateTime = new Date()
var bookingData
var roomData

startDateTime.setHours(0,0,0)
endDateTime.setHours(24)

console.log(startDateTime)
console.log(endDateTime)

$(document).ready(function(){
    $('#td_startHour').remove();
    $('#td_endHour').remove();

    getData()
    $('#search').click(function() {

        startDateTime = new Date(($('#date').val()))
        endDateTime = new Date(($('#date').val()))
        startDateTime.setHours(0)
        endDateTime.setHours(24)

        console.log(startDateTime)
        console.log(endDateTime)

        getData()
    });
    
});

function populateTemplate() {
    var roomHasEvent = [0,0,0,0]
    
    if (bookingData.length > 0) {
        for (var booking of bookingData) {
            if (booking.event_booking_yn) {
                roomHasEvent[booking.room_id-1] += 1
            }
        }
    } else {
        roomHasEvent = [0,0,0,0]
    }

    console.log(roomHasEvent)

    //code repetition
    $('#room1').css('background-color','#0072bc')
    $('#room1name').text('INNOVATION STATION')
    if (roomHasEvent[0] == 0) {
        $('#room1Status').css('background-color','green')
        $('#room1Status').text("available")
        $('#room1name').append('<span class="fas fa-arrow-right"></span>')
    } else {
        $('#room1').css('background-color','slategray')
        $('#room1Status').css('background-color','red')
        $('#room1Status').text("Unavailable")
        $('#room1name').append('<span class="fas fa-ban"></span>')
        $('#room1a').removeAttr('href');
    }

    $('#room2').css('background-color','#0072bc')
    $('#room2name').text('ONE TECH HUB')
    if (roomHasEvent[1] == 0) {
        $('#room2Status').css('background-color','green')
        $('#room2Status').text("available")
        $('#room2name').append('<span class="fas fa-arrow-right"></span>')
    } else {
        $('#room2').css('background-color','slategray')
        $('#room2Status').css('background-color','red')
        $('#room2Status').text("Unavailable")
        $('#room2name').append('<span class="fas fa-ban"></span>')
        $('#room2a').removeAttr('href');
    }

    $('#room3').css('background-color','#0072bc')
    $('#room3name').text('Room 3')
    if (roomHasEvent[2] == 0) {
        $('#room3Status').css('background-color','green')
        $('#room3Status').text("available")
        $('#room3name').append('<span class="fas fa-arrow-right"></span>')
    } else {
        $('#room3').css('background-color','slategray')
        $('#room3Status').css('background-color','red')
        $('#room3Status').text("Unavailable")
        $('#room3name').append('<span class="fas fa-ban"></span>')
        $('#room3a').removeAttr('href');
    }

    $('#room4').css('background-color','#0072bc')
    $('#room4name').text('Room 4')
    if (roomHasEvent[3] == 0) {
        $('#room4Status').css('background-color','green')
        $('#room4Status').text("available")
        $('#room4name').append('<span class="fas fa-arrow-right"></span>')
    } else {
        $('#room4').css('background-color','slategray')
        $('#room4Status').css('background-color','red')
        $('#room4Status').text("Unavailable")
        $('#room4name').append('<span class="fas fa-ban"></span>')
        $('#room4a').removeAttr('href');
    }
}

async function getData() {
    bookingData = await getRoomBookings(startDateTime.toISOString().slice(0, 19).replace('T', ' '),endDateTime.toISOString().slice(0, 19).replace('T', ' '))
    roomData = await getAllRooms()
    populateTemplate();
}

async function getRoomBookings(startDateTime, endDateTime) {
    var output
    await $.get("/api/v1/bookings/ByDateRange/" + startDateTime + "/" + endDateTime, await function (data) {
        output = data
    });
    return output
}

async function getAllRooms() {
    var output
    await $.get('/api/v1/rooms/all/', await function(data) {
        output = data
    });
    return output
}

function navigate(item) {
    console.log($(item).attr('id').charAt(4));
    $.post("/setRoomId/"+ $(item).attr('id').charAt(4), (res)=> {
        console.log(res);
        console.log("in");
        window.location.href = "/eventBooking";
    })
}