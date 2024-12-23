import { Inject, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class CommonService{
    genDynamicObject(obj: any, key:string) {
        let tmp= obj;
        let k= key.split('/');
        for(let i=0; i< k.length; i++){
            let localK= k[i];
            tmp[localK]= tmp[localK] || {};
            tmp[localK]._level= i+ 1;
            tmp[localK]._max= k.length;
            tmp= tmp[localK];
        }
        return tmp;
    }
}