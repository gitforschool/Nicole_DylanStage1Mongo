function GradedBook(pAssignment, pClass, pGrade) {
    this.assignment= pAssignment;
    this.class = pClass;
    this.grade = pGrade;
    this.completed = false;
  }
  var ClientNotes = [];  // our local copy of the cloud data

document.addEventListener("DOMContentLoaded", function (event) {

    document.getElementById("submit").addEventListener("click", function () {
        var tAssignment = document.getElementById("assignment").value;
        var tClass = document.getElementById("class").value;
        var tGrade = document.getElementById("grade").value;
        var oneAssignment = new GradedBook(tAssignment, tClass, tGrade);

        $.ajax({
            url: '/NewAssignment' ,
            method: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(oneAssignment),
            success: function (result) {
                console.log("added new graded assignment")
            }

        });
    });

    document.getElementById("get").addEventListener("click", function () {
        updateList()
    });
  


    document.getElementById("delete").addEventListener("click", function () {
        
        var whichAssignment = document.getElementById('deleteAssignment').value;
        var idToDelete = "";
        for(i=0; i< ClientNotes.length; i++){
            if(ClientNotes[i].assignment === whichAssignment) {
                idToDelete = ClientNotes[i]._id;
           }
        }
        
        if(idToDelete != "")
        {
                     $.ajax({  
                    url: 'DeleteAssignment/'+ idToDelete,
                    type: 'DELETE',  
                    contentType: 'application/json',  
                    success: function (response) {  
                        console.log(response);  
                    },  
                    error: function () {  
                        console.log('Error in Operation');  
                    }  
                });  
        }
        else {
            console.log("no matching Subject");
        } 
    });



    document.getElementById("msubmit").addEventListener("click", function () {
        var tAssignment = document.getElementById("mAssignment").value;
        var tClass = document.getElementById("mClass").value;
        var tGrade = document.getElementById("mGrade").value;
        var oneAssignment = new GradedBook(tAssignment, tClass, tGrade);
        oneAssignment.completed =  document.getElementById("mcompleted").value;
        
            $.ajax({
                url: 'UpdateGradedAssignment/'+idToFind,
                type: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(oneAssignment),
                    success: function (response) {  
                        console.log(response);  
                    },  
                    error: function () {  
                        console.log('Error in Operation');  
                    }  
                });  
            
       
    });


    
    var idToFind = ""; // using the same value from the find operation for the modify
    // find one to modify
    document.getElementById("find").addEventListener("click", function () {
        var tAssignment = document.getElementById("modAssignment").value;
         idToFind = "";
        for(i=0; i< ClientNotes.length; i++){
            if(ClientNotes[i].assignment === tAssignment) {
                idToFind = ClientNotes[i]._id;
           }
        }
        console.log(idToFind);
 
        $.get("/FindAssignment/"+ idToFind, function(data, status){ 
            console.log(data[0].assignment);
            document.getElementById("mAssignment").value = data[0].assignment;
            document.getElementById("mClass").value= data[0].class;
            document.getElementById("mGrade").value = data[0].grade;
            document.getElementById("mcompleted").value = data[0].completed;
           

        });
    });

    // get the server data into the local array
    updateList();

});


function updateList() {
var ul = document.getElementById('listUl');
ul.innerHTML = "";  // clears existing list so we don't duplicate old ones

//var ul = document.createElement('ul')

$.get("/GradedAssignments", function(data, status){  // AJAX get
    ClientNotes = data;  // put the returned server json data into our local array

    // sort array by one property
    ClientNotes.sort(compare);  // see compare method below
    console.log(data);
    //listDiv.appendChild(ul);
    ClientNotes.forEach(ProcessOneAssignment); // build one li for each item in array
    function ProcessOneAssignment(item, index) {
        var li = document.createElement('li');
        ul.appendChild(li);

        li.innerHTML=li.innerHTML + index + ": " + " GradedAssignment: " + item.assignment + "  " + item.class + ":  " + item.grade + " Done? "+ item.completed;
    }
});
}

function compare(a,b) {
    if (a.completed == false && b.completed== true) {
        return -1;
    }
    if (a.completed == false && b.completed== true) {
        return 1;
    }
    return 0;
}
