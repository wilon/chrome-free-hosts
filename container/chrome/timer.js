;(function(HostAdmin){
	var host_admin = HostAdmin.core;
    var host_file_wrapper = HostAdmin.host_file_wrapper;

    setInterval(function(){
        get("https://api.github.com/repos/racaljk/hosts/commits", function(xhr) {
            if (xhr.readyState == 4) {
                try {
                    var resp = JSON.parse(xhr.responseText);
                    console.log(resp[0].sha, chrome.storage.local['githubShaAb'])
                    if (resp[0].sha != chrome.storage.local['githubShaAb']) {
                        get("https://raw.githubusercontent.com/racaljk/hosts/master/hosts", function (xhrh) {
                            if (xhrh.readyState == 4) {
                                host_admin.save(xhrh.responseText);
                                // chrome.storage.local['githubShaAb'] = resp[0].sha;
                            }
                        })
                    }
                } catch(e) {
                    console.error(e);
                }
            }
        })
    }, 10000)

})(window.HostAdmin);

function get(url, func) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function() {
        func(xhr);
    }
    xhr.send();
}