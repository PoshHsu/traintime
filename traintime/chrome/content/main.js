var browser;

function trainOfStationLoaded(doc) {
  var rows = doc.querySelectorAll("table#ResultGridView > tbody > tr"),
      result = [];
  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    var fields = row.children;
    try {
      result.push({
        "type": fields.item(0).textContent.trim(),
        "code": fields.item(1).textContent.trim(),
        "terminal":  fields.item(3).textContent.trim(),
        "arrive": fields.item(4).textContent.trim(),
        "leave": fields.item(5).textContent.trim()
      });
    } catch (e) {
      dump("Error when parsing element: " + e);
    }
  }
  dump("result: " + JSON.stringify(result) + "\n");
}

function trainTableLoaded(e) {
  var target = e.originalTarget;
  if (target != browser.contentDocument) {
    return;
  }

  var uri = target.documentURI;
  dump("uri: " + uri + "\n");

  if (uri.startsWith('http://twtraffic.tra.gov.tw/twrail/SearchResult.aspx?')) {
    trainOfStationLoaded(target);
  }
}

window.addEventListener('load', function(e) {
  browser = document.getElementById('bw');
  browser.addEventListener("DOMContentLoaded", trainTableLoaded);
  if (initUri.startsWith('http://twtraffic.tra.gov.tw/twrail/SearchResult.aspx?')) {
    browser.loadURI(initUri);  
  }
});

var cmdLine = window.arguments[0],
    initUri;
cmdLine = cmdLine.QueryInterface(Components.interfaces.nsICommandLine);
dump("Load init URI" + cmdLine.getArgument(0) + "\n");

initUri = cmdLine.getArgument(0);
