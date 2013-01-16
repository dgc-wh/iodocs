(function() {
    $.widget( "custom.catcomplete", $.ui.autocomplete, {
        //console.log(apiDefinition);
        _renderMenu: function( ul, items ) {
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

    $( "#search" ).catcomplete({
        source: "search",
        minLength: 2,
        select: function (event, ui) {
            return ui;
        }
    });
})();
