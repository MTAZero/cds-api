import { InjectModel } from '@nestjs/mongoose';
import { BaseDBService } from './base';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UnitDBService } from './unitDBService';
import { QueryParams, ResponseQuery } from 'src/interface/i-base-db-service';
import { GoingCall } from  './../schemas/going_call.schema'
import { UserDBService } from './userDBService';

@Injectable()
export class goingCallDBService extends BaseDBService<GoingCall> {
  
  @Inject(UnitDBService)
  unitDBService: UnitDBService;

  @Inject(UserDBService)
  userDBService: UserDBService;
  
  constructor(@InjectModel(GoingCall.name) private readonly entityModel) {
    super(entityModel);
  }

  async getListgoingCall(
    query: QueryParams,
  ): Promise<ResponseQuery<any>> {
    let { filter } = query;
    const { skip, limit } = query;
    const pageIndex = skip / limit + 1;

    let lstgoing = await this.getItems({
      ...query,
      ...{
        filter,
      },
    });

    const populateQuery = [
      {
          path: "unitIdTransfer",
      },
      {
          path: "unitIdReceived"
      },
      {
          path: "idLeader"
      }
  ];
  
    const lst = await this.entityModel.populate(lstgoing.items, populateQuery);

    const ans = lst.map(
      (item) => {
        return {
          ...item,
          ...{
            unitIdTransfer: item.unitIdTransfer._id,
            unitNameTransfer: item.unitIdTransfer.name,
            unitIdReceived: item.unitIdReceived._id,
            unitNameReceived: item.unitIdReceived.name,
            idLeader: item.idLeader._id,
            nameLeader: item.idLeader.full_name
          }
        }
      }
    )

    return ans;
  }

  async insert(entity: any): Promise<GoingCall> {
    
    const goingCall =  await this.insertItem(entity);
    return goingCall;

  }

  async update(goingCallId: string ,entity: any): Promise<GoingCall> {

    const goingCall = await this.getItemById(goingCallId);
    if(!goingCall) throw new NotFoundException();

    return await this.updateItem(goingCallId, entity);
  }

  async remove(goingCallId: string): Promise<any> {
    const goingCall = await this.getItemById(goingCallId);
    if(!goingCall) throw new NotFoundException();

    return await this.removeItem(goingCallId);
  }

  async getDetail(goingCallId: string): Promise<any> {

    const goingCall = await this.getItemById(goingCallId)
    if(!goingCall) throw new NotFoundException();

    const ans = {
      ...goingCall,
      unitNameTransfer: (await this.unitDBService.getItemById(goingCall.unitIdTransfer)).name,
      unitNameReceived: (await this.unitDBService.getItemById(goingCall.unitIdReceived)).name,
      nameLeader: (await this.userDBService.getItemById(goingCall.idLeader)).full_name
    };

    return ans;
  }
}
