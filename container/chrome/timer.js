;(function(HostAdmin){
		var host_admin = HostAdmin.core;
		var host_file_wrapper = HostAdmin.host_file_wrapper;
    host_admin.refresh();
    var upRacaljkHosts = function(){

        get("https://api.github.com/repos/racaljk/hosts/commits", function(xhr) {

            var log = {
                time: new Date().toLocaleString(),
                getHost: false,
                saveHost: false,
            };

            try {
                var resp = JSON.parse(xhr.responseText);
                log.getHost = true;
                chrome.storage.local.get('githubShaXXX', function (items) {
                    log.commitSha = typeof items.githubShaXXX == 'undefined' ? 'xx' : items.githubShaXXX;
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

    upRacaljkHosts();
    setInterval(function () {
        upRacaljkHosts();
    }, 1000 * 60 *10);

})(window.HostAdmin);

function get(url, func) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function() {
        func(xhr);
    }
    xhr.send();
}
