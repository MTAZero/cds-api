import { InjectModel } from '@nestjs/mongoose';
import { BaseDBService } from './base';
import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { VehicleCommand } from '../schemas/vehicleCommand.schema';
import { UnitDBService } from './unitDBService';
import { QueryParams, ResponseQuery } from 'src/interface/i-base-db-service';
import { DeliveryBill } from '../schemas/delivery-bill.schema';


@Injectable()
export class DeliveryBillDBService extends BaseDBService<VehicleCommand> {
  
  @Inject(UnitDBService)
  unitDBService: UnitDBService;
  
  constructor(@InjectModel(DeliveryBill.name) private readonly entityModel) {
    super(entityModel);
  }

  async getList(
    query: QueryParams,
  ): Promise<ResponseQuery<any>> {
    let { filter } = query;
    const { skip, limit } = query;
    const pageIndex = skip / limit + 1;

    let lstDeliveryBill = await this.getItems({
      ...query,
      ...{
        filter,
      },
    });

    const populateQuery = [
      {
        path: "belongCommandID"
      }
  ];
  
    const lst = await this.entityModel.populate(lstDeliveryBill.items, populateQuery);

    const ans = lst.map(
      (item) => {
        return {
          ...item,
          ...{
            commandNumber: item.belongCommandID.orderNumber,
            belongCommandID: item.belongCommandID._id
          }
        }
      }
    )

    return {
      ...lstDeliveryBill,
      ...{
        items: ans
      }
    };
  }

  async getDetail(id: string): Promise<any> {

    const deliveryBill = await this.getItemById(id);
    if(!deliveryBill) throw new NotFoundException();

    const populateQuery = [
      {
        path: "belongCommandID",
      }
  ];
  
    const deliveryBillExtra = await this.entityModel.populate(deliveryBill, populateQuery);

    const ans = {
      ...deliveryBill,
      ...{
        commandNumber: deliveryBillExtra.belongCommandID.orderNumber,
        belongCommandID: deliveryBillExtra.belongCommandID._id
      }
    };

    return ans;

  }
}
