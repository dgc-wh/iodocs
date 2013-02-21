(function() {
    var searchResults;
    $.widget( "custom.catcomplete", $.ui.autocomplete, {
        _renderMenu: function( ul, items ) {
            //console.log(items);
            searchResults = items;
            var that = this,
                currentCategory = "";
            $.each( items, function( index, item ) {
                if ( item.category != currentCategory ) {
                    ul.append( "<li class='ui-autocomplete-category'>" + item.category + "</li>" );
                    currentCategory = item.category;
                }
                that._renderItemData( ul, item );
            });
        }
    });

    $( "#search1" ).catcomplete({
        source: "search",
        minLength: 2,
    });


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
                    $(this.parentNode.parentNode).toggleClass('expanded')
                }
            });
        }
        return false;

    });

    $('#clear-search').click(function () {
        clearSearch();
    });

    function matching (text, searchResults) {
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

    function clearSearch () {
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


