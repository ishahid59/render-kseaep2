// This file is created to make multiselect work without refreshing the page(js code in index.html wont work without refresh)
// So this js file is directly imported into the project search component and called from ngOnInit()
exports.callJSForProDetail = function () {
    // console.log("Hello Call callJSForProSearch Function From TypeScript ");


    // https://stackoverflow.com/questions/18261214/load-external-js-file-in-another-js-file
    // Load bootstrap-multiselect.js and initilize #multiple-checkboxes
    $.getScript('/assets/javascript/bootstrap-multiselect.js', function () {
        // alert();
        $('#multiple-checkboxes2').multiselect({
            // includeSelectAllOption: true,
            // buttonWidth: '222px',
            // maxHeight: 358,
            // enableFiltering: true,
            includeSelectAllOption: true,
            enableFiltering: false,
            buttonWidth: '422px',
            buttonHeight:'42px',
            maxWidth: 100,

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
                var brands = $('#multiple-checkboxes2 option:selected');
                var selected = [];
                $(brands).each(function (index, brand) {
                  selected.push([$(this).val()]);
                });
                
                // alert(selected);
                // Array value is stored in a input control with id multiSelectedIdsEditModal
               
                $("#multiSelectedIdsEditModal").val(selected);// store array in input control for multi secproject search
                $("#secondaryprojecttype").val(selected);// store array in input control for multi secproject search

              }

        });
    });

 
    // // now filling cmb is done in component
    // *************************************************************************
    // // LOAD script main2.js for filling cmb
    // *************************************************************************
    // $.getScript('/assets/javascript/main2.js', function () {
    //     // alert();
    // });



    // Clear Multiselect. Hidden btn to clearMultiSelect. This btn clicked is called from angular "clearall()"
    $("#clearMultiSelect2").click(function () {
        $("#multiple-checkboxes2").multiselect("clearSelection");// WORKING clear Bootstrap multiselect

        // $('#multiple-checkboxes').multiselect('select', ['1', '2', '4']); // WORKING
        // $("#multiple-checkboxes").multiselect('refresh');// refresh Bootstrap multiselect
        // $("#multiple-checkboxes").multiselect("deselectAll", false);
        // $("#multiple-checkboxes option[value='"+21+"']").prop('selected', true);
        // $("#multiple-checkboxes option[value='"+21+"']").attr("selected", "selected");
    });



}




