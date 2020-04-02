
const template = Handlebars.compile(document.querySelector('#channel_panel').innerHTML);
const template_oneChannel = Handlebars.compile(document.querySelector('#one_channel').innerHTML);

  // Put all exsisting channels in list
document.addEventListener('DOMContentLoaded', load);

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
    console.log(name);
    request.onload = () => {
        if (request.response == 'Channel already exsists') {
          const error = document.querySelector('#error');
          console.log('Channel already exsists');
          error.innerHTML = 'Channel already exsists';
          }
        else {
        document.querySelector('#error').innerHTML='';
        socket.emit('create channel', {'channel_name': channel_name});
        console.log('Socket emit');
        return false;
        }
    };
    return false;
  };
});
  socket.on('announce creation', add_channel);
  });

function load() {
  let request = new XMLHttpRequest();
  request.open('POST', '/channels');
  request.send();
  request.onload = () => {
      const data = JSON.parse(request.responseText);
      console.log(data);
      const list = template(data);
      document.querySelector('#channel_list_cover').innerHTML = list;
  };
};

function add_channel(data) {
  const content = template_oneChannel({'channel_name': data.channel_name, 'channel_host': data.channel_host, 'url': data.url});
  console.log('add_channel');
  document.querySelector('#channel_list').innerHTML += content;
};
