fend-P5-1-inter-map
===================

Interactive Neighbourhood Map

This is Project 5-1 of the Udacity Front-End Developer Nano-Degree.
It grows out of course-work from the JavaScript Design Patterns course
& Introduction to Ajax course.

to see the working model:
http://krdecker.github.io/P5-1-submission-repo/

The map shows a list of spots to eat in and around the Commercial-Broadway Station in East Vancouver, British Columbia. Each spot on the list is represented by a marker on the map. One may click on a name in the list to see the marker bob to indicate the location and see a small street view. If one clicks on the street view, another slide will open with detailed information about the spot, from FourSquare, and their colour-coded rating.

At the bottom of the screen, is a text input slot marked "FILTER" which one can activate and, by typing, reduce the list. When only one spot remains from the list, pressing the 'enter' key will open the small street-view window and another 'enter' will open the info/rating slide.

Clicking on the slide will close it. Clicking on another name or marker will close both street-view and info-slide.

Return to the list of spots at any time by clicking the menu icon.






*Assignment from Udacity:*

1 Review our course JavaScript Design Patterns.

2 Download the Knockout framework. Knockout must be used to handle list, filter, and any other information on the page that is subject to changing state. Things that should not be handled by knockout: anything the map api is used for, tracking markers, making the map, refreshing the map.

3 Write code required to add a full-screen map to your page using the Google Maps API. For sake of efficiency, the map API should be called only once.

4 Write code required to display map markers identifying at least 5 locations that you are interested in within this neighborhood. Your app should display those locations by default when the page is loaded.

5 Implement a list view of the set of locations defined in step 4.

6 Provide a filter option that uses an input field to filter both the list view and the map markers displayed by default on load. The list view and the markers should update accordingly in real-time. Providing a search function through a third-party API is not enough to meet specifications.

7 Add functionality using third-party APIs to provide information when a map marker or list view entry is clicked (ex. Yelp reviews, Wikipedia, Flickr images, etc). If you need a refresher on making AJAX requests to third-party servers, check out our Intro to AJAX course.

8 Add functionality to animate a map marker when either the list item associated with it or the map marker itself is selected.

9 Add functionality to open an infoWindow with the information described in step 7 when either a location is selected from the list view or its map marker is selected directly.

10 The app's interface should be intuitive to use. For example, the input text area to filter locations should be easy to locate. It should be easy to understand what set of locations is being filtered. Selecting a location via list item or map marker should cause the map marker to bounce or in some other way animate to indicate that the location has been selected and associated info window should open above map marker with additional information.

11 Error Handling: In case of error (e.g. in a situation where a third party api does not return the expected result) we expect your webpage to do one of the following: A message is displayed notifying the user that the data can't be loaded, OR There are no negative repercussions to the UI. Note: Please note that we expect students to handle errors if the browser has trouble initially reaching the 3rd-party site as well. For example, imagine a user is using your neighborhood map, but her firewall prevents her from accessing the Instagram servers. Here is a reference article on how to block websites with the hosts file. It is important to handle errors to give users a consistent and good experience with the webpage. Read this blogpost to learn more .Some JavaScript libraries provide special methods to handle errors. For example: refer to .fail() method discussed here if you use jQuery's ajax() method. We strongly encourage you to explore ways to handle errors in the library you are using to make API calls.

- started by re-factoring Ben's Cat-Clicker code for KnockoutJS

- splash page with options 23 Dec 2015
- start research on translink api 28 Dec 2015
- implement google.map api and hamburger menu return function 31 Dec 2015
- created data model from google maps info 07 Jan 2016
- series of small tools & unit testing apis 14 Jan 2016
- completed functioning of filter by text and by item click 21 Jan 2016
- filter markers 23 Jan 2016
- animate markers and open InfoWindows with streetview pix 28 Jan 2016
- add FourSquare info slide 31 Jan 2016
