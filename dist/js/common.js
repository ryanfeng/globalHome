(function ($) {
    $.fn.scrollLoading = function (options) {
        var defaults = {
            image: true,
            container: window,
            callback: $.noop,
            attr: "data-url"
        };

        var params = $.extend({}, defaults, options || {});
        // 把父元素转为jquery对象；
        var container = $(params.container);
        // 新建一个数组，然后调用each方法，用于存储每个dom对象相关的数据；
        params.cache = [];
        $(this).each(function () {
            // 取出jquery对象中每个dom对象的节点类型，取出每个dom对象上设置的图片路径
            var node = this.nodeName.toLowerCase(),
                className = $(this).attr('class'),
                url = $(this).attr(params["attr"]);
            //重组，把每个dom对象上的属性存为一个对象；
            var data = {
                obj: $(this),
                tag: node,
                url: url,
                className: className
            };
            // 把这个对象加到一个数组中；
            params.cache.push(data);
        });

        var callback = function (call) {
            if ($.isFunction(params.callback)) {
                params.callback.call(call);
            }
        };

        //每次触发滚动事件时，对每个dom元素与container元素进行位置判断，如果满足条件，就把路径赋予这个dom元素！
        var loading = function () {
            // 获取父元素的高度
            var contHeight = container.outerHeight();
            var contWidth = container.outerWidth();

            // 获取父元素相对于文档页顶部的距离，这边要注意了，分为以下两种情况；
            if (container.get(0) === window) {
                // 第一种情况父元素为window，获取浏览器滚动条已滚动的距离；$(window)没有offset()方法；
                var contop = $(window).scrollTop();
                var conleft = $(window).scrollLeft();
            } else {
                // 第二种情况父元素为非window元素，获取它的滚动条滚动的距离；
                var contop = container.offset().top;
                var conleft = container.offset().left;
            }

            $.each(params.cache, function (i, data) {
                var o = data.obj,
                    tag = data.tag,
                    url = data.url,
                    post, posb, posl, posr;
                if (o) {
                    //对象顶部与文档顶部之间的距离，如果它小于父元素底部与文档顶部的距离，则说明垂直方向上已经进入可视区域了；
                    post = o.offset().top - (contop + contHeight);
                    //对象底部与文档顶部之间的距离，如果它大于父元素顶部与文档顶部的距离，则说明垂直方向上已经进入可视区域了；
                    posb = o.offset().top + o.height() - contop;

                    // 水平方向上同理；
                    posl = o.offset().left - (conleft + contWidth);
                    posr = o.offset().left + o.width() - conleft;

                    // 只有当这个对象是可视的，并且这四个条件都满足时，才能给这个对象赋予图片路径；
                    if (o.is(':visible') && (post < 0 && posb > 0) && (posl < 0 && posr > 0)) {
                        if (params.image) {
                            if (url) {
                                if (tag === "img") {
                                    //设置图片src
                                    callback(o.attr("src", url));
                                } else {
                                    // 设置除img之外元素的背景url
                                    callback(o.css("background-image", "url(" + url + ")"));
                                }
                            } else {
                                // 无地址，直接触发回调
                                callback(o);
                            }
                        } else {
                            callback(o.css({'opacity': 1}));
                        }
                        // 给对象设置完图片路径之后，把params.cache中的对象给清除掉；对象再进入可视区，就不再进行重复设置了；
                        data.obj = null;
                    }
                }
            });
        };
        //加载完毕即执行
        loading();
        //滚动执行
        container.bind("scroll", loading);
    };
})(jQuery);

$('html').css("font-size", $(window).width()*20/375);
/**
 * Created by apple on 16/9/22.
 */
