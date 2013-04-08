var browser;

function selectValueFromOptions(optionCollection, targetValue) {
  var val = targetValue.trim();
  for (var i = 0; i < optionCollection.length; i++) {
    if (optionCollection.item(i).textContent.trim() == val) {
      return optionCollection.item(i);
    }
  }
  return null;
}

function trainOfStationSearch(doc) {
  var searchBtn = doc.querySelector('input#SearchButton');
  searchBtn.click();
}

function loadURI(uri, loadCallback) {
  function contentLoadedHandler(e) {
    var target = e.originalTarget;
    if (target != browser.contentDocument) {
      return;
    }

    browser.removeEventListener("DOMContentLoaded", contentLoadedHandler);
    var uri = target.documentURI;
    dump("uri: " + uri + "\n");
    loadCallback(target);
  }

  browser.addEventListener("DOMContentLoaded", contentLoadedHandler);
  browser.loadURI(uri);
}

function trainOfStation(uri, doneCb, errorCb) {
  loadURI(uri, function(doc) {
    var rows = doc.querySelectorAll("table#ResultGridView > tbody > tr"),
        result = [];
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      var fields = row.children;
      try {
        dump("Result: " + fields.item(1).querySelector("a"));
        result.push({
          "type": fields.item(0).textContent.trim(),
          "code": {
            "code": fields.item(1).textContent.trim(),
            "queryUri": fields.item(1).querySelector("a").href
          },
          "terminal":  fields.item(3).textContent.trim(),
          "arrive": fields.item(4).textContent.trim(),
          "leave": fields.item(5).textContent.trim()
        });
      } catch (e) {
        dump("Error when parsing element: " + e + "\n");
      }
    }
    doneCb(result);
  });
}

window.addEventListener('load', function(e) {
  function doneCallback(result) {
    dump("result: " + JSON.stringify(result) + "\n");

    var appStartup = Components.classes['@mozilla.org/toolkit/app-startup;1'].
                     getService(Components.interfaces.nsIAppStartup);
    appStartup.quit(Components.interfaces.nsIAppStartup.eAttemptQuit);
  }

  function errorCallback() {
  }

  browser = document.getElementById('bw');

  switch (action) {
  case "citylist":
    parseCity(initUri, doneCallback, errorCallback);
    break;
  case "trainofstation":
  case "tos":
    trainOfStation(initUri, doneCallback, errorCallback);
    break;
  }
});

var cmdLine = window.arguments[0],
    initUri,
    action;
cmdLine = cmdLine.QueryInterface(Components.interfaces.nsICommandLine);
initUri = cmdLine.getArgument(1);
action = cmdLine.getArgument(0);

dump("Load init URI: " + initUri + ", action: " + action + "\n");

