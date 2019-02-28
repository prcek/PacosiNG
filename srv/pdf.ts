import {Express, NextFunction, Request, Response, json} from 'express';


export async function createAndRegisterPdfRender(app: Express, productionMode: boolean) {
    console.log('render pdf registration');
    app.post('/pdf', [json(), render]);
}


function render(req: Request, res: Response, next: NextFunction) {
    console.log('render pdf post request', req.body);
    res.send({ok: true, data: 'blabla'});
}
