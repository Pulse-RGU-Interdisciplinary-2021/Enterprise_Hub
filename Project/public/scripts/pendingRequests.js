window.addEventListener('DOMContentLoaded', () => {
  
  document.getElementById("accountsTabButton").click();
})

async function tabChanged(evt, tabName) { //from https://www.w3schools.com/howto/howto_js_tabs.asp
  console.log("tab changed " + tabName)  
  // Declare all variables
    var i, tabcontent, tablinks;
  
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
      tabcontent[i].innerHTML = '';
    }
  
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";

    if (tabName == "Bookings"){
      await callShowBookings(false)
    }
    else if (tabName == "Accounts"){
      await showUsers()
    }
    else if (tabName == "Events"){
      await callShowBookings(true)
    }
  }

  async function callShowBookings(isEvents){
    await showBookings(isEvents)
  }