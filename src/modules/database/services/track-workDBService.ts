import { InjectModel } from '@nestjs/mongoose';
import { BaseDBService } from './base';
import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { QueryParams, ResponseQuery } from 'src/interface/i-base-db-service';
import { MAX_ITEM_QUERYS } from 'src/const';
import { TrackWorkBook } from '../schemas/track-work-book.schema';
import { UnitDBService } from './unitDBService';

@Injectable()
export class TrackWorkBookDBService extends BaseDBService<TrackWorkBook> {

  @Inject(UnitDBService)
  unitDBService: UnitDBService;
  
  constructor(@InjectModel(TrackWorkBook.name) private readonly entityModel) {
    super(entityModel);
  }

  async getTrackWorkBelongUnit(
    userUnitId: string,
    unitId: string,
    query: QueryParams,
  ): Promise<ResponseQuery<any>> {
    let { filter } = query;
    const { skip, limit } = query;
    const pageIndex = skip / limit + 1;
    
    const checkPermisison = await this.unitDBService.checkUnitPermission(userUnitId, unitId)
    if(!checkPermisison) throw new ForbiddenException();

    let lstDiscipline = await this.getItems({
      ...query,
      ...{
        filter,
      },
    });

    const populateQuery = [
      {
        path: "unitId" 
      },
      {
        path: "personId"
      }
  ];
  
    const lst = await this.entityModel.populate(lstDiscipline.items, populateQuery);

    const ans = lst.map(
      (item) => {
        
        return {
          ...item,
          ...{
            unitId: item.unitId._id,
            unitName: item.unitId.name,
            personId: item.personId._id,
            personName: item.personId.full_name
          }
        }
      }
    )
    return ans;
  }
  
  async CURDTrackWork(entity: any): Promise<ResponseQuery<any>> {
    
    //get list
    const query: QueryParams = {
      skip: 0,
      limit: MAX_ITEM_QUERYS,
      filter: {},
    };
    const itemExist =  (await this.getItems(query)).items;
    let oldListID = [];
    let listID = [];

    itemExist.forEach(item => {
      oldListID.push(item._id.toString());
    })
    
    entity.forEach(item => {
      if(item._id)
        listID.push(item._id.toString());
    })
    
    const listID_delete =
    oldListID.filter((element) => !listID.includes(element));

    for(let i = 0; i < entity.length; i++) {
      if(entity[i]._id){

        const {_id, ...otherProperties} = entity[i];
        const item = {...otherProperties};
        await this.updateItem(_id, item);

      } else {

        await this.insertItem(entity[i]);

      }
    }

    if(listID_delete.length > 0)
      await this.removeMany({_id: { $in: listID_delete }});
    
    const ans = await this.getItems(query);
    return ans;
  }
  
 }
