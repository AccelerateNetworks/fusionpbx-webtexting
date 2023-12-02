export class CPIM {
    headers: { [id: string]: string};
    filename: string;
    fileSize: number;
    fileContentType: string;
    fileURL: string;
    bodyText?: string;
    previewURL: string;

    constructor(url?: string, contentType?: string) {
        this.headers = {};
        if(url) {
            this.fileURL = url;
        }

        if(contentType) {
            this.fileContentType = contentType;
        }
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

    public serialize(): string {
        const doc = document.implementation.createDocument("", "", null);

        const fileElement = doc.createElement('file');
        fileElement.setAttribute('xmlns', 'urn:gsma:params:xml:ns:rcs:rcs:fthttp');
        fileElement.setAttribute('xmlns:am', 'urn:gsma:params:xml:ns:rcs:rcs:rram');

        const fileInfoElement = doc.createElement('file-info');
        fileInfoElement.setAttribute('type', 'file');
        fileElement.appendChild(fileInfoElement);

        if(this.fileURL) {
            const dataElement = doc.createElement('data');
            dataElement.setAttribute('url', this.fileURL);
            fileElement.appendChild(dataElement);
        }

        if(this.fileContentType) {
            const contentTypeElement = doc.createElement('content-type');
            contentTypeElement.textContent = this.fileContentType;
            fileElement.appendChild(contentTypeElement);
        }

        doc.appendChild(fileElement);

        const body = new XMLSerializer().serializeToString(doc);

        let serialized = "";
        Object.entries(this.headers).forEach((header) => {
            serialized += header[0] + ": " + header[1] + "\n";
        });
        serialized += "\n";

        serialized += 'Content-Type: application/vnd.gsma.rcs-ft-http+xml\n';
        serialized += 'Content-Length: '+body.length+'\n\n';
        serialized += body;

        console.log("serialized CPIM", this, "->", serialized);

        return serialized;
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

    public async getTextBody(): Promise<string|null> {
        if(this.fileContentType != "text/plain") {
            return null;
        }
        let response = await fetch(this.fileURL)
        return await response.text()
    }

    public getHeader(header: string): string|null {
        const key = header.toLowerCase();
        return this.headers[key];
    }
}
