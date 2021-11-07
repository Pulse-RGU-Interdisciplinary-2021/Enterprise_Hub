var allPendingUsers
async function showUsers() {
    allPendingUsers = await getUsers("true")
    addUsers(allPendingUsers)
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
        confirm.setAttribute("class", "confirm")

        //to change
        var reject = document.createElement("button")
        reject.innerHTML = "reject"
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

        $("#Accounts").append(currentUser)

    }
}

async function getUsers(boolean) {
    var output
    await $.get("/api/v1/users/All/", await function (data) { //temporary till pending user requests are added
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
    output = allPendingUsers[i].fullName
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