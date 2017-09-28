// Userlist data array for filling in info box
var userListData = [];

// DOM Ready =============================================================
$(document).ready(function() {
    // Populate the user table on initial page load
    populateTable();
});

//show user info
$('#userList table tbody').on('click','td a.linkshowuser',showUserInfo);

// Add User
$('#btnAddUser').on('click', addUser);

//Delete User 

$('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);

// Functions =============================================================

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/users/userlist', function( data ) {
		userListData = data;
        // For each item in our JSON, add a table row and cells to the content string
        $.each( data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">' + this.username + '</a></td>';
            tableContent += '<td>' + this.email + '</td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#userList table tbody').html(tableContent);
    });
};

// show user info =====================================

function showUserInfo(event){

	event.preventDefault();

	var thisUserName = $(this).attr('rel');
	var arrayPossition = userListData.map(function(arrayItem){ return arrayItem.username;}).indexOf(thisUserName);
	var thisUserObject = userListData[arrayPossition];

	console.log(thisUserObject);

	$('#userInfoName').text(thisUserObject.fullname);
	$('#userInfoAge').text(thisUserObject.age);
	$('#userInfoGender').text(thisUserObject.gender);
	$('#userInfoLocation').text(thisUserObject.location);
}

// Add user =====================================

function addUser(event){

    event.preventDefault();

    var errorCount = 0;

    $('#addUser input').each(function(index,val){
        if($(this).val() === ''){ errorCount++; }
    });

    if(errorCount === 0){

        var newUser = {
            'username': $('#addUser fieldset input#inputUserName').val(),
            'email': $('#addUser fieldset input#inputUserEmail').val(),
            'userfullname': $('#addUser fieldset input#inputUserFullname').val(),
            'age': $('#addUser fieldset input#inputUserAge').val(),
            'location': $('#addUser fieldset input#inputUserLocation').val(),
            'gender': $('#addUser fieldset input#inputUserGender').val()
        }
        $.ajax({
            type: 'POST',
            data: newUser,
            url: '/users/addUser',
            dataType: 'JSON'
        }).done(function( response ){

            if(response.msg === '' ){

                $('#addUser fieldset input').val('');
                populateTable();
            }
            else{

                alert('Error: ' + response.msg);
            }
        });
    }
    else{
        alert('Please fill in all fields');
        return false;
    }
}

//============================= Delete User ==========================================

function deleteUser(){

    event.preventDefault();

    var confirmation = confirm('Are you sure to delete this user');

    if(confirmation){

        $.ajax({
            type: 'DELETE',
            url: '/users/deleteuser/'+ $(this).attr('rel')
        }).done(function(response){
            if (response.msg === '') { 
            }
            else{
                alert('Error: ' + response.msg);
            }
         });
           populateTable();
    }
    else{

        return false;
    }

}

