async function dateChanged(){
    var startDateTime = $('#startDatetimeInput').value
    var endDateTime = $('#endDatetimeInput').value

    showRoomAvailability(startDateTime, endDateTime)

}

async function showRoomAvailability(startDateTime, endDateTime) {
    $('#roomAvailabilityDiv').empty()

    var allAvailableRooms
    allAvailableRooms = await getallAvailableRooms()
    addBookings(allAvailableRooms)
}

// async function getallAvailableRooms(startDateTime, endDateTime) {
//     var output
//     await $.get("/api/v1/rooms/StartEndTimeRange/" + startDateTime + "/" + endDateTime, await function (data) {
//         output = data
//     });
//     return output
// }