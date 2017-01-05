;(function(HostAdmin){
	var host_admin = HostAdmin.core;
    var host_file_wrapper = HostAdmin.host_file_wrapper;

    var upRacaljkHosts = function(){
        if (host_file_wrapper.write_able() == false) {
            console.log(host_file_wrapper.write_able(), host_file_wrapper.get())
            return;
        }
        get("https://api.github.com/repos/racaljk/hosts/commits", function(xhr) {
            if (xhr.readyState != 4) return;

            var log = {
                time: new Date().toLocaleString(),
                getHost: false,
                saveHost: false,
            };

            try {
                var resp = JSON.parse(xhr.responseText);
                log.getHost = true;
                chrome.storage.local.get('githubShaXXX', function (items) {
                    if (typeof items.githubShaXXX == 'undefined') {
                        console.log(host_admin.load());
                        return;
                    }
                    log.commitSha = items.githubShaXXX;
                    if (resp[0].sha != log.commitSha) {
                        get("https://raw.githubusercontent.com/racaljk/hosts/master/hosts", function (xhrh) {
                            if (xhrh.readyState != 4) return;
                            log.saveHost = host_admin.save(xhrh.responseText);
                            if (log.saveHost == true) {
                                chrome.storage.local.set({'lastSuccesslog': log});
                                chrome.storage.local.set({'githubShaXXX': resp[0].sha});
                            }
                        })
                    }
                });
            } catch(e) {};

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

    upRacaljkHosts();
    setInterval(function () {
        upRacaljkHosts();
    }, 5000);

})(window.HostAdmin);

function get(url, func) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function() {
        func(xhr);
    }
    xhr.send();
}