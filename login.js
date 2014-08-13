var mylistofusers= new Firebase("https://crackling-fire-4161.firebaseio.com");
var currentUserRef; 

//mylistofusers.push({user:"dana",password:"hello"});
//mylistofusers.push({user:"aisha",password:"salut"});



function CheckLogin(){

	console.log("inside CheckLogin");

	//printing all the users and passwords
	var userName=$("#Username").val();
	var passWord=$("#Password").val();

	mylistofusers.child(userName).once("value",function(snapshot){
		var MyData=snapshot.val();
			if (MyData.user_name == userName && MyData.pass_word == passWord){
				console.log("correct user");
				currentUserRef = mylistofusers.child(userName);
			}
	});
	
}

$(function(){
	$("#LoginButton").click(CheckLogin);
	$("#SubmitButton").click(createAccount);
	$("#DoneButton").click(AddEvent);
});

//var mylistofusers= new Firebase("https://crackling-fire-4161.firebaseio.com");

//mylistofusers.push({user:"dana",password:"hello"});
//mylistofusers.push({user:"aisha",password:"salut"});



function createAccount(){

	console.log("inside CheckCreateAccount");

	//printing all the users and passwords
	var firstName = $("#FirstName").val();
	var lastName = $("#LastName").val();
	var userName = $("#UserName").val();
	var passWord = $("#pw").val();
	var totalHours = $("#Goal").val();
	//console.log("HI");
	console.log($("#FirstName").val());
	console.log($("#LastName").val());
	console.log($("#UserName").val());
	console.log($("#pw").val());
	console.log($("#Goal").val());
	
	

	var newAccount = mylistofusers.child(userName);
	newAccount.set({
		first_name: firstName,
		last_name: lastName,
		user_name: userName,
		pass_word: passWord,
		total_Hours: totalHours

	});	

	currentUserRef = mylistofusers.child(userName);
}

function AddEvent(){
	console.log("inside Checkadd");
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
	});

}




