var nodemailer = require("nodemailer");

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

exports.sendEmail = (type, params) => {
    var transporter = nodemailer.createTransport({
        service: 'hotmail',
        auth: {
          user: 'asdasdakljd@outlook.es',
          pass: 'testamento!'
        }
      });
      
      var text = getText(type, params)

      var mailOptions = {
        from: '"Fred Foo 👻" <asdasdakljd@outlook.es>', // sender address
        to: "santoroally@gmail.com", // list of receivers
        subject: type, // Subject line
        text: text, // plain text body
        //html: "<b>Hello world?</b>", // html body
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });    
}

exports.isValidEmail = (email) => {
	var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	return !!email && typeof email === 'string'
		&& email.match(emailRegex)
};

function getText(type, params){
  var text=''
  console.log(params);
  console.log(params["date"]);
  console.log(params.date);
  if (type == "Booking Approval"){
    text = "Please note these emails are sent from an automated system, for support please contact (insert EIG email)."
    text += "Your Booking placed on" + params["date"] + " at " + params["roomName"] + " for " +  params["bookingType"] + "has been successful."
    text += "Please enjoy the facilities and contact EIG Booking Hub for any requests involving cancellation or alteration to your booking."
  }

  else if (type == 'Booking Rejected'){
    text = "Please note these emails are sent from an automated system, for support please contact (insert EIG email). "
    text += "Your Booking placed on " + params[date] + " at " + params[roomName] + " for " + params[bookingType] + " has been unsuccessful. "
    text += "Please contact EIG Booking Hub for further information or book at another time slot. "
  }

  else if (type == 'Account Request Approved'){
    text = "Please note these emails are sent from an automated system, for support please contact (insert EIG email). "
    text += "Your application for a booking account with EIG Booking Hub online has been successful, you may now proceed to utilise the online booking system for your enterprise and innovation needs. "
  }

  else if (type == 'Account Request Rejected'){
    text = "Please note these emails are sent from an automated system, for support please contact (insert EIG email). "
    text += "Your application for a booking account with EIG Booking Hub online has been unsuccessful, for further information please contact the EIG Booking Hub. "
  }

  else if (type == 'Event Request Approved'){
    text = 'Please note these emails are sent from an automated system, for support please contact (insert EIG email). '
    text += 'Your booking application for ' +  params[roomName] + ' on ' + params[date] +'  has been successful, for further requests involving cancellation or alteration to your booking, please contact EIG Booking hub. '
  }

  else if (type == 'Event Request Rejected'){
    text = 'Please note these emails are sent from an automated system, for support please contact (insert EIG email). '
    text += 'Your booking application for ' +  params[roomName] + ' on ' + params[date] +' has been unsuccessful, for further requests on this decision, please contact EIG Booking hub. '
  }

  else if (type == 'Account Registration Request Received'){
    text = 'User ' + params[userName] + ' has requested a booking account registration, to approve/deny this request, please access the admin tab/pending requests on the EIG Booking System. '
  }

  else if (type == 'Booking Request Received'){
    text = 'You received a booking request. '
    text += 'To approve/deny this request, please access the admin tab/pending requests on the EIG Booking System. '
  }

  else if (type == 'Event Request Received'){
    text = 'User (username, email address, role) has requested an event booking (room) at (date), (location) – For the purpose of (Event Name). '
    text += 'To approve/deny this request, please access the admin tab/pending requests on the EIG Booking System. '
  }

  return text
}