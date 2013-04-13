var selectedGroup = null;
var selectedStation = null;
var selectedTrain = null;

$(document).ready(function(e) {
});

$(document).on("pagecreate", "#page_home", function(e) {
  $.get("/stations", 'json', function(data) {
    var listView = $("#page_home #group-list");
    for (var i = 0; i < data.length; i++) {
      var group = data[i];
      var listItem = $("<li/>"),
          anchor = $("<a href=\"#page_station_list\" data-transition=\"slide\">" + group.name + "</a>");
      anchor.click(function(group) {
        selectedGroup = group;
      }.bind(null, group));
      listItem.append(anchor);
      listView.append(listItem);
    }
    listView.listview("refresh");
  });
});

$(document).on("pagebeforeshow", "#page_station_list", function(e) {
  $("#page_station_list #header h1").html(selectedGroup.name);
  var listView = $("#page_station_list #city-list");
  var stations = selectedGroup.stations;
  for (var i = 0; i < stations.length; i++) {
    var station = stations[i];
    var listItem = $("<li/>"),
        anchor = $("<a href=\"#page_station\" data-transition=\"slide\">" + station.station + "</a>");
    anchor.click(function(station) {
      selectedStation = station;
    }.bind(null, station));
    listItem.append(anchor);
    listView.append(listItem);
  }
  listView.listview("refresh");
});

$(document).on("pagebeforeshow", "#page_station", function(e) {
  $("#page_station #header h1").html(selectedStation.station);
  $.get("/trainAt/" + selectedStation.code + "/0", 'json', function(data) {
    var listView = $("#page_station #train-list");
    for (var i = 0; i < data.length; i++) {
      var train = data[i];
      var listItem = $("<li/>"),
          anchor = $("<a href=\"#page_train\" data-transition=\"slide\">" + train.type + " - " + train.code.code + "</a>");
      anchor.click(function(train) {
        selectedTrain = train;
      }.bind(null, train));
      listItem.append(anchor);
      listView.append(listItem);
    }
    listView.listview("refresh");
  });
});
