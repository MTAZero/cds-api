import { BadRequestException, ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { UnitDBService } from './unitDBService';
import { PositionDBService } from './positionDBService';
import { UserDBService } from './userDBService';
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
        url: `${process.env.SSO_URL}/oauth2/token`,
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
        const idToken = response.data.id_token ? response.data.id_token : null
        if(!accessToken)
            throw new ForbiddenException();
        
        const responseContinue = await axios.request({
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            method: "POST",
            url: `${process.env.SSO_URL}/oauth2/userinfo`,
            httpsAgent: new https.Agent({  
                rejectUnauthorized: false
            })
        })

        if(responseContinue.data){
            const mail = responseContinue.data.sub
            const user = await this.userDBService.getItemByUsername(mail)
            
            if(!user) return {
                access_token: null,
                id_token: idToken
            }

            const ans = await this.userDBService.signTokenByUser(user)
            return {
                ...ans,
                ...{
                    id_token: idToken
                }
            }
        }
        throw new BadRequestException()
    }
    throw new BadRequestException()
  }
}
