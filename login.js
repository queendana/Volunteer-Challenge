var mylistofusers= new Firebase("https://resplendent-inferno-9479.firebaseio.com/");
var currentUserRef; 
var eventsRef;


$(function(){
	$("#LoginButton").click(loadDashFromLogin);
	$("#SubmitButton").click(loadDashFromCreateAcct);
	$("#DoneButton").click(loadDashFromAddEvent);
	$("#logoutButton").click(Logout);
	$("#CancelButton").click(CancelAddEvent);
});

function loadDashFromLogin(){
	checkLogin(function() {
		showHoursAndEvents(); 
	});
}

function loadDashFromCreateAcct(){
	createAccount(function(){
		showHoursAndEvents();	
	});
}

function loadDashFromAddEvent(){
	addEvent(showHoursAndEvents);
}


function checkLogin(callback){

	console.log("inside CheckLogin"); 
	var userName=$("#Username").val();
	var passWord=$("#Password").val();
	
	mylistofusers.once("value", function(snapshot){
		var MyData=snapshot.val();
		var found = 0;
		var correctPassword = false;
		for (var user in MyData) { 
			var thisUser = MyData[user]; 
			if (thisUser.user_name == userName){
				found = 1; 	
				console.log("they match");	
				if (thisUser.pass_word == passWord){
					console.log("set current user ref")
					currentUserRef=mylistofusers.child(userName);
					correctPassword = true;
				}
			}
		}

					
		
		if (found==1){
			console.log("found " + found);
			if (correctPassword == true){
				$.mobile.changePage( "#firstPageofhomepage", { transition: "slideup", changeHash: false });
			}
			//$("#LoginButton").attr("href", "#firstPageofhomepage");
			//$("#currentPage").load("#firstPageofhomepage");
			
		}

		callback();
		
	});
	

}
	

function createAccount(callback){

	console.log("CreateAccount");

	//printing all the users and passwords
	var firstName = $("#FirstName").val();
	var lastName = $("#LastName").val();
	var userName = $("#UserName").val();
	var passWord = $("#pw").val();
	var totalHours = $("#Goal").val();
	//console.log("HI");
	
	
	

	var newAccount = mylistofusers.child(userName);
	newAccount.set({
		first_name: firstName,
		last_name: lastName,
		user_name: userName,
		pass_word: passWord,
		total_Hours: totalHours

	});	

	currentUserRef = mylistofusers.child(userName);
	
	if(currentUserRef != null){
		console.log("callback");
		callback();
	}

	$.mobile.changePage( "#firstPageofhomepage", { transition: "slideup", changeHash: false });
}

function addEvent(callback){
	console.log("addEvent");
	var eventName = $("#requirementname").val();
	var eventHours = $("#HoursDone").val();
	//var DateEvent = $("#date").val();

	eventsRef = currentUserRef.child("Events");
	//eventsRef.update({
		//description: "events completed by this user"
	//});
 	eventsRef.child(eventName).update({
 		//"event_date" : DateEvent,
		"event_hours" : eventHours,
		"event_name": eventName 
	});

	currentUserRef.once("value", function(snapshot){
		var MyData=snapshot.val();
		var myHours = MyData.total_Hours;
		console.log(myHours);
		
		myHours=myHours-eventHours;
		
		currentUserRef.update({total_Hours: myHours});

		callback();
		$.mobile.changePage( "#firstPageofhomepage", { transition: "slideup", changeHash: false });
	});

	// console.log("hello change the list please");
	// eventsRef.on('child_added', function (snapshot) {
 //  		var NewEvent = snapshot.val();
 //  		var NewName = NewEvent.event_name;
 //  		var NewHours = NewEvent.event_hours;
 //  		$("#EventHistory").append("<li>" + NewEvent + NewHours + "hours </li>" );
 //  		//FIX THIS
	// })

	}
	
	/*currentUserRef.on("child_changed", function(snapshot){
		var myHours = snapshot.val(); 
		$("#TotHours").html("Total Hours Left: " + myHours + " hrs");
		});*/

	


function showHoursAndEvents(){
	console.log("hi");
	console.log(currentUserRef.child("total_Hours"));
	currentUserRef.child("total_Hours").once("value", function(snapshot){
		var myHours = snapshot.val();
		console.log(" my hours " + myHours);
		if(myHours<=0){
			$("#TotHours").html("Extra Hours Done: " + myHours*-1 + " hrs");
		}
		else{
			$("#TotHours").html("Total Hours Left: " + myHours + " hrs" );
		}
		
	});

	currentUserRef.child("Events").once("value", function(snapshot){
		$("#EventHistory").html();
		var Eventlist = snapshot.val();
		//console.log(Eventlist);
		for (i in Eventlist){
			var eRef = currentUserRef.child("Events");
			eRef.child(i).once("value", function(snapshot){
			var eventValue = snapshot.val();
			var listnameEvent = eventValue.event_name;
			//var newdate = eventValue.event_date;
			var newHours = eventValue.event_hours;
			$("#EventHistory").append("<li class='ui-li-static ui-body-inherit ui-first-child ui-last-child'>" + listnameEvent + " for " + newHours + " hours </li>" );

		});	

		}
	});
	//take snapshot of events 
	//clear html from list view
	//add all events to listview
	//refresh
}

function Logout(){
	$.mobile.changePage("#firstPageoflogin", { transition: "slideup", changeHash: false});
}
function CancelAddEvent(){
	$.mobile.changePage("#firstPageofhomepage", { transition: "slideup", changeHash: false});
}

