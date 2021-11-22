
window.onload = async function () {
    google.charts.load('current', { 'packages': ['corechart', 'calendar', 'bar'] });
    google.charts.setOnLoadCallback(drawChart);
    await loadRooms()
    await optionSelected()
}

$(window).resize(function () {
    drawChart();
});

async function loadRooms() {
    var rooms = await getRoomsArray()

    for (var i = 0; i < rooms.length; i++) {
        $('#roomOptionDiv').append('<option>' + rooms[i].room_name + '</option>');
    }
}

async function getRoomsArray() {
    var output
    await $.get("/api/v1/rooms/All", await function (data) {
        output = data
    });
    return output
}

async function drawChart() {
    await drawRolesChart()
    await drawEvents()
}

async function drawRolesChart() {
    var roleCount = await getRoleCount()

    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Role');
    data.addColumn('number', 'RoleCount');
    data.addRows(roleCount);

    //var data = google.visualization.arrayToDataTable(roleCount);

    var options = {
        title: 'User role distribution',
        titleTextStyle: {
            color: '#888888',
        },
        width: '100%',
        fontName: 'Gordon',
        fontSize: 20,
        legend: { position: 'top', textStyle: { fontSize: 14, color: 'rgb(223, 223, 223)' } },
        tooltip: { textStyle: { fontSize: 14 } },
        slices: {
            0: { color: '#9FBF00' },
            1: { color: '#FFB300' },
            2: { color: '#E31C79' },
            3: { color: '#E4002B' },
            4: { color: '#006B99' },
            5: { color: '#FF8000' },
        }

    };

    var chart = new google.visualization.PieChart(document.getElementById('userRole'));

    chart.draw(data, options);
}

async function drawEvents() {
    var eventCount = await getEventCount()

    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn({ type: 'date', id: 'Date' });
    dataTable.addColumn({ type: 'number', id: 'EventCount' });
    dataTable.addRows(eventCount);

    var chart = new google.visualization.Calendar(document.getElementById('eventsDistribution'));

    var options = {
        title: "Events Dates",
        titleTextStyle: { color: '#000000', },
        fontName: 'Gordon',
        fontSize: 30,
        width: '50%',
        height: '100vh',
        chartArea: {
            left: 40,
            width: '50%'
        },
        legend: {
            position: 'top'
        },
        colorAxis: {
            minValue: 0,
            colors: ['#FFFFFF', '#571046']
        },
        noDataPattern: {
            backgroundColor: '#C4A1C9',
            color: '#C4A1C9'
        },
        calendar: {
            underYearSpace: 10, // Bottom padding for the year labels.
            yearLabel: {
                fontName: 'Gordon',
                fontSize: 20,
                bold: true,
                italic: true
            },
            monthLabel: {
                fontName: 'Gordon',
            },
            dayOfWeekLabel: {
                fontName: 'Gordon',
            }
        }
    };

    setTimeout(function () {
        chart.draw(dataTable, options);
    }, 2000
    );
}

async function getRoleCount() {
    var allBookings = await getAllBookings()
    var roleCount = []
    var roleAccountsId = {}

    roleAccountsId = await getAccountIdObject(allBookings, roleAccountsId)

    for (const [key, value] of Object.entries(roleAccountsId)) {
        var arr = []

        arr.push(String(key))
        arr.push(value.length)
        roleCount.push(arr)
    }

    return roleCount
}

async function getEventCount() {
    var allEvents = await getAllEvents()
    var eventsObject = {}
    var eventsCountArray = []

    for (var i = 0; i < allEvents.length; i++) {
        var currentDate = await getDateObject(allEvents[i].start_datetime)
        if (currentDate) {
            if (currentDate in eventsObject) {
                eventsObject[currentDate] += 1
            }
            else {
                eventsObject[currentDate] = 1
            }
        }
    }

    for (const [key, value] of Object.entries(eventsObject)) {
        var arr = []
        arr.push(new Date(key))
        arr.push(value)
        eventsCountArray.push(arr)
    }

    return eventsCountArray

}

async function getAccountIdObject(allBookings, roleAccountsId) {
    for (var i = 0; i < allBookings.length; i++) {
        var currentRole = allBookings[i].user_role
        var currentUserId = allBookings[i].user_id
        if (currentRole) {
            if (currentRole in roleAccountsId) {
                if (!(roleAccountsId[currentRole].includes(currentUserId))) {
                    roleAccountsId[currentRole].push(currentUserId)
                }
            }
            else {
                roleAccountsId[currentRole] = []
                roleAccountsId[currentRole].push(currentUserId)
            }
        }
    }

    return roleAccountsId
}

