# Taiwan railway schedule parser

## List train of a station

Example of train list of a station

    http://twtraffic.tra.gov.tw/twrail/SearchResult.aspx?searchtype=1&searchdate=2013/04/09&fromstation=1008&trainclass=undefined&traindirection=0&fromtime=0000&totime=2359

Example of station list of a train

    http://twtraffic.tra.gov.tw/twrail/SearchResultContent.aspx?searchdate=2013/04/10&traincode=251&trainclass=自強&mainviaroad=0&fromstation=1008&tostation=&language=Result:

## Usage

### Get station code

    ./xulrunner application.ini citylist

### Parse train of a station

    ./xulrunner application.ini tos <year> <month> <day> <direction> <station code>

* _direction_ 0 for clock-wise, 1 for counterclock-wise
* _station code_ can be retrieved by calling citylist. It a number for a station.

### Parse arrive/leave time at each station of a train

    ./xulrunner application.ini st <url>

### As a daemon

This program can stay on and connect to an application server via socket.io.
Run with this command:

    ./xulrunner application.ini daemon <server's url>

* _server's url_ points to the application server. _traintime_ will work as a
websocket client (with socket.io).
