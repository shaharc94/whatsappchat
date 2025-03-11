document.getElementById("fileInput").addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function() {
        // חילוץ נתונים מתוך ZIP
        const zip = new JSZip()
        zip.loadAsync(reader.result).then(function(zip) {
            return zip.file("_chat.txt").async("text");
        }).then(function(text) {
            parseChat(text);
        });
    };
    reader.readAsArrayBuffer(file);
});

// פירוק קובץ הצ'אט והצגתו
function parseChat(chatText) {
    const chatBox = document.getElementById("chatBox");
    chatBox.innerHTML = "";

    const lines = chatText.split("\n");
    const pattern = /\[(\d{1,2}\/\d{1,2}\/\d{4}, \d{1,2}:\d{2}:\d{2})\] (.*?): (.*)/;

    lines.forEach(line => {
        const match = line.match(pattern);
        if (match) {
            const timestamp = match[1];
            const sender = match[2];
            const message = match[3];

            const messageElement = document.createElement("div");
            messageElement.classList.add("message");
            messageElement.classList.add(sender.includes("Shahar") ? "sent" : "received");
            messageElement.innerHTML = `<strong>${sender}:</strong> ${message} <div class="timestamp">${timestamp}</div>`;
            chatBox.appendChild(messageElement);
        }
    });

    chatBox.scrollTop = chatBox.scrollHeight; // גלילה אוטומטית למטה
}
