# EIG Booking application :books:
This application was developed for our client Robert Gordon University (RGU) Enterprise and Innovation Hub. The application will de displayed as a web as due to its ease of access and development.
## Description of the application :page_facing_up:

As previously mentioned this will be a booking application hosted on the website. The application will consists of the following :key: features:

* User authentication

Before accessing the application the user will need to either create a new account or log in with his credentials. When the user creates a new account, it will need to be validated before accessing the website.

* Booking
    
    As the name suggest one of the features of a booking application is the ability to book something, in this case the user will be able to book room in a variety of ways.

    * Room
        
        The first option will be to book a room for meetings, getting work done etc. The user will book with a certain time frame on a concrete date, also he/she will be able to choose the following 2 options for room booking:
        * Individual seat

        With this option the user will be able to book x amounts of seats of the room selected.

        * Full room booking

        With this option the user will state that he wants to book the entire selected room.

    * Event

    This option is more suited for organizations, with this option the room will be fully booked for events like talks, workshops etc.

* Insights
    
    This page will contain som statistical data about rooms, page usage etc, so the admins can monitor the system and get some insight on their infrastructure.

* Booking/User/Event approval

    Some of the features of the applications need to be validated by administrators, this includes new user creation full, room bookings and event bookings.

* Bookings lookup
This will allow the users of the system to check bookings done both past and future ones. 
There will also be an addition page for administrators where they can check every booking filtered by room name, user id, date etc
## Tool and technology used :wrench:

This application has been developed with [EJS](https://ejs.co/) and [node js](https://nodejs.org/es/) with its respective modules as well as using some [jquery](https://jquery.com/) for the website aspect.

For the database we opted for a local sql database as this was a prototype application. So if you wanted to try the application you would need to created a local db and change some code in order to make it work.

Database image uploaded to docker hub at https://hub.docker.com/repository/docker/graybang/enterprise_hub