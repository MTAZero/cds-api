import { InjectModel } from '@nestjs/mongoose';
import { BaseDBService } from './base';
import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { VehicleCommand } from '../schemas/vehicleCommand.schema';
import { UnitDBService } from './unitDBService';
import { QueryParams, ResponseQuery } from 'src/interface/i-base-db-service';


@Injectable()
export class VehicleCommandDBService extends BaseDBService<VehicleCommand> {
  
  @Inject(UnitDBService)
  unitDBService: UnitDBService;
  
  constructor(@InjectModel(VehicleCommand.name) private readonly entityModel) {
    super(entityModel);
  }

  async getVehicleCommandBelongPerfomDate(
    query: QueryParams,
  ): Promise<ResponseQuery<any>> {
    let { filter } = query;
    const { skip, limit } = query;
    const pageIndex = skip / limit + 1;

    let lstVehicleComand = await this.getItems({
      ...query,
      ...{
        filter,
      },
    });

    const populateQuery = [
      {
        path: "vehicle"
      }
  ];
  
    const lst = await this.entityModel.populate(lstVehicleComand.items, populateQuery);

    const ans = lst.map(
      (item) => {
        return {
          ...item,
          ...{
            typeVehicle: item.vehicle.typeVehicle,
            label: item.vehicle.name,
            license: item.vehicle.license,
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
    
    const commandVehicle = await this.getItemById(id);
    if(!commandVehicle) throw new NotFoundException();

    return await this.removeItem(id);
  }

  async getDetail(id: string): Promise<any> {

    const commandVehicle = await this.getItemById(id);
    if(!commandVehicle) throw new NotFoundException();

    const populateQuery = [
      {
        path: "vehicle",
      }
  ];
  
    const commandVehicleExtra = await this.entityModel.populate(commandVehicle, populateQuery);

    const ans = {
      ...commandVehicleExtra,
      ...{
        typeVehicle: commandVehicleExtra.vehicle.typeVehicle,
        label: commandVehicleExtra.vehicle.name,
        license: commandVehicleExtra.vehicle.license
      }
    };
    return ans;
  }
}
