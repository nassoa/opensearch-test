// Update this variable to point to your domain.
var apigatewayendpoint = '';
var loadingdiv = $('#loading');
var noresults = $('#noresults');
var resultdiv = $('#results');
var searchbox = $('input#search');
var timer = 0;

// Executes the search function 250 milliseconds after user stops typing
searchbox.keyup(function () {
  clearTimeout(timer);
  timer = setTimeout(search, 250);
});

async function search() {
  // Clear results before searching
  noresults.hide();
  resultdiv.empty();
  loadingdiv.show();
  // Get the query from the user
  let query = searchbox.val();
  // Only run a query if the string contains at least three characters
  if (query.length > 3) {
    // Make the HTTP request with the query as a parameter and wait for the JSON results
    let response = await $.get(apigatewayendpoint, { q: query, size: 25 }, 'json');
    // Get the part of the JSON response that we care about
    let results = response['hits']['hits'];
    if (results.length > 0) {
      loadingdiv.hide();
      // Iterate through the results and write them to HTML
      resultdiv.append('<p>Found ' + results.length + ' results.</p>');
      for (var item in results) {
        let image = results[item]._source.image_url;
        let reference = results[item]._source.reference;
        let brand = results[item]._source.brand;
        let results_d = undefined_v(results[item]._source.results);
        let url_img = results[item]._source.image_url;
        let usine = undefined_v(results[item]._source.usine);

        // Construct the full HTML string that we want to append to the div
        resultdiv.append('<div class="result">' +
        '<a href="' + url_img + '" ><img data-lity src="' + image + '" onerror="imageError(this)"></a>' +
        '<div><h2>' + brand + ' - ' + reference + '</h2>' +
        '<p class="usine">' + usine + '</p>' +
        '<p class="results_d">' + results_d + '</p></div></div>');
      }
    } else {
      noresults.show();
    }
  }
  loadingdiv.hide();
}

// Tiny function to catch images that fail to load and replace them
function imageError(image) {
  image.src = 'images/no-image.jpg';
}
// confitions function to hide undefined values
function undefined_v(val) {
  if (val == undefined) {
    return ' ';
  } else {
    return val;
  }
}