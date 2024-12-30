import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CommonService {

    constructor(private httpService: HttpService) { }

    genDynamicObject(obj: any, key: string) {
        let tmp = obj;
        let k = key.split('/');
        for (let i = 0; i < k.length; i++) {
            let localK = k[i];
            tmp[localK] = tmp[localK] || {};
            tmp[localK]._level = i + 1;
            tmp[localK]._max = k.length;
            tmp = tmp[localK];
        }
        return tmp;
    }

    async forwardPostRequest(data: any) {
        const response = await firstValueFrom(
            this.httpService.post(
                // 'http://45.77.252.19:5000/generate-report',
                'http://127.0.0.1:5000/generate-report',
                data,
                {
                    headers:
                    {
                        'Content-Type': 'application/json'
                    },
                    responseType: 'stream'
                }
            )
        );
        return response;
    }
}