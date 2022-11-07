window.onload = function() {
    function secondToDate(second) {
        if (!second) {
            return 0;
        }
        var time = new Array(0, 0, 0, 0, 0);
        if (second >= 365 * 24 * 3600) {
            time[0] = parseInt(second / (365 * 24 * 3600));
            second %= 365 * 24 * 3600;
        }
        if (second >= 24 * 3600) {
            time[1] = parseInt(second / (24 * 3600));
            second %= 24 * 3600;
        }
        if (second >= 3600) {
            time[2] = parseInt(second / 3600);
            second %= 3600;
        }
        if (second >= 60) {
            time[3] = parseInt(second / 60);
            second %= 60;
        }
        if (second > 0) {
            time[4] = second;
        }
        return time;
    }

    function setTime() {
        currentTime = secondToDate(((Math.round((new Date().getTime() + 8 * 60 * 60 * 1000) / 1000) - Math.round(new Date(Date.UTC(2022, 09, 2, 10, 24, 0)).getTime() / 1000))));
        currentTimeHtml = currentTime[0] + ' 年 ' + currentTime[1] + ' 天 ' +
            currentTime[2] + ' 时 ' + currentTime[3] + ' 分 ' + currentTime[4] +
            ' 秒 ';
        document.getElementById('LF_Time_ServerRun').innerHTML = currentTimeHtml;
    }
    setInterval(setTime, 1000);

    //------

    const Load_LC_SDK = document.createElement('script');
    Load_LC_SDK.setAttribute('src', 'av-core-mini.js');
    document.getElementsByTagName('body')[0].appendChild(Load_LC_SDK);
    Load_LC_SDK.onload = function() {
        AV.initialize('p1zULfnyH8jIRVaWEDwi9Cml-gzGzoHsz', 'CPlolQCbb1y7SWMsNtciyS2P');
        LiCount_On = AV.Object.extend('LiCount');
        LiCount_Main = new AV.Query(LiCount_On);

        LiCount_Main.equalTo('ID', 'LF_LikeMe');
        LiCount_Main.find({
            success: function(Results) {
                if (Results.length !== 0) {
                    for (var i = 0; i < Results.length; i++) document.getElementById('LF_LikeMe_Show').innerHTML = Results[i].get('count');
                    var num = 0,
                        Star = document.getElementById('LF_LikeMe_Show').innerHTML,
                        t = setInterval(function() {
                            num++;
                            document.getElementById('LF_LikeMe_Show').innerText = num;
                            Star === num && clearInterval(t)
                        }, 50);
                } else {
                    console.log('「LiCount」' + ID + ' has no data!');
                    document.getElementById('LF_LikeMe_Show').innerHTML = 0
                }
            },
            error: function(object, error) {
                console.log('「LiCount」LeanCloud Javascript SDK Error: ' + error.code + ' ' + error.message);
            }
        });

        document.getElementById('LF_LikeMe').addEventListener('click', function() {
            if (LiCount_Lock) return;
            LiCount_Main.find({
                success: function(Results) {
                    if (Results.length > 0) {
                        var licount_ = Results[0];
                        licount_.fetchWhenSave(true);
                        licount_.increment('count');
                        licount_.save(null, {
                            success: function(ResultGet) {
                                document.getElementById('LF_LikeMe_Show').innerHTML = ResultGet.get('count');
                                LiCount_Lock = true;
                                document.getElementById('LF_LikeMe').style.background = 'rgba(152, 89, 89, 0.4)'
                            },
                            error: function(ResultGet, error) { console.log('「LiCount」LeanCloud Javascript SDK Failed to save Visitor num, with error message: ' + error.message) }
                        });
                    } else {
                        var LiCount_On_To = new LiCount_On();
                        LiCount_On_To.set('ID', 'LF_LikeMe_Show');
                        LiCount_On_To.set('count', 1);
                        LiCount_On_To.save(null, {
                            success: function(ResultGet) {
                                document.getElementById('LF_LikeMe_Show').innerHTML = ResultGet.get('count');
                            },
                            error: function(error) { console.log('「LiCount」LeanCloud Javascript SDK Failed to create!') }
                        });
                    }
                },
                error: function(error) {
                    console.log('「LiCount」LeanCloud Javascript SDK Error: ' + error.code + ' ' + error.message);
                }
            });
        }, false);
    }

}
var LiCount_Main, LiCount_On, LiCount_Lock = false;