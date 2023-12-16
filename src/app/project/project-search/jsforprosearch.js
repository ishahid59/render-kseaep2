// This file is created to make multiselect work without refreshing the page(js code in index.html wont work without refresh)
// So this js file is directly imported into the project search component and called from ngOnInit()
exports.callJSForProSearch = function () {
    // console.log("Hello Call callJSForProSearch Function From TypeScript ");


    // https://stackoverflow.com/questions/18261214/load-external-js-file-in-another-js-file
    // Load bootstrap-multiselect.js and initilize #multiple-checkboxes
    $.getScript('/assets/javascript/bootstrap-multiselect.js', function () {
        // alert();
        $('#multiple-checkboxes').multiselect({
            includeSelectAllOption: true,
            buttonWidth: '222px',
            maxHeight: 358,
        });
    });



    // Load cmb by calling main.js
    $.getScript('/assets/javascript/main.js', function () {
        // alert();
    });



    // Clear Multiselect. Hidden btn to clearMultiSelect. This btn clicked is called from angular "clearall()"
    $("#clearMultiSelect").click(function () {
        $("#multiple-checkboxes").multiselect("clearSelection");// WORKING clear Bootstrap multiselect

        // $('#multiple-checkboxes').multiselect('select', ['1', '2', '4']); // WORKING
        // $("#multiple-checkboxes").multiselect('refresh');// refresh Bootstrap multiselect
        // $("#multiple-checkboxes").multiselect("deselectAll", false);
        // $("#multiple-checkboxes option[value='"+21+"']").prop('selected', true);
        // $("#multiple-checkboxes option[value='"+21+"']").attr("selected", "selected");
    });



    // test go to zero index when backspace or delete clicked
    $('#srcEmpID').on('keydown', function (event) {
        if (event.keyCode == 8 || event.keyCode == 46) {
            //  alert('backspace pressed');
            $("#srcEmpID").prop("selectedIndex", 0);
            // return false;
        }
    });




}




