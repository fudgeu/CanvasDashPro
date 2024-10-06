// https://usflearn.instructure.com/files/177901678

import * as pdfjsLib from "pdfjs-dist";

const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.mjs');

export async function getItems(src: string ){

    const read_data = await fetch(src);

    const arrayBuffer = await read_data.arrayBuffer();

    const uint8Array = new Uint8Array(arrayBuffer);

    const document = await pdfjsLib.getDocument(uint8Array).promise;



    let stringData: string = ''
    console.log(document.numPages)
    for(let i = 1; i <= document.numPages; i++){
        const page = await document.getPage(i);
        const pageContent = await page.getTextContent();
        const rawData: string[]= pageContent.items.map((item) => {
            return item.str
        })
        stringData += (rawData.join(' '))

    }
    console.log(`stringData: ${stringData}`);
    return stringData;
}
