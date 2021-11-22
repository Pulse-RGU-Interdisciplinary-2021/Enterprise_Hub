var allPendingUsers
async function showUsers() {
    allPendingUsers = await getUsers("true")
    $("#Accounts").append("<h1>Pending Accounts</h1>")
    if (allPendingUsers.length === 0){
        var noRequests = document.createElement("p");
        noRequests.innerHTML = "No pending account requests"  
        noRequests.setAttribute("id", "noAccountRequests")
        $("#Accounts").append(noRequests)
    }
    else{
        addUsers(allPendingUsers)
    }
    
}

async function addUsers(allPendingUsers) {
    for (var i = 0; i < allPendingUsers.length; i++) {

        var userImage = document.createElement('img');
        userImage.src = await getUserImage(i);
        userImage.setAttribute("class", "userImage");

        var fullName = document.createElement("p");
        fullName.innerHTML = await getFullName(i)
        fullName.setAttribute("class", "fullName")

        var email = document.createElement("p");
        email.innerHTML = await getEmail(i)
        email.setAttribute("class", "email")

        //to change
        var confirm = document.createElement("button")
        confirm.innerHTML = "confirm"
        confirm.setAttribute("onclick", "confirmAccountRequest(" + i + ")")
        confirm.setAttribute("class", "confirm")

        //to change
        var reject = document.createElement("button")
        reject.innerHTML = "reject"
        reject.setAttribute("onclick", "rejectAccountRequest(" + allPendingUsers[i].id+ ")")
        reject.setAttribute("class", "reject")

        var currentUserInfo = document.createElement("div")
        var currentUserInfo = formatCurrentUser(userImage, fullName, email)
        currentUserInfo.setAttribute("class", "infoPendingUsersDiv")

        var currentUserResponse = document.createElement("div")
        currentUserResponse.appendChild(confirm)
        currentUserResponse.appendChild(reject)
        currentUserResponse.setAttribute("class", "approveRejectButtonsDiv")

        var currentUser = document.createElement("div")
        currentUser.appendChild(currentUserInfo)
        currentUser.appendChild(currentUserResponse)
        currentUser.setAttribute("class", "userDiv")
        currentUser.setAttribute("id", "user-" + allPendingUsers[i].id)

        $("#Accounts").append(currentUser)

    }
}

async function getUsers(boolean) {
    var output
    await $.get("/api/v1/users/Enabled/" + false, await function (data) { //temporary till pending user requests are added
        output = data
    });
    return output
}

async function getUserImage(i){
    var output = ""
    if (allPendingUsers[i].user_image) {
        var sqlImage = allPendingUsers[i].user_image
        //from https://stackoverflow.com/questions/13122459/how-to-display-images-stored-in-database-as-a-blob-in-webpage
        var arrayBufferView = new Uint8Array(sqlImage);                                       
        var blob = new Blob( [ arrayBufferView ], { type: "image/jpg" } );
        var urlCreator = window.URL || window.webkitURL;
        var imageUrl = urlCreator.createObjectURL( blob );                                  
        output = imageUrl
    }
    else {
        output = "./images/ProfilePic.png"
    }
    return output
    
}

async function getFullName(i){
    output = allPendingUsers[i].full_name
    return output
}

async function getEmail(i){
    output = allPendingUsers[i].email
    return output
}

function formatCurrentUser(userImage, fullName, email) {
    var currentUser = document.createElement("div")
    currentUser.appendChild(userImage)
    currentUser.appendChild(fullName)
    currentUser.appendChild(email)

    return currentUser

}

async function confirmAccountRequest(i) {
    await $.ajax({
        type: 'PUT',
        url: '/api/v1/users/',
        data: { user_id: allPendingUsers[i].id,
                enabled: 1,
                user_image: allPendingUsers[i].user_image,
                full_name: allPendingUsers[i].full_name,
                email: allPendingUsers[i].email,
                phone_number: allPendingUsers[i].phone_number,
                password: allPendingUsers[i].password,
                admin: allPendingUsers[i].admin,
        },
        success: function(response){
            alertOutcomeApproveAccount(i)

            await $.ajax({
                type: 'POST',
                url: '/accountApproved',
                data: {
                }
            })
        }
    });
}

async function alertOutcomeApproveAccount(i){
    var user = await getUserById(allPendingUsers[i].id)
    if (user[0].enabled == 1){
        alert ("User approved correctly")
        var userDiv = document.getElementById("user-" + allPendingUsers[i].id) 
        userDiv.style.opacity = '0'
        setTimeout(function(){
            userDiv.style.height = $("#user-" + allPendingUsers[i].id).height()+ 'px';
            userDiv.classList.add('hide-me');
            (function(el) {
                setTimeout(function() {
                el.remove();
                }, 1500);
            })(userDiv);
        }, 1000);
    }
    else {
        alert ("Error in booking approval")
    }
}

async function rejectAccountRequest(id) {
    await $.ajax({
        type: 'DELETE',
        url: '/api/v1/users/delete/' + id,
        data: { user_id: id,
        },
        success: function(response){
            alertOutcomeRejectAccount(id)

            await $.ajax({
                type: 'POST',
                url: '/accountRejected',
                data: {
                }
            })
        }
    });
}

async function alertOutcomeRejectAccount(id){
    var user = await getUserById(id)
    if (!user[0]){
        alert ("User rejected correctly")
        var userDiv = document.getElementById("user-" + id) 
        userDiv.style.opacity = '0'
        setTimeout(function(){
            userDiv.style.height = $("#" + id).height()+ 'px';
            userDiv.classList.add('hide-me');
            (function(el) {
                setTimeout(function() {
                el.remove();
                }, 1500);
            })(userDiv);
        }, 1000);
    }
    else {
        alert ("Error in user rejection")
    }
}

async function getUserById(id){
    var output
    await $.get("/api/v1/users/Id/" + id, await function (data) {
        output = data
    });
    return output
}