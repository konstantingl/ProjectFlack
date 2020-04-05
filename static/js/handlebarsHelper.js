Handlebars.registerHelper("lasttext", function(array){
  if (array.length != 0){
    return array[array.length-1].message_text;}
  else {
    return 'No messages yet';
  }
});

Handlebars.registerHelper("lastdate", function(array){
  if (array.length != 0){
    return array[array.length-1].creation_time;}
  else {
    return 'No messages yet';
  }
});

Handlebars.registerHelper("lastsender", function(array){
  if (array.length != 0){
    return array[array.length-1].message_sender;}
  else {
    return 'No messages yet';
  }
});
