(function ($) {
  let mySearchForm = $('#search-form'),
    groupNameInput = $('#groupNameSearch'),
    categoryInput = $('#categorySearch'),
    searchResults = $('#search-results'),
    error = $('#error'),
    empty = $('#empty');

  function bindRequestToJoinButton(result) {
    result.find('.finishItem').on('click', function (event) {
      event.preventDefault();
      let currentLink = $(this);
      let currentId = currentLink.data('id');

      let requestConfig = {
        method: 'POST',
        url: '/navigation/sendrequest/' + currentId,
        data: JSON.stringify({
          groupId: currentId,
        })
      };

      $.ajax(requestConfig).then(function (responseMessage) {
        let newElement = $(responseMessage);
        bindRequestToJoinButton(newElement);
        searchResults.empty();
        searchResults.html(newElement);
      });
    });
  }

  function bindAll(newElement) {
    newElement.children().each(function (index, element) {
      bindRequestToJoinButton($(element));
    });
  }



  mySearchForm.submit(function (event) {
    $('#noResults').hide();
    error.hide();
    event.preventDefault();

    let groupName = groupNameInput.val();
    let category = categoryInput.val();

    if (groupName) {
      if (groupName.trim().length === 0) {
        error.show();
        error.html("Error: Group Name Can not contain empty spaces");
        return;
      }
    }

    let categoryArray = ["N/A", "OTT", "Music Streaming", "Network Service Providers", "Education", "E-Commerce", "Other"]

    if (category) {
      if (category.trim().length === 0) {
        error.show();
        error.html("Error: Category Can not contain empty spaces");
        return;
      }
      let flag = true;
      categoryArray.forEach(element => {
        if (category === element) flag = false;
      });
      if (flag) {
        error.show();
        error.html("Error: Invalid Category");
        return;
      }
    }

    if (category === "N/A") category = false;

    if (groupName || category) {

      let requestConfig = {
        method: 'POST',
        url: '/navigation/search.html',
        contentType: 'application/json',
        data: JSON.stringify({
          groupName: groupName,
          category: category
        })
      };

      $.ajax(requestConfig).then(function (responseMessage) {
        let newElement = $(responseMessage);
        if (newElement.children().length === 0) {
          empty.hide();
          searchResults.show();
          searchResults.empty();
          $('#noResults').show();
          $('#noResults').html("No results found. Please try again.");
        }

        bindAll(newElement);
        empty.hide();
        searchResults.show();
        searchResults.empty();
        searchResults.html(newElement);
      });
    } else {
      empty.show();
      searchResults.hide();
    }
  });
})(window.jQuery);