
exports.getRemainingDesks = (startingHour, endingHour, roomId, callback) => {
    let remainingDeskQuery = `
    select (r.max_desks - SUM(b.desks)) as remainingSeats
    from bookings  as b inner join rooms as r on b.room_id = r.id
    where start_datetime >= '`+ startingHour +`' 
    AND end_datetime <= '`+ endingHour +`' 
    AND room_id = '`+ roomId +`'
    group by r.id, r.max_desks;
    `
    let sql = require("mssql");
    let sqlRequest = new sql.Request();
    sqlRequest.query(remainingDeskQuery, (err, res) => {
        if (err) throw err; 
        callback(res.recordset[0].remainingSeats);
    });
}

exports.getRoomFeatures = (roomId, callback) => {
    let sql = require("mssql");
    let sqlRequest = new sql.Request();
    let roomFeatureQuery = `
    select rf.room_id, f.feature_desc
    from room_features_xref as rf  join features as f on rf.feature_id = f.id
    where rf.room_id = '` + roomId + `'        
    `;
    sqlRequest.query(roomFeatureQuery, (err, res) => {
        if (err) throw err;
        callback(res.recordset);
    });
}

