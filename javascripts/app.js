/**
 * Created by mac on 16/8/19.
 */

//通过点击footer部分的按钮 来生成一层阴影和弹出搜索框
$(".foot_container").bind('click',function () {

    var Divshadow = $("<div></div>");
    var extral = $(".extral");

    //给阴影添加样式
    Divshadow.addClass("divShadow");
    $("body").append(Divshadow);

    // console.log(Divshadow);
    // Divshadow.append($(".extral"));

    //同时将原本隐藏的搜索框显示出来
    extral.css("display","block");

    //通过点击阴影来隐藏自身和搜索框
    Divshadow.click(function () {
        hideShadow(Divshadow,extral);
    });


    //同过点击extral中的button按钮来获取天气信息
    $("#btn").click(function () {

        hideShadow(Divshadow,extral);

        //获取搜索框输入信息
        var cityName = $("#name").val();
        // console.log(cityName);

        //正则匹配拼音
        var pattern = /^[a-zA-Z]{1,}$/;
        // console.log(pattern.test(cityName));

        var $head = $(".head");

        if(pattern.test(cityName)){
            //获取城市当天的天气
            $.ajax({
                url:"http://apis.baidu.com/apistore/weatherservice/weather",
                headers:{apikey:"ced205e0cde5295f3f582074bac9776b"},
                data:{citypinyin:cityName},
                dataType:"json",
                success:function (data) {
                    console.log(data);
                    //用拼音获取当天天气
                    pinyinGetTodayWeather(data);

                    getDate("20"+data.retData.date);
                }
            });
        }else{
            // $.ajax({
            //     //获取城市列表
            //     url:"http://apis.baidu.com/apistore/weatherservice/citylist",
            //     headers:{apikey:"ced205e0cde5295f3f582074bac9776b"},
            //     data:{cityname:cityName},
            //     dataType:"json",
            //     success:function (data) {
            //         console.log(data);
            //     }
            //
            // });
            //获取过去7天和未来4天的天气
            $.ajax({
                url:"http://apis.baidu.com/apistore/weatherservice/recentweathers",
                headers:{apikey:"ced205e0cde5295f3f582074bac9776b"},
                data:{cityname:cityName},
                dataType:"json",
                success:function (data) {
                    console.log(data);
                    //用中文获得当天的天气
                    chineseGetTodayWeather1(data);

                    //用中文当前天气状况
                    chineseGetTodayWeather2(data);

                    //未来天气状况
                    chineseGetForecastWeather(data);

                    //获取今天的日期
                    getDate(data.retData.today.date);

                }
            });


            // $.ajax({
            //     url:"http://apis.baidu.com/apistore/weatherservice/cityname",
            //     headers:{apikey:"ced205e0cde5295f3f582074bac9776b"},
            //     data:{cityname:cityName},
            //     dataType:"json",
            //     success:function (data) {
            //         console.log(data);
            //     }
            // });
            //获取城市信息
            //     $.ajax({
            //         url:"http://apis.baidu.com/apistore/weatherservice/cityinfo",
            //         headers:{apikey:"ced205e0cde5295f3f582074bac9776b"},
            //         data:{cityname:cityName},
            //         dataType:"json",
            //         success:function (data) {
            //             console.log(data);
            //         }
            //     });
        }

        function pinyinGetTodayWeather(data) {
            //先清空当前城市的天气
            $head.empty();

            //添加搜索到的天气信息
            var $p1 = $("<p></p>").text(data.retData.city+"市");
            var $p2 = $("<p></p>").text(data.retData.weather);
            var $p3 = $("<p></p>").text(data.retData.temp);
            var $div= $('<div class="head_div"></div>');
            $div.append(judgeWeatherImage(data.retData.weather));
            $head.append($p1);
            $head.append($p2);
            $head.append($p3);
            $head.append($div);
        }

        function chineseGetTodayWeather1(data) {

            //先清空当前城市的天气
            $head.empty();

            //添加搜索到的天气信息
            var $p1 = $("<p></p>").text(data.retData.city+"市");
            var $p2 = $("<p></p>").text(data.retData.today.type);
            var $p3 = $("<p></p>").text(data.retData.today.curTemp);
            var $div= $('<div class="head_div"></div>');
            $div.append(judgeWeatherImage(data.retData.today.type));
            $head.append($p1);
            $head.append($p2);
            $head.append($p3);
            $head.append($div);
        }

        function chineseGetTodayWeather2(data) {
            var midUlFirst = $(".mid ul:nth-child(1) li")
            midUlFirst.empty();
            var $span = $("<span class='today'>今天</span>");
            var $p1 = $("<p></p>").html('<span class="today">今天</span>'+ data.retData.today.week);
            var $p2 = $("<p></p>").text(data.retData.today.hightemp);
            var $p3 = $("<p></p>").text(data.retData.today.lowtemp);
            midUlFirst.append($p1);
            midUlFirst.append($p2);
            midUlFirst.append($p3);
        }

        function chineseGetForecastWeather(data) {
            var midUlSec = $(".mid ul:nth-child(2)");
            midUlSec.empty();
            var i = 0;
            for(var i=0;i<data.retData.forecast.length;i++){
                var $li = $("<li></li>");
                var $lip1=$("<p></p>").text(data.retData.forecast[i].week);
                // var $img = $('<img src="img/lo_06.png" alt="">');
                var $lip2 = $('<p class="weather"><span>'+ data.retData.forecast[i].type +'</span><br><span>'+data.retData.forecast[i].fengli+'</span></p>');
                var $lip3 = $('<p class="temperature"><span>'+data.retData.forecast[i].hightemp+'</span><span>'+data.retData.forecast[i].lowtemp+'</span></p>')
                $li.append($lip1);
                //加入返回的图片
                $li.append(judgeWeatherImage(data.retData.forecast[i].type));
                $li.append($lip2);
                $li.append($lip3);
                midUlSec.append($li);
            }
        }

        function getDate(data) {
            var $p = $('.foot p');
            $p.empty();
            $p.text(data);
        }
    });

});


//隐藏shadow和extral
function hideShadow(Divshadow,extral) {
    Divshadow.css("display","none");
    extral.css("display","none");
}

//通过判断天气 来决定出现天气图片
function judgeWeatherImage(data) {
    var $img;
    if(data == "雷阵雨"){
        return $img = $('<img src="images/lo_21.png" alt="">');
    }else if(data == "多云"){
        return $img = $('<img src="images/lo_06.png" alt="">');
    }else if(data == "多云"){
        return $img = $('<img src="images/lo_03.png" alt="">');
    }else if(data == "大雨"){
        return $img = $('<img src="images/lo_08.png" alt="">');
    }else if(data == "阵雨"){
        return $img = $('<img src="images/lo_11.png" alt="">');
    }else if(data == "中雨"){
        return $img = $('<img src="images/lo_08.png" alt="">');
    }
}
