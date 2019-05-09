import * as feather from "./../node_modules/feather-icons/dist/feather.js";

$(document).ready(function(){
    feather.replace();
    $('#openmenu').click(function(){
        $('#overlay, #menu').removeClass('close');
        $('#overlay, #menu').addClass('open');
        $('#content, header, footer').addClass('blurblur');
    });
    $('#overlay, #closemenu').click(function(){
        $('#overlay, #menu').removeClass('open');
        $('#overlay, #menu').addClass('close');
        $('#content, header, footer').removeClass('blurblur');
    });
});