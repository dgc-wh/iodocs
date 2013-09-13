<<<<<<< HEAD
(function() {
    var searchResults;
    var maxItems = 20;
    $.widget( "custom.catcomplete", $.ui.autocomplete, {
        _renderMenu: function( ul, items ) {
=======
(function () {
    var searchResults;
    var maxItems = 20;
    $.widget( "custom.catcomplete", $.ui.autocomplete, {
        _renderMenu: function (ul, items) {
>>>>>>> e24ec1ce176a02d0e38ccc37342d6afe6aa1f213
            searchResults = items;
            var that = this,
                currentCategory = "";

            // Setting up an object with the count of method matches for each
            // endpoint.
            var matchedMethodCount = {};
            for (var i = 0; i < items.length; i++) {
                if (items[i].category !== currentCategory) {
                    currentCategory = items[i].category;
                    matchedMethodCount[currentCategory] = 0;
                }
                if (items[i].category === currentCategory) {
                    matchedMethodCount[currentCategory]++;
                }
            }
            currentCategory = "";

<<<<<<< HEAD
            $.each( items, function( index, item ) {
=======
            $.each( items, function (index, item) {
>>>>>>> e24ec1ce176a02d0e38ccc37342d6afe6aa1f213
                // Determining the count of methods matched for an endpoint here
                // is probably poor for performance. Worry about it later.
                if ( item.category != currentCategory ) {
                    var uiItem = $( "<li>" )
                        .addClass('ui-autocomplete-category')
                        .text(item.category + " | Methods matched: " + matchedMethodCount[item.category] ) 
                        // Opens and closes a given endpoint when it is clicked on
                        .click( function (event) {
<<<<<<< HEAD
                                $(this).nextUntil('.ui-autocomplete-category').slideToggle();
=======
                            $(this).nextUntil('.ui-autocomplete-category').slideToggle();
>>>>>>> e24ec1ce176a02d0e38ccc37342d6afe6aa1f213
                        })
                        // Change the cursor and underline the endpoint text when an endpoint
                        // is hovered over. This should provide an indication to the user to
                        // click on given endpoint.
                        .hover(
                            // hoverOn
                            function () {
                                $(this).css('cursor', 'pointer');
                                $(this).css('text-decoration', 'underline');
                            },
                            // hoverOut
                            function () {
                                $(this).css('text-decoration', 'none');
                            }
                        );
                    ul.append(uiItem);
                    currentCategory = item.category;
                }
                that._renderItem( ul, item, items.length );
            });
        },
        // _renderItem is the jQuery UI function that sets up the methods for display,
        // I couldn't find much in way of documentation for this, but it looks like 
        // this should be function should be overriden for customization.
<<<<<<< HEAD
        _renderItem: function ( ul, item, count ) {
            var that = this;
            // Create the anchor link for a method, same as is done in api.jade
            var link = "#"+(item.category + '-' + item.type + '-' + item.label).replace(/\s/g, '-');
            var testreturn = $( "<li>" )
                    .append( $( "<a href=" + link +">" ).text( item.label ))
                    .addClass(item.type.toLowerCase())  // Adds the background color 
                    .click( function (event) {          // What to do when a method is clicked on
                        if (/PUT|POST|GET|DELETE/.test(link)){
                            // Opens up a particular method.
                            var div_node = $('div.clickable').has('a[href="'+link+'"]');
                            if (div_node.closest('li.endpoint').hasClass('expanded')) {
                                // do nothing
                            }
                            else {
                                div_node.closest('li.endpoint').toggleClass('expanded');
                                div_node.closest('li.endpoint').children('ul.methods').slideToggle();
                            }
                            div_node.siblings('form').slideToggle();
                        }
=======
        _renderItem: function (ul, item, count) {
            var that = this;
            // Create the anchor link for a method, same as is done in api.jade
            var link = "#"+(item.category + '-' + item.type + '-' + item.label).replace(/\s/g, '-');
            var processedMethod = $( "<li>" )
                    .append( $( "<a href=" + link +">" ).text( item.label ))
                    .addClass(item.type.toLowerCase())  // Adds the background color 
                    .click( function (event) {          // What to do when a method is clicked on
                        window.location.hash=link;
                        var methodName = $(this).text();
                        // iterate through all methods looking for equivalent method text
                        $("div.title > span.name").each(function () {
                            // if a method matches, find the endpoint it belongs to
                            // and then open the endpoint. Next, click on the
                            // method itself.
                            if ($(this).text() === methodName) {
                                var foundMethod = $(this).parent();
                                endpointText = $(this).closest("ul.methods").siblings("h3.title").children("span.name");
                                endpointText.click();
                                foundMethod.click();
                            }
                        });
>>>>>>> e24ec1ce176a02d0e38ccc37342d6afe6aa1f213
                        // Close the search results box after a method has been clicked on.
                        that.close(event);
                        event.preventDefault();
                    })
                    .appendTo( ul );
            if (count > maxItems) {
<<<<<<< HEAD
                  return testreturn.css('display', 'none');
            }
            else {
                  return testreturn;
=======
                return processedMethod.css('display', 'none');
            }
            else {
                return processedMethod;
>>>>>>> e24ec1ce176a02d0e38ccc37342d6afe6aa1f213
            }
        }
    });

    $( "#search1" ).catcomplete({
        source: "search",
        minLength: 2,
    });


<<<<<<< HEAD
    $('#searchForm').submit( function()  {
        clearSearch();
        if ( $('#search1').val().length > 0 ) {
            $("#search1").catcomplete("close");
            $('li.endpoint > h3.title span.name').each(function () {
                if(!matching($(this).text(), searchResults)) {
                    $(this).parent().parent().addClass('hide-this');
                }
                else {
                    // endpoint name matched
                    //console.log($(this).text());

                    // Deal with hiding methods that did not match. 
                    $(this.parentNode).siblings('ul.methods').children('li.method').each(function () {
                        if (!matching($(this).find('div.title span.name').text(), searchResults)) {
                            //console.log($(this).find('div.title span.name').text());
                            $(this).addClass('hide-this');
                        }
                        else {
                            //console.log($(this).find('div.title span.name').text());
                        }
                    });

                    // Toggle endpoint
                    $('ul.methods', this.parentNode.parentNode).slideToggle();
                    $(this.parentNode.parentNode).toggleClass('expanded');
                }
            });
        }
        return false;

=======
// Submitting the search term:
// Check each endpoint to see if it exists in the search results.
// If it does not, hide the endpoint.
// If it does exist, then hide the methods inside the endpoint that do not
// appear in the searchResults.
    $('#searchForm').submit(function () {
        var searchTerm = $('#search1').val();
        if (searchTerm) {
            $.get("/search", {term: searchTerm}, function (searchButtonResults) {
                clearSearch();
                if ( searchButtonResults.length > 0 ) {
                    $("#search1").catcomplete("close");
                    $('li.endpoint > h3.title span.name').each(function () {
                        var endpointName = $(this); // span.name
                        var endpointElement = endpointName.parent().parent(); // li.endpoint

                        if( !matching(endpointName.text(), searchButtonResults) ) {
                            endpointElement.addClass('hide-this');
                        }
                        else {
                            // endpoint name matched
                            // Deal with hiding methods that did not match. 
                            endpointName.parent().siblings('ul.methods').children('li.method').each(function () {
                                var method = $(this);
                                if ( !matching(method.find('div.title span.name').text(), searchButtonResults) ) {
                                    method.addClass('hide-this');
                                }
                            });

                            $('ul.methods', endpointElement).slideToggle();
                            endpointElement.toggleClass('expanded');
                            endpointName.parent().show();
                            endpointName.show();
                        }

                    });
                }
            });
        }
        else {
            clearSearch();
        }
        return false;
>>>>>>> e24ec1ce176a02d0e38ccc37342d6afe6aa1f213
    });

    $('#clear-search').click(function () {
        clearSearch();
<<<<<<< HEAD
    });

    function matching (text, searchResults) {
=======
        $('input#search1').val('');
        $("form.hidden:visible").slideUp();
    });

    function matching(text, searchResults) {
>>>>>>> e24ec1ce176a02d0e38ccc37342d6afe6aa1f213
        for (var k = 0; k < searchResults.length; k++) {
            for ( var prop in searchResults[k] ) {
                if (searchResults[k][prop] == text) {
                    // Match found
                    return true;
                }
            }
        }
        // No matches found.
        return false;
    }

<<<<<<< HEAD
    function clearSearch () {
=======
    function clearSearch() {
>>>>>>> e24ec1ce176a02d0e38ccc37342d6afe6aa1f213
        $('li.method.hide-this').removeClass('hide-this');
        // Close open endpoints
        var endpoints = $('ul.methods'),
            endpointsLength = endpoints.length;

        for (var x = 0; x < endpointsLength; x++) {
            var methodsList = $(endpoints[x]);
            methodsList.slideUp();
            methodsList.parent().toggleClass('expanded', false)
        }
        $('li.endpoint.hide-this').removeClass('hide-this');
    }

})();


