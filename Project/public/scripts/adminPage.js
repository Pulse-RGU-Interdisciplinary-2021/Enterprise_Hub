window.addEventListener('DOMContentLoaded', () => {
    document.getElementById("insightsTabButton").click();
})

async function adminTabChanged(evt, adminTabName) { //from https://www.w3schools.com/howto/howto_js_tabs.asp
    console.log("tab changed " + adminTabName)
    // Declare all variables
    var i, adminTabcontent, adminTablinks;

    // Get all elements with class="tabcontent" and hide them
    adminTabcontent = document.getElementsByClassName("adminTabcontent");
    for (i = 0; i < adminTabcontent.length; i++) {
        adminTabcontent[i].style.display = "none";

    }

    // Get all elements with class="adminTablinks" and remove the class "active"
    adminTablinks = document.getElementsByClassName("adminTablinks");
    for (i = 0; i < adminTablinks.length; i++) {
        adminTablinks[i].className = adminTablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(adminTabName).style.display = "block";
    evt.currentTarget.className += " active";

    if (adminTabName == "Requests"){
        pendingTabOpened()
    }
}