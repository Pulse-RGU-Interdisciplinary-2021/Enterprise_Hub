//too long, should be split into separate documents
async function filterOptionSelected(selectObject){
    var optionSelected = selectObject.value;

    $("#filterResult").empty()
    if (optionSelected == "Date and time") {
        await dateTimeFilterSelected()
    }
    else if (optionSelected == "User's name") {
        await userSNameFilterSelected()
    }
    else if (optionSelected == "Room name") {
        await roomNameFilterSelected()
    }
    else {
        console.log("Option selected is invalid")
    }
}

async function dateTimeFilterSelected(){
    var html = '<label for="datetimeInput">Select the desired date and time:</label>';
    html += '<input type="datetime-local" id="datetimeInput" onchange="datePicked(this)">';
    $("#filterResult").append(html)
}

async function userSNameFilterSelected(){
    var html = '<form id="userSNameInputForm">'
    html += '<label for="userSNameInput">Enter the full name of the user:</label>'
    html += '<input type="text" id="userSNameInput">'
    html += '<button type="submit" id = "userSNameInputButton">Search</button>'
    html += '</form>'

    $("#filterResult").append(html)

    const userSNameInputForm = document.getElementById('userSNameInputForm');
    userSNameInputForm.addEventListener('submit', nameEntered);
}

async function roomNameFilterSelected(){
    var html = '<label for="roomNameInput">Select the desired room:</label>';
    html += '<select id="roomNameInput" onchange="roomSelected(this)">'

    var rooms = await getRoomsArray()

    if (rooms.length<1) {
        html += '<option value="noRooms">No rooms available</option>'
    }
    else {
        for (var i = 0; i < rooms.length; i++) {
            html += '<option value="room' + i + '">'
            html += rooms[i].room_name
            html += '</option>'
        }
    }
    html += '</select>';
    $("#filterResult").append(html)
}

async function getRoomsArray(){
    var output
    await $.get("/api/v1/rooms/All", await function (data) {
        output = data
    });
    return output
}

async function datePicked(dateTimeInput) {
    var dateTime = dateTimeInput.value;
    var filteredBookings;
    filteredBookings = await getBookingsByDate(dateTime)
    addBookings(filteredBookings)
}

async function getBookingsByDate(dateTime){
    var output
    await $.get("/api/v1/bookings/Date/" + dateTime, await function (data) {
        output = data
    });
    return output
}
async function nameEntered(){
    var name = $('#userSNameInput').value
    var filteredBookings;
    filteredBookings = await getBookingsByName(name)
    addBookings(filteredBookings)
}

async function getBookingsByName(name) {
    var output
    await $.get("/api/v1/bookings/UserFullName/" + name, await function (data) {
        output = data
    });
    return output
}

async function roomSelected(roomInput){
    var room = roomInput.value;
    if (room == "No rooms available"){
        var result = document.createElement("p");
        result.innerHTML = "No rooms"
        $("#results").append(result)
    }
    else {
        var filteredBookings;
        filteredBookings = await getBookingsByRoomName(room)
        addBookings(filteredBookings)
    }
}

async function getBookingsByRoomName(roomName) {
    var output
    await $.get("/api/v1/bookings/RoomName/" + roomName, await function (data) {
        output = data
    });
    return output
}

async function addBookings(filteredBookings){
    for (var i = 0; i < filteredBookings.length; i++) {

        var userName = document.createElement("p");
        userName.innerHTML = await getuserName(i, filteredBookings)
        userName.setAttribute("class", "userName")

        var date = document.createElement("p");
        date.innerHTML = formattedStartAndEndTime(i, filteredBookings)
        date.setAttribute("class", "date");

        var roomName = document.createElement("p");
        roomName.innerHTML = await getRoomName(i, filteredBookings)
        roomName.setAttribute("class", "roomName")

        var bookingType = document.createElement("p");
        bookingType.innerHTML = formattedBookingType(i, filteredBookings)
        bookingType.setAttribute("class", "bookingType")

        var reason = document.createElement("p")
        reason.innerHTML = "Reason of booking: " + filteredBookings[i].reason
        reason.setAttribute("class", "reason")

        var status = document.createElement("p")
        status.innerHTML = getBookingStatus(i, filteredBookings)
        reason.setAttribute("class", "bookingStatus")

        var currentBookingInfo = document.createElement("div")
        var currentBookingInfo = formatCurrentBooking(userName, date, roomName, bookingType, reason, bookingStatus)
        currentBookingInfo.setAttribute("class", "infoPendingBookingsDiv")

        //to change
        var confirm = document.createElement("p")
        confirm.innerHTML = "confirm"
        confirm.setAttribute("class", "confirm")

        //to change
        var reject = document.createElement("p")
        reject.innerHTML = "reject"
        reject.setAttribute("class", "reject")

        var currentBookingResponse = document.createElement("div")
        currentBookingResponse.appendChild(confirm)
        currentBookingResponse.appendChild(reject)
        currentBookingResponse.setAttribute("class", "approveRejectButtonsDiv")
        
        var currentBooking = document.createElement("div")
        currentBooking.appendChild(currentBookingInfo)
        currentBooking.appendChild(currentBookingResponse)
        currentBooking.setAttribute("class", "bookingDiv")

        $("#results").append(currentBooking)

    }


}

async function getuserName(i, filteredBookings){
    var output = ""
    var userId = filteredBookings[i].user_id
    await $.get("/api/v1/users/id/" + userId, await function (data) {
        output += data[i].full_name
    })
    return output
}

function formattedStartAndEndTime(i, filteredBookings) {
    var output = "From "
    console.log(typeof filteredBookings[i].start_datetime)
    output += filteredBookings[i].start_datetime
    output += " to "
    output += filteredBookings[i].end_datetime
    return output
}

async function getRoomName(i, filteredBookings) {
    var output = ""
    var roomId = filteredBookings[i].room_id
    await $.get("/api/v1/rooms/id/" + roomId, await function (data) {
        output += data[0].room_name
    })
    return output
}

function formattedBookingType(i, filteredBookings) {
    var output = ""
    if (filteredBookings[i].full_room_booking) {
        output += "Full room booking"
    }
    else {
        var nOfDesks = filteredBookings[i].desks
        if (nOfDesks > 1) {
            output += filteredBookings[i].desks + " desks"
        }
        else {
            output += filteredBookings[i].desks + " desk"
        }  
    }
    return output
}

function getBookingStatus(i, filteredBookings) {
    var output = ""
    if (filteredBookings[i].confirmed) {
        output += "BOOKING CONFIRMED"
    }
    else {
        if (filteredBookings[i].pending) {
            output += "BOOKING PENDING"
        }
        else {
            output += "STATUS UNKNOWN"
        }
    }
    return output
}

function formatCurrentBooking(userName, date, roomName, bookingType, reason, status) {
    var currentBooking = document.createElement("div")
    currentBooking.appendChild(userName)
    currentBooking.appendChild(date)
    currentBooking.appendChild(roomName)
    currentBooking.appendChild(bookingType)
    currentBooking.appendChild(reason)
    currentBooking.appendChild(status)

    return currentBooking

}