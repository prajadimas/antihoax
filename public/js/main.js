(function ($) {
  "use strict";
  /* ==================================================================
  [ Validate ] */
  var input = $(".validate-input .input100");
  var sentenceInput = "";
  var socketId = null;

  var socket = io();

  socket.on('time server', function (msg) {
    // $('#messages').append($('<li>').text(msg));
    $("#result").append(JSON.stringify(msg, null, 2));
    $("#result").append("\n");
  });

  socket.on('process', function (msg) {
    $("#result").append(msg.step);
    $("#result").append(msg.out);
  });

  socket.on('socket id', function (msg) {
    socketId = msg.id;
    console.log(socketId);
  });

  $(".validate-form").on("submit", function (evt) {
    evt.preventDefault();
    var check = true;
    for (var i = 0; i < input.length; i++) {
      if (validate(input[i]) == false) {
        showValidate(input[i]);
        check = false;
      }
    }
    sentenceInput = $("[name='sentence']").val();
    $("[name='sentence']").val("");
    $("#result").html("");
    return analyzing(sentenceInput, check);
  });

  $(".validate-form .input100").each(function () {
    $(this).focus(function () {
      hideValidate(this);
    });
  });

  function validate(input) {
    if ($(input).attr("type") == "email" || $(input).attr("name") == "email") {
      if ($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
        return false;
      }
    } else {
      if ($(input).val().trim() == "") {
        return false;
      }
    }
  }

  function showValidate(input) {
    var thisAlert = $(input).parent();

    $(thisAlert).addClass("alert-validate");
  }

  function hideValidate(input) {
    var thisAlert = $(input).parent();

    $(thisAlert).removeClass("alert-validate");
  }

  function analyzing(sentence, validation) {
    if (validation) {
      console.log("ANALYZING...", sentence);
      $.ajax({
        url: '/api',
        type: 'POST',
        data: { text: sentence, id: socketId },
        // dataType: 'application/json', // what type of data do we expect back from the server
        contentType: 'application/x-www-form-urlencoded',
        encode: true,
        success: function (res) {
          console.log(res);
          if (res.result) {
            if (res.result === 'HOAX') {
              Swal.fire({
                title: res.result,
                text: res.message,
                icon: 'error'
              })
            } else {
              Swal.fire({
                title: res.result,
                text: res.message,
                icon: 'success'
              })
            }
          } else {
            Swal.fire({
              title: 'NOT NEWS',
              text: res.message,
              icon: 'warning'
            })
          }
        },
        error: function (err) {
          console.error(err);
        }
      });
    } else {
      return validation;
    }
  }

})(jQuery);
