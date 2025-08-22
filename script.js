// Main function
async function fetchToolInfo() {
    const toolName = document.getElementById('toolInput').value.trim();
    const loading = document.getElementById('loading');
    const errorBox = document.getElementById('error');
    const output = document.getElementById('output');

    if (!toolName) {
        showError("⚠️ Please enter a tool name.");
        return;
    }

    try {
        // Show loading spinner
        loading.style.display = 'block';
        errorBox.style.display = 'none';
        output.style.display = 'none';

        // Fetch from Wikipedia API
        const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(toolName)}`);
        if (!res.ok) throw new Error("Tool not found");
        const data = await res.json();

        // Update page with results
        document.getElementById('toolTitle').innerText = data.title;
        document.getElementById('toolDesc').innerText = data.extract;
        document.getElementById('toolImage').src = data.thumbnail?.source || '';
        document.getElementById('toolImage').style.display = data.thumbnail ? 'block' : 'none';

        output.style.display = 'block';

        // Save to history
        addToHistory(data.title);

    } catch (err) {
        showError("❌ Could not fetch information for this tool.");
    } finally {
        // Hide loading
        loading.style.display = 'none';
    }
}

// Error display helper
function showError(msg) {
    const errorBox = document.getElementById('error');
    errorBox.innerText = msg;
    errorBox.style.display = 'block';
    document.getElementById('output').style.display = 'none';
}

// Add to search history
function addToHistory(tool) {
    const historyList = document.getElementById('historyList');
    const li = document.createElement('li');
    li.innerText = tool;
    li.style.cursor = "pointer";
    li.onclick = () => {
        document.getElementById('toolInput').value = tool;
        fetchToolInfo();
    };
    historyList.prepend(li);
}

// Event Listeners
document.getElementById("submitBtn").addEventListener("click", fetchToolInfo);
document.getElementById("toolInput").addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        fetchToolInfo();
    }
});
