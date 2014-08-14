var mylistofusers= new Firebase("https://crackling-fire-4161.firebaseio.com");
var currentUserRef; 

$(function(){
	$("#LoginButton").click(loadDashFromLogin);
	$("#SubmitButton").click(loadDashFromCreateAcct);
	$("#DoneButton").click(loadDashFromAddEvent);
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

	var eventsRef = currentUserRef.child("Events");
	eventsRef.update({
		description: "events completed by this user"
	});
 	eventsRef.child(eventName).update({
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
	
	/*currentUserRef.on("child_changed", function(snapshot){
		var myHours = snapshot.val(); 
		$("#TotHours").html("Total Hours Left: " + myHours + " hrs");
		});*/

	
}

function showHoursAndEvents(){
	console.log("hi");
	console.log(currentUserRef.child("total_Hours"));
	currentUserRef.child("total_Hours").once("value", function(snapshot){
		var myHours = snapshot.val();
		console.log(" my hours " + myHours);
		$("#TotHours").html("Total Hours Left: " + myHours + " hrs");
	});
}
