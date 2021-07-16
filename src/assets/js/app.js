$(document).ready(function () {

    $(".select2").select2({
        width: '100%',
        minimumResultsForSearch: -1,
        dropdownParent: $('.select2-custom-container')
    });

    $(".select2-search").select2({
        width: '100%',
        dropdownParent: $('.select2-custom-container')
    });

    $(".select2-search, .select2")
        .on('select2:open', (e) => {
            e.preventDefault();
            $('.select2-custom-container').show();
        })
        .on('select2:closing', (e) => {
            $('.select2-custom-container').hide();
        })
        // .on('select2:open', (e) => {
        //     e.preventDefault();
        // });

    // siteJS ---------------------------------------

    let siteJS = {
        onload: () => {
            siteJS.init();
        },
        init() {
            this.typeDisplay();
        },
        typeDisplay() {
            if ("ontouchstart" in document.documentElement) {
                document.body.classList.add('touch-device');
            } else {
                document.body.classList.add('hover-device');
            }
        }
    };

    siteJS.onload();
});



