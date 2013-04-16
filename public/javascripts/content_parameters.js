(function() {
    // When user clicks on a PUT or POST bar, populate the text area with
    // existing non-empty fields.
    $('li.method.post, li.method.put').on('click', function(event) {
        event.stopPropagation();
        updateContentTextArea($(this).children('form').children('div.content'));
    });
 
    // On click or data entry/change in content parameters, this block will capture
    // the event and things will happen, dominos will fall, and pigs will fly.
    $('.content').find('ul.parameters').on( "change click keyup", "input, select", function(event) {
        event.stopPropagation();
        updateContentTextArea($(this));
    });

    function updateContentTextArea( elem ) {
        var root = elem.closest('div.content');
        var paramList = root.children('ul.parameters');
        var snapshotObject = handleTable(paramList); 
        updateTextArea( elem, snapshotObject );
    }

    /*
       li > ul are the row abstraction. Take the li, and then process the sub-ul.
    */

    function handleTable( paramList , type ) {
        if (type == 'collection') {
            var collectionValue = handleCollection(paramList.children('li'));
            if (collectionValue.length > 0) {
                return collectionValue;
            }
            else {
                return;
            }
        }

        if (type == 'object') {
            var objectValue = handleObject(paramList.children('li'));
            if (Object.keys( objectValue ).length !== 0) {
                return objectValue;
            }
            else {
                return;
            }
        }

        if (type == 'list') {
            var listValue = handleList(paramList.children('li'));
            if (listValue.length > 0) {
                return listValue;
            }
            else {
                return;
            }
        }

        if (type == 'list-only') {
            var listValue = handleList(paramList.children('li'));
            if (listValue.length > 0) {
                return listValue;
            }
            else {
                return;
            }
        }

        var rows = paramList.children('li');
        var obj = {};

        rows.each(function () {
            var row = $(this).children('ul');

            var type = row.children('li.type').text();
            type = type.replace(/^\s\s*/, '').replace(/\s\s*$/, '');

            if ( row.hasClass('header') ) {
                // Do nothing, ignore the header row.
            }
            else {
                var name = rowName( row );
                var val = rowValue( row );
            }

            if (type == 'list-only') {
                var test =  rowValue(row);
                obj = test;
            }
            else {
                $.extend(obj, createSimpleObject(name, val));
            }
        });

        return obj;
    }

    function handleCollection( elements ) {
        // Collect information of all collection elements
        var collectionsArray = [];
        // What are the children I'm getting? Rows.
        // Represented as li > ul, where the ul is the row wrapper over the row cells.
        elements.children().each( function (event) {
            var val = rowValue( $(this) );
            var name = rowName( $(this) );
            var attr = $(this).parent().attr('class');
            // This is to ignore the row which contains the minimize collection
            // button.
            if ( attr != '' &&  undefined != attr && undefined !== val ) {
                collectionsArray.push({ 'name': name, 'value': val, 'class': attr });
            }
        });

        return createCollectionValue( collectionsArray );
    }

    function handleObject( elements ) {
        // Collect all of the properties and property values for the object
        // elements.
        var tempObj = {};
        // What are the children I'm getting? Rows.
        // Represented as li > ul, where the ul is the row wrapper over the row cells.
        elements.children().each( function (event) {
            var val = rowValue( $(this) );
            var name = rowName( $(this) );

            $.extend(tempObj, createSimpleObject(name, val));
        });

        return tempObj;
    }

    function handleList ( elements ) {
        // Unlike handleObject and HandleCollection, handleList gets the set of
        // 'li' elements that contain values to be processed. rowValue is not
        // needed here, provided that only the basic input types are present
        // (string/integer/enumerated).
        //
        // Collect information of all list elements
        var collectionsArray = [];
        elements.children().each( function (event) {
            var val = formatValue($(this).val());
            if (val) {
                collectionsArray.push( val );
            }
        });

        return collectionsArray;
    }

    function rowName( row ) {
        return name = row.children('li.name') .text();
    }

    function rowValue( row ) {
        var type = row.children('li.type').text();
        type = type.replace(/^\s\s*/, '').replace(/\s\s*$/, '');

        // '' option for list type, where parameter fields do not have an
        // associated type field. Could add type field back and not have this
        // problem. Or the ''== type can be the final else clause.
        if (type == 'boolean' || type == 'enumerated' || type == 'string' || type == 'integer' || type == '') {
            var val;
            val = row.children('li.parameter')
                .children('input, select')
                .val();

            if (val != '') {
                return formatValue(val);
            }
        }

        else if (type == 'collection' || type == 'object' ) {
            var paramList  = row.children('li.parameter').children('ul.parameters');
            return handleTable(paramList, type);
        }
        else if (type == 'list' || type == 'list-only') {
            var paramList  = row.children('li.parameter').children('ul');
            return handleTable(paramList, type);
        }
    }

    function createCollectionValue( collectionsArray ) {
        var currentObj = '',
            tempObj = {},
            collectionValue = [];

        for ( var i = 0; i < collectionsArray.length; i++ ) {
            var name = collectionsArray[i]['name'];
            var value = collectionsArray[i]['value'];
            
            // Creating an object with all of its properties and values.
            if ( collectionsArray[i]['class'] == currentObj ) {
                $.extend(tempObj, createSimpleObject(name, value));
            }
            // A new/different object has been found, push the current object
            // on to an array saving completed objects, and setup a new object.
            else {
                currentObj = collectionsArray[i]['class'];
                if (Object.keys( tempObj ).length !== 0) {
                    // In the future: check tempObj against schema before adding
                    collectionValue.push(tempObj);
                    tempObj = {};
                }
                tempObj = createSimpleObject(name, value);
            }

            // Handle a 1 object collection, or the last object in the collection.
            if ( i == collectionsArray.length - 1 ) {
                if (Object.keys( tempObj ).length !== 0) {
                    // In the future: check tempObj against schema before adding
                    collectionValue.push(tempObj);
                }
            }
        }

        return collectionValue;
    }
    // Take collected information (collectionsArray), and create an array of objects
    // that will be displayed as the value for the collection-owner parameter.
    //
    // [                                                    [
    //    {                                                    {
    //       name: 'id',                                          'id':324,
    //       value: '324',                                        'enabled':false
    //       class: 'collection-new-2'                         },
    //    },                                                   {
    //    {                               -> becomes ->           'id':8934,
    //       name: 'enabled',                                     'enabled':true
    //       value: 'false',                                   }
    //       class: 'collection-new-2'                      ]
    //    },                                         
    //    {
    //       name: 'id',
    //       value: '8934',
    //       class: 'collection-new-3'
    //    },
    //    {
    //       name: 'enabled',
    //       value: 'true',
    //       class: 'collection-new-3'
    //    }
    //  ]

    function createSimpleObject( name, value ) {
        var tempObj = {};
        tempObj[name]= value;
        return tempObj;
    }

    function formatValue( value ) {
        if ( value == 'value' || value == 'true' ) { 
            return true;
        }
        else if ( value == 'false' ) {
            return false;
        }
        // Should probably add a seperate check to see if its a number type to
        // begin with
        else if ( /^\d+$/.test(value) ) {
            return parseInt(value);
        }
        else {
            return value;
        }
    }
    // This function makes it so that 'true', 'false', and 'integer' values will
    // not show up as strings (encased in quotation marks). formatValue()
    // was originally intended just for 'select' elements, but has been modified 
    // to affect 'input' elements as well. This doesn't seem a bad thing, will
    // reconsider with input.

    function updateTextArea( element, dataObject ) {
        // Determine the text area to which this parameter belongs
        var goal = element.closest('li.method')
                        .children('form')
                        .children('div.content')
                        .children('div.fields')
                        .children('textarea');

        // Update the text field
        goal.val(JSON.stringify(dataObject, null, 2));
    }

    //
    // Adding new collections to the page
    // 
    
    /*
        Docs, need docs.      
    */
    $('li.name').on('click', 'a.add-collection, a.add-list', function( event ) {
        event.stopPropagation();
        if ( $(this).hasClass('add-collection') ) {

            var collectionClass = $(this).parent()
                                .siblings('li.parameter')
                                .children('ul.parameters')
                                .children(':first')
                                .attr('class');

            collectionClass = collectionClass.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
            
            var collectionBody = $(this).parent()
                                .siblings('li.parameter')
                                .children('ul.parameters')
                                .clone(true, true);

            // Obtain identifier class of the current last element in the list of
            // collections
            var lastRow = $(this).parent().siblings('li.parameter')
                .children('ul.parameters')
                .children()
                .last();

            // Determine the numeric identifier from the class, then increment and
            // pass on value
            var collectionCount = 0;
            if (lastRow.hasClass('collection-original')) { 
                collectionCount = 1;
            }
            else {
                collectionCount = parseInt(lastRow.attr('class').replace(/collection-new-/g, ''));
                collectionCount++;
            }

            newCollectionObject(collectionBody, collectionClass, collectionCount);

            $(this).parent().siblings('li.parameter')
                        .children('ul.parameters')
                        .append(collectionBody.children());
        }
        else if ( $(this).hasClass('add-list') ){
            // Get the 'ul' element in li.parameter for this 'list' type row.
            var listElement = $(this).parent().siblings('li.parameter').children('ul');
            // Make a copy of the first list element, and then append that to the end of the list.
            var firstListElement = listElement.children().first().clone();
            firstListElement.appendTo(listElement);
        }
    });

    // What should collectionBody be? li elements from ul.parameters
    function newCollectionObject(collectionBody, collectionClass, collectionCount) {
        // Rows
        collectionBody.children().each(function() {
            var type = $(this).children('ul').children('li.type').text();
            type = type.replace(/^\s\s*/, '').replace(/\s\s*$/, '');


            if (!$(this).hasClass(collectionClass)) {
                $(this).remove();
            }
            else {
                $(this).removeClass(collectionClass);
                $(this).addClass('collection-new-'+collectionCount);
                if (type == 'collection') {
                    newCollectionObject($(this).children('ul.collection')
                                        .children('li.parameter')
                                        .children('ul.parameters'),
                                          collectionClass,
                                          collectionCount
                                        );
                }
            }
        });
    }

    //
    // Minimize functionality for collections and lists
    // 
    $('li').on("click", "a.collection-minimize, a.list-minimize", function(event) {
        event.stopPropagation();
        // Get the class of the following row
        var minimize_class = $(this).parent().parent().parent().next().attr('class');
        // Object case
        if (minimize_class === undefined) {
            $(this).parent().parent().parent().siblings().slideToggle();
        }
        // Collection case
        else {
            // trim whitespace
            minimize_class = minimize_class.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
            // Minimize all following rows of the same class.
            $(this).parent().parent().parent().siblings('.' + minimize_class).slideToggle();
        }
        // Rotating the minimize button
        if ($(this).parent().hasClass('rotate')) {
            $(this).parent().removeClass('rotate');
        }
        else {
            $(this).parent().addClass('rotate');
        }
    });
})();
