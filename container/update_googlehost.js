
function get(url, func) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function() {
        func(xhr);
    }
    xhr.send();
}

var upGoogleHosts = function(HostAdmin_core, force = false){

    get("https://api.github.com/repos/googlehosts/hosts/commits", function(xhr) {

        var log = {
            time: new Date().toLocaleString(),
            getHost: false,
            saveHost: 'no update',
        };

        try {
            var resp = JSON.parse(xhr.responseText);
            log.getHost = true;
            chrome.storage.local.get('githubSha', function (items) {
                log.commitSha = items.githubSha || false;
                if (resp[0].sha != log.commitSha || force === true) {
                    get("https://raw.githubusercontent.com/googlehosts/hosts/master/hosts-files/hosts", function (xhrh) {
                        if (xhrh.readyState != 4) return;
                        // 保存到 hosts 文件
                        log.saveHost = HostAdmin_core.save(xhrh.responseText);
                        console.log(log.saveHost, xhrh.responseText)
                        if (log.saveHost === true) {
                            chrome.storage.local.set({'lastSuccesslog': log});
                            chrome.storage.local.set({'githubSha': resp[0].sha});
                        }
                    })
                }
                console.log(log, resp)
            });
        } catch(e) {
            return;
        };

        chrome.storage.local.get('log', function (items) {
            var localLog = typeof items.log == 'undefined' ? [] : items.log;
            localLog.push(log);
            if (localLog.length > 10) {
                localLog.shift();
            }
            chrome.storage.local.set({'log': localLog});
        });

    });
}