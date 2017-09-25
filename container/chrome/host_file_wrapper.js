;(function (HostAdmin) {

    var os = null;

    chrome.runtime.getPlatformInfo(function(platformInfo){
        os = platformInfo.os;
    });

    var pending_read = "";
    var pending_write = null;
    var modified_time = 0;

    var host_entry = null;

    var write_able = false;

    // SUCKS
    var write_error = false;

    var refresh_file = function(cb){
        chrome.storage.local.get('hostentry', function (items) {
            if (items.hostentry) {
                chrome.fileSystem.isRestorable(items.hostentry, function (bIsRestorable) {
                    chrome.fileSystem.restoreEntry(items.hostentry, function (entry) {
                        host_entry = entry;
                        chrome.fileSystem.isWritableEntry(host_entry, function(isWritable){
                            write_able = isWritable;
                            cb();
                        });
                    });
                });
            }
        });

    }

    refresh_file(function(){});

    var refresh_read = function(cb){
        if(host_entry){
            host_entry.file(function(file){
                var reader = new FileReader();

                reader.onload = function (e) {
                    modified_time = file.lastModifiedDate.getTime();
                    pending_read = e.target.result;
                };

                reader.readAsText(file);

            });
        }

    }

    var refresh_write = function(cb){
        if(host_entry && pending_write){
            write_error = false;
            host_entry.createWriter(function(writer){

                writer.onerror = function(e){
                    console.log(e.currentTarget.error.message)
                    write_able = false;
                    write_error = true;
                }
                writer.onwriteend = function(){
                    if(pending_write){
                        this.truncate(this.position);
                    }
                    pending_write = null;
                    cb();
                };

                writer.write(pending_write);

            });
        }else {
            cb();
        }
    }

    var refresh = function(cb){
        refresh_file(function(){
            refresh_write(function(){
                refresh_read();
                cb();
            });
        })
    };

    HostAdmin.host_file_wrapper = {
        get: function () {
            return pending_read;
        },
        set: function (data) {
            if (os == "win") {
                data = data.replace(/([^\r])\n/g, "$1\r\n");
            }

            pending_write = new Blob([data], {type: 'text/plain;charset=UTF-8'});;
            refresh(function(){});

            return this.pending_write();
        },
        pending_write : function(){
            return write_able && pending_write !== null && !write_error;
        },
        write_able: function () {
            return write_able;
        },
        time: function () {
            return modified_time;
        },
        splitchar: '\n',
        choosed : function(){
            return host_entry != null;
        },
        refresh_file : refresh_file,

        _refresh : refresh
    };
})(window.HostAdmin);
