chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Message received in background script:", request.action);

    if (request.action === "saveCurrentWindow") {
        chrome.windows.getCurrent({populate: true}, (window) => {
            console.log("Current window tabs:", window.tabs);

            if (window.tabs.length > 2) {  // This condition can be removed for testing
                chrome.bookmarks.create({"title": "Main window"}, (mainWindowFolder) => {
                    window.tabs.forEach((tab) => {
                        chrome.bookmarks.create({
                            "parentId": mainWindowFolder.id,
                            "title": tab.title,
                            "url": tab.url
                        });
                    });
                    sendResponse({status: "success"});
                });
            } else {
                sendResponse({status: "tooFewTabs"});
            }
        });
    } else if (request.action === "saveAllWindows") {
        chrome.windows.getAll({populate: true}, (windows) => {
            console.log("All windows tabs:", windows);

            chrome.bookmarks.create({"title": "All windows"}, (allWindowsFolder) => {
                windows.forEach((window, index) => {
                    let windowFolderName = `Window ${index + 1}`;
                    chrome.bookmarks.create({
                        "parentId": allWindowsFolder.id,
                        "title": windowFolderName
                    }, (windowFolder) => {
                        window.tabs.forEach((tab) => {
                            chrome.bookmarks.create({
                                "parentId": windowFolder.id,
                                "title": tab.title,
                                "url": tab.url
                            });
                        });
                    });
                });
                sendResponse({status: "success"});
            });
        });
    }
    return true; // Keeps the message channel open for sendResponse
});
