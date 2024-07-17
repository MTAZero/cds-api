import { InjectModel } from '@nestjs/mongoose';
import { BaseDBService } from './base';
import { Injectable } from '@nestjs/common';
import { ManagerVehicle } from '../schemas/manager-vehicle.schema';
import { MAX_ITEM_QUERYS } from 'src/const';
import { QueryParams, ResponseQuery } from 'src/interface/i-base-db-service';

@Injectable()
export class ManagerVehicleDBService extends BaseDBService<ManagerVehicle> {
  constructor(@InjectModel(ManagerVehicle.name) private readonly entityModel) {
    super(entityModel);
  }
  
  async CURDVehicle(entity: any): Promise<ResponseQuery<any>> {
    
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
