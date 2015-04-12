/*global $:false, console:false, document:false */

function Profile() {
}

Profile.prototype.runner = function () {
    this.showAll();
    this.bind();
};

Profile.prototype.scheduleAnalytics = function (that) {

    if (!$(that).hasClass('wait')) {

        var url = $(that).attr('data-url');

        $.post('/schedule', { url: url } )
         .done(function(data) {
                                $(that).html('<span class="fui-time"></span>')
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

    document.location.reload(true);


};

Profile.prototype.bind = function() {

    var that = this;

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
        var request = $.ajax({
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

    $('.profile-schedule-analytics').live('click', function (event){

        that.scheduleAnalytics(this);
        event.preventDefault();

    });

    $('.profile-schedule-remove').live('click', function (event){

        if(confirm("Are you sure you wish to delete all data?")) {
            that.scheduleRemoveAnalytics(this);
        }

        event.preventDefault();

    });
};

Profile.prototype.showAll = function () {

    $.getJSON('/profile.json', function (data) {

        if (data.length === 0) {
            var $alert = $('#profile-tbody .lead');
            $alert.find('strong').text('There are no monitors yet');
            $alert.append('<br/><a href="#box-form-profile" class="btn btn-primary fui-plus" data-toggle="collapse"> Add one</a>');
        } else {
            var items = {
                emails: [],
                urls: []
            };

            var HTMLTOOLBAR = '<div class="btn-toolbar">' +
                              '  <div class="btn-group">' +
                              '    <a class="btn btn-primary profile-schedule-analytics" href="/schedule" data-url="%URLENCODED%"><i class="fui-time"></i></a>' +
                              '    <a class="btn btn-primary active profile-schedule-remove" href="/schedule/%URLENCODED%"><i class="fui-cross"></i></a>' +
                              '    <a class="btn btn-primary" href="/dashboard/%URLENCODED%"><i class="fui-eye"></i></a>' +
                              '  </div>' +
                              '</div>';

            var HTML = '<tr>' +
                       '   <td>'+
                       '    <a href="/dashboard/%URLENCODED%"><span class="fui-eye"></span> ' + '%URL%</a>' +
                       '   </td>' +
                       '   <td>%EMAIL%</td>' +
                       '   <td style="width: 145px; font-size: 1px;">' +
                       HTMLTOOLBAR +
                       '   </td>' +
                       '</tr>';
            var HTMLinserted = '';


            $.each(data, function(key, val) {
                HTMLinserted += HTML.replace('%URL%', val.url)
                                    .replace('%URLENCODED%', encodeURIComponent(val.url))
                                    .replace('%URLENCODED%', encodeURIComponent(val.url))
                                    .replace('%URLENCODED%', encodeURIComponent(val.url))
                                    .replace('%URLENCODED%', encodeURIComponent(val.url))
                                    .replace('%EMAIL%', val.email);
            });

            $('#profile-tbody').html(HTMLinserted);
        }
    });

};

$(document).ready(function(){

    var profile = new Profile();

    profile.runner();
});
