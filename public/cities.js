(function($){
    var searchInput = window.querySelector(input[name="city"]);
    var results = window.querySelector(div.cityresults);
    var cities = JSON.parse(cities);
    var timer;

    searchInput.on('input', function(e){
        window.clearTimeout(timer)
        timer = window.setTimeout(function(){
            var inputValue = searchInput.val();
            inputValue = inputValue.toLowerCase();
            function(matches) {
                var matchHTML = '';

                if(matches.length == 0){
                    results.html('<div>No Cities</div>')
                    $('results').show();
                } else if (inputValue === ''){
                    results.empty().hide();
                } else {
                    $.each(matches, function(i, value){
                        matchHTML += '<div>'+ value+'</div>';
                    });
                    results.html(matchHTML);
                    results.show();
                };
            }
        });
    }, 250)
});

    results.on('mouseover', 'div', function(e){
        $('.highlight').removeClass('highlight');
        $(e.target).addClass('highlight');
    });

    function fillResult(){
        searchInput.val($('.highlight').html());
    }

    results.on('mousedown', fillResult);

    $('body').on('keydown', function(e){
        if (e.which == 40) {
            if( $('.highlight').length == 0) {
                $('.results div:first').addClass('highlight');
            } else {
                $('.highlight').removeClass('highlight').next().addClass('highlight');
            }
        } else if (e.which == 38){
            if( $('.highlight').length == 0) {
                $('.results div:last').addClass('highlight');
            } else {
                $('.highlight').removeClass('highlight').prev().addClass('highlight');
            }
        } else if (e.which == 13) {
            fillResult();
            results.hide();
        }
    })

    searchInput.on('focus',function() {
        if(searchInput.val() !== ''){
            results.show();
        }
    });
    searchInput.on('blur', function(){
        results.hide();
    });

    results.hide();

})(jQuery, cities.json)
