//Function to swap main site to mobile site when site is loaded on mobile devices

function redirectMobile(){
    if (typeof window.matchMedia !== "undefined" && window.matchMedia("(max-width: 999px)").matches)
    {
        window.location = "mobindex.html";
    }
    }
    redirectMobile(window);