import {Express, NextFunction, Request, Response, json} from 'express';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
assign(pdfMake, 'vfs', pdfFonts.pdfMake.vfs);

function assign(obj: any, prop: any, value: any) {
    if (typeof prop === 'string') {
      prop = prop.split('.');
    }

    if (prop.length > 1) {
      const e = prop.shift();
      this.assign(obj[e] =
        Object.prototype.toString.call(obj[e]) === '[object Object]'
          ? obj[e]
          : {},
        prop,
        value);
    } else {
      obj[prop[0]] = value;
    }
  }


export async function createAndRegisterPdfRender(app: Express, productionMode: boolean) {
    console.log('render pdf registration');
    app.post('/pdf', [json(), render]);
}


function render(req: Request, res: Response, next: NextFunction) {
    console.log('render pdf post request', req.body.doc);

    const pdfDocGenerator = <any> pdfMake.createPdf(req.body.doc);
    pdfDocGenerator.getDataUrl((url) => {
        res.send({ok: true, data: url});
    });

}
