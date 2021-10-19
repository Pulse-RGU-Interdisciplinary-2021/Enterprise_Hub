var stopLoadingResults = false
//too long, should be split into separate documents
async function filterOptionSelected(selectObject){
    var optionSelected = selectObject.value;

    $("#filterResult").empty()
    $("#results").empty()
    
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
    var html = '<form action="#">'
    html += '<label for="userSNameInput">Enter the full name of the user:</label>'
    html += '<input type="text" id="userSNameInput">'
    html += '<button id = "userSNameInputButton" onclick="nameEntered()">Search</button>'
    html += '</form>'

    $("#filterResult").append(html)
}

async function roomNameFilterSelected(){
    var html = '<label for="roomNameInput">Select the desired room:</label>';
    html += '<select id="roomNameInput" onchange="roomSelected(this)">'
    html += '<option selected disabled hidden>Choose here</option>'

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
    stopLoadingResults = true
    $("#results").empty()
    console.log("hi" + dateTimeInput.value)
    var dateTime = dateTimeInput.value;
    var filteredBookings;
    filteredBookings = await getBookingsByDate(dateTime)
    stopLoadingResults = false
    addBookings(filteredBookings)
}

async function getBookingsByDate(dateTime){
    var formattedDateTime = await formatDateForSQL(dateTime)
    console.log("bb" + formattedDateTime)
    var output
    await $.get("/api/v1/bookings/Date/" + formattedDateTime, await function (data) {
        output = data
    });
    console.log(output[0] + "aaaa")
    return output
}

async function formatDateForSQL(dateTime) {
    var dateTimeObject = new Date(dateTime)
    var output = dateTimeObject.getFullYear() + "-"
    output += (dateTimeObject.getMonth() + 1) + "-"
    output += dateTimeObject.getDate() + " "
    output += dateTimeObject.getHours() + ":"
    output += dateTimeObject.getMinutes() + ":00"
    return output
}
async function nameEntered(){
    stopLoadingResults = true
    $("#results").empty()
    var name = $('#userSNameInput').val()
    var filteredBookings;
    filteredBookings = await getBookingsByName(name)
    stopLoadingResults = false
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
    stopLoadingResults = true
    $("#results").empty()
    var room = $('#roomNameInput').children("option").filter(":selected").text();
    if (room == "No rooms available"){
        var result = document.createElement("p");
        result.innerHTML = "No rooms"
        $("#results").append(result)
    }
    else {
        var filteredBookings;
        filteredBookings = await getBookingsByRoomName(room)
        stopLoadingResults = false
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
    $("#results").empty()
    console.log("hi")
    if (filteredBookings.length === 0) {
        console.log("no results found")
        var results = document.createElement("p");
        results.innerHTML = "No bookings found"
        $("#results").append(results)
    }
    else {
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
            bookingType.innerHTML = await formattedBookingType(i, filteredBookings)
            bookingType.setAttribute("class", "bookingType")
    
            var reason = document.createElement("p")
            reason.innerHTML = "Reason of booking: " + filteredBookings[i].reason
            reason.setAttribute("class", "reason")
    
            var status = document.createElement("p")
            status.innerHTML = await getBookingStatus(i, filteredBookings)
            reason.setAttribute("class", "bookingStatus")
    
            var currentBookingInfo = document.createElement("div")
            var currentBookingInfo = await formatCurrentBooking(userName, date, roomName, bookingType, reason, status)
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
            
            console.log("stopLoadingResults " + stopLoadingResults)
            if (stopLoadingResults == true) {
                return
            }
            else {
                $("#results").append(currentBooking)
            }
            
        }
    }
    


}

async function getuserName(i, filteredBookings){
    var output = ""
    var userId = filteredBookings[i].user_id

    await $.get("/api/v1/users/id/" + userId, await function (data) {
        output = data[0].full_name
    })
    return output
}

function formattedStartAndEndTime(i, filteredBookings) {
    var output = "From "
    output += filteredBookings[i].start_datetime
    output += " to "
    output += filteredBookings[i].end_datetime
    console.log("aaa" + output)
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

async function formattedBookingType(i, filteredBookings) {
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

async function getBookingStatus(i, filteredBookings) {
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

async function formatCurrentBooking(userName, date, roomName, bookingType, reason, status) {
    var currentBooking = document.createElement("div")
    console.log(date + "aaa")
    currentBooking.appendChild(userName)
    currentBooking.appendChild(date)
    currentBooking.appendChild(roomName)
    currentBooking.appendChild(bookingType)
    currentBooking.appendChild(reason)
    currentBooking.appendChild(status)

    return currentBooking

}