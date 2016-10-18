// GLOBAL VARIABLES
var locObj;
var genderSelect;
var nameSelect;
var firstName;
var lastName;
var map;
var myAddressString = '';
var getPersonImagesArray = [];
var getNamesArray = [];
var finalDate = {};
var finalEvent;
var redefinedEventList = [];
var map2;
var infowindow2;
var object_list;
function clearMain() {
    $('.main').children().remove();
}
// Note: This example requires that you consent to location sharing when
// prompted by your browser.
function getAddress() {
    locObj = new LocationObj(checkAddress, null);
}
function checkAddress() {
    console.log(locObj.getLocation());
    var locTest = locObj.getLocation();
    if (locTest.status === false) {
        createAddressBar();
    }
}
function LocationObj(successCallback, errorCallback) {
    this.success = successCallback;
    this.error = errorCallback;
    var myPosition = {
        lat: null,
        long: null,
        status: null
    };
    var nav = navigator.geolocation;
    function success(position) {
        myPosition.lat = position.coords.latitude;
        myPosition.long = position.coords.longitude;
        myPosition.status = true;
        this.success();
    }
    function failure(error) {
        //defaults to learningfuze location if it fails
        myPosition.lat = 33.6362183;
        myPosition.lang = -117.7394721;
        myPosition.status = false;
        myPosition.error = error;
    }
    this.getLocation = function () {
        return myPosition;
    };
    nav.getCurrentPosition(success.bind(this), failure);
}
function geocodeAddress() {
    function initMap() {
        var map = new google.maps.Map(document.getElementById('main'), {
            zoom: 8,
            center: {lat: -34.397, lng: 150.644}
        });
        var geocoder = new google.maps.Geocoder();
        document.getElementById('submit').addEventListener('click', function () {
            geocodeAddress(geocoder, map);
        });
    }
    function geocodeAddress(geocoder, resultsMap) {
        var address = document.getElementById('address').value;
        geocoder.geocode({'address': address}, function (results, status) {
            if (status === 'OK') {
                resultsMap.setCenter(results[0].geometry.location);
                var marker = new google.maps.Marker({
                    map: resultsMap,
                    position: results[0].geometry.location
                });
            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    }
}
function createAddressBar() {
    $('<input>').attr({
        type: 'text',
        placeholder: 'Enter Your Location',
        class: 'form-control',
        id: 'address'
    }).appendTo('.main');
}
// PAGE 1 - Date Choice
function createDomPage1() {
    // var choiceArray = ['Male', 'Female', 'Surprise Me'];
    var choiceIDArray = ['male', 'female', 'shiba']; // Used to set ID to div so we can use ID for search query input
    for (var i = 0; i < choiceIDArray.length; i++) {
        var dateChoices = $('<div>').addClass('col-sm-4 dateChoices').click(genderClicked).attr('gender', choiceIDArray[i]);
        $('.main').append(dateChoices);
        var dateSelect = $('<div>').addClass('nameContainers doggy' + i).text(choiceIDArray[i]);
        var dateChoicesContainer = $('<div>').addClass('dateChoicesContainer choice' + i).css({'background-image':'url(images/'+choiceIDArray[i]+'.png)'});
        $(dateChoices).append(dateChoicesContainer, dateSelect);
    }
    if ($('.nameContainers').hasClass('doggy2')){
        $('.doggy2').text('SURPRISE ME!')
    }
}
function setAddress() {
    myAddressString = $(':input').val();
    console.log(myAddressString);
    if (myAddressString !== '') {
        //get geocode
        console.log('get geocode');
    } else {
        //default location
        myAddressString = '9080 Irvine Center Dr';
    }
}

function genderClicked() {
    genderSelect = $(this).attr('gender');
    setAddress();
    clearMain();
    getPersonImages();
    // getNames();
    console.log(genderSelect);
}
// PAGE 2 - Date Buttons
function createDomPage2() {
    for (var i = 0; i < 6; i++) {
        var dateDiv = $('<div>').addClass('dateBtns col-sm-4 col-xs-6').click(clickDateBtns);
        $('.main').append(dateDiv);
        var dateContainer = $('<div>').addClass('dateContainers').attr('id', 'second' + i);
        $(dateContainer).append(getPersonImagesArray[i]);
        //var nameContainer = $('<div>').addClass('nameContainers');
        //$(nameContainer).append(getNamesArray[i]);
        $(dateDiv).append(dateContainer);//nameContainer
    }
}
//Getting random names function via ajax call
function getNames(id) {
    var dataObj = {
        amount: 6,
        region: 'United States'
    };
    nameSelect = genderSelect.toLowerCase();
    if (nameSelect != 'shiba') {
        dataObj.gender = nameSelect;
    }
    $.ajax({
        method: 'get',
        datatype: 'json',
        data: dataObj,
        url: 'http://uinames.com/api/',
        success: function (result) {
            for (var i=0; i<6; i++){
                getNamesArray.push(result[i].name + ' ' + result[i].surname);
            }
            if (getPersonImagesArray.length == 6) {
                createDomPage2();
            }
        },
        error: function () {
            console.log('call was unsuccessful');
        }
    })
}
//Getting images from Flickr function
function getPersonImages() {
    var dataObj = {
        method: 'flickr.photos.search',
        api_key: '4291af049e7b51ff411bc39565109ce6',
        nojsoncallback: '1',
        sort: 'relevance',
        format: 'json',
        safe_search: 3,
        content_type: 1,
        cache: false
    };
    if (genderSelect == 'shiba') {
        dataObj.text = genderSelect + " dog, closeup";

    } else if (genderSelect == 'male'){
        dataObj.text = genderSelect + ", portrait, -boy, -kids, -kid, -woman, -girl, -female, -nipple, man, profile, -topless, picture, -drawing, model, -shirtless, male";
    }
    else{
        dataObj.text = genderSelect + ", woman, profile, facebook, -nude, -shirtless, -man, picture, -model, -lingerie, -party, -model";
        console.log(dataObj.text);
    }
    $.ajax({
        url: 'https://api.flickr.com/services/rest',
        method: 'get',
        data: dataObj,
        success: function (result) {
            console.log(result);
            for (var i = 0; i < 6; i++) {
                var index = Math.floor((Math.random() * 100));
                console.log(index);
                var all_photo = result.photos.photo;
                var photo_id = all_photo[index].id;
                var farm_id = all_photo[index].farm;
                var secret_id = all_photo[index].secret;
                var server_id = all_photo[index].server;
                console.log(photo_id, farm_id, secret_id);
                var image_src = 'https://farm' + farm_id + '.staticflickr.com/' + server_id + '/' + photo_id + '_' + secret_id + '.jpg';
                console.log(image_src);
                var images = $('<img>').attr('src', image_src).addClass('flickrImg');
                getPersonImagesArray.push(images);
                console.log(getPersonImagesArray.length);
            }
            if (getPersonImagesArray.length == 6) {
                console.log(getPersonImagesArray);
                createDomPage2();
            }
            // if (getNamesArray.length == 6) {
            //     console.log(getPersonImagesArray);
            //     createDomPage2();
            // }
        }

    })
}
function clickDateBtns(dateBtnDiv) {
    clearMain();
    //save the img and name of clicked item for final page
    finalDate.image = $(this).text();
    finalDate.name = $(this).find('img').attr('src');
    createDomPage3();
    console.log(finalDate);
}
// PAGE 3 - Event Choices
function createDomPage3() {
    //better keywords
    var api_call_keywords = ['restaurant', 'cafe', 'park', 'movie_theater', 'bar', 'shopping_mall'];
    for (var i = 0; i < 6; i++) {
        var eventDiv = $('<div>').addClass('eventBtns col-sm-4 col-xs-6 outerbox ' + i).attr("venue", api_call_keywords[i]).click(function () {
            clickeventChoices($(this));
        });
        var textContainer = $('<div>').addClass('nameContainers').text(api_call_keywords[i]);
        var eventContainer = $('<div>').addClass('eventContainers box' + i).css({'background-image' : 'url(images/'+api_call_keywords[i]+'.png)'});
        eventDiv.append(eventContainer,textContainer).appendTo($('.main'));
    }
}
function clickeventChoices(clickedElement) {
    var eventSearch = clickedElement.attr('venue');
    console.log('venue clicked : ', eventSearch);
    initMap(eventSearch);
}
function initMap(keyword) {
    $('<div>').attr("id", 'map').appendTo('.main');
    var myLocation = locObj.getLocation();
    map2 = new google.maps.Map(document.getElementById('map'), {
        center: {lat: myLocation.lat, lng: myLocation.long},
        zoom: 12
    });
    infowindow2 = new google.maps.InfoWindow();//
    var service = new google.maps.places.PlacesService(map2); //constructor
    service.nearbySearch({
        location: {lat: myLocation.lat, lng: myLocation.long}, //use brian's plug in location object
        radius: 10000,//radius in meters
        type: [keyword],
    }, callback);
    function callback(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            console.log(results);
            object_list = results;
            clearMain();
            createDomPage4(object_list);
        }
    }
}
// PAGE 4  -  Events Buttons
function createDomPage4(eventList){
    for(var j = 0; j < eventList.length;j++){
        if(eventList[j].hasOwnProperty('photos')){
            redefinedEventList.push(eventList[j]);
        }
    }
    var count;
    if(redefinedEventList.length > 6 ){
        count = 6;
    }else{
        count = redefinedEventList.length;
    }
    for(var i = 0; i < count; i++){
        var eventDiv = $('<div>').addClass('eventBtns col-sm-4 col-xs-6').attr('redefinedEventIndex',i);
        $(eventDiv).click(function(){
            clickEventBtns($(this));
        });
        $('.main').append(eventDiv);
        var textContainer = $('<div>').addClass('nameContainers').text(redefinedEventList[i].name);
        var eventContainer = $('<div>').addClass('dateContainers').css(
            'background-image', 'url('+redefinedEventList[i].photos[0].getUrl({maxWidth:1000, maxHeight:1000})+')'
        );
        $(eventDiv).append(eventContainer, textContainer);
    }
}
function clickEventBtns(imgElement) {
    var redefinedIndex = imgElement.attr('redefinedEventIndex');
    console.log("index number in redefinedEventList : ",redefinedIndex);
    finalEvent = redefinedEventList[redefinedIndex];
    console.log('finalEvent is : ',finalEvent);
    clearMain();
    //save the img and name of clicked item
    createDomPage5();
}
function createDomPage5() {
    for (var i = 0; i < 3; i++) {
        if (i<2) {
            var finalDiv = $('<div>').addClass('finalBtns col-xs-6 col-sm-6');
        }
        else {
            var finalDiv = $('<div>').addClass('finalBtns col-xs-12 col-sm-12');
        }
        $('.main').append(finalDiv);
        var finalDivContainer = $('<div>').addClass('finalDivContainer').attr('id', 'final_' + i);
        $(finalDiv).append(finalDivContainer);
        navigator.geolocation.getCurrentPosition(initialize);
    }
    var appendHere1 = $('#final_1').parent();
    $('<div>').addClass('nameContainers').text(finalEvent.name).appendTo(appendHere1);
    $('#final_1').css('background-image', 'url('+finalEvent.photos[0].getUrl({maxWidth:1000, maxHeight:1000})+')');
    $('<div>').addClass('nameContainers').text(finalEvent.name).appendTo('#final_1');
    var appendHere0 = $('#final_0').parent();
    $('<div>').addClass('nameContainers').text(finalDate.image).appendTo(appendHere0);
    $('#final_0').css('background-image', 'url('+ finalDate.name+')');
    $('<div>').addClass('nameContainers').text(finalDate.image).appendTo('#final_0');
}
//Getting google maps for the locations
function initialize(location) {
    console.log(location);
    var shibaImage = 'images/shiba.gif';
    var heartImage = 'images/heart.gif';
    var currentLocation = locObj.getLocation();
    var lat = finalEvent.geometry.location.lat();
    var long = finalEvent.geometry.location.lng();
    var locations = [
        ['My Location', currentLocation.lat, currentLocation.long, 1],
        [finalEvent.name, lat, long, 2]
    ];
    var centerLocationLat = (currentLocation.lat + lat) /2;
    var centerLocationLong = (currentLocation.long + long) /2;
    var map = new google.maps.Map(document.getElementById('final_2'), {
        zoom: 12,
        center: new google.maps.LatLng(centerLocationLat, centerLocationLong),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    var infowindow = new google.maps.InfoWindow();
    var marker, i;
    for (i = 0; i < locations.length; i++) {
        var myImage = '';
        if (i === 0){
            myImage = shibaImage;
        }else{
            myImage = heartImage;
        }
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(locations[i][1], locations[i][2]),
            map: map,
            icon: myImage,
            animation:google.maps.Animation.BOUNCE
        });
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                infowindow.setContent(locations[i][0]);
                infowindow.open(map, marker);
            }
        })(marker, i));
    }
}
//End of google maps function
function createSpinner (){
    $('<div>').addClass("fa fa-refresh fa-spin fa-3x fa-fw").css({
        'width': '60vw',
        'height': '60vh'
    })
}
//DOCUMENT READY
$(document).ready(function () {
    //create location object
    getAddress();
    createDomPage1();
});
