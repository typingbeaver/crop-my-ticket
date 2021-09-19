const { PDFDocument, PDF } = PDFLib;
var file;
var pdfData;

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
        page.setCropBox(56, 579, 457, 228);

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
        pdfData = await pdfDoc.save();

        // Show PDF
        renderPage(pdfData); 
        ticketMockup.hidden = true;    
        ticketCanvas.hidden = false;

        // Show Download button
        downloadView.hidden = false;
        saveBtn.disabled = false;
    };

    reader.onerror = function() {
        console.log(reader.error);
    };

    // Page Rendering
    function renderPage() {
        // The workerSrc property shall be specified.
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'assets/pdfjs-2.9.359-dist/build/pdf.worker.min.js';

        // Load PDF
        var loadingTask = pdfjsLib.getDocument({data: pdfData});
        loadingTask.promise.then(function(pdf) {
        
            // Fetch the first page
            pdf.getPage(1).then(function(page) {
                
                var desiredWidth = document.getElementById("imageBox").clientWidth;
                var viewport = page.getViewport({ scale: 1, });
                var scale = desiredWidth / viewport.width;
                var scaledViewport = page.getViewport({ scale: scale, });

                // Prepare canvas using PDF page dimensions
                var canvas = document.getElementById('ticketCanvas');
                var context = canvas.getContext('2d');
                canvas.height = scaledViewport.height;
                canvas.width = scaledViewport.width;

                // Render PDF page into canvas context
                var renderContext = {
                    canvasContext: context,
                    viewport: scaledViewport
                };
                page.render(renderContext);
            });
        });
    }

}

function save() {
    download(pdfData, "NRW/VRS-Semester" + file.name, "application/pdf");
}