(function () {
    //字体和图片的懒加载效果
    //内容模块
    $('.con-ft-block').scrollLoading({image: false});
    $('.con-ft-sm').scrollLoading({image: false});
    $('.con-ft-sm-two').scrollLoading({image: false});
    //背景图
    $('.xf-con').scrollLoading();
    $('.jf-con').scrollLoading();
    $('.s1-con').scrollLoading();
    $('.school-con').scrollLoading();
    $('.bus-con').scrollLoading();
    $('.home-img').scrollLoading();
    //图片
    $('.data-img').scrollLoading();

    //手机端头部展开事件
    if ($(window).width() < 768) {
        //头部导航展开效果
        $(".hd_dropdown").click(function () {
            if ($(".dropdown-menu").css('height') == '0px') {
                $(".dropdown-menu").css('animation', 'opacity-b linear .3s').css('height', '140px');
            } else {
                $(".dropdown-menu").css('animation', 'opacity-d linear .3s').css('height', '0');
            }
        });

        //手机版本头部导航插件的修改
        $('#navbar').on('hidden.bs.collapse', function () {
            $(".dropdown-menu").css('animation', '').css('height', '0');
            isShowAll = true;
            $(".showAll").removeClass('glyphicon-minus').addClass('glyphicon-plus');
        });

        //手机头部导航产品的展开和收起效果
        var isShowAll = true;
        $(".hd_dropdown").click(function () {
            if (isShowAll) {
                isShowAll = false;
                $(".showAll").removeClass('glyphicon-plus').addClass('glyphicon-minus');
            } else {
                isShowAll = true;
                $(".showAll").removeClass('glyphicon-minus').addClass('glyphicon-plus');
            }
        });
    }

    //PC端头部展开滑动效果
    if ($(window).width() >= 768) {
        //头部导航
        $('.hd_dropdown').mouseenter(function () {
            $(this).addClass('nav-item-active');
            $(".dropdown-menu").css('animation', 'opacity-a linear .3s').css('height', '214px');
        });
        $('.hd_dropdown').mouseleave(function () {
            $(this).removeClass('nav-item-active');
            $(".dropdown-menu").css('animation', 'opacity-c linear .3s').css('height', '0');
        });
    }

    //产品模块导航的页面滚动显现
    $(window).scroll(function () {
        if ($(document).scrollTop() > 155) {
            $(".produce-nav-fix").css('margin-top', '0px');
        } else {
            $(".produce-nav-fix").css('margin-top', '-52px');
        }
    });

    //底部微信/微博/QQ等的滑动效果
    $(".about-logo").mouseenter(function () {
        $(this).attr('src', $(this).attr('src').split(".png")[0] + 1 + ".png");
    }).mouseleave(function () {
        $(this).attr('src', $(this).attr('src').split("1.png")[0] + ".png");
    });
    $(".wx-btn").click(function () {
        $("#wx-bg").css("display", 'block');
        // $("#wx").css("display", 'block');
        $("#wx").slideDown(1000);
    });
    $("#wx").click(function () {
        $("#wx-bg").css("display", 'none');
        // $("#wx").css("display", 'none');
        $("#wx").slideUp(500);
    });

    //页面滚动指定位置
    function click_scroll(id) {
        var str = '#' + id;
        var scroll_offset = $(str).offset();  //得到pos这个div层的offset，包含两个值，top和left
        $("body,html").animate({
            scrollTop: scroll_offset.top  //让body的scrollTop等于pos的top，就实现了滚动
        }, 600);
    }

    //页面滚动指定位置
    function click_scroll1(id) {
        var str = '#' + id;
        var scroll_offset = $(str).offset();  //得到pos这个div层的offset，包含两个值，top和left
        $("body,html").animate({
            scrollTop: scroll_offset.top  //让body的scrollTop等于pos的top，就实现了滚动
        }, 2000);
    }

    //移动天气弹出框
    $(".weather-mobile").click(function () {
        $(".weather").show();
    });

    $(".wea-close").click(function () {
        $(".weather").hide();
    });

    //产品头部导航
    $(".nav-class").on('click', function () {
        $('.nav-class').removeClass('active');
        $(this).addClass("active");
    });

    //头部导航数据
    var headerData = {
        home: {
            name: '首页',
            url: '/',
            active: false
        },
        schoolDevice: {
            name: '校园新风',
            url: 'schoolDevice.html',
            active: false
        },
        produce: {
            name: '产品',
            url: 'produce.html',
            active: false
        },
        business: {
            name: '健康屋招商',
            url: 'business.html',
            active: false
        },
        about: {
            name: '关于地球村',
            url: 'about.html',
            active: false
        }

    };
    //底部导航数据
    var footerData = {
        server: {
            name: "服务支持",
            child: [
                {name: '售后服务', url: 'afterService.html'},
                {name: 'App下载', url: 'appDown.html'},
                {name: '常见问题', url: 'question.html'}],
            src: 'afterService.html'
        },
        download: {
            name: "资料下载",
            child: [
                {name: '产品手册', url: 'downFile.html?produce=1'},
                {name: '检测报告', url: 'downFile.html?report=1'}],
            src: 'downFile.html'
        },
        contact: {
            name: "联系我们",
            child: [{name: '商务合作', url: 'business.html?cantrat=1'}],
            src: 'business.html?cantrat=1'
        },
        aboutLink: {
            name: "相关栏目",
            child: [
                {name: '校园新风', url: '/schoolDevice.html'},
                {name: '健康屋', url: '/business.html'},
                {name: '家用新风机', url: '/produceXF.html'}
            ],
            src: 'business.html?cantrat=1'
        }
    };
    if ($(window).width() < 768) {
        footerData.contact.src = 'join.html';
        footerData.contact.child[0].url = 'join.html';
    }
    //页面导航页面的定位
    var pathname = window.location.pathname;
    if ((pathname.indexOf('produceXF') != -1) || (pathname.indexOf('produceJF') != -1) || (pathname.indexOf('produceS1') != -1)) {
        headerData.produce.active = true;
        $(".hd_dropdown").addClass('active');
    }

    $.each(headerData, function (obj) {
        if (pathname.indexOf(obj) != -1) {
            headerData[obj].active = true;
        }
    });

    new Vue({
        el: '.footer',
        data: {
            list: footerData
        }
    });

    new Vue({
        el: '.header',
        data: {
            list: headerData
        }
    });

    //获取url中的参数
    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg);  //匹配目标参数
        if (r != null) return unescape(r[2]);
        return null; //返回参数值
    }

    window.click_scroll = click_scroll;
    window.click_scroll1 = click_scroll1;
    window.getUrlParam = getUrlParam;


    $(".weather").hover(function () {
        $('.wea-arraw').attr('src', './images/home/xl.png');
    });
    $(".weather").mouseleave(function () {
        $('.wea-arraw').attr('src', './images/home/xl1.png');
    });

    var secret = "ts=" + Math.round(new Date().getTime() / 1000) + "&ttl=30&uid=U265706035";
    var sig = encodeURIComponent(CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA1(secret, 'FXUDZ1RWN7')));
    $.ajax({
        type: "get",
        url: "https://api.thinkpage.cn/v3/air/now.json?" + secret + "&sig=" + sig + "&location=ip&language=zh-Hans&scope=city",
        dataType: "jsonp",
        jsonp: "callback",
        jsonpCallback: "showWeather",
        success: function (data) {
            var info = data.results[0];
            if (info.air.city.aqi > 500) {
                info.air.city.aqi = 500;
            }

            $(".weather-mobile label").html(info.air.city.aqi);
            // $(".mo-ricle-base").css('border-color', getWeaColor()[info.air.city.quality][1]);
            $(".mo-ricle").css('background-color', getWeaColor()[info.air.city.quality][1]);
            $(".lo-wz").html(info.location.name + "&nbsp;&nbsp;<span class='wea-num1'>AQI:&nbsp;" + info.air.city.aqi + "</span>&nbsp;&nbsp;<span>" + info.air.city.quality + "</span>");
            $(".w-top-tx").html(info.location.name + "&nbsp;&nbsp;<span>" + info.air.city.last_update.substr(info.air.city.last_update.indexOf("T") + 1, 5) + "&nbsp;发布</span>");
            $(".middle-aqi-num").html(info.air.city.aqi);
            $(".middle-aqi-tx2").html(info.air.city.quality).css('background', getWeaColor()[info.air.city.quality][1]);
            $(".middle-aqi-tx3").html(getWeaColor()[info.air.city.quality][2]);
            $(".w-f-pm25 .w-f-left span").html(info.air.city.pm25);
            $(".w-f-pm25 .w-f-right span").html(Math.ceil(info.air.city.pm25 * 0.01 * 24 * 60));
            $(".w-f-pm10 .w-f-left span").html(info.air.city.pm10);
            $(".w-f-pm10 .w-f-right span").html(Math.ceil(info.air.city.pm10 * 0.01 * 24 * 60));

            getRank(info.location.id);
        }
    });

    function getRank(id) {
        $.ajax({
            type: "get",
            url: "https://api.thinkpage.cn/v3/air/ranking.json?" + secret + "&sig=" + sig + "&language=zh-Hans",
            dataType: "jsonp",
            jsonp: "callback",
            jsonpCallback: "showWeather1",
            success: function (data) {
                var len = data.results.length;
                for (var i = 0; i < len; i++) {
                    if (data.results[i].location.id == id) {
                        $(".middel-rank").html("目前城市排名 " + (i + 1) + "，击败全国 " + (100 - Math.ceil(((i + 1) / len * 100))) + "% 的城市");
                        break;
                    }
                }
            }
        });
    }

    function getWeaColor() {
        return {
            '优': [0, '#4bd964', '温馨提示：可正常外出活动'],
            '良': [50, '#fdce28', '温馨提示：异常敏感人群应减少户外活动'],
            '轻度污染': [100, '#fa8803', '温馨提示：儿童、老年及心肺病患应减少外出'],
            '中度污染': [150, '#fe0405', '温馨提示：适量减少户外活动'],
            '重度污染': [200, '#d10000', '温馨提示：减少户外活动'],
            '严重污染': [300, '#930453', '温馨提示：应避免户外活动']
        }
    }
})();








