function Profile(){
}

Profile.prototype.runner = function() {
    this.showAll();
    this.bind();
};

Profile.prototype.scheduleAnalytics = function(that) {

    if(!$(that).hasClass('wait')) {

        var url = $(that).attr('data-url');

        $.post('/schedule', { url: url } )
         .done(function(data) {
                                $(that).html('<span class="fui-time"></span> ' + data.msg)
                                       .hide()
                                       .addClass('wait')
                                       .fadeIn(500);
                            });
    }

};

Profile.prototype.scheduleRemoveAnalytics = function(that) {

    if(!$(that).hasClass('wait')) {


        var url = $(that).attr('href');

       $.ajax({
            url: url,
            type: 'post',
            success: function(data) {
                console.log("Removing Data: ");

                $(that).html('<span class="fui-time"></span> ' + data.msg)
                       .hide()
                       .addClass('wait')
                       .fadeIn(500);
            }
        });
    }

    window.location = window.location

};

Profile.prototype.bind = function() {

    var that = this;

    $('.btn-profile-add').on('click', function(){
        $('.form-profile').slideToggle('slow');
    });

    $(".form-profile").on('submit', function(event){

        event.preventDefault();

        // setup some local variables
        var $form = $(this);

        // let's select and cache all the fields
        var $inputs = $form.find("input, select, button, textarea");

        // serialize the data in the form
        var serializedData = $form.serialize();

        // let's disable the inputs for the duration of the ajax request
        $inputs.prop("disabled", true);

        // fire off the request to /profile router from API
        request = $.ajax({
            url: "/profile",
            type: "post",
            data: serializedData
        });

        // callback handler that will be called on success
        request.done(function (response, textStatus, jqXHR){

            // log a message to the console
             $(".btn-profile-alert").html("Nice, it was added!")
                                    .show()
                                    .fadeOut(3000, function(){
                                        document.location.reload(true);
                                    });
        });

        // callback handler that will be called on failure
        request.fail(function (jqXHR, textStatus, errorThrown){

            // log the error to the console
            $(".btn-profile-alert").html(
                "The following error occured: "+
                textStatus, errorThrown
            ).show();
        });

        // callback handler that will be called regardless
        // if the request failed or succeeded
        request.always(function () {
            // reenable the inputs
            $inputs.prop("disabled", false);
        });

        // prevent default posting of form
        event.preventDefault();
    });

    $('.profile-schedule-analytics').live('click', function(event){

        that.scheduleAnalytics(this);
        event.preventDefault();

    });

    $('.profile-schedule-remove').live('click', function(event){

        that.scheduleRemoveAnalytics(this);
        event.preventDefault();

    });
};

Profile.prototype.showAll = function() {

    $.getJSON('/profile.json', function(data) {

        var items = {
            emails: [],
            urls: []
        };

        var HTML = '<tr>' +
                   '   <td>'+
                   '    <a href="/dashboard/%URLENCODED%"><span class="fui-eye"></span> ' + '%URL%</a>' +
                   '   </td>' +
                   '   <td>%EMAIL%</td>' +
                   '   <td style="width: 200px; font-size: 1px;">' +
                   '    <a href="/schedule" data-url="%URLENCODED%" class="btn btn-small btn-block btn-primary profile-schedule-analytics">' +
                   '      <span class="fui-time"></span> schedule analysis</a>' +
                   '    </a>' +
                   '    <a href="/schedule/%URLENCODED%" class="btn btn-small btn-block btn-primary profile-schedule-remove">' +
                   '      <span class="fui-cross"></span> remove all data</a>' +
                   '    </a>' +
                   '   </td>' +
                   '</tr>',
            HTMLinserted = '';


        $.each(data, function(key, val) {
            HTMLinserted += HTML.replace('%URL%', val.url)
                                .replace('%URLENCODED%', encodeURIComponent(val.url))
                                .replace('%URLENCODED%', encodeURIComponent(val.url))
                                .replace('%URLENCODED%', encodeURIComponent(val.url))
                                .replace('%EMAIL%', val.email);
        });

        $('#profile-tbody').html(HTMLinserted);
    });

};

$(document).ready(function(){

    var profile = new Profile();

    profile.runner();
});