async function getDateObject(dateString) {
    var datetimeObject = new Date(dateString)
    var dateObject = new Date(datetimeObject.getFullYear(), datetimeObject.getMonth() + 1, datetimeObject.getDate())
    return dateObject
}

async function getAllBookings() {
    var output
    await $.get("/api/v1/bookings/All", await function (data) {
        output = data
    });
    return output
}

async function getAllEvents() {
    var output
    await $.get("/api/v1/bookings/Events/" + true, await function (data) {
        output = data
    });
    return output
}

async function optionSelected() {
    var room = $('#roomOptionDiv').children("option").filter(":selected").text();
    var timerange = $('#timerangeOptionDiv').children("option").filter(":selected").text();
    await drawRoomAffluency(room, timerange)
}

async function drawRoomAffluency(room, timerange) {
    var bookings
    if (room == "All") {
        bookings = await getAllBookings()
    }
    else {
        bookings = await getBookingsByRoomName(room)
    }

    var data = await setColumnsByTimeRange(timerange, bookings)

    var options = {
        title: 'Bookings frequency',
        width: '100%',
        legend: 'none',
        fontName: 'Gordon',
    }
    var chart = new google.charts.Bar(document.getElementById('roomAffluency'));

    chart.draw(data, google.charts.Bar.convertOptions(options));
}

async function getBookingsByRoomName(roomname) {
    var output
    await $.get("/api/v1/bookings/RoomName/" + roomname, await function (data) {
        output = data
    });
    return output
}

async function setColumnsByTimeRange(timerange, bookings) {
    if (timerange == "Day") {
        return await dayRoomAffluency(bookings)
    }
    else if (timerange == "Week") {
        return await weekRoomAffluency(bookings)
    }
    else if (timerange == "Month") {
        return await monthRoomAffluency(bookings)
    }
}

async function dayRoomAffluency(bookings) {
    var hourObject = await splitBookingsByHour(bookings)
    var hourArray = await getArrayFromObject(hourObject)
    var data = google.visualization.arrayToDataTable(hourArray);
    return data
}

async function splitBookingsByHour(bookings) {
    var hoursObject = {}

    for (i = 0; i < 24; i++) {
        hoursObject[i] = 0
    }

    for (var i = 0; i < bookings.length; i++) {
        var currentDate = new Date(bookings[i].start_datetime)
        var hour = currentDate.getHours()
        if (hour in hoursObject) {
            hoursObject[hour]++
        }
        else {
            console.log("invalid hour in date " + currentDate)
        }
    }

    return hoursObject
}

async function getArrayFromObject(object) {
    var array = [['', 'Number of Bookings', { role: 'style' }]]

    for (const [key, value] of Object.entries(object)) {
        var arr = []

        arr.push(String(key))
        arr.push(value)
        arr.push('color: #009FEE')
        array.push(arr)
    }
    return array
}

async function weekRoomAffluency(bookings) {
    var weekdayObject = await splitBookingsByWeekday(bookings)
    var weekdayArray = await getArrayFromObject(weekdayObject)
    var data = google.visualization.arrayToDataTable(weekdayArray);
    return data
}

async function splitBookingsByWeekday(bookings) {
    var weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

    console.log(weekdays[0])

    var weekdayObject = {}

    for (var i = 0; i < 7; i++) {
        var key = weekdays.at(i)
        weekdayObject[key] = 0
    }


    for (var i = 0; i < bookings.length; i++) {
        var currentDate = new Date(bookings[i].start_datetime)
        var weekday = weekdays[currentDate.getDay()]
        if (weekday in weekdayObject) {
            weekdayObject[weekday]++
        }
        else {
            console.log("invalid weekday in date " + currentDate)
        }
    }

    return weekdayObject
}

async function monthRoomAffluency(bookings) {
    var dateObject = await splitBookingsByDate(bookings)
    var dateArray = await getArrayFromObject(dateObject)
    var data = google.visualization.arrayToDataTable(dateArray);
    return data
}

async function splitBookingsByDate(bookings) {
    var dateObject = {}

    for (i = 1; i < 32; i++) {
        dateObject[i] = 0
    }

    for (var i = 0; i < bookings.length; i++) {
        var currentDate = new Date(bookings[i].start_datetime)
        var date = currentDate.getDate()
        if (date in dateObject) {
            dateObject[date]++
        }
        else {
            console.log("invalid date in date " + currentDate)
        }
    }

    return dateObject
}