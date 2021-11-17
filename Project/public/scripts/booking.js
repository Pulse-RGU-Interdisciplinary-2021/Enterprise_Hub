var startDateTime = new Date();
var endDateTime = new Date()
var bookingData
var roomData

endDateTime.setHours(endDateTime.getHours() + 1)

console.log(startDateTime)
console.log(endDateTime)

$(document).ready(function(){
    getData()
    $('#search').click(function() {

        startDateTime = new Date(($('#date').val()))
        endDateTime = new Date(($('#date').val()))
        startDateTime.setHours($('#startHour').val())
        endDateTime.setHours($('#endHour').val())

        console.log(startDateTime)
        console.log(endDateTime)

        getData()
    });
});

function populateTemplate() {
    var seatsBooked = [0,0,0,0]
    
    if (bookingData.length > 0) {
        for (var booking of bookingData) {
            seatsBooked[booking.room_id-1] += 1
        }
    } else {
        seatsBooked = [0,0,0,0]
    }

    console.log(seatsBooked)

    room1seats = roomData[0].max_desks - seatsBooked[0]
    room2seats = roomData[1].max_desks - seatsBooked[1]
    room3seats = roomData[2].max_desks - seatsBooked[2]
    room4seats = roomData[3].max_desks - seatsBooked[3]

    //code repetition
    $('#room1').css('background-color','#0072bc')
    $('#room1name').text('INNOVATION STATION')
    if (room1seats > 6) {
        $('#room1Status').css('background-color','green')
        $('#room1Status').text(room1seats + " seat(s) available")
        $('#room1name').append('<span class="fas fa-arrow-right"></span>')
        $('#room1a').attr('href','/room');
    } else if (room1seats <= 6 && room1seats > 0) {
        $('#room1Status').css('background-color','peru')
        $('#room1Status').text(room1seats + " seat(s) available")
        $('#room1name').append('<span class="fas fa-arrow-right"></span>')
        $('#room1a').attr('href','/room');
    } else if (room1seats < 1) {
        $('#room1').css('background-color','slategray')
        $('#room1Status').css('background-color','red')
        $('#room1Status').text("Unavailable")
        $('#room1name').append('<span class="fas fa-ban"></span>')
        $('#room1a').removeAttr('href');
    }


    $('#room2').css('background-color','#0072bc')
    $('#room2name').text('ONE TECH HUB')
    if (room2seats > 6) {
        $('#room2Status').css('background-color','green')
        $('#room2Status').text(room2seats + " seat(s) available")
        $('#room2name').append('<span class="fas fa-arrow-right"></span>')
        $('#room2a').attr('href','/room');
    } else if (room2seats <= 6 && room2seats > 0) {
        $('#room2Status').css('background-color','peru')
        $('#room2Status').text(room2seats + " seat(s) available")
        $('#room2name').append('<span class="fas fa-arrow-right"></span>')
        $('#room2a').attr('href','/room');
    } else {
        $('#room2').css('background-color','slategray')
        $('#room2Status').css('background-color','red')
        $('#room2Status').text("Unavailable")
        $('#room2name').append('<span class="fas fa-ban"></span>')
        $('#room2a').removeAttr('href');
    }

    $('#room3').css('background-color','#0072bc')
    $('#room3name').text('Room 3')
    if (room3seats > 6) {
        $('#room3Status').css('background-color','green')
        $('#room3Status').text(room3seats + " seat(s) available")
        $('#room3name').append('<span class="fas fa-arrow-right"></span>')
        $('#room3a').attr('href','/room');
    } else if (room3seats <= 6 && room3seats > 0) {
        $('#room3Status').css('background-color','peru')
        $('#room3Status').text(room3seats + " seat(s) available")
        $('#room3name').append('<span class="fas fa-arrow-right"></span>')
        $('#room3a').attr('href','/room');
    } else if (room3seats < 1) {
        $('#room3').css('background-color','slategray')
        $('#room3Status').css('background-color','red')
        $('#room3Status').text("Unavailable")
        $('#room3name').append('<span class="fas fa-ban"></span>')
        $('#room3a').removeAttr('href');
    }

    $('#room4').css('background-color','#0072bc')
    $('#room4name').text('Room 4')
    if (room4seats > 6) {
        $('#room4Status').css('background-color','green')
        $('#room4Status').text(room4seats + " desk(s) available")
        $('#room4name').append('<span class="fas fa-arrow-right"></span>')
        $('#room4a').attr('href','/room');
    } else if (room4seats <= 6 && room4seats > 0) {
        $('#room4Status').css('background-color','peru')
        $('#room4Status').text(room4seats + " desk(s) available")
        $('#room4name').append('<span class="fas fa-arrow-right"></span>')
        $('#room4a').attr('href','/room');
    } else if (room4seats < 1) {
        $('#room4').css('background-color','slategray')
        $('#room4Status').css('background-color','red')
        $('#room4Status').text("Unavailable")
        $('#room4name').append('<span class="fas fa-ban"></span>')
        $('#room4a').removeAttr('href');
    }

    var dateTimeSelected = true
    if ($('#date').val() == "" || $('#startHour').val() == null || $('#endHour').val() == null) {
        dateTimeSelected = false
    }

    if (!dateTimeSelected) {
        $('#room1a').removeAttr('href');
        $('#room2a').removeAttr('href');
        $('#room3a').removeAttr('href');
        $('#room4a').removeAttr('href');
    } else {
        $('#room1a').removeAttr('class');
        $('#room2a').removeAttr('class');
        $('#room3a').removeAttr('class');
        $('#room4a').removeAttr('class');
        $("#tooltip1").remove()
        $("#tooltip2").remove()
        $("#tooltip3").remove()
        $("#tooltip4").remove()
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