/// <reference path="typings/jquery/jquery.d.ts" />
/// <reference path="typings/moment/moment.d.ts" />
"use strict";
var remote = require('remote');
var app = remote.require('app');
var dialog = remote.require('dialog');
var http = remote.require('http');
var ir_messages = [];
function initialize() {
    load_messages();
    if (localStorage.getItem('ip_address')) {
        home();
    } else {
        setting();
    }

}
// show home pain
function home() {
    $(function () {
        $('button').removeClass('active');
        $('span.icon-home').parent('button').addClass('active');
        $('.content').hide();
        $('#home').show();
        $('#get_message_button').on('click', function () {
            return get_message();
        });
    });
    update_button_mode_get_message();
    update_message_list();
    return false;
}
// show setting pain
function setting() {
    $(function () {
        $('button').removeClass('active');
        $('span.icon-cog').parent('button').addClass('active');
        $('.content').hide();
        $('#setting').show();
        var ip_selector = $('#ip_address');
        ip_selector
            .on('load', function () {
                update_button_mode_get_client_token($(this));
            })
            .on('change', function () {
                localStorage.setItem('ip_address', ip_selector.val());
                update_button_mode_get_client_token($(this));
            })
            .on('keyup', function () {
                update_button_mode_get_client_token($(this));
            });
        ip_selector.val(localStorage.getItem('ip_address') || '');
        $('#client_key').val(localStorage.getItem('client_key') || '');
        $('#device_id').val(localStorage.getItem('device_id') || '');
        update_button_mode_get_client_token(ip_selector);
        $('#get_client_token_button').on('click', function () {
            return get_client_token();
        });
    });
    return false;
}
// update signal list
function update_message_list() {
    var table = $('#message_list');
    var html = '';
    for (var i = 0; i < ir_messages.length; i++) {
        var m = ir_messages[i];
        if (m.data == null) {
            continue;
        }
        html += "\n<tr>\n    <td>\n        <button onclick=\"return post_message(" + i + ");\" class=\"bin btn-positive btn-large\">send</button>\n    </td>\n    <td>\n        <input type=\"text\" class=\"message-action\" id=\"action_" + i + "\" value=\"" + (m.action || '') + "\"/>\n    </td>\n    <td>\n        <input type=\"text\" class=\"message-category\" id=\"category_" + i + "\" value=\"" + (m.category || '') + "\"/>\n    </td>\n    <td>" + (m.updated || '') + "</td>\n</tr>\n";
    }
    table.html(html);
    $('.message-action, .message-category').on('change', function () {
        var a = $(this).attr('id').split('_');
        var id = a[1];
        var m = moment();
        ir_messages[id].action = $("#action_" + id).val();
        ir_messages[id].category = $("#category_" + id).val();
        ir_messages[id].updated = m.format("YYYY/MM/DD hh:mm:ss");
        save_messages();
        update_message_list();
    });
}
function get_client_token() {
    var ip_address = $('#ip_address').val();
    $.ajax({
        url: "http://" + ip_address + '/keys',
        type: 'post',
        dataType: 'json',
        data: {},
        headers: {
            "X-Requested-With": "curl"
        }
    }).done(function (response) {
        console.log('success');
        console.log(response);
        localStorage.setItem('ip_address', ip_address);
        localStorage.setItem('client_token', response.clienttoken);
        $.ajax({
            url: "https://api.getirkit.com/1/keys",
            type: 'post',
            dataType: 'json',
            data: {
                'clienttoken': response.clienttoken
            },
            headers: {
                "X-Requested-With": "curl"
            }
        }).done(function (response) {
            console.log('success');
            console.log(response);
            localStorage.setItem('ip_address', ip_address);
            localStorage.setItem('client_key', response.clientkey);
            localStorage.setItem('device_id', response.deviceid);
            $('#client_key').val(response.clientkey);
            $('#device_id').val(response.deviceid);
        }).fail(function (response) {
            console.log('failure');
            console.log(response);
        });
    }).fail(function (response) {
        console.log('failure');
        console.log(response);
    });
    return false;
}
// Get Client Token button active control
function update_button_mode_get_client_token(column) {
    var ip_address = column.val();
    var button = $('#get_client_token_button');
    if (ip_address.match(/^([0-9]{1,3}\.){3}[0-9]{1,3}$/)) {
        if (button.prop("disabled") == true) {
            button.prop("disabled", false);
            button.removeClass('btn-default');
            button.addClass('btn-primary');
        }
    }
    else {
        if (button.prop("disabled") == false) {
            button.prop("disabled", true);
            button.removeClass('btn-primary');
            button.addClass('btn-default');
        }
    }
}
// Get Signal button active control
function update_button_mode_get_message() {
    var button = $('#get_message_button');
    if (localStorage.getItem('ip_address') && localStorage.getItem('client_key') && localStorage.getItem('device_id')) {
        if (button.prop("disabled") == true) {
            button.prop("disabled", false);
        }
    }
    else {
        if (button.prop("disabled") == false) {
            button.prop("disabled", true);
        }
    }
}
// get signal request
function get_message() {
    var ip_address = localStorage.getItem('ip_address');
    $.ajax({
        url: "http://" + ip_address + '/messages',
        type: 'get',
        dataType: 'json',
        headers: {
            "X-Requested-With": "curl"
        }
    }).done(function (response) {
        console.log(response);
        ir_messages[ir_messages.length] = {'data': response.data, 'freq': response.freq, 'format': response.format};
        save_messages();
        update_message_list();
    }).fail(function (response) {
        console.log('failure');
        console.log(response);
    });
}
// post signal request
function post_message(id) {
    var ip_address = localStorage.getItem('ip_address');
    $.ajax({
        url: "http://" + ip_address + '/messages',
        type: 'post',
        dataType: 'json',
        processData: false,
        data: JSON.stringify({"message": JSON.stringify(ir_messages[id])}),
        headers: {
            "X-Requested-With": "curl"
        }
    }).done(function (response) {
        console.log(response);
        var m = moment();
        ir_messages[ir_messages.length] = {
            'data': response.data,
            'freq': response.freq,
            'format': response.format,
            'updated': m.format("YYYY/MM/DD hh:mm:ss")
        };
        save_messages();
    }).fail(function (response) {
        console.log('failure');
        console.log(response);
    });
}
// save to localStorage
function save_messages() {
    console.log(ir_messages);
    ir_messages.sort(function (a, b) {
        if (a.category < b.category) {
            return -1;
        }
        if (a.category > b.category) {
            return 1;
        }
        if (a.action < b.action) {
            return -1;
        }
        if (a.action > b.action) {
            return 1;
        }
        return 0;
    });
    console.log(ir_messages);
    localStorage.setItem('messages', JSON.stringify(ir_messages));
}
// load from localStorage
function load_messages() {
    ir_messages = JSON.parse(localStorage.getItem('messages'));
}
//# sourceMappingURL=index.js.map