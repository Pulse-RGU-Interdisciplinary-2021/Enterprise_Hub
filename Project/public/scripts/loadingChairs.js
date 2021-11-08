$(document).ready(async function () {
    console.log("ready")
    await setDefaultDateTimes()
    dateChanged()
});

async function setDefaultDateTimes() {
    var defaultStartDT = await getDefaultStartDateTime()
    var defaultEndDT = await getDefaultEndDateTime()
    console.log(defaultEndDT + defaultStartDT)
    document.getElementById("startDatetimeInput").defaultValue = defaultStartDT
    document.getElementById("endDatetimeInput").defaultValue = defaultEndDT
}

async function getDefaultStartDateTime() {
    var dateTimeObject = new Date()
    var output = dateTimeObject.getFullYear() + "-"

    var month = dateTimeObject.getMonth() + 1
    if (month.toString().length < 2) {
        month = "0" + (dateTimeObject.getMonth() + 1)
    }

    var date = dateTimeObject.getDate()
    if (date.toString().length < 2) {
        date = "0" + dateTimeObject.getDate()
    }

    var hour = dateTimeObject.getHours()
    if (hour.toString().length < 2) {
        hour = "0" + dateTimeObject.getHours()
    }

    var minute = dateTimeObject.getMinutes()
    if (minute.toString().length < 2) {
        minute = "0" + dateTimeObject.getMinutes()
    }

    output += month + "-"
    output += date + "T"
    output += hour + ":"
    output += minute
    return output
}

async function getDefaultEndDateTime() {
    var dateTimeObject = new Date()
    var output = dateTimeObject.getFullYear() + "-"

    var month = dateTimeObject.getMonth() + 1
    if (month.toString().length < 2) {
        month = "0" + (dateTimeObject.getMonth() + 1)
    }

    var date = dateTimeObject.getDate()
    if (date.toString().length < 2) {
        date = "0" + dateTimeObject.getDate()
    }

    var hour = dateTimeObject.getHours()
    if (hour.toString().length < 2) {
        hour = "0" + dateTimeObject.getHours()
    }

    var minute = dateTimeObject.getMinutes()
    if (minute.toString().length < 2) {
        minute = "0" + dateTimeObject.getMinutes()
    }

    output += month + "-"
    output += date + "T"
    output += (hour + 1) + ":"
    output += minute
    return output
}

async function dateChanged() {
    var startDateTime = $('#startDatetimeInput').val()
    var endDateTime = $('#endDatetimeInput').val()

    showRoomAvailability(startDateTime, endDateTime)

}

async function showRoomAvailability(startDateTime, endDateTime) {
    $('#roomAvailabilityDiv').empty()
    var allRooms
    allRooms = await getAllRooms()
    displayRooms(allRooms, startDateTime, endDateTime)
}

async function getAllRooms() {
    var output
    await $.get("/api/v1/rooms/All", await function (data) {
        output = data
    });
    return output
}

async function displayRooms(allRooms, startDateTime, endDateTime) {
    if (allRooms.length === 0) {
        console.log("no results found")
        var results = document.createElement("p");
        results.innerHTML = "No rooms found"
        $("#roomAvailabilityDiv").append(results)
    }
    else {
        for (var i = 0; i < allRooms.length; i++) {
            var formattedStartTime = await formatDateForSQL(startDateTime)
            var formattedEndTime = await formatDateForSQL(endDateTime)
            var unavailableDesks = await getUnavailableDesksNumber(allRooms[i].id, formattedStartTime, formattedEndTime)
            var totalDesks = allRooms[i].max_desks
            console.log(i + " Total desks:" + totalDesks)
            var roomDiv = document.createElement("div")
            roomDiv.setAttribute("class", "roomDiv")
            roomDiv.setAttribute("id", "room" + i)
            $('#roomAvailabilityDiv').append(roomDiv)

            var roomDiagram = await getRoomDiagram(unavailableDesks[0].deskn, totalDesks, i, allRooms)
            $('#room' + i).append(roomDiagram)
        }
    }
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

async function getUnavailableDesksNumber(room_id, startDateTime, endDateTime) {
    var output
    await $.get("/api/v1/bookings/CountUnavailableDesks/" + room_id + "/" + startDateTime + "/" + endDateTime, await function (data) {
        output = data
    });
    return output
}

async function getRoomDiagram(unavailableDesks, totalDesks, i, allRooms) {
    var output = '<div id=\'room' + i + 'Diagram\' class = \'diagram\' onclick=\'diagramClicked(' + allRooms[i].id + ')\'>'

    console.log("unavailableDesks: " + unavailableDesks + "\ntotalDesks: " + totalDesks)
    var columns = 5 //can be changed later
    var emptyDiagramSpaces = (columns * Math.ceil(totalDesks/columns)) - totalDesks
    console.log("Empty diagram spaces = " + emptyDiagramSpaces)
    var totalDiagramSpaces = totalDesks + emptyDiagramSpaces
    if (totalDiagramSpaces % columns !== 0) {
        console.log("error with diagram desk spaces")
        console.log("totalDiagramSpaces: " + totalDiagramSpaces + " Columns: " + columns)
    }
    var rows = totalDiagramSpaces / columns

    //we will use these variables to keep track of how many desks of each time have been added
    var unavailableDesksCountDown = unavailableDesks
    var availableDesksCountDown = totalDesks - unavailableDesks
    var emptyDiagramSpacesCountDown = emptyDiagramSpaces

    if ((rows * columns) !== (unavailableDesksCountDown + availableDesksCountDown + emptyDiagramSpacesCountDown)) {
        console.log("error in desk numbers")
        console.log("r " + rows + " c " + columns + " a " + availableDesksCountDown + " u " + unavailableDesksCountDown + " e " + emptyDiagramSpacesCountDown)
    }
    output += '<table>'
    for (var i = 0; i < rows; i++) {
        output += '<tr id="roow' + i + '">'
        for (var j = 0; j < columns; j++) {
            output += '<th>'
            //img height is in pixel, should be changed to % or vh in css
            if (unavailableDesksCountDown > 0) {
                output += '<img class="row' + i + ', column' + j + '" src="./images/unavailableChair.png" alt="unavailable chair icon" height="30"></img>'
                unavailableDesksCountDown--
            }
            else if (availableDesksCountDown > 0) {
                output += '<img class="row' + i + ', column' + j + '" src="./images/availableChair.png" alt="available chair icon" height="30" ></img>'
                availableDesksCountDown--
            }
            else if (emptyDiagramSpacesCountDown > 0) {
                output += '<img class="row' + i + ', column' + j + '" src="./images/emptyChairSpace.png" alt="empty icon" height="30"></img>'
                emptyDiagramSpacesCountDown--
            }
            output += '</th>'
        }
        output += '</tr>'
    }

    output += '</div>'
    output += '</table><br><br>'
    return output
}

async function diagramClicked(room_id) {
    var startTD = $("startDatetimeInput").val()
    var endTD = $("endDatetimeInput").val()
    var valueArray = [room_id, startTD, endTD]

    // $.ajax({
    //     url: '/testPost',
    //     type: 'POST',
    //     data: JSON.stringify( valueArray ),
    //     dataType: 'json',
    //     success: function(response){ console.log("success");}
    //     });

    $.post("http://localhost:4000/testPost",
        {
            array: valueArray
        },
        function (data, status) {
            alert("Data: " + data + "\nStatus: " + status);
        });
}