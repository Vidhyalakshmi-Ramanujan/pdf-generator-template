import mustache from 'mustache';
import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
import pdf from 'html-pdf';
import { jsPDF } from 'jspdf'; 
import { template } from 'handlebars';
// import html2pdf from 'html2pdf.js'; 
const mammoth = require('mammoth');

const templatesDir = path.join(__dirname, 'templates');
const dataDir = path.join(__dirname, 'data');
const outDir = path.join(__dirname, 'out');
const outputDir1 = path.join(outDir, 'puppeteer');
const outputDir2 = path.join(outDir, 'html-pdf');
const outputDir3 = path.join(outDir, 'jspdf'); 
const outputDir4= path.join(outDir,'docs')

if (!fs.existsSync(outputDir1)) {
    fs.mkdirSync(outputDir1);
}
if (!fs.existsSync(outputDir2)) {
    fs.mkdirSync(outputDir2);
}
if (!fs.existsSync(outputDir3)) { 
    fs.mkdirSync(outputDir3);
}
if (!fs.existsSync(outputDir4)) { 
    fs.mkdirSync(outputDir4);
}

export async function generatePdf(templateName: string, dataContent: any,filetype:string) {
// export async function generatePdf() {
    try {
        const templatePath = path.join(templatesDir, `${templateName}.html`);
        const templateContent = fs.readFileSync(templatePath, 'utf-8');

        const renderedHtml = mustache.render(templateContent, dataContent);
        const randomPrefix = 'sample_doc'; 
        let sequenceNumber = Math.floor(Math.random() * 101);


        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(renderedHtml);
        const outputFilePath = path.join(outputDir1, `${randomPrefix}_${sequenceNumber}_puppeteer.${filetype}`);
        await page.pdf({
            path: outputFilePath,
            format: 'A4',
        });

        await browser.close();
        console.log(`PDF generated successfully: ${outputFilePath}`);
        return outputFilePath;
    } catch (error) {
        console.error('Error generating PDF:', error);
    }

}

export async function generatePdfhtml(templateName: string, dataContent: any, filetype: string) {
    try {
        const templatePath = path.join(templatesDir, `${templateName}.html`);
        const templateContent = fs.readFileSync(templatePath, 'utf-8');
        const renderedHtml = mustache.render(templateContent, dataContent);

        const randomPrefix = 'sample_doc'; 
        const sequenceNumber = Math.floor(Math.random() * 101);
        const outputFilePath = path.join(outputDir2, `${randomPrefix}_${sequenceNumber}_htmlpdf.${filetype}`);
        pdf.create(renderedHtml).toFile(outputFilePath, (err:Error, res:any) => {
            if (err) {
                console.error('Error generating PDF:', err);
            } else {
                console.log(`PDF generated successfully: ${res.filename}`);
            }
        });

        return outputFilePath;



    } catch (error) {
        console.error('Error generating PDF:', error);
    }
}   
export function generatePdfjs(templateName: string, dataContent: any, filetype: string) {
    try {
        const templatePath = path.join(templatesDir, `${templateName}.html`);
        const templateContent = fs.readFileSync(templatePath, 'utf-8');
        const renderedHtml = mustache.render(templateContent, dataContent);

        const randomPrefix = 'sample_doc';
        const sequenceNumber = Math.floor(Math.random() * 101);
        const outputFilePath = path.join(outputDir3, `${randomPrefix}_${sequenceNumber}_jspdf.${filetype}`);

        const doc = new jsPDF();
        //The HTML content will be displayed as raw text or basic elements in the PDF.
        // Since jsPDF doesn't render HTML directly, you'll need to manually convert the HTML content to text or structured data.
        //  use jsPDF's `text` method to add text or other methods for more complex content.
        doc.text(renderedHtml,10,10);//x y co-ord
        doc.save(outputFilePath);  

        console.log(`PDF generated successfully using jsPDF: ${outputFilePath}`);
        return outputFilePath;
    } catch (error) {
        console.error('Error generating PDF with jsPDF:', error);
    }
} 

export async function generatedocx(templateName: string, dataContent: any, filetype: string) {
    try {
        console.log("generatedocx function called");

        const templatePath = path.join(templatesDir, `${templateName}.html`);
        const templateContent = fs.readFileSync(templatePath, 'utf-8');
        const renderedHtml = mustache.render(templateContent, dataContent);

        const randomPrefix = 'sample_doc';
        const sequenceNumber = Math.floor(Math.random() * 101);
        const outputFilePath = path.join(outputDir4, `${randomPrefix}_${sequenceNumber}_doc.${filetype}`);

        console.log('Rendered HTML:', renderedHtml);
        const result = await mammoth.convertToDocx({ html: renderedHtml });
        console.log('Result:', result);

        const docx = result.value;
        console.log('Generated DOCX:', docx);
        fs.writeFileSync(outputFilePath, docx);

    } catch (err) {
        console.error('Error in docx generation:', err);
    }
}
