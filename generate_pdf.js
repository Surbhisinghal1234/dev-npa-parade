const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
    console.log('Starting PDF generation for Officer Dev...');

    const possiblePaths = [
        'C:\\Users\\Asus\\.cache\\puppeteer\\chrome\\win64-152.0.7977.54\\chrome-win64\\chrome.exe',
        'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
    ];

    let executablePath = possiblePaths.find(p => fs.existsSync(p));
    console.log('Using browser executable:', executablePath);

    const launchOptions = {
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    };
    if (executablePath) {
        launchOptions.executablePath = executablePath;
    }

    const browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();

    await page.setViewport({
        width: 1200,
        height: 1600,
        deviceScaleFactor: 2
    });

    const fileUrl = 'http://localhost:3000';
    console.log(`Navigating to ${fileUrl}...`);
    await page.goto(fileUrl, { waitUntil: 'networkidle0' });

    await page.evaluate(async () => {
        const overlay = document.getElementById('envelopeOverlay');
        if (overlay) overlay.style.display = 'none';

        const mainContent = document.getElementById('mainContent');
        if (mainContent) {
            mainContent.classList.remove('hidden');
            mainContent.style.display = 'block';
            mainContent.style.opacity = '1';
        }

        await document.fonts.ready;

        const imgs = Array.from(document.querySelectorAll('img'));
        await Promise.all(imgs.map(img => {
            if (img.complete) return Promise.resolve();
            return new Promise((resolve) => {
                img.onload = resolve;
                img.onerror = resolve;
            });
        }));
    });

    await new Promise(r => setTimeout(r, 1500));

    const pdfPath = path.join(__dirname, 'Officer_Dev_Passing_Out_Parade_Letter.pdf');
    
    console.log('Generating PDF...');
    await page.pdf({
        path: pdfPath,
        format: 'A4',
        printBackground: true,
        margin: {
            top: '20px',
            right: '20px',
            bottom: '20px',
            left: '20px'
        }
    });

    console.log(`PDF successfully generated at: ${pdfPath}`);
    await browser.close();
})();
