var allBookingsByUser
showBookings()
async function showBookings() {
    var userId = 2 //We would get this from the login later
    allBookingsByUser = await getBooking(userId)
    addBookings(allBookingsByUser)
}

async function addBookings(allBookingsByUser) {
    for (var i = 0; i < allBookingsByUser.length; i++) {

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
        reason.innerHTML = "Reason of booking: " + allBookingsByUser[i].reason
        reason.setAttribute("class", "reason")

        var status = document.createElement("p")
        status.innerHTML = getBookingStatus(i)
        reason.setAttribute("class", "bookingStatus")

        var currentBooking = document.createElement("div")
        var currentBooking = formatCurrentBooking(date, roomName, bookingType, reason, status)
        currentBooking.setAttribute("class", "bookingDiv")

        $("#myBookingsDiv").append(currentBooking)
    }
}

async function getBooking(userId) {
    var output
    await $.get("/api/v1/bookings/UserId/" + userId, await function (data) {
        output = JSON.parse(JSON.stringify(data))
    });
    return output
}

function formattedStartAndEndTime(i) {
    var output = "From "
    console.log(typeof allBookingsByUser[i].start_datetime)
    output += allBookingsByUser[i].start_datetime
    output += " to "
    output += allBookingsByUser[i].end_datetime
    return output
}

async function getRoomName(i) {
    var output = ""
    var roomId = allBookingsByUser[i].room_id
    await $.get("/api/v1/rooms/id/" + roomId, await function (data) {
        output += JSON.parse(JSON.stringify(data))[0].room_name
    })
    return output
}

function formattedBookingType(i) {
    var output = ""
    if (allBookingsByUser[i].full_room_booking) {
        output += "Full room booking"
    }
    else {
        var nOfDesks = allBookingsByUser[i].desks
        if (nOfDesks > 1) {
            output += allBookingsByUser[i].desks + " desks"
        }
        else {
            output += allBookingsByUser[i].desks + " desk"
        }  
    }
    return output
}

function getBookingStatus(i) {
    var output = ""
    if (allBookingsByUser[i].confirmed) {
        output += "BOOKING CONFIRMED"
    }
    else {
        if (allBookingsByUser[i].pending) {
            output += "BOOKING PENDING"
        }
        else {
            output += "STATUS UNKNOWN"
        }
    }
    return output
}

function formatCurrentBooking(date, roomName, bookingType, reason, status) {
    var currentBooking = document.createElement("div")
    currentBooking.appendChild(date)
    currentBooking.appendChild(roomName)
    currentBooking.appendChild(bookingType)
    currentBooking.appendChild(reason)
    currentBooking.appendChild(status)

    return currentBooking

}
/** 
function formatDateTime(date) {
    
}*/