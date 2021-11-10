window.addEventListener('DOMContentLoaded', () => {
    showBookings()
    createObserver()
});

async function showBookings() {
    var userId = 1 //We would get this from the login later
    var allBookingsByUser = await getBooking(userId)
    iterateThroughBookings(allBookingsByUser)
}

async function iterateThroughBookings(allBookingsByUser) {
    if (allBookingsByUser.length === 0) {
        addNoBookingText("#upcomingBookings")
        addNoBookingText("#pastBookings")
    }
    else {
        var upcomingBookings = []
        var pastBookings = []
        var pastUpcomingBookingsArray = await splitBookings(allBookingsByUser, upcomingBookings, pastBookings)
        upcomingBookings = pastUpcomingBookingsArray[0]
        pastBookings = pastUpcomingBookingsArray[1]
        pastBookings.reverse()

        if(upcomingBookings.length === 0) {
            await addNoBookingText("#upcomingBookings")
        }
        else{
            await addBookings(upcomingBookings, true)
        }

        if(pastBookings.length == 0) {
            await addNoBookingText("#pastBookings")
        }
        else{
            await addBookings(pastBookings, false)
        } 
    }
}

async function addBookings(allBookingsByUser, isUpcoming) {
    for (var i = 0; i < allBookingsByUser.length; i++) {


        var date = document.createElement("p");
        date.innerHTML = formattedStartAndEndTimeToString(i, allBookingsByUser)
        date.setAttribute("class", "date");

        var roomName = document.createElement("p");
        roomName.innerHTML = await getRoomName(i, allBookingsByUser)
        roomName.setAttribute("class", "roomName")

        var bookingType = document.createElement("p");
        bookingType.innerHTML = formattedBookingType(i, allBookingsByUser)
        bookingType.setAttribute("class", "bookingType")

        var reason = document.createElement("p")
        reason.innerHTML = "Reason of booking: " + allBookingsByUser[i].reason
        reason.setAttribute("class", "reason")

        var status = document.createElement("p")
        status.innerHTML = getBookingStatus(i, allBookingsByUser)
        reason.setAttribute("class", "bookingStatus")

        if (isUpcoming) {
            var button = document.createElement("button")
            button.innerHTML = "Cancel Booking"
            button.setAttribute("onclick", "cancelBooking(" + allBookingsByUser[i].id + ")");
            button.setAttribute("class", "cancelButton")
            button.setAttribute("type", "button")
        }


        var currentBooking = document.createElement("div")
        var currentBooking = formatCurrentBooking(date, roomName, bookingType, reason, status, button, isUpcoming)
        currentBooking.setAttribute("class", "bookingDiv")
        currentBooking.setAttribute("id", allBookingsByUser[i].id)

        if (isUpcoming) {
            $("#upcomingBookings").append(currentBooking)
        }
        else {
            $("#pastBookings").append(currentBooking)
        }

    }
}

async function addNoBookingText(sectionDiv) {
    var message = document.createElement("p")
    message.innerHTML = "No bookings to show"
    message.setAttribute("class", "noBookingsMessage")

    $(sectionDiv).append(message)
}

async function getBooking(userId) {
    var output
    await $.get("/api/v1/bookings/UserId/" + userId, await function (data) {
        output = data
    });
    return output
}

async function splitBookings(allBookingsByUser, upcomingBookings, pastBookings) {
    var dateTimeObject = new Date()
    upcomingBookings = []
    pastBookings = []
    for (var i = 0; i < allBookingsByUser.length; i++) {
        var currentBookingDateTimeObject = new Date(allBookingsByUser[i].start_datetime)
        if (currentBookingDateTimeObject > dateTimeObject) {
            upcomingBookings.push(allBookingsByUser[i])
        }
        else if (currentBookingDateTimeObject < dateTimeObject) {
            pastBookings.push(allBookingsByUser[i])
        }
        else {
            console.log("Problem with comparing dates\nCurrent date: " + dateTimeObject.toDateString() + "\nBooking date:" + allBookingsByUser[i].start_datetime)
        }


    }

    return [upcomingBookings, pastBookings]
}

