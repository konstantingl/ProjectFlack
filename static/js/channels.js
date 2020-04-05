
const template = Handlebars.compile(document.querySelector('#channel_panel').innerHTML);
const template_oneChannel = Handlebars.compile(document.querySelector('#one_channel').innerHTML);


// Put all exsisting channels in list
document.addEventListener('DOMContentLoaded', load);


// Connect to socket and try to create channel
document.addEventListener('DOMContentLoaded', () => {

  var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
  socket.on('connect', () =>{
  document.querySelector('#channel_create_form').onsubmit = () => {
    const channel_name = document.querySelector('#channel_name').value;

    // Check if channel_name already exsists
    let formData = new FormData();
    formData.set('channel_name', channel_name);
    let request = new XMLHttpRequest();
    request.open('POST', '/channel_names_check');
    request.send(formData);
    name = formData.get('channel_name')
    request.onload = () => {
        if (request.response == 'Channel already exsists') {
          const error = document.querySelector('#error');
          error.innerHTML = 'Channel already exsists';
          }
        else {
        document.querySelector('#error').innerHTML='';
        socket.emit('create channel', {'channel_name': channel_name});
        return false;
        }
    };
    return false;
  };
});
  socket.on('announce creation', add_channel);
  });


// Load existing channels
function load() {
  let request = new XMLHttpRequest();
  request.open('POST', '/channels');
  request.send();
  request.onload = () => {
      const data = JSON.parse(request.responseText);
      const list = template(data);
      document.querySelector('#channel_list_cover').innerHTML = list;
  };
};

// Add new channel
function add_channel(data) {
  const content = template_oneChannel({'channel_name': data.channel_name, 'channel_host': data.channel_host, 'url': data.url});
  document.querySelector('#channel_list').innerHTML += content;
};
