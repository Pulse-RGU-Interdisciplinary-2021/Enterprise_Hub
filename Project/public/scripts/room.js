var roomData
var bookingData
var roomId

$(document).ready(function(){
    roomId = $('#roomId').text();
    getData()

    $('#seats').on('click','.chair', function() {
        if(!$(this).hasClass('chair-unavailable') && !$(this).hasClass('chair-selected')) {
            $(this).addClass('chair-selected')
        } else if ($(this).hasClass('chair-selected')) {
            $(this).removeClass('chair-selected')
        }
      } );

      startDateTime = startDateTime.toISOString().slice(0, 19).replace('T', ' ') + ".000"
      endDateTime = endDateTime.toISOString().slice(0, 19).replace('T', ' ') + ".000"
});

async function buildSeatsTable(bookingInput, roomInput) {
    var bookedSeats = [];
    
    for (var booking of bookingInput) {
        bookedSeats.push(booking.seat_id);
    }

    outputTable = "<table style='width: 100%;'> <tr>"
    for(let i = 0; i < roomInput[0].max_desks; i++) {
        if ((i)%4 == 0) {
            outputTable += "</tr><tr>"
        }
        if (bookedSeats.includes(i+1)) {
            outputDiv = "<div class='chair chair-unavailable'>" + (i+1) +"</div>"
        } else {
            outputDiv = "<div class='chair'>" + (i+1) +"</div>"
        }

        outputTable += "<td>" + outputDiv + "</td>"
    }
    outputTable += "</tr> </table><br><label>Full room booking</label><input type='checkbox'>"

    console.log(outputTable)
    $('#seats').append(outputTable)

    $('#roomId').text(roomInput[0].room_name)
}

async function getData() {
    roomData = await getRoomInfo(roomId)
    bookingData = await getRoomBookings(roomId,startDateTime,endDateTime)
    buildSeatsTable(bookingData, roomData);
}

async function getRoomBookings(room_id, startDateTime, endDateTime) {
    var output
    await $.get("/api/v1/bookings/ByIdAndDateRange/" + room_id + "/" + startDateTime + "/" + endDateTime, await function (data) {
        output = data
    });
    return output
}

async function getRoomInfo(room_id) {
    var output
    await $.get('/api/v1/rooms/Id/' + room_id, await function(data) {
        output = data
    });
    return output
}
