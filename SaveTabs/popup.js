document.getElementById('save-current-window').addEventListener('click', () => {
    let folderName = document.getElementById('folder-name').value || "Main window";
    document.getElementById('feedback').textContent = "Saving...";
    
    chrome.runtime.sendMessage({action: "saveCurrentWindow", folderName}, (response) => {
        handleResponse(response, 'save-current-window');
    });
});

document.getElementById('save-all-windows').addEventListener('click', () => {
    let folderName = document.getElementById('folder-name').value || "All windows";
    document.getElementById('feedback').textContent = "Saving...";
    
    chrome.runtime.sendMessage({action: "saveAllWindows", folderName}, (response) => {
        handleResponse(response, 'save-all-windows');
    });
});

function handleResponse(response, buttonId) {
    if (response.status === "success") {
        document.getElementById(buttonId).textContent = "All saved!";
        document.getElementById('feedback').textContent = "";
        setTimeout(() => {
            window.close();
        }, 3000);
    } else if (response.status === "tooFewTabs") {
        document.getElementById('feedback').textContent = "Too few tabs to save";
    }
}
