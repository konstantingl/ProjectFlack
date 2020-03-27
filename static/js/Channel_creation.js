document.addEventListener('DOMContentLoaded', () => {

  var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
  socket.on('connect', () =>{
  document.querySelector('#channel_create_form').onsubmit = () => {
    const channel_name = document.querySelector('#channel_name').value;
    socket.emit('create channel', {'channel_name': channel_name});
    return false;
  };
});

  socket.on('announce creation', data => {
    const li = document.createElement('li');
    var name = data.channel_name;
    var time = data.creation_time;
    var host = data.channel_host;
    li.innerHTML = 'Channel name: ' + name + '; ' + 'Creation time:' + time + '; ' + 'Channel host: ' + host;
    document.querySelector('#channel_list').append(li);
  });

});
