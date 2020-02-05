import Swiper from 'swiper';
import $ from 'jquery'
function wheelPlanting() {
        var mySwiper = new Swiper(".swiper-container", {
        disabledClass: 'my-button-disabled',
        mousewheel: true,
        autoplay:true,
       // 如果需要前进后退按钮
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
            },
        keyboard: {
            enabled: true,
            onlyInViewport: true,
                },
         });
}
function play(){
    var mySwiper = new Swiper(".swiper-container", {
         speed:100,
       });
    $(".closeautoplay").hide();
    $(".openautoplay").show();
    $(".openautoplay").click(function(){
        mySwiper.autoplay.start();
        $(".closeautoplay").show();
        $(".openautoplay").hide();
    })
    $(".closeautoplay").click(function(){
        mySwiper.autoplay.stop();
        $(".closeautoplay").hide();
        $(".openautoplay").show();
    })
}
export {
    wheelPlanting,
    play
}