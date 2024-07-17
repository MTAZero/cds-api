import { InjectModel } from '@nestjs/mongoose';
import { BaseDBService } from './base';
import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UnitDBService } from './unitDBService';
import { QueryParams, ResponseQuery } from 'src/interface/i-base-db-service';
import { TroopUnitDBService } from './troopUnitDBService';
import { ObjectId } from 'mongoose';
import { MeetingBook } from '../schemas/meeting-book.schema';
import { TypeLevelUnit } from 'src/enums';

@Injectable()
export class MeetingBookDBService extends BaseDBService<MeetingBook> {

  @Inject(UnitDBService)
  unitDBService: UnitDBService;

  @Inject(TroopUnitDBService)
  troopUnitDBService: TroopUnitDBService;

  constructor(@InjectModel(MeetingBook.name) private readonly entityModel) {
    super(entityModel);
  }

  async getListMeetingBook(
    userUnitID: string,
    meetingBookUnit : ObjectId,
    query: QueryParams
  ): Promise<ResponseQuery<any>> {

    const checkPermisison = await this.unitDBService.checkUnitPermission(userUnitID, meetingBookUnit.toString())
    if(!checkPermisison) throw new ForbiddenException();
    const unit = await this.unitDBService.getItemById(meetingBookUnit.toString());
    const ans = await super.getItems(query);
    let populateQuery = [];

    if(unit.parent){
      
      populateQuery = [
        {
            path: "dutyLeader",
        }, 
        {
            path: "dutySecondPerson",
        }
    ];
  }
  else{
    populateQuery = [
      {
          path: "dutyLeader",
      }, 
      {
          path: "dutySecondPerson",
      },
      {
          path: "dutyThirdPerson"
      }
    ];
  }

  const result = await this.entityModel.populate(ans.items, populateQuery);

  const tmp = await Promise.all( result.map( async (item) => {
    
    const troop = await this.troopUnitDBService.getReportDetail(
      userUnitID.toString(),
      {
        unitId: meetingBookUnit,
        time: item.created_date
      }
    )

    return {
      ...item,
      ...{
        dutyLeader_name: item?.dutyLeader?.full_name,
        dutySecondPerson_name: item?.dutySecondPerson?.full_name,
        dutyThirdPerson_name: item?.dutyThirdPerson?.full_name,
        dutyLeader: item?.dutyLeader?._id,
        dutySecondPerson: item?.dutySecondPerson?._id,
        dutyThirdPerson: item?.dutyThirdPerson?._id
      },
      ...troop
    }

  }))
    ans.items = tmp;
    return ans;
  }

  async insert(userUnitID: string, entity: any): Promise<any> {

    const checkPermission = await this.unitDBService.checkUnitPermission(userUnitID, entity.unit)
    
    if(!checkPermission) throw new ForbiddenException();

    const meetingBook = await super.insertItem(entity);

    const troop = await this.troopUnitDBService.getReportDetail(
      userUnitID.toString(),
      {
        unitId: meetingBook.unit,
        time: meetingBook.created_date
      }
    )

    const ans = {
      ...meetingBook.toObject(),
      ...troop
    }

    return ans;

  }

  async update(userUnitID: string, id: string, entity: any): Promise<any> {

    const meetingBook = await this.getItemById(id);
    if(!meetingBook) throw new NotFoundException();

    const checkPermission = await this.unitDBService.checkUnitPermission(userUnitID, meetingBook.unit)        
    if(!checkPermission) throw new ForbiddenException();

    return await super.updateItem(id, entity)
  }

  async delete(userUnitID: string, id: string): Promise<any> {

    const meetingBook = await this.getItemById(id);
    if(!meetingBook) throw new NotFoundException();

    const checkPermission = await this.unitDBService.checkUnitPermission(userUnitID, meetingBook.unit)        
    if(!checkPermission) throw new ForbiddenException();

    return await super.removeItem(id)
  }

  async getDetail(userUnitID: string, id: string): Promise<any> {

    const meetingBook = await this.getItemById(id);
    if(!meetingBook) throw new NotFoundException();

    const checkPermission = await this.unitDBService.checkUnitPermission(userUnitID, meetingBook.unit)        
    if(!checkPermission) throw new ForbiddenException();

    const troop = await this.troopUnitDBService.getReportDetail(
      userUnitID.toString(),
      {
        unitId: meetingBook.unit,
        time: meetingBook.created_date
      }
    ) 

    return {
      ...meetingBook,
      ...troop
    };
  }
}
