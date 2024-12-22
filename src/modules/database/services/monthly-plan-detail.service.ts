import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { BaseDBService } from './base';
import { UnitDBService } from './unitDBService';
import { InjectModel } from '@nestjs/mongoose';
import { QueryParams, ResponseQuery } from 'src/interface/i-base-db-service';
import { MonthlyPlanDetail } from '../schemas/monthly-plan/monthly-plan-detail';

@Injectable()
export class MonthlyPlanDetailService extends BaseDBService<MonthlyPlanDetail> {

    @Inject(UnitDBService)
    unitDBService: UnitDBService;

    constructor(@InjectModel(MonthlyPlanDetail.name) private readonly entityModel) {
        super(entityModel);
    }

    

    async update(id: string, entity: any): Promise<MonthlyPlanDetail> {

        const obj = await this.getItemById(id);
        if (!obj) throw new NotFoundException();

        return await this.updateItem(id, entity);

    }

    async remove(id: string): Promise<any> {

        const obj = await this.getItemById(id);
        if (!obj) throw new NotFoundException();

        return await this.removeItem(id);
    }

    async getDetail(id: string): Promise<any> {

        const obj = await this.getItemById(id);
        if (!obj) throw new NotFoundException();

        const objExtra = await this.entityModel.populate(obj, [{
            path: "ke_hoach_thang",
        }]);
        return objExtra;
    }

}
