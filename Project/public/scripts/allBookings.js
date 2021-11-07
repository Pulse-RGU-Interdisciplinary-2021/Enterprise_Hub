//too long, should be split into separate documents
async function filterOptionSelected(selectObject) { //shows some input type depending on option chosen
    var optionSelected = selectObject.value;

    $("#filterResult").empty()
    $("#results").remove()
    $("#navSectionDiv").remove()

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

async function dateTimeFilterSelected() {
    var html = '<label for="datetimeInput">Select the desired date and time:</label>';
    html += '<input type="datetime-local" id="datetimeInput" onchange="datePicked(this)">';
    $("#filterResult").append(html)
    $("#navSectionDiv").remove()
}

async function userSNameFilterSelected() {
    var html = '<form action="#">'
    html += '<label for="userSNameInput">Enter the full name of the user:</label>'
    html += '<input type="text" id="userSNameInput">'
    html += '<button id = "userSNameInputButton" onclick="nameEntered()">Search</button>'
    html += '</form>'

    $("#filterResult").append(html)
}

async function roomNameFilterSelected() {
    var html = '<label for="roomNameInput">Select the desired room:</label>';
    html += '<select id="roomNameInput" onchange="roomSelected(this)">'
    html += '<option selected disabled hidden>Choose here</option>'

    var rooms = await getRoomsArray()

    if (rooms.length < 1) {
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

async function getRoomsArray() {
    var output
    await $.get("/api/v1/rooms/All", await function (data) {
        output = data
    });
    return output
}

async function datePicked(dateTimeInput) {
    $("#results").remove()
    $("#navSectionDiv").remove()
    var dateTime = dateTimeInput.value;
    var filteredBookings;
    filteredBookings = await getBookingsByDate(dateTime)
    iterateThroughBookings(filteredBookings)
}

async function getBookingsByDate(dateTime) {
    var formattedDateTime = await formatDate(dateTime)
    var output
    await $.get("/api/v1/bookings/Date/" + formattedDateTime, await function (data) {
        output = data
    });
    console.log(output[0] + "aaaa")
    return output
}

async function formatDate(dateTime) {
    var dateTimeObject = new Date(dateTime)
    var output = dateTimeObject.getFullYear() + "-"
    output += (dateTimeObject.getMonth() + 1) + "-"
    output += dateTimeObject.getDate() + " "
    output += dateTimeObject.getHours() + ":"
    output += dateTimeObject.getMinutes() + ":00"
    return output
}
async function nameEntered() {
    $("#results").remove()
    $("#navSectionDiv").remove()
    var name = $('#userSNameInput').val()
    var filteredBookings;
    filteredBookings = await getBookingsByName(name)
    iterateThroughBookings(filteredBookings)
}

async function getBookingsByName(name) {
    var output
    await $.get("/api/v1/bookings/UserFullName/" + name, await function (data) {
        output = data
    });
    return output
}

async function roomSelected(roomInput) {
    $("#results").remove()
    $("#navSectionDiv").remove()
    var room = $('#roomNameInput').children("option").filter(":selected").text();
    if (room == "No rooms available") {
        var result = document.createElement("p");
        result.innerHTML = "No rooms"
        $("#results").append(result)
    }
    else {
        var filteredBookings;
        filteredBookings = await getBookingsByRoomName(room)
        iterateThroughBookings(filteredBookings)
    }
}

async function getBookingsByRoomName(roomName) {
    var output
    await $.get("/api/v1/bookings/RoomName/" + roomName, await function (data) {
        output = data
    });
    return output
}

async function iterateThroughBookings(filteredBookings) {
    $('#mainContent').append('<nav id="navSectionDiv"><ul><li class = "navLi" id="upcomingBookingsNav"><a href="#upcomingBookings">Upcoming Bookings</a></li><li class = "navLi" id="pastBookingsNav"><a href="#pastBookings">Past Bookings</a></li></ul></nav>')
    
    var resultsDiv = document.createElement("div")
    resultsDiv.setAttribute("id", "results");
    $("#mainContent").append(resultsDiv);

    if (filteredBookings.length === 0) {
        if (!(document.body.contains(document.getElementById("upcomingBookings")))) {
            console.log("break")
        }
        addNoBookingText("#upcomingBookings")
        addNoBookingText("#pastBookings")
    }
    else {
        var upcomingBookings = []
        var pastBookings = []
        var pastUpcomingBookingsArray = await splitBookings(filteredBookings, upcomingBookings, pastBookings)
        upcomingBookings = pastUpcomingBookingsArray[0]
        pastBookings = pastUpcomingBookingsArray[1]
        pastBookings.reverse()

        if (upcomingBookings.length === 0) {
            await addNoBookingText("#upcomingBookings")
        }
        else {
            await addBookings(upcomingBookings, true)
        }

        if (pastBookings.length == 0) {
            await addNoBookingText("#pastBookings")
        }
        else {
            await addBookings(pastBookings, false)
        }
    }
    await createObserver()
}

async function splitBookings(filteredBookings, upcomingBookings, pastBookings) {
    var dateTimeObject = new Date()
    upcomingBookings = []
    pastBookings = []
    for (var i = 0; i < filteredBookings.length; i++) {
        var currentBookingDateTimeObject = new Date(filteredBookings[i].start_datetime)
        if (currentBookingDateTimeObject > dateTimeObject) {
            upcomingBookings.push(filteredBookings[i])
        }
        else if (currentBookingDateTimeObject < dateTimeObject) {
            pastBookings.push(filteredBookings[i])
        }
        else {
            console.log("Problem with comparing dates\nCurrent date: " + dateTimeObject.toDateString() + "\nBooking date:" + filteredBookings[i].start_datetime)
        }


    }

    return [upcomingBookings, pastBookings]
}

async function addNoBookingText(sectionDiv) {
    console.log("uuuuuu" + sectionDiv)
    if (sectionDiv == "#upcomingBookings"){
        $('#results').append('<div id="upcomingBookings" class="bookingsContainer"><p class="typeOfBookingTitle">Upcoming Bookings</p></div>')
    }
    else if(sectionDiv == "#pastBookings"){
        $('#results').append('<div id="pastBookings" class="bookingsContainer"><p class="typeOfBookingTitle">Past Bookings</p></div>')
    }
    else{
        console.log("problem wit showing no results")
        $('#results').append("Problem encountered")
    }
    var message = document.createElement("p")
    message.innerHTML = "No bookings to show"
    message.setAttribute("class", "noBookingsMessage")

    $(sectionDiv).append(message)
}

async function addBookings(filteredBookings, isUpcoming) {
    if (isUpcoming) {
        $('#results').append('<div id="upcomingBookings" class="bookingsContainer"><p class="typeOfBookingTitle">Upcoming Bookings</p></div>')
    }
    else {
        $('#results').append('<div id="pastBookings" class="bookingsContainer"><p class="typeOfBookingTitle">Past Bookings</p></div>')
    }


    for (var i = 0; i < filteredBookings.length; i++) {

        if (!(document.body.contains(document.getElementById("results")))) {
            console.log("break")
            break
        }
        var userName = document.createElement("p");
        userName.innerHTML = await getuserName(i, filteredBookings)
        userName.setAttribute("class", "userName")

        var date = document.createElement("p");
        date.innerHTML = await formattedStartAndEndTimeToString(i, filteredBookings)
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

        if (isUpcoming) {
            var button = document.createElement("button")
            button.innerHTML = "Cancel Booking"
            button.setAttribute("onclick", "openPopUpCancelBooking(" + filteredBookings[i].id + ")");
            button.setAttribute("class", "cancelButton")
            button.setAttribute("type", "button")
        }

        var currentBookingInfo = document.createElement("div")
        var currentBookingInfo = await formatCurrentBooking(userName, date, roomName, bookingType, reason, status, button, isUpcoming)
        currentBookingInfo.setAttribute("class", "infoPendingBookingsDiv")

        var currentBooking = document.createElement("div")
        currentBooking.appendChild(currentBookingInfo)
        currentBooking.setAttribute("class", "bookingDiv")


       if (isUpcoming) {
            $("#upcomingBookings").append(currentBooking)
        }
        else {
            $("#pastBookings").append(currentBooking)
        }


    }

}

async function openPopUpCancelBooking(bookingId){
    var popUp = "<div id = \"popUpContainer\">"
    popUp += "<div id = \"popUpDiv\>"
    popUp += "<h1>Are you sure you want to delete this booking?</h1>"
    popUp += "<div id = \"cancelBookingPopUpButtonsDiv\">"
    popUp += "<button onclick = \"cancelBooking(" + bookingId + ")>Yes</button>"
    popUp += "<button onclick = \"closePopUpCancelBooking()\">No</button>"
    popUp += "</div>"
    popUp += "</div>"
    popUp += "</div>"
}

async function closePopUpCancelBooking() {
    $("#popUpContainer").remove()
}

async function cancelBooking(bookingId){
    var output
    await $.post("/api/v1/bookings/delete/" + bookingId, await function (data) {
        output = data
    });
    console.log(output)
}

async function getuserName(i, filteredBookings) {
    var output = ""
    var userId = filteredBookings[i].user_id

    await $.get("/api/v1/users/id/" + userId, await function (data) {
        output = data[0].full_name
    })
    return output
}

function formattedStartAndEndTimeToString(i, filteredBookings) {
    var output = "From "
    output += "<div class=\"dateText\">" + formatDateTime(filteredBookings[i].start_datetime) + "</div>"
    output += "<br>to "
    output += "<div class=\"dateText\">" + formatDateTime(filteredBookings[i].end_datetime) + "</div>"
    return output
}

function formatDateTime(dateTime) {
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
/** 
async function formattedStartAndEndTime(i, filteredBookings) {
    var output = "From "

    var formattedStart = await formatDate(filteredBookings[i].start_datetime)
    output += formattedStart

    output += " to "

    var formattedEnd = await formatDate(filteredBookings[i].end_datetime)
    output += formattedEnd
    return output
}*/

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

async function formatCurrentBooking(userName, date, roomName, bookingType, reason, status, button, isUpcoming) {
    var currentBooking = document.createElement("div")
    console.log(date + "aaa")
    currentBooking.appendChild(userName)
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

function checkVisibleScrollSection(entries, observer) {
    var upComingBookingLi = document.getElementById("upcomingBookingsNav")
    var pastBookingsLi = document.getElementById("pastBookingsNav")

    entries.forEach(entry => {
        const id = entry.target.getAttribute('id');
        if (entry.intersectionRatio > 0) {
            console.log("hiii")
            document.querySelector(`nav li a[href="#${id}"]`).style.color = "#009fee";
        }
        else {
            document.querySelector(`nav li a[href="#${id}"]`).style.color = "black";
        }
    })
}

async function createObserver() { //this is used to check what parts of the ui are visible

    console.log("eeeeeeee")

    let observer = new IntersectionObserver(checkVisibleScrollSection);
    document.querySelectorAll('.bookingsContainer').forEach((section) => {
        console.log("ooooooooooooooooo")
        observer.observe(section);
    });
}