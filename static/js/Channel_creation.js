const template = Handlebars.compile(document.querySelector('#channel_panel').innerHTML);

  // Put all exsisting channels in list
document.addEventListener('DOMContentLoaded', load);

document.addEventListener('DOMContentLoaded', () => {

  var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
  socket.on('connect', () =>{
  document.querySelector('#channel_create_form').onsubmit = () => {
    const channel_name = document.querySelector('#channel_name').value;
    socket.emit('create channel', {'channel_name': channel_name});
    return false;
  };
});

  socket.on('announce creation', add_channel);
    // const content = template({'channel_name': data.channel_name});
    // document.querySelector('#channel_list').innerHTML += content;
});

function load() {
  const request = new XMLHttpRequest();
  request.open('POST', '/channels');
  request.onload = () => {
      const data = JSON.parse(request.responseText);
      data.forEach(add_channel);
  };
};

function add_channel(data) {
  const content = template({'channel_name': data.channel_name});
  document.querySelector('#channel_list').innerHTML += content;
};
