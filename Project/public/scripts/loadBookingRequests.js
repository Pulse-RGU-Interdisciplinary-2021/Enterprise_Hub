var allPendingBookings;
async function showBookings(isEvents) {
    //allPendingBookings = await getBookings("true")
    if (isEvents) {
        allPendingBookings = await getEvents(true);
        $("#Events").append("<h1>Pending Events</h1>");
    } else {
        allPendingBookings = await getBookingsNoEvents(true);
        $("#Bookings").append("<h1>Pending Bookings</h1>");
        console.log("888" + allPendingBookings[0])
    }
    addBookings(allPendingBookings, isEvents);
}

async function addBookings(allPendingBookings, isEvents) {
    for (var i = 0; i < allPendingBookings.length; i++) {
        var userName = document.createElement("p");
        userName.setAttribute("class", "userName");
        if (!isEvents) {
            userName.innerHTML = await getuserName(i);
        }

        var date = document.createElement("p");
        date.innerHTML = formattedStartAndEndTimeToString(i, isEvents);
        date.setAttribute("class", "date");

        var roomName = document.createElement("p");
        roomName.innerHTML = await getRoomName(i);
        roomName.setAttribute("class", "roomName");

        if (!isEvents) {
            var bookingType = document.createElement("p");
            bookingType.innerHTML = formattedBookingType(i);
            bookingType.setAttribute("class", "bookingType");
        }

        var reason = document.createElement("p");
        reason.innerHTML = "Reason of booking: ";
        if (isEvents) {
            var reasonFull = allPendingBookings[i].reason;
            var arr = reasonFull.split(":");
            reason.innerHTML += arr[1];
            userName.innerHTML = arr[0];
        } else {
            reason.innerHTML += allPendingBookings[i].reason;
        }
        reason.setAttribute("class", "reason");

        var currentBookingInfo = document.createElement("div");
        var currentBookingInfo = formatCurrentBooking(
            userName,
            date,
            roomName,
            bookingType,
            reason,
            isEvents
        );
        currentBookingInfo.setAttribute("class", "infoPendingBookingsDiv");

        //to change
        var confirm = document.createElement("button");
        confirm.innerHTML = "confirm";
        confirm.setAttribute("onclick", "confirmBookingRequest(" + i + ")");
        confirm.setAttribute("class", "confirm");

        //to change
        var reject = document.createElement("button");
        reject.innerHTML = "reject";
        reject.setAttribute(
            "onclick",
            "rejectBookingRequest(" + allPendingBookings[i].id + ", " + i + ")"
        );
        reject.setAttribute("class", "reject");

        var currentBookingResponse = document.createElement("div");
        currentBookingResponse.appendChild(confirm);
        currentBookingResponse.appendChild(reject);
        currentBookingResponse.setAttribute("class", "approveRejectButtonsDiv");

        var currentBooking = document.createElement("div");
        currentBooking.appendChild(currentBookingInfo);
        currentBooking.appendChild(currentBookingResponse);
        currentBooking.setAttribute("class", "bookingDiv");
        currentBooking.setAttribute("id", allPendingBookings[i].id);

        if (isEvents) {
            $("#Events").append(currentBooking);
        } else {
            $("#Bookings").append(currentBooking);
        }
    }
}

async function getEvents(boolean) {
    var output;
    await $.get(
        "/api/v1/bookings/UpcomingPendingEvents/" + boolean,
        await function (data) {
            output = data;
        }
    );
    return output;
}

async function getBookingsNoEvents(boolean) {
    var output;
    await $.get(
        "/api/v1/bookings/UpcomingPendingNoEvents/" + boolean,
        await function (data) {
            output = data;
        }
    );
    return output;
}

async function getuserName(i) {
    var output = "";
    var userId = allPendingBookings[i].user_id;
    await $.get(
        "/api/v1/users/id/" + userId,
        await function (data) {
            output += data[0].full_name;
        }
    );
    return output;
}

function formattedStartAndEndTimeToString(i) {
    var output = "From ";
    output +=
        '<div class="dateText">' +
        formatDateTime(allPendingBookings[i].start_datetime) +
        "</div>";
    output += "<br>to ";
    output +=
        '<div class="dateText">' +
        formatDateTime(allPendingBookings[i].end_datetime) +
        "</div>";
    return output;
}

function formatDateTime(dateTime) {
    var dateTimeObject = new Date(dateTime);
    var output = "";

    output += dateTimeObject.getDate() + " / ";
    output += dateTimeObject.getMonth() + 1 + " / ";
    output += dateTimeObject.getFullYear() + " at ";

    if (dateTimeObject.getHours() < 10) {
        output += "0" + dateTimeObject.getHours() + ":";
    } else {
        output += dateTimeObject.getHours() + ":";
    }

    if (dateTimeObject.getMinutes() < 10) {
        output += "0" + dateTimeObject.getMinutes();
    } else {
        output += dateTimeObject.getMinutes();
    }

    return output;
}

async function getRoomName(i) {
    var output = "";
    var roomId = allPendingBookings[i].room_id;
    await $.get(
        "/api/v1/rooms/id/" + roomId,
        await function (data) {
            output += data[0].room_name;
        }
    );
    return output;
}

