// (function ($) {
//     let mySearchForm = $('#search-form'),
//       // groupNameInput = $('#groupNameSearch'),
//       categoryInput = $('#categorySearch'),
//       searchResults = $('#search-results'),
//       error = $('#error'),
//       empty = $('#empty');
  
//     function bindInviteButton(result) {
//       result.find('.btn').on('click', function (event) {
//         event.preventDefault();
//         let currentLink = $(this);
//         let currentId = currentLink.data('id');
  
//         let requestConfig = {
//           method: 'POST',
//           url: '/navigation/send-invite/' + currentId,
//           data: JSON.stringify({
//             userId: currentId,
//           })
//         };
  
//         $.ajax(requestConfig).then(function (responseMessage) {
//           let newElement = $(responseMessage);
//           bindInviteButton(newElement);
//           searchResults.empty();
//           searchResults.html(newElement);
//         });
//       });
//     }
  
//     function bindAll(newElement) {
//       newElement.children().each(function (index, element) {
//         bindInviteButton($(element));
//       });
//     }
  
  
  
//     mySearchForm.submit(async (event) => {
//       event.preventDefault();
//       $('#noResults').hide();
//       error.hide();
  
//       // let groupName = groupNameInput.val();
//       let category = categoryInput.val();
  
//       // if (groupName) {
//       //   if (groupName.trim().length === 0) {
//       //     searchResults.hide();
//       //     empty.hide();
//       //     error.show();
//       //     error.html("Error: Group Name Can not contain empty spaces");
//       //     return;
//       //   }
//       // }
  
//       let categoryArray = ["N/A", "OTT", "Music Streaming", "Network Service Provider", "Education", "E-Commerce", "Other"]
  
//       if (category) {
//         if (category.trim().length === 0) {
//           searchResults.hide();
//           empty.hide();
//           error.show();
//           error.html("Error: Category Can not contain empty spaces");
//           return;
//         }
//         let flag = true;
//         categoryArray.forEach(element => {
//           if (category === element) flag = false;
//         });
//         if (flag) {
//           searchResults.hide();
//           empty.hide();
//           error.show();
//           error.html("Error: Invalid Category");
//           return;
//         }
//       }
  
//       if (category === "N/A") category = false;
  
//       if (category) {
  
//         let requestConfig = {
//           method: 'POST',
//           url: '/navigation/search-user.html',
//           contentType: 'application/json',
//           data: JSON.stringify({
//             category: category
//           })
//         };
  
//         $.ajax(requestConfig).then(function (responseMessage) {
//           let newElement = $(responseMessage);
//           if (newElement.children().length === 0) {
//             empty.hide();
//             searchResults.show();
//             searchResults.empty();
//             $('#noResults').show();
//             $('#noResults').html("No results found. Please try again.");
//           }
  
//           bindAll(newElement);
//           empty.hide();
//           searchResults.show();
//           searchResults.empty();
//           searchResults.html(newElement);
//         });
//       } else {
//         empty.show();
//         searchResults.hide();
//       }
//     });
//   })(window.jQuery);