import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { MonthlyPlan } from '../schemas/monthly-plan/monthly-plan';
import { BaseDBService } from './base';
import { UnitDBService } from './unitDBService';
import { InjectModel } from '@nestjs/mongoose';
import { QueryParams, ResponseQuery } from 'src/interface/i-base-db-service';

@Injectable()
export class MonthlyPlanService extends BaseDBService<MonthlyPlan> {
    async getDetail(id: any) : Promise<any> {
        const obj = await this.getItemById(id);
        if (!obj) throw new NotFoundException();

        const objExtra = await this.entityModel.populate(obj, [{
            path: "unit",
        }]);
        return objExtra;
    }
    
    async getMonthlyPlanBelongPerfomDate(
        query: QueryParams,
    ): Promise<ResponseQuery<any>> {
        let { filter } = query;
        // const { skip, limit } = query;
        // const pageIndex = skip / limit + 1;

        let lstObj = await this.getItems({
            ...query,
            ...{
                filter,
            },
        });

        const lst = await this.entityModel.populate(lstObj.items, [
            { path: 'unit' }
        ]);

        return lst;
    }

    @Inject(UnitDBService)
    unitDBService: UnitDBService;

    constructor(@InjectModel(MonthlyPlan.name) private readonly entityModel) {
        super(entityModel);
    }
    
}
