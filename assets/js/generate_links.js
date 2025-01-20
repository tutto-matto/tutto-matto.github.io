// Function to parse CSV data into an array of objects
function parseCSV(data) {
    const rows = data.trim().split("\n");
    const headers = rows[0].split(",");
    const entries = rows.slice(1).map(row => {
        const values = row.split(",");
        return headers.reduce((acc, header, index) => {
            acc[header] = values[index];
            return acc;
        }, {});
    });
    return entries;
}

// Generate links dynamically
function generateLinks(data) {
    const container = document.getElementById("links-container");
    data.forEach(entry => {
        // Create link element
        const link = document.createElement("a");
        link.href = `https://tutto-matto.github.io/matto${entry.container}/yr${entry.grade}/${entry.subject}/${entry.task_type}/${entry.file_name}.pdf`;
        link.textContent = entry.paper_name;
        link.target = "_blank";

        // Create download button
        const downloadButton = document.createElement("button");
        downloadButton.textContent = "⬇";
        downloadButton.addEventListener("click", async () => {
            try {
                const response = await fetch(link.href);
                if (!response.ok) throw new Error("Failed to fetch file for download.");
        
                const blob = await response.blob();
                const downloadLink = document.createElement("a");
                downloadLink.href = URL.createObjectURL(blob);
                downloadLink.download = `${entry.file_name}.pdf`;
                downloadLink.click();
        
                URL.revokeObjectURL(downloadLink.href);
            } catch (error) {
                console.error("Error during file download:", error);
            }
        });

        // Create list item
        const listItem = document.createElement("li");
        listItem.appendChild(link);
        listItem.appendChild(downloadButton);
        container.appendChild(listItem);
    });
}

// Load the CSV file dynamically
async function loadCSV(filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`Failed to fetch CSV: ${response.statusText}`);
        const csvData = await response.text();
        const data = parseCSV(csvData);
        generateLinks(data);
    } catch (error) {
        console.error("Error loading CSV file:", error);
    }
}

// Usage
document.addEventListener("DOMContentLoaded", () => {
    loadCSV("/assets/papers.csv"); 
});