function formattedStartAndEndTimeToString(i, allBookingsByUser) {
    var output = "From "
    output += "<div class=\"dateText\">" + formatDateTime(allBookingsByUser[i].start_datetime) + "</div>"
    output += "<br>to "
    output += "<div class=\"dateText\">" + formatDateTime(allBookingsByUser[i].end_datetime) + "</div>"
    return output
}

function formatDateTime(dateTime, allBookingsByUser) {
    var dateTimeObject = new Date(dateTime)
    var output = "";

    output += dateTimeObject.getDate() + " / "
    output += (dateTimeObject.getMonth() + 1) + " / "
    output += dateTimeObject.getFullYear() + " at "

    if (dateTimeObject.getHours() < 10) {
        output += "0" + dateTimeObject.getHours() + ":"
    }
    else {
        output += dateTimeObject.getHours() + ":"
    }

    if (dateTimeObject.getMinutes() < 10) {
        output += "0" + dateTimeObject.getMinutes()
    }
    else {
        output += dateTimeObject.getMinutes()
    }

    return output
}


async function getRoomName(i, allBookingsByUser) {
    var output = ""
    var roomId = allBookingsByUser[i].room_id
    await $.get("/api/v1/rooms/id/" + roomId, await function (data) {
        output += data[0].room_name
    })
    return output
}

function formattedBookingType(i, allBookingsByUser) {
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

function getBookingStatus(i, allBookingsByUser) {
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

function formatCurrentBooking(date, roomName, bookingType, reason, status, button, isUpcoming) {
    var currentBooking = document.createElement("div")
    currentBooking.appendChild(date)
    currentBooking.appendChild(roomName)
    currentBooking.appendChild(bookingType)
    currentBooking.appendChild(reason)
    currentBooking.appendChild(status)

    if (isUpcoming) {
        currentBooking.appendChild(button)
    }

    return currentBooking

}

async function cancelBooking(id){
    await $.ajax({
        type: 'DELETE',
        url: '/api/v1/bookings/delete/' + id,
        data: { booking_id: id,
        },
        success: function(response){
            alertOutcomeBookingCancelled(id)
        }
    });
}

async function alertOutcomeBookingCancelled(id){
    var booking = await getBookingById(id)
    if (!booking[0]){
        alert ("Booking cancelled correctly")
        var bookingDiv = document.getElementById(id) 
        bookingDiv.style.opacity = '0'
        setTimeout(function(){
            bookingDiv.style.height = $("#" + id).height()+ 'px';
            bookingDiv.classList.add('hide-me');
            (function(el) {
                setTimeout(function() {
                el.remove();
                }, 1500);
            })(bookingDiv);
        }, 1000);
    }
    else {
        alert ("Error in booking rejection")
    }
}

async function getBookingById(id){
    var output
    await $.get("/api/v1/bookings/Id/" + id, await function (data) {
        output = data
    });
    return output
}

function checkVisibleScrollSection(entries, observer) {
    var upComingBookingLi = document.getElementById("upcomingBookingsNav")
    var pastBookingsLi = document.getElementById("pastBookingsNav")

    entries.forEach(entry => {
        const id = entry.target.getAttribute('id');
        if (entry.intersectionRatio > 0) {
            document.querySelector(`nav li a[href="#${id}"]`).style.color = "#009fee";
        }
        else {
            document.querySelector(`nav li a[href="#${id}"]`).style.color = "black";
        }
    })
}

function createObserver() { //this is used to check what parts of the ui are visible

    let observer = new IntersectionObserver(checkVisibleScrollSection);
    document.querySelectorAll('.bookingsContainer').forEach((section) => {
        observer.observe(section);
    });
}
