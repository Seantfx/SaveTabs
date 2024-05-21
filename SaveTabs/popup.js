document.getElementById('save-current-window').addEventListener('click', () => {
    console.log("Save only this window button clicked");

    chrome.runtime.sendMessage({action: "saveCurrentWindow"}, (response) => {
        console.log("Response received for saving current window:", response);

        if (response.status === "success") {
            let button = document.getElementById('save-current-window');
            button.textContent = "All saved!";
            setTimeout(() => {
                window.close();
            }, 3000);
        } else if (response.status === "tooFewTabs") {
            console.log("Too few tabs to save");
        }
    });
});

document.getElementById('save-all-windows').addEventListener('click', () => {
    console.log("Save all open windows button clicked");

    chrome.runtime.sendMessage({action: "saveAllWindows"}, (response) => {
        console.log("Response received for saving all windows:", response);

        if (response.status === "success") {
            let button = document.getElementById('save-all-windows');
            button.textContent = "All saved!";
            setTimeout(() => {
                window.close();
            }, 3000);
        }
    });
});
