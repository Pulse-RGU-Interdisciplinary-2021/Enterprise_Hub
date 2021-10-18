var allPendingdBookings
showBookings()
async function showBookings() {
    allPendingdBookings = await getBookings("true")
    addBookings(allPendingdBookings)
}

async function addBookings(allPendingdBookings) {
    for (var i = 0; i < allPendingdBookings.length; i++) {

        var userName = document.createElement("p");
        userName.innerHTML = await getuserName(i)
        userName.setAttribute("class", "userName")

        var date = document.createElement("p");
        date.innerHTML = formattedStartAndEndTime(i)
        date.setAttribute("class", "date");

        var roomName = document.createElement("p");
        roomName.innerHTML = await getRoomName(i)
        roomName.setAttribute("class", "roomName")

        var bookingType = document.createElement("p");
        bookingType.innerHTML = formattedBookingType(i)
        bookingType.setAttribute("class", "bookingType")

        var reason = document.createElement("p")
        reason.innerHTML = "Reason of booking: " + allPendingdBookings[i].reason
        reason.setAttribute("class", "reason")

        var currentBookingInfo = document.createElement("div")
        var currentBookingInfo = formatCurrentBooking(userName, date, roomName, bookingType, reason)
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

        $("#pendingBookingsDiv").append(currentBooking)
    }
}

async function getBookings(boolean) {
    var output
    await $.get("/api/v1/bookings/Pending/" + boolean, await function (data) {
        output = data;
    });
    return output
}

async function getuserName(i){
    var output = ""
    var userId = allPendingdBookings[i].user_id
    await $.get("/api/v1/users/id/" + userId, await function (data) {
        // data is an array thats why [0] is needed even if it seems redundant
        output += data[0].full_name
    })
    return output
}

function formattedStartAndEndTime(i) {
    var output = "From "
    console.log(typeof allPendingdBookings[i].start_datetime)
    output += allPendingdBookings[i].start_datetime
    output += " to "
    output += allPendingdBookings[i].end_datetime
    return output
}

async function getRoomName(i) {
    var output = ""
    var roomId = allPendingdBookings[i].room_id
    await $.get("/api/v1/rooms/id/" + roomId, await function (data) {
        output += data[0].room_name
    })
    return output
}

function formattedBookingType(i) {
    var output = ""
    if (allPendingdBookings[i].full_room_booking) {
        output += "Full room booking"
    }
    else {
        var nOfDesks = allPendingdBookings[i].desks
        if (nOfDesks > 1) {
            output += allPendingdBookings[i].desks + " desks"
        }
        else {
            output += allPendingdBookings[i].desks + " desk"
        }  
    }
    return output
}

function formatCurrentBooking(userName, date, roomName, bookingType, reason) {
    var currentBooking = document.createElement("div")
    currentBooking.appendChild(userName)
    currentBooking.appendChild(date)
    currentBooking.appendChild(roomName)
    currentBooking.appendChild(bookingType)
    currentBooking.appendChild(reason)

    return currentBooking

}