function formattedBookingType(i) {
    var output = "";
    if (allPendingBookings[i].full_room_booking) {
        output += "Full room booking";
    } else {
        var nOfDesks = allPendingBookings[i].desks;
        if (nOfDesks > 1) {
            output += allPendingBookings[i].desks + " desks";
        } else {
            output += allPendingBookings[i].desks + " desk";
        }
    }
    return output;
}

function formatCurrentBooking(
    userName,
    date,
    roomName,
    bookingType,
    reason,
    isEvents
) {
    var currentBooking = document.createElement("div");
    currentBooking.appendChild(userName);
    currentBooking.appendChild(date);
    currentBooking.appendChild(roomName);
    if (!isEvents) {
        currentBooking.appendChild(bookingType);
    }

    currentBooking.appendChild(reason);

    return currentBooking;
}

async function confirmBookingRequest(i) {
    var date = await formatDateTime(allPendingBookings[i].start_datetime);
    var roomName = await getRoomName(i);

    if (allPendingBookings[i].event_booking_yn == 1) {
        var bookingsType = "full room";

        await $.post("/eventApproved", {
            date: date,
            roomName: roomName,
            bookingType: bookingsType,
        }, (response) => {
            $.ajax({
                type: "PUT",
                url: "/api/v1/bookings/",
                data: {
                    booking_id: allPendingBookings[i].id,
                    room_id: allPendingBookings[i].room_id,
                    user_id: allPendingBookings[i].user_id,
                    start_datetime: allPendingBookings[i].start_datetime,
                    end_datetime: allPendingBookings[i].end_datetime,
                    desks: allPendingBookings[i].desks,
                    reason: allPendingBookings[i].reason,
                    full_room_booking: allPendingBookings[i].full_room_booking,
                    confirmed: 1,
                    pending: 0,
                },
                success: function (response) {
                    alertOutcomeBookingApproved(i);
                },
            });
        },
        );
    } else {
        var bookingsType = formattedBookingType(i);
        var bookingsType = "full room";
        await $.post("/bookingApproved", {
            date: date,
            roomName: roomName,
            bookingType: bookingsType,
        }, (response) => {
            allPendingBookings[i].pending = 0;
            allPendingBookings[i].confirmed = 1;
            $.ajax({
                type: "PUT",
                url: "/api/v1/bookings/",
                data: {
                    booking_id: allPendingBookings[i].id,
                    room_id: allPendingBookings[i].room_id,
                    user_id: allPendingBookings[i].user_id,
                    start_datetime: allPendingBookings[i].start_datetime,
                    end_datetime: allPendingBookings[i].end_datetime,
                    desks: allPendingBookings[i].desks,
                    reason: allPendingBookings[i].reason,
                    full_room_booking: allPendingBookings[i].full_room_booking,
                    confirmed: 1,
                    pending: 0,
                },
                success: function (response) {
                    console.log(response);
                    alertOutcomeBookingApproved(i);
                },
                error: function (response) {
                    console.log(response);
                }
            });
        });
    }
}

async function alertOutcomeBookingApproved(i) {
    var booking = await getBookingById(allPendingBookings[i].id);
    if (booking[0].pending == 0 && booking[0].confirmed == 1) {
        alert("Booking approved correctly");
        var bookingDiv = document.getElementById(allPendingBookings[i].id);
        bookingDiv.style.opacity = "0";
        setTimeout(function () {
            bookingDiv.style.height =
                $("#" + allPendingBookings[i].id).height() + "px";
            bookingDiv.classList.add("hide-me");
            (function (el) {
                setTimeout(function () {
                    el.remove();
                }, 1500);
            })(bookingDiv);
        }, 1000);
    } else {
        alert("Error in booking approval");
    }
}

async function rejectBookingRequest(id, i) {
    var date = await formatDateTime(allPendingBookings[i].start_datetime);
    var roomName = await getRoomName(i);

    if (allPendingBookings[i].event_booking_yn == 1) {
        var bookingsType = "full room";

        await $.post("/eventRejected", {
            date: date,
            roomName: roomName,
            bookingType: bookingsType,
        }, (response) => { })

    } else {
        var bookingsType = formattedBookingType(i);
        await $.post("/bookingRejected", {
            date: date,
            roomName: roomName,
            bookingType: bookingsType,
        }, (response) => {
            $.ajax({
                type: "DELETE",
                url: "/api/v1/bookings/delete/" + id,
                data: {
                    booking_id: id,
                },
                success: function (response) {
                    alertOutcomeBookingRejected(id);
                },
            });
         })
    }

}

async function alertOutcomeBookingRejected(id) {
    console.log("hiaa")
    var booking = await getBookingById(id);
    if (!booking[0]) {
        alert("Booking rejected correctly");
        var bookingDiv = document.getElementById(id);
        bookingDiv.style.opacity = "0";
        setTimeout(function () {
            bookingDiv.style.height = $("#" + id).height() + "px";
            bookingDiv.classList.add("hide-me");
            (function (el) {
                setTimeout(function () {
                    el.remove();
                }, 1500);
            })(bookingDiv);
        }, 1000);
    } else {
        alert("Error in booking rejection");
    }
}

async function getBookingById(id) {
    var output;
    await $.get(
        "/api/v1/bookings/Id/" + id,
        await function (data) {
            output = data;
        }
    );
    return output;
}
