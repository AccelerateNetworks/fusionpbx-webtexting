export class CPIM {
    headers: Record<string, string>;
    filename: string;
    fileSize: number;
    fileContentType: string;
    fileURL: string;

    constructor() {
        this.headers = {};
    }

    static fromString(raw: string): CPIM {
        let cpim = new CPIM();

        let parts = raw.split("\n\n");
        cpim.addHeaders(parts[0]);
        cpim.addHeaders(parts[1]);

        const parser = new DOMParser();
        const doc = parser.parseFromString(parts[2], "application/xml");
        
        let fileSize = doc.querySelector('file-size');
        if(fileSize) {
            cpim.fileSize = Number(fileSize.textContent);
        }

        let filename = doc.querySelector('file-name');
        if(filename) {
            cpim.filename = filename.textContent;
        }

        let contentType = doc.querySelector('content-type');
        if(contentType) {
            cpim.fileContentType = contentType.textContent;
        }

        let data = doc.querySelector('data');
        if(data && data.getAttribute("url")) {
            cpim.fileURL = data.getAttribute("url");
        }

        return cpim;
    }

    private addHeaders(headers: string) {
        for (const line of headers.split("\n")) {
            let parts = line.split(":", 2);
            if(parts.length < 2) {
                continue;
            }
            
            this.headers[parts[0].toLowerCase()] = parts[1].trim();
        }
    }
}
