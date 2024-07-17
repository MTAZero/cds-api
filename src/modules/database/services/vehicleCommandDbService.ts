import { InjectModel } from '@nestjs/mongoose';
import { BaseDBService } from './base';
import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { VehicleCommand } from '../schemas/vehicleCommand.schema';
import { UnitDBService } from './unitDBService';
import { QueryParams, ResponseQuery } from 'src/interface/i-base-db-service';
import { convertTimeStampToDateTime } from 'src/utils/time.helper';

@Injectable()
export class VehicleCommandDBService extends BaseDBService<VehicleCommand> {
  
  @Inject(UnitDBService)
  unitDBService: UnitDBService;
  
  constructor(@InjectModel(VehicleCommand.name) private readonly entityModel) {
    super(entityModel);
  }

  async getRegisterVehicleBelongUnit(
    query: QueryParams,
  ): Promise<ResponseQuery<any>> {
    let { filter } = query;
    const { skip, limit } = query;
    const pageIndex = skip / limit + 1;

    let lstRegisterVehicle = await this.getItems({
      ...query,
      ...{
        filter,
      },
    });

    const populateQuery = [
      {
          path: "unit",
      }
  ];
  
    const lst = await this.entityModel.populate(lstRegisterVehicle.items, populateQuery);

    const ans = lst.map(
      (item) => {
        return {
          ...item,
          ...{
            unit: item.unit._id,
            unitName: item.unit.name,
            fromTime: convertTimeStampToDateTime(item.fromTime),
            toTime: convertTimeStampToDateTime(item.toTime)
          }
        }
      }
    )

    return ans;
  }

  async update(id: string ,entity: any): Promise<VehicleCommand> {

    const commandVehicle = await this.getItemById(id);
    if(!commandVehicle) throw new NotFoundException();

    return await this.updateItem(id, entity);

  }

  async remove(id: string): Promise<any> {
    
    const registerVehicle = await this.getItemById(id);
    if(!registerVehicle) throw new NotFoundException();

    return await this.removeItem(id);
  }

  async getDetail(id: string): Promise<any> {

    const commandVehicle = await this.getItemById(id);
    if(!commandVehicle) throw new NotFoundException();

    const ans = {
      ...commandVehicle,
      vehicleBelongUnit_name: (await this.unitDBService.getItemById(commandVehicle.vehicleBelongUnit)).name,
      unitWork_name:  (await this.unitDBService.getItemById(commandVehicle.unitWork)).name,
      date: convertTimeStampToDateTime(commandVehicle.date)
    };

    return ans;
  }
}
