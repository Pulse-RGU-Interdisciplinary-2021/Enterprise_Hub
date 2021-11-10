var roomData
var bookingData

$(document).ready(function(){
    getData()
});

async function buildSeatsTable(bookingInput, roomInput) {
    var bookedSeats = [];
    
    for (var booking of bookingInput) {
        bookedSeats.push(booking.seat_id);
    }

    outputTable = "<table style='width: 100%; height: 100%;'> <tr>"
    for(let i = 0; i < roomInput[0].max_desks; i++) {
        if ((i)%5 == 0) {
            outputTable += "</tr><tr>"
        }
        if (bookedSeats.includes(i+1)) {
            outputDiv = "<div style='width: 100%; height: 100%; background-color: red;display: flex; justify-content: center; align-items: center;'>Seat " + (i+1) + "</div>"
        } else {
            outputDiv = "<div style='width: 100%; height: 100%; background-color: green;display: flex; justify-content: center; align-items: center;'>Seat " + (i+1) + "</div>"
        }

        outputTable += "<td>" + outputDiv + "</td>"
    }
    outputTable += "</tr> </table>"

    console.log(outputTable)
    $('#desks').append(outputTable)
}

async function getData() {
    roomData = await getRoomInfo(1)
    bookingData = await getRoomBookings(1,'2021-10-30 10:00:00.000','2021-11-01 08:00:00.000')
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