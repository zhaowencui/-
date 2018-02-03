~function($){
    let change = function (example) {
        let {slides:slideAry,activeIndex} = example;
        [].forEach.call(slideAry, (item, index)=> {
            if (index === activeIndex) {
                item.id = 'page' + (activeIndex + 1);
                return;
            }
            item.id = null;
        });
    };
    let mySwiper = new Swiper('.swiper-container', {
        grabCursor : true,
        direction : 'vertical',
        speed:300,
        onInit: change,
        onTransitionEnd: change
    });
    let $music=$('#music');
    let audioBox = $('#audioBox')[0];
//->开始进来先播放
    audioBox.oncanplay = ()=> {
        //->canplay:当前音频可以播放触发的事件
        //资源可能没有加载完成,随播放随加载
        $music.css('display', 'block')
            .addClass('rotate');
    };
    audioBox.play();

    //->点击按钮控制暂停播放
    $music.tap(()=> {
        if (audioBox.paused) {
            //->当前是暂停的:我们让其播放
            audioBox.play();
            $music.addClass('rotate');
            return;
        }
        //->当前是播放的:我们让其暂停
        audioBox.pause();
        $music.removeClass('rotate');
    });
}(Zepto);
