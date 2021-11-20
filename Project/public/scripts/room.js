var roomData
var bookingData
var userData
var roomId
var selectedSeats = []

$(document).ready(function(){
    roomId = $('#roomId').text();
    getData()

    $('#seats').on('click','.chair', function() {
        if(!$(this).hasClass('chair-unavailable') && !$(this).hasClass('chair-selected')) {
            $(this).addClass('chair-selected')
            selectedSeats.push($(this).text())
        } else if ($(this).hasClass('chair-selected')) {
            $(this).removeClass('chair-selected')
            selectedSeats = selectedSeats.filter(item => item !== $(this).text())
        }
      } );

      startDateTime = startDateTime.toISOString().slice(0, 19).replace('T', ' ') + ".000"
      endDateTime = endDateTime.toISOString().slice(0, 19).replace('T', ' ') + ".000"

      $('#book').on('click', function() {

        userInt = parseInt(userId)

        if(userId =! ""){
            $.ajax({
                type: "POST",
                url: "/api/v1/bookings/",
                data: { 
                    "room_id": roomId,
                    "user_id": userInt,
                    "start_datetime": startDateTime,
                    "end_datetime": endDateTime,
                    "desks": 1,
                    "reason": $('#reason').val(),
                    "full_room_booking": $("#fullRoomBooking").prop('checked'),
                    "confirmed": 0,
                    "pending": 0 ,
                    "seat_id": selectedSeats[0],
                    "event_booking_yn": 0,
                    "user_name": $('#name').val(),
                    "user_email": $('#email').val(),
                    "user_number": $('#number').val(),
                    "user_role": $('#role').val()
                },
                success: function(msg){
                    window.location = "/success";
                },
                fail: function(){
                    window.location = "/failure";
                }
            })
        } else {
            alert("User is not logged in!")
            window.location = "/login";
        }
    })
});

async function getData() {
    roomData = await getRoomInfo(roomId)
    bookingData = await getRoomBookings(roomId,startDateTime,endDateTime)
    userData = await getUserById(userId)
    buildSeatsTable(bookingData, roomData)
    populateUserInfo(userData)
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

async function getUserById(userId) {
    var output
    await $.get('/api/v1/users/Id/' + userId, await function(data) {
        output = data
    }); 
    return output
}

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
    outputTable += "</tr> </table><br><label for='fullRoom'>Full room booking<input id='fullRoomBooking' name='fullRoom' type='checkbox'></label>"

    $('#seats').append(outputTable)
    $('#roomId').text(roomInput[0].room_name)
}

async function populateUserInfo(data) {
    $('#name').val(data[0].full_name)
    $('#email').val(data[0].email)
    $('#number').val(data[0].phone_number)
}