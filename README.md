# Taiwan railway schedule parser

## List train of a station

Example

    http://twtraffic.tra.gov.tw/twrail/SearchResult.aspx?searchtype=1&searchdate=2013/04/09&fromstation=1008&trainclass=undefined&traindirection=0&fromtime=0000&totime=2359

## Usage

### Get station code

    ./xulrunner application.ini citylist

### Parse train of a station

    ./xulrunner application.ini tos <url>

