run_from_glue(function(HostAdmin){
    var host_admin = HostAdmin.core;
    var host_file_wrapper = HostAdmin.host_file_wrapper;
    var logLoaded = [];
    var load = function () {

        if (host_file_wrapper.write_able() != true) {
            return false;
        }

        chrome.runtime.getPlatformInfo(function(platformInfo){
            $('#tips code').eq(0).text(platformInfo.os);
            var wrt = host_file_wrapper.write_able() == true ? '可写' : '不可写，请设置文件权限'
            $('#tips code').eq(1).text(wrt);
        });

        chrome.storage.local.get('lastSuccesslog', function (items) {
            if (items == {}) return;
            var eq2 = '没有更改';
            try {
                if (items.lastSuccesslog.saveHost == true) {
                    var eq2 = items.lastSuccesslog.time + ' 更新成功，可尝试访问<a target="_blank" href="https://www.google.com/ncr">Google</a>';
                };
            } catch(e) {}
            $('#tips code').eq(2).html(eq2);
            displayLog(items.lastSuccesslog, 'success');
        });
        chrome.storage.local.get('log', function (items) {
            if (items == {}) return;
            if (typeof items.log == 'undefined') return;
            items.log.map(function(elem, index) {
                displayLog(elem);
                return;
            })
        });

        function displayLog(elem, res) {
            if (typeof elem == 'undefined') return;
            var has = logLoaded.some(function (item, index, array) {
                return item == elem.time;
            });
            if (has) return;
            if (typeof elem.time != 'undefined') {
                logLoaded.push(elem.time);
            }
            var desc = elem.getHost == true ? (
                    elem.saveHost === true ? '更新成功' :
                    (
                        elem.saveHost === false ? '更新失败' : '无需更新'
                    )
                ) : '获取host失败';
            var tr = `<tr> <td> <code>${desc}</code> </td> <td>${elem.time}</td> </tr>`;
            if (res == 'success') {
                $('#saveHostLog').prepend(tr);
            } else {
                $('#saveHostLog').append(tr);
            }
            return;
        }
    }
    load();
    setInterval(function(){
        load();
    }, 5000);

    // chrome only button
    $("#update_googlehost").click(function(){
        upGoogleHosts(host_admin, true);
        load();
    });
    $("#btnChoose").click(function(){
        $("#choosehost").modal('hide')
        chrome.fileSystem.chooseEntry({type: 'openWritableFile'}, function(host_entry){
            if(host_entry){
                host_entry.file(function(file){
                    if(file.name == "hosts"){
                        chrome.storage.local.set({'hostentry': chrome.fileSystem.retainEntry(host_entry)});
                        host_file_wrapper.refresh_file(function(){});
                        upGoogleHosts(host_admin);
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
