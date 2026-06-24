import express from 'express';
import fs from 'fs';
import path from 'path';
import { generatePdf,generatePdfhtml,generatePdfjs,generatedocx } from './pdfService';

const app = express();
const PORT = 3002;
app.use(express.json()); 

const templatesDir = path.join(__dirname, 'templates');
const dataDir = path.join(__dirname, 'data');
const outputDir = path.join(__dirname, 'out');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}
console.log('paths:');
console.log('template:',templatesDir);
console.log('data:',dataDir);
console.log('output:',outputDir);
app.post('/generate-pdf', async (req:any,res:any) => {
    try {
        console.log('request:',req.body);
        const { template, data,filetype } = req.body;

        if (!template || !data || !filetype) {
            return res.send('Missing required query parameters: template, data, output');
        }

        const pdfPath = await generatePdf(template , data , filetype);

        res.send(`PDF generated successfully: ${pdfPath}`);
    } catch (error) {
        res.send('Error generating PDF');
    }
});

app.post('/generate-pdf-html', async (req:any,res:any) => {
    try {
        console.log('request:',req.body);
        const { template, data,filetype } = req.body;

        if (!template || !data || !filetype) {
            return res.send('Missing required query parameters: template, data, output');
        }

        const pdfPath = await generatePdfhtml(template , data , filetype);

        res.send(`PDF generated successfully: ${pdfPath}`);
    } catch (error) {
        res.send('Error generating PDF');
    }
});
app.post('/generate-pdf-jspdf', async (req:any,res:any) => {
    try {
        console.log('request:',req.body);
        const { template, data,filetype } = req.body;

        if (!template || !data || !filetype) {
            return res.send('Missing required query parameters: template, data, output');
        }

        const pdfPath = await generatePdfjs(template , data , filetype);

        res.send(`PDF generated successfully: ${pdfPath}`);
    } catch (error) {
        res.send('Error generating PDF');
    }
});

app.post('/generate-docx', async (req:any,res:any) => {
    try {
        console.log('request:',req.body);
        const { template, data,filetype } = req.body;

        if (!template || !data || !filetype) {
            return res.send('Missing required query parameters: template, data, output');
        }

        const pdfPath = await generatedocx(template , data , filetype);

        res.send(`PDF generated successfully: ${pdfPath}`);
    } catch (error) {
        res.send('Error generating docx');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
