const template = Handlebars.compile(document.querySelector('#messages_panel').innerHTML);
const template_Message = Handlebars.compile(document.querySelector('#one_message').innerHTML);
const template_channels = Handlebars.compile(document.querySelector('#channels_template').innerHTML);


// Put all exsisting messages
document.addEventListener('DOMContentLoaded', load_messages);

// Connect socket and send message
document.addEventListener('DOMContentLoaded', () => {

  var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
  socket.on('connect', () =>{
  document.querySelector('#message_send').onsubmit = () => {
    const message = document.querySelector('#message').value;
    let channel_name = document.querySelector('#channel_name').innerHTML;
    socket.emit('send message', {'message': message, 'channel_name': channel_name});
    return false;
    }
  });
  socket.on('announce creation', send_message);
  });


function load_channels_panel(){
  let request = new XMLHttpRequest();
  request.open('POST', '/channels');
  request.send();
  request.onload = () => {
      const data = JSON.parse(request.responseText);
      const channels_panel = template_channels(data);
      document.querySelector('.inbox_chat').innerHTML = channels_panel;
      style_channel();
    };
};

// load messages that previously existed in the channel
function load_messages() {
  let request = new XMLHttpRequest();
  let form = new FormData();
  var channel_name = document.querySelector('#channel_name').innerHTML;
  form.append('channel_name', channel_name);
  request.open('POST', '/messages');
  request.send(form);
  request.onload = () => {
      const data = JSON.parse(request.responseText);
      const list = template(data);
      document.querySelector('#messages_list').innerHTML = list;
      load_channels_panel();
      style_msg();
      autoscroll();
    };

  };

// Style existing messages if previously send by the user
function style_msg(){
  var message_sender = localStorage.getItem('name');
  document.querySelectorAll('.incoming_msg').forEach(item => {
    if (item.querySelector('#message_sender').innerHTML == message_sender){
      item.className = 'outgoing_msg';
      item.querySelector('.received_msg').className = 'sent_msg';
      item.querySelector('.received_withd_msg').className = 'o';
      item.querySelector('.sender_info_msg').remove();
    }
  });
};

// Style current channel in grey
function style_channel(){
  document.querySelectorAll('.chat_list').forEach(item => {
    if (item.querySelector('.channel_name_in_Messages').innerHTML == channel_name.innerHTML){
      item.className = 'chat_list active_chat';
    };
});
};

// send new message
function send_message(data) {
  const content = template_Message({'message_text': data.message_text, 'message_sender': data.message_sender, 'creation_time': data.creation_time});
  document.querySelector('#messages_list').innerHTML += content;
  autoscroll();
};

// auto scroll message list down
function autoscroll(){
  let div = document.querySelector('#messages_list');
  div.scrollTop = div.scrollHeight;
}
