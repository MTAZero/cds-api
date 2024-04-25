import { InjectModel } from '@nestjs/mongoose';
import { Progress } from '../schemas/progress.schema';
import { BaseDBService } from './base';
import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { QueryParams, ResponseQuery } from 'src/interface/i-base-db-service';
import { UnitDBService } from './unitDBService';
import { Training } from '../schemas/trainnings.schema';

@Injectable()
export class TrainingDBService extends BaseDBService<Progress> {

  @Inject(UnitDBService)
  unitDBService: UnitDBService;
  
  constructor(@InjectModel(Training.name) private readonly entityModel) {
    super(entityModel);
  }

  async getTrainingOfMonth(
    userUnitID: string,
    unitTraining: string,
    query: QueryParams,
  ): Promise<ResponseQuery<any>> {
    
    const checkPermisison = await this.unitDBService.checkUnitIsDescenants(userUnitID, unitTraining)
    if(!checkPermisison) throw new ForbiddenException();

    const ans = await this.findWithTwoPopulateByFilter(query, 'progress', "unit")
    return ans
  }

  async updateTraining(
    userUnitID: string,
    id: string,
    entity: any,
  ) {
    const training = await this.getItemById(id)
    if(!training) throw new NotFoundException();

    const checkPermisison = await this.unitDBService.checkUnitIsDescenants(userUnitID, training.unit)
    if(!checkPermisison) throw new ForbiddenException();

    let sum_people = 0
    let sum_joiner = 0
    for (let obj of entity.element_join) {
        sum_people += obj["list_people"].length
        if (obj["list_people"].length > 0){
            sum_joiner += obj["list_people"].reduce(
                (accumulator:any, child_obj: any) => accumulator + child_obj["joined"],
                0,
            )
        }      
    }
  
    entity.sum_people = sum_people
    entity.sum_joiner = sum_joiner
    return await this.updateItem(id, entity)
  }
}
