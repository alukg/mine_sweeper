import $ from 'jquery';

$(".centerMe").click(function(){
    if($(this).hasClass("confirm")){
        $(this).addClass("done");
        $(".centerMe span").text("Starting");
        setTimeout(function(){
            $(".centerMe").removeClass("confirm").removeClass("done");
            $(".centerMe span").text("New Game");
        }, 1200);
    } else if(!$(this).hasClass("done")) {
        $(this).addClass("confirm");
        $(".centerMe span").text("Are you sure?");
    }
});

// Reset
$(".centerMe").on('mouseout', function(){
    if($(this).hasClass("confirm")){
        setTimeout(function(){
            $(".centerMe").removeClass("confirm").removeClass("done");
            $(".centerMe span").text("New Game");
        }, 3000);
    }
});

$(".super-mode").click(function () {
    if($(this).hasClass("off"))
        $(this).removeClass("off").addClass("on");
    else
        $(this).removeClass("on").addClass("off");
});