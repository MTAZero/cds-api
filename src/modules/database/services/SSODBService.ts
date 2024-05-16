import { InjectModel } from '@nestjs/mongoose';
import { PersonalDiary } from '../schemas/personal-diarys.schema';
import { BaseDBService } from './base';
import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { QueryParams, ResponseQuery } from 'src/interface/i-base-db-service';
import { UnitDBService } from './unitDBService';
import { PositionDBService } from './positionDBService';
import { UserDBService } from './userDbService';
import { ProgressDBService } from './progressDBService';
import { MAX_ITEM_QUERYS } from 'src/const';
import axios from 'axios';
import * as https from 'https'

@Injectable()
export class SSODBService {

  @Inject(UnitDBService)
  unitDBService: UnitDBService;

  @Inject(PositionDBService)
  positionDBService: PositionDBService;

  @Inject(UserDBService)
  userDBService: UserDBService;
  

  async loginWithSSO(entity: any): Promise<any> 
  {
    const response = await axios.request({
        method: "POST",
        url: `https://xacthuc.bqp/oauth2/token`,
        params: entity,
        headers: {
            'Content-Type':  'application/x-www-form-urlencoded',
        },
        httpsAgent: new https.Agent({  
            rejectUnauthorized: false
        })
    }

    );
    if(response.data){
        const accessToken = response.data.access_token ? response.data.access_token : null
        if(!accessToken)
            throw new ForbiddenException();
        
        const responseContinue = await axios.request({
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            method: "POST",
            url: `https://xacthuc.bqp/oauth2/userinfo`,
            httpsAgent: new https.Agent({  
                rejectUnauthorized: false
            })
        })

        if(responseContinue.data){
            const mail = responseContinue.data.sub
            const user = await this.userDBService.getItemByUsername(mail)
            
            if(!user) throw new ForbiddenException();

            const ans = await this.userDBService.signTokenByUser(user)
            return ans
        }
        throw new BadRequestException()
    }
    throw new BadRequestException()
  }
}
