import { InjectModel } from '@nestjs/mongoose';
import { BaseDBService } from './base';
import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UnitDBService } from './unitDBService';
import { QueryParams, ResponseQuery } from 'src/interface/i-base-db-service';
import { IncomingCall } from  './../schemas/incoming_call.schema'
import { UserDBService } from './userDBService';

@Injectable()
export class IncomingDBService extends BaseDBService<IncomingCall> {
  
  @Inject(UnitDBService)
  unitDBService: UnitDBService;

  @Inject(UserDBService)
  userDBService: UserDBService;
  
  constructor(@InjectModel(IncomingCall.name) private readonly entityModel) {
    super(entityModel);
  }

  async getListIncomingCall(
    query: QueryParams,
  ): Promise<ResponseQuery<any>> {
    let { filter } = query;
    const { skip, limit } = query;
    const pageIndex = skip / limit + 1;

    let lstIncoming = await this.getItems({
      ...query,
      ...{
        filter,
      },
    });

    const populateQuery = [
      {
          path: "unitId",
      },
      {
          path: "idLeader"
      }
  ];
  
    const lst = await this.entityModel.populate(lstIncoming.items, populateQuery);

    const ans = lst.map(
      (item) => {
        return {
          ...item,
          ...{
            unitId: item.unitId._id,
            unitName: item.unitId.name,
            idLeader: item.idLeader._id,
            nameLeader: item.idLeader.full_name
          }
        }
      }
    )

    return ans;
  }

  async insert(entity: any): Promise<IncomingCall> {
    
    const incomingCall =  await this.insertItem(entity);
    return incomingCall;

  }

  async update(incomingCallId: string ,entity: any): Promise<IncomingCall> {

    const incomingCall = await this.getItemById(incomingCallId);
    if(!incomingCall) throw new NotFoundException();

    return await this.updateItem(incomingCallId, entity);
  }

  async remove(incomingCallId: string): Promise<any> {
    const incomingCall = await this.getItemById(incomingCallId);
    if(!incomingCall) throw new NotFoundException();

    return await this.removeItem(incomingCallId);
  }

  async getDetail(incomingCallId: string): Promise<any> {

    const incomingCall = await this.getItemById(incomingCallId)
    if(!incomingCall) throw new NotFoundException();

    const ans = {
      ...incomingCall,
      unitName: (await this.unitDBService.getItemById(incomingCall.unitId)).name,
      nameLeader: (await this.userDBService.getItemById(incomingCall.idLeader)).full_name
    };

    return ans;
  }
}
