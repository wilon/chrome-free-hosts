run_from_glue(function(HostAdmin){
    var host_admin = HostAdmin.core;
    var host_file_wrapper = HostAdmin.host_file_wrapper;
    console.log(host_admin.load())
    var logLoaded = [];
    var load = function () {
        chrome.runtime.getPlatformInfo(function(platformInfo){
            $('#tips code').eq(0).text(platformInfo.os);
            var wrt = host_file_wrapper.write_able() == true ? '可写' : '不可写，请设置文件权限'
            $('#tips code').eq(1).text(wrt);
        });
        chrome.storage.local.get('lastSuccesslog', function (items) {
            var eq2 = '没有更改';
            if (items.lastSuccesslog.saveHost == true) {
                var eq2 = items.lastSuccesslog.time + ' 更新成功，可尝试访问<a target="_blank" href="https://www.google.com/ncr">Google</a>';
            };
            $('#tips code').eq(2).html(eq2);
            displayLog(items.lastSuccesslog);
        });
        chrome.storage.local.get('log', function (items) {
            if (typeof items.log == 'undefined') return;
            items.log.map(function(elem, index) {
                displayLog(elem);
                return;
            })
        });

        function displayLog(elem) {
            var has = logLoaded.some(function (item, index, array) {
                return item == elem.time;
            });
            if (has) return;
            logLoaded.push(elem.time);
            var desc = elem.getHost == true ? (elem.saveHost == true ? '更新成功' : '无需更新') : '获取host失败';
            var tr = `<tr> <td> <code>${desc}</code> </td> <td>${elem.time}</td> </tr>`;
            $('#saveHostLog').append(tr);
            return;
        }
    }
    load();
    setInterval(function(){
        load();
    }, 5000);

    // chrome only button
    $("#btnChoose").click(function(){
        $("#choosehost").modal('hide')
        chrome.fileSystem.chooseEntry({type: 'openWritableFile'}, function(host_entry){
            if(host_entry){
                host_entry.file(function(file){
                    console.log(host_entry, chrome.fileSystem.retainEntry(host_entry))
                    if(file.name == "hosts"){
                        chrome.storage.local.set({'hostentry': chrome.fileSystem.retainEntry(host_entry)});
                        host_file_wrapper.refresh_file(function(){});
                    }else{
                        $("#choosehost").modal('show')
                    }
                });
            }else{
                $("#choosehost").modal('show');
            }
        })
    });

    if(host_file_wrapper.choosed && !host_file_wrapper.choosed()){
        $("#choosehost").modal('show');
    }
});
