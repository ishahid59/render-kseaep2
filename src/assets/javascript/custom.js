// https://www.techiediaries.com/use-javascript-in-angular/
// https://stackoverflow.com/questions/47346559/how-to-call-external-javascript-function-in-angular-5

function hello() {
    alert('Hello! from custom.js');
}

function getEditData(empid) {
    $.ajax({
        type: "get",
        url: "http://localhost:5000/api/employee/" + empid + "",
        success: function (result) {
            // console.log(result);
            $("#empid").val(result.empid);
            $("#firstname").val(result.firstname);
            $("#lastname").val(result.lastname);
            $("#jobtitle").val(result.jobtitle);
            $("#registration").val(result.registration);
        }
    });
}



// *** to clear token on tab/browser close
$(document).ready(function () {
    // window.onbeforeunload = function () {
    //     localStorage.removeItem("token");
    //     return '';
    // };

    // $('#multiple-checkboxes2').multiselect({
    //     includeSelectAllOption: true,
    //     buttonWidth:'443px',
    //     maxHeight:358,
    //   });

      function test(){
        alert('TestingFunction')
    }
    $("#btntest").click(function(){
        alert("The paragraph was clicked.");
      });



});







