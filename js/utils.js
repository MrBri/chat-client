// utility function for setting authentication headers.
// use it like this:
// $.ajax(url, {
//   ...,
//   beforeSend: headerSetter
// })
(function() {

  var userObjects, listOfUsernames, name, msg, newObject, room;

  var headerSetter = function(xhr) {
    xhr.setRequestHeader("X-Parse-Application-Id", "voLazbq9nXuZuos9hsmprUz7JwM2N0asnPnUcI7r");
    xhr.setRequestHeader("X-Parse-REST-API-Key", "QC2F43aSAghM97XidJw8Qiy1NXlpL5LR45rhAVAf");
  };

  $(document).ready(function() {

    var messageTemplate = _.template('<span class="user" data-name="<%= username %>">' +
      '<%= username %></span><span class="message <%= username %>" data-name="<%= username %>">' +
      '<%= text %></span><br>');
    // not all users have text. Errors in console

    var nameTemplate = _.template('<span class="userInWin" data-name="<%= name %>">' +
      '<%= name %></span><br>');

    var ajaxCall = function(options) {
      var ajaxParams = _.extend({beforeSend: headerSetter, contentType: 'application/json'}, options);
      $.ajax('https://api.parse.com/1/classes/messages', ajaxParams);
    };

    var refreshMessages = function(){
      ajaxCall({
        data: {'order': '-createdAt'},
        success: function(data){

          userObjects = data.results;

          listOfUsernames = _.uniq(_.pluck(data.results, 'username'));
          _.each(listOfUsernames, function(name){
            $('.nameWin').append(nameTemplate({name: name}));
          });

          $('.userInWin').on('click', function(){
            var name = $(this).attr('data-name');
            $('span.' + name).toggleClass('bold');
            $(this).toggleClass('bold');
          });

          _.each(data.results, function(user, key, data) {
            $('div.messageWin').append(messageTemplate(user));
          });
        }
      });
    };


    $('form.inputWin').submit(function(e) {
      e.preventDefault();
      name = $('input#name').val();
      msg = $('input#message').val();
      room = $('input#room').val();
      if ( room !== "") {
        newObject = {username: name, text: msg, roomname: room};
      } else {
        newObject = {username: name, text: msg};
      }

      ajaxCall({
        type: 'POST',
        dataType: "json",
        data: JSON.stringify(newObject),
        success: function(object) {
          if (!newObject.roomname){
            $('div.messageWin').prepend(messageTemplate(newObject));
          } else if (newObject.roomname === $('div[data-room]')){
            //check div array for data-room match to newObject.roomname; if yes, prepend
            $('div[data-room]').prepend(messageTemplate(newObject));
          } else {
            $('select').append('<option selected>'+newObject.roomname+'</option>');
            $('div.chatContainer').prepend('<div class="defaultStyleWin" data-room="newObject.roomname">'+newObject.roomname+'</div>');
          }
        }
      }); // ajaxCall
    }); // submit

    refreshMessages();
    setInterval(refreshMessages, 1000);

  }); // document ready
})(); // closure
