// This file is created to make multiselect work without refreshing the page(js code in index.html wont work without refresh)
// So this js file is directly imported into the project search component and called from ngOnInit()
exports.callJSForProSearch = function () {
    // console.log("Hello Call callJSForProSearch Function From TypeScript ");
    


    // https://stackoverflow.com/questions/18261214/load-external-js-file-in-another-js-file

    // ************************************************************************************
    // LOAD script bootstrap-multiselect.js and initilize CMB #multiple-checkboxes
    // ************************************************************************************
        $.getScript('/assets/javascript/bootstrap-multiselect.js', function () { // load script
        // alert();

        // Inilize and configure bootstrap-multiselect
        $('#multiple-checkboxes').multiselect({
            includeSelectAllOption: true,
            buttonWidth: '222px',
            maxHeight: 358,
            enableFiltering: false,
            // buttonWidth: '232px',
            maxWidth: 100,
            //   buttonText:function(options, select) {
            //     var numberOfOptions = $(this).children('option').length;
            //     if (options.length === 0) {
            //         return this.nonSelectedText + '';
            //     } else {
            //         var selected = '';
            //         options.each(function() {
            //             var label = ($(this).attr('label') !== undefined) ?
            //                 $(this).attr('label') : $(this).html();
            //             selected += label + ', ';
            //         });
            //         return selected.substr(0, selected.length - 2) + '';
            //     }

            buttonText: function (options) {
                // // return "Search or select";
                // // you can show the number of selected options
                // return "(" + options.length + ") options selected";
                if (options.length == 0) {
                    return "None selected"
                } else {
                    return options.length + " selected";
                }
            },

            onChange: function (element, checked) {
                var brands = $('#multiple-checkboxes option:selected');
                var selected = [];
                $(brands).each(function (index, brand) {
                    selected.push([$(this).val()]);
                });
                // alert(selected);
                // Array value is stored in a input control with id multiSelectedIds
                $("#multiSelectedIds").val(selected);// store array in input control for multi secproject search
            }
        });
    });



    // // now filling cmb is done in component
    // *************************************************************************
    // // LOAD script main.js for filling cmb
    // *************************************************************************
    // $.getScript('/assets/javascript/main.js', function () {
    //     // alert();
    // });




    // Clear Multiselect. Hidden btn to clearMultiSelect. This btn clicked is called from angular "clearall()"
    // ********************************************************************************************************
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




