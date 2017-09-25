;(function(HostAdmin){
    var host_admin = HostAdmin.core;
    var host_file_wrapper = HostAdmin.host_file_wrapper;
    host_admin.refresh();

    upGoogleHosts(host_admin);
    setInterval(function () {
        upGoogleHosts(host_admin);
    }, 1000 * 60 * 15);

})(window.HostAdmin);
