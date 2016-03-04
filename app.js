(function () {
  'use strict';

  var $input = $('#input'),
    $results = $('#results');

  // this function returns a promise which is important
  function searchWikipedia(term) {
    // let's see what we are sending
    console.info(term);

    // use jquery to ajax some data to wikipedia
    return $.ajax({
      url: 'http://en.wikipedia.org/w/api.php',
      dataType: 'jsonp',
      data: {
        action: 'opensearch',
        format: 'json',
        search: term
      }
    }).promise();
  }

  // Only get the value from each key up
  var keyups = Rx.Observable.fromEvent($input, 'keyup')
    //.map(e => {console.log(JSON.stringify(e.target)); return e.target.value;});
    .map(e => e.target.value);

  keyups
    .flatMapLatest(searchWikipedia)
    .subscribe(
      data => {
        var res = data[1];

        // clear the markup
        $results.empty();

        // emit an <li> with each result,
        $.each(res, (_, value) => $('<li>' + value + '</li>').appendTo($results));
      },
      error => {
        // clear the markup
        $results.empty();

        $('<li>Error: ' + error + '</li>').appendTo($results);
      });
}());
