/**
 * 下载文件
 * @param {File|Blob} file 
 * @param {string} [fileName = file.name] 
 */
export function downloadFile(file, fileName) {
    const url = URL.createObjectURL(file);
    _downloadUrl(url, fileName);
    URL.revokeObjectURL(url)
}

/**
 * 下载 url 对应文件
 * @param {string} url 
 * @param {string} [fileName = url.split("/").pop()] 
 */
export function downloadUrl(url, fileName) {
    if (!fileName) {
        fileName = url.split("/").pop();
    }
    if (url.startsWith("http")) {
        fetch(url).then((response) => {
            return response.blob();
        }).then(blob => {
            downloadFile(blob, fileName)
        })
        return
    }
    _downloadUrl(url, fileName)
}

function _downloadUrl(url, fileName) {
    const aLink = document.createElement("a");
    aLink.download = fileName;
    aLink.href = url;
    aLink.click();
}

/**
 * 
 * @param {File} file 
 * @returns {Promise<string>}
 */
export function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
    })
}