chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "saveCurrentWindow") {
        saveCurrentWindow(request.folderName, sendResponse);
    } else if (request.action === "saveAllWindows") {
        saveAllWindows(request.folderName, sendResponse);
    }
    return true;
});

function saveCurrentWindow(folderName, sendResponse) {
    chrome.windows.getCurrent({populate: true}, (window) => {
        if (window.tabs.length > 2) {
            chrome.bookmarks.create({"title": folderName}, (mainWindowFolder) => {
                saveTabs(window.tabs, mainWindowFolder.id);
                sendResponse({status: "success"});
            });
        } else {
            sendResponse({status: "tooFewTabs"});
        }
    });
}

function saveAllWindows(folderName, sendResponse) {
    chrome.windows.getAll({populate: true}, (windows) => {
        chrome.bookmarks.create({"title": folderName}, (allWindowsFolder) => {
            windows.forEach((window, index) => {
                let windowFolderName = `Window ${index + 1}`;
                chrome.bookmarks.create({
                    "parentId": allWindowsFolder.id,
                    "title": windowFolderName
                }, (windowFolder) => {
                    saveTabs(window.tabs, windowFolder.id);
                });
            });
            sendResponse({status: "success"});
        });
    });
}

function saveTabs(tabs, parentId) {
    tabs.forEach((tab) => {
        chrome.bookmarks.create({
            "parentId": parentId,
            "title": tab.title,
            "url": tab.url
        });
    });
}
