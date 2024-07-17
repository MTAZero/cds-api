import { InjectModel } from '@nestjs/mongoose';
import { Progress } from '../schemas/progress.schema';
import { BaseDBService } from './base';
import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { QueryParams, ResponseQuery } from 'src/interface/i-base-db-service';
import { UnitDBService } from './unitDBService';
import { TrainingDBService } from './trainingDBService';
import { UserDBService } from './userDbService';
import { MAX_ITEM_QUERYS } from 'src/const';
import { promises } from 'dns';
import { PositionDBService } from './positionDBService';

@Injectable()
export class ProgressDBService extends BaseDBService<Progress> {

  @Inject(UnitDBService)
  unitDBService: UnitDBService;

  @Inject(TrainingDBService)
  trainingDBService: TrainingDBService;

  @Inject(UserDBService)
  userDBService: UserDBService;

  @Inject(PositionDBService)
  positionDBService: PositionDBService;
  
  constructor(@InjectModel(Progress.name) private readonly entityModel) {
    super(entityModel);
  }

  async getProgressOfWeekBelongUnit(
    userUnitID: string,
    unitProgress: string,
    query: QueryParams,
  ): Promise<ResponseQuery<any>> {
    let { filter } = query;
    const { skip, limit } = query;
    const pageIndex = skip / limit + 1;

    const checkPermisison = await this.unitDBService.checkUnitPermission(userUnitID, unitProgress)
    if(!checkPermisison) throw new ForbiddenException();

    const ans = await this.getItems({
      ...query,
      ...{
        filter,
      },
    });
    if(!ans) throw new NotFoundException();
    const items = ans.items;

    const unit = await this.unitDBService.getItemById(items[0].unit)
    var setElement = new Set();
    let updatedItem = await Promise.all(
      items.map( async (item: any) => {
      
        const new_time_train_detail = await Promise.all(
          item.time_train_detail.map( async (x: any) => {
          let temp = await this.positionDBService.getItemById(x.object)
          setElement.add(temp.name)
          return { object: temp.name, time: x.time }
        }))

        item = {
          ...item,
          ...{
            time_train_detail: new_time_train_detail,
            unit: unit.name,
            allElements: [...setElement]
          }
        }
        return item
      }) 
    )
    ans.items = updatedItem 
    return ans;
  }

  async getDetailByID(userUnitID: string ,id: any): Promise<any> {

    const progress = await this.getItemById(id);
    if(!progress) throw new NotFoundException();

    const checkPermisison = await this.unitDBService.checkUnitPermission(userUnitID, progress.unit)
    if(!checkPermisison) throw new ForbiddenException();
    const training = await this.trainingDBService.getItemById(id);
    if(!training) throw new NotFoundException();
    const ans = {
      ...progress,
      ...{
        evaluation: training.evaluation
      }
    }
    return ans;
  }

  async insertProgress(userUnitID: string, entity: any): Promise<any> {

    const checkPermisison = await this.unitDBService.checkUnitPermission(userUnitID, entity.unit)
    if(!checkPermisison) throw new ForbiddenException();

    const progress =  await this.insertItem(entity);
    if(progress){

      await this.trainingDBService.insertItem({
        _id: progress._id,
        progress: progress._id,
        element_join: [],
        week: progress.week,
        month: progress.month,
        year: progress.year,
        unit: progress.unit,
      });
    }
    return progress;
  }

  async updateProgress(userUnitID: string, progressID: string, entity: any): Promise<any> {

    const progress = await this.getItemById(progressID);
    if(!progress) throw new NotFoundException();
   
    const checkPermisison = await this.unitDBService.checkUnitPermission(userUnitID, progress.unit)
    if(!checkPermisison) throw new ForbiddenException();

    const progressUpdated =  await this.updateItem(progressID, entity);
    
    const objProgress = new Set(progressUpdated.time_train_detail.map((item:any) => {
      return item.object
    }))
    
    const training = await this.trainingDBService.getItemById(progressID);
    const element_join = training.element_join;
    const objTraining = new Set(element_join.map((item:any) => {
      return item.object
    }))
    
    const lst_newObj = [...objProgress].filter((item:any) => !objTraining.has(item));
    const units = await this.unitDBService.getAllDescendants(progress.unit);
    const unitsId = units.map((i) => i._id.toString());
    
    if (lst_newObj.length > 0) {
      const lst_element_add = await this.findListJoiner(unitsId, lst_newObj);
      const lst_element_new = element_join.concat(lst_element_add);
      this.trainingDBService.updateItem(progressID, { element_join: lst_element_new });
    } else {
      const lst_removedObj = [...objTraining].filter((item:any) => !objProgress.has(item));
      if(lst_removedObj.length > 0) {
        const lst_element_rest = element_join.fillter((item:any) => {
          if(!(lst_removedObj.includes(item.object)))
            return item
        })
        this.trainingDBService.updateItem(progressID, { element_join: lst_element_rest });
      }
    }
    return progressUpdated;
  }

  async deleteProgress(userUnitID: string, progressID: string): Promise<any> {

    const ans = await this.getItemById(progressID);
    if(!ans) throw new NotFoundException();

    const checkPermisison = await this.unitDBService.checkUnitPermission(userUnitID, ans.unit)
    if(!checkPermisison) throw new ForbiddenException();
    await this.trainingDBService.removeItem(progressID);
    return await this.removeItem(progressID); 
  }

  async findListJoiner(unitsID: any, elementJoin: any): Promise<any> {

    const lstElements = (await this.userDBService.getItems({
      skip: 0,
      limit: MAX_ITEM_QUERYS,
      filter: {
        unit: {
          $in: unitsID
        },
        position: {
          $in: elementJoin
        }
      }
    })).items;

    const lstJoiner = []

    for(let position of elementJoin){
      lstJoiner.push({
        object: position,
        name_object: (await this.positionDBService.getItemById(position)).name,
        list_people: []
      })
    }

    for ( let item of lstJoiner ) {
      lstElements.map( (elem) => {
        if(elem["position"] == item.object) {
          item.list_people.push({
            "_id": elem._id, 
            "full_name": elem.full_name, 
            "joined": 0
          })
        }
      })
    }
    
    return lstJoiner
  }

  async getListPeopleJoin(userUnitID: string, progressID: string): Promise<any> {
    const progress = await this.getItemById(progressID);
    if(!progress) throw new NotFoundException();

    const checkPermisison = await this.unitDBService.checkUnitPermission(userUnitID, progress.unit);
    if(!checkPermisison) throw new ForbiddenException();

    const lstObj = progress.time_train_detail.map((item:any) => {
      return item.object
    })
    const units = await this.unitDBService.getAllDescendants(progress.unit);

    const unitsId = units.map((i) => i._id.toString());

    const training = await this.trainingDBService.getItemById(progressID);
  
    if(training.element_join.length == 0){

      return await this.findListJoiner(unitsId, lstObj)
    
    } else {

      const elementJoin = (await this.trainingDBService.getItemById(progressID)).element_join;

      const elementJoinMap = await Promise.all(elementJoin.map(async(element) => {
        return {
          ...element,
          ...{
            name_object: (await this.positionDBService.getItemById(element.object)).name
          }
        }
      }))
      return elementJoinMap;
    }
  }
}
