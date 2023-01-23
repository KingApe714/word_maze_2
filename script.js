document.addEventListener('DOMContentLoaded', () => {
    window.addEventListener('orientationchange', function () {
        if (window.innerHeight > window.innerWidth) {
            document.getElementsByTagName('body')[0].style.transform = "rotate(90deg)";
        }
    });

    // console.log('testing');
})