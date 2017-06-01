/**
 * IE Version Detector
 * 
 * 判断 IE 的版本，为 html 加上特征 class ，方便 css hack
 * 使用方式：在 head 中直接引入
 * 
 * Author: Johnson Phi
 */

(function (doc) {
    var html = document.documentElement;
    var userAgent = navigator.userAgent.toLocaleLowerCase();
    // IE 11 的 userAgent 中没有 msie
    var hasMsie = ~userAgent.indexOf('msie');
    var isIE = hasMsie || ~userAgent.indexOf('trident');
    // console.log(~userAgent.indexOf('msie'), ~userAgent.indexOf('trident'));
    if (!isIE) {
        return setClass('not-ie');
    }
    var _timer = null;
    var IEClasses = {
        // 5: 'ie5 lt-ie11 lt-ie10 lt-ie9 lt-ie8 lt-ie7 lt-ie6',
        6: 'ie6 lt-ie11 lt-ie10 lt-ie9 lt-ie8 lt-ie7',
        7: 'ie7 lt-ie11 lt-ie10 lt-ie9 lt-ie8',
        8: 'ie8 lt-ie11 lt-ie10 lt-ie9',
        9: 'ie9 lt-ie11 lt-ie10',
        10: 'ie10 lt-ie11',
        11: 'ie11'
    };
    function setClass(cls) {
        clearTimeout(_timer);
        _timer = setTimeout(function () {
            html.className += cls;
        }, 1);
    }
    function getIEVersion() {
        // 用于防止因通过IE8+的文档兼容性模式设置文档模式，导致版本判断失效
        var dm = document.documentMode,
            ieVersion = 11;
        if (dm) {
            ieVersion = dm;
        } else {
            ieVersion = /msie (\d{1,2})/.test(userAgent);
            ieVersion = ieVersion && RegExp.$1;
        }
        // console.log(ieVersion);
        return IEClasses[ieVersion] || 'not-ie';
    };
    setClass(getIEVersion());
})(document);