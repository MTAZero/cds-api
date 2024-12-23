import { InjectModel } from '@nestjs/mongoose';
import { BaseDBService } from './base';
import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { RegisterVehicle } from '../schemas/register-vehicle.schema';
import { UnitDBService } from './unitDBService';
import { QueryParams, ResponseQuery } from 'src/interface/i-base-db-service';
import { convertTimeStampToDateTime } from 'src/utils/time.helper';
import { DeliveryBillDBService } from './deliveryBillDbService';
import { VehicleCommandDBService } from './vehicleCommandDBService';

@Injectable()
export class RegisterVehicleDBService extends BaseDBService<RegisterVehicle> {
  
  @Inject(UnitDBService)
  unitDBService: UnitDBService;

  @Inject(VehicleCommandDBService)
  vehicleCommandDBService: VehicleCommandDBService;
  
  constructor(@InjectModel(RegisterVehicle.name) private readonly entityModel) {
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
            unitName: item.unit.name
          }
        }
      }
    )

    return ans;
  }

  async insert(userUnitID: string, entity: any): Promise<RegisterVehicle> {

    const checkPermisison = await this.unitDBService.checkUnitPermission(userUnitID, entity.unit)
    if(!checkPermisison) throw new ForbiddenException();
    const registerVehicle =  await this.insertItem(entity);
    return registerVehicle;

  }

  async update(userUnitID: string, registerVehicleID: string ,entity: any): Promise<RegisterVehicle> {

    const registerVehicle = await this.getItemById(registerVehicleID);
    if(!registerVehicle) throw new NotFoundException();

    const checkPermisison = await this.unitDBService.checkUnitPermission(userUnitID, registerVehicle.unit)
    if(!checkPermisison) throw new ForbiddenException();
    
    if(entity.type == "00"){

      return await this.updateItem(registerVehicleID, entity);

    } else if(entity.type == "01"){
      
      const planRegisterVehicle = await this.updateItem(registerVehicleID, entity);

      const vehicleCommand = await this.vehicleCommandDBService.getItemById(registerVehicleID)

      if(!vehicleCommand) {

        await this.vehicleCommandDBService.insertItem({
          _id: planRegisterVehicle._id,
          mission: entity.contentUse
        })

      } else {

        await this.vehicleCommandDBService.updateItem(
        planRegisterVehicle._id,
        {
          mission: entity.contentUse
        })
      }

      return planRegisterVehicle;

    }
  }

  async remove(userUnitID: string, registerVehicleID: string): Promise<any> {
    const registerVehicle = await this.getItemById(registerVehicleID);
    if(!registerVehicle) throw new NotFoundException();

    const checkPermisison = await this.unitDBService.checkUnitPermission(userUnitID, registerVehicle.unit)
    if(!checkPermisison) throw new ForbiddenException();

    await this.removeItem(registerVehicleID);

    await this.removeItem
  }

  async getDetail(userUnitID: string, registerVehicleID: string): Promise<any> {

    const registerVehicle = await this.getItemById(registerVehicleID);
    if(!registerVehicle) throw new NotFoundException();

    const checkPermisison = await this.unitDBService.checkUnitPermission(userUnitID, registerVehicle.unit)
    if(!checkPermisison) throw new ForbiddenException();

    const ans = {
      ...registerVehicle,
      unitName: (await this.unitDBService.getItemById(registerVehicle.unit)).name
    };
    return ans;
  }

}
