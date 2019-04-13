//inspired by Zack Richard's zoom and blur: https://codepen.io/zrichard/details/wEFBd#forks

$(function() {
    zoom = $(".feature").css("background-size");
    zoom = parseFloat(zoom) / 100;
    size = zoom * $(".feature").width();
    $(window).on("scroll", function() {
        fromTop = $(window).scrollTop();
        newSize = size - fromTop / 10;
        if (newSize > $(".feature").width()) {
            $(".feature").css({
                "background-size": newSize,
                "-webkit-filter": "blur(" + 0 + fromTop / 100 + "px)",
                opacity: 1 - (fromTop / $("html").height()) * 1.3
            });
        }
    });
});

$(function() {
    var isChrome =
        /Chrome/.test(navigator.userAgent) &&
        /Google Inc/.test(navigator.vendor);
    var isSafari =
        /Safari/.test(navigator.userAgent) &&
        /Apple Computer/.test(navigator.vendor);

    if (isChrome || isSafari) {
    } else {
        $(".feature").append('<div class="opaque"></div>');
        $(window).on("scroll", function() {
            var opacity = 0.5 + $(window).scrollTop() / 50;
            $(".opaque").css("opacity", opacity);
        });
    }
});
