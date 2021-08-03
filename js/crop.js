const { PDFDocument, PDF } = PDFLib;
var file;
var pdfBytes;

function convert() {
    // Open and read file
    file = document.getElementById('ticket').files[0];
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    
    reader.onload = async function() {
        // Load PDF Document
        const pdfDoc = await PDFDocument.load(reader.result);
        
        // Crop to ticket
        var page = pdfDoc.getPage(0);
        page.setCropBox(56, 577, 457, 230);

        // Edit metadata
        pdfDoc.setTitle('Semesterticket NRW/VRS');
        const viewerPrefs = pdfDoc.catalog.getOrCreateViewerPreferences();
        viewerPrefs.setHideToolbar(true);
        viewerPrefs.setHideMenubar(true);
        viewerPrefs.setHideWindowUI(true);
        viewerPrefs.setFitWindow(true);
        viewerPrefs.setCenterWindow(true);
        viewerPrefs.setDisplayDocTitle(true);

        // Save data
        pdfBytes = await pdfDoc.save();

        // Show PDF and Download button
        // pdfView.hidden = false;
        downloadView.hidden = false;
        saveBtn.disabled = false;
    };

    reader.onerror = function() {
        console.log(reader.error);
    };
}

function save() {
    download(pdfBytes, "NRW/VRS-Semester" + file.name, "application/pdf");
}