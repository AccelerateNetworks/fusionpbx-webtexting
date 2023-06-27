var CPIM = /** @class */ (function () {
    function CPIM() {
        this.headers = {};
    }
    CPIM.fromString = function (raw) {
        var cpim = new CPIM();
        var parts = raw.split("\n\n");
        cpim.addHeaders(parts[0]);
        cpim.addHeaders(parts[1]);
        var parser = new DOMParser();
        var doc = parser.parseFromString(parts[2], "application/xml");
        var fileSize = doc.querySelector('file-size');
        if (fileSize) {
            cpim.fileSize = Number(fileSize.textContent);
        }
        var filename = doc.querySelector('file-name');
        if (filename) {
            cpim.filename = filename.textContent;
        }
        var contentType = doc.querySelector('content-type');
        if (contentType) {
            cpim.fileContentType = contentType.textContent;
        }
        var data = doc.querySelector('data');
        if (data && data.getAttribute("url")) {
            cpim.fileURL = data.getAttribute("url");
        }
        return cpim;
    };
    CPIM.prototype.addHeaders = function (headers) {
        for (var _i = 0, _a = headers.split("\n"); _i < _a.length; _i++) {
            var line = _a[_i];
            var parts = line.split(":", 2);
            if (parts.length < 2) {
                continue;
            }
            this.headers[parts[0].toLowerCase()] = parts[1].trim();
        }
    };
    return CPIM;
}());
