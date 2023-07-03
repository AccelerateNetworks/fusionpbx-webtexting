async function uploadAttachment(file): Promise<string> {
    const uploadTarget = await fetch("upload.php", {
        method: "POST",
        body: JSON.stringify({ filename: file.name })
    }).then(r => r.json());

    console.log("uploading ", uploadTarget);
    const resp = await fetch(uploadTarget.upload_url, {
        method: "PUT",
        body: await file.arrayBuffer(),
    });

    console.log("uploaded: ", resp);

    return uploadTarget.path;
}

async function uploadText(text: string): Promise<string> {
    const uploadTarget = await fetch("upload.php", {
        method: "POST",
        body: JSON.stringify({ filename: "part-001.txt" })
    }).then(r => r.json());

    const resp = await fetch(uploadTarget.upload_url, {
        method: "PUT",
        body: text,
    });


    return uploadTarget.path;
}

export { uploadText }
