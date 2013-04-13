$(document).ready(function(e) {
  alert("hey");
  $.get("/stations", 'json', function(data) {
    for (var i = 0; i < data.length; i++) {
      var listView = $("#page_home #train-list");
      listView.append("<li><a href=\"#page\">" + data[i].station + "</a></li>");
      listView.listview("refresh");
    }
  });
});
