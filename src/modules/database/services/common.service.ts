import { Inject, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class CommonService{
    genDynamicObject(obj: any, key:string) {
        let tmp= obj;
        let k= key.split('/');
        for(let i=0; i< k.length; i++){
            let localK= k[i];
            tmp[localK]= tmp[localK] || {};
            tmp= tmp[localK];
        }
        return tmp;
    }
}