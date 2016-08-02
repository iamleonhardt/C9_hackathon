// GLOBAL VARIABLES
var myLocation;

function LocationObj(){
    var myPosition = {
        lat: null,
        long: null,
        success: null
    };
    var nav = navigator.geolocation;
    nav.getCurrentPosition(success, failure);
    function success(position){
        myPosition.lat = position.coords.latitude;
        myPosition.long = position.coords.longitude;
        myPosition.success = true;
    }
    function failure(error){
        myPosition.success = false;
        myPosition.error = error;
    }
    this.getLocation = function(){
        return myPosition;
    }
}
$(document).ready(function(){
    //create location object
    var locObj = new LocationObj();
    myLocation = locObj.getLocation();
    console.log(myLocation);

});

function clearMain(){
    $('.main').children().remove();
}





// PAGE 1 - Date Choice












// PAGE 2 - Date Buttons

function createDomPage2 (){
    for (var i=0; i < 6; i++){
        var dateDiv = $('<div>').addClass('dateBtns col-sm-4 col-xs-6').text(i+1);
        $('.main').append(dateDiv);
    }
}


function clickDateBtns (){
    clearMain();
    //save the img and name of clicked item
    createDomPage3();
}







// PAGE 3 - Event Choices

function createDomPage3(){
    clearMain();
    for(var i = 0; i <= 2; i++) {
        var selectEvent = $('<div>').addClass('eventChoices').html('EVENT CHOICE' + i);
        $('.main').append(selectEvent);
    }
}



// PAGE 4  -  Events Buttons
function createDomPage4(){
    for(var i = 0; i < 6 ; i++){
        var div = $('<div>').addClass('eventBtns col-sm-4 col-xs-6');
        $('.main').append(div);
    }
}

function clickEventBtns(){
    clearMain();
    $('.eventBtns').click(function(){createDomPage5()});
}









// Dinner





// Cafe





// Parks





// Theaters





// Malls





// Museum





// PAGE 5














