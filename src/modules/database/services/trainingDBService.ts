import { InjectModel } from '@nestjs/mongoose';
import { Progress } from '../schemas/progress.schema';
import { BaseDBService } from './base';
import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { QueryParams, ResponseQuery } from 'src/interface/i-base-db-service';
import { UnitDBService } from './unitDBService';
import { Training } from '../schemas/trainnings.schema';
import { PositionDBService } from './positionDBService';
import { UserDBService } from './userDBService';
import { MAX_ITEM_QUERYS, ResponseMessage } from 'src/const';


@Injectable()
export class TrainingDBService extends BaseDBService<Training> {

  @Inject(UnitDBService)
  unitDBService: UnitDBService;

  @Inject(PositionDBService)
  positionDBService: PositionDBService;

  @Inject(UserDBService)
  userDBService: UserDBService;
  
  constructor(@InjectModel(Training.name) private readonly entityModel) {
    super(entityModel);
  }

  async getTrainingOfMonth(
    userUnitID: string,
    unitTraining: string,
    query: QueryParams,
  ): Promise<ResponseQuery<any>> {
    
    const checkPermisison = await this.unitDBService.checkUnitPermission(userUnitID, unitTraining)
    if(!checkPermisison) throw new ForbiddenException();

    let lst_training = await this.getItems(query)
    const populateQuery = [
      {
          path: "progress",
      }, 
      {
          path: "unit",
      }
  ];
  
    const lst_map = await this.entityModel.populate(lst_training.items, populateQuery);
    var element = []
    const ans = await Promise.all(lst_map.map(async (item) => {
      if(item.progress.time_train_detail.length > 0){

        element = await Promise.all(item.progress.time_train_detail.map( async (x) => {
          const obj = await this.positionDBService.getItemById(x.object)
          return obj.name
        }))

      }

      return {
        _id: item._id,
        date: item.progress.date,
        content: item.progress.content,
        train_time_actual: item.time_train_actual,
        elements:  element,
        sum_joiner: item.sum_joiner,
        evaluation: item.evaluation
      }
    }))

    return {
      items: ans,
      total: lst_training.total,
      size: lst_training.size,
      page: lst_training.page,
      offset: lst_training.offset,
    };
  }

  async getHistoryTrainingOfMonth(
    userUnitID: string,
    unitTraining: string,
    query: QueryParams,
  ): Promise<ResponseQuery<any>> {
    
    const checkPermisison = await this.unitDBService.checkUnitPermission(userUnitID, unitTraining)
    if(!checkPermisison) throw new ForbiddenException();

    let lst_training = await this.getItems(query)
    const populateQuery = [
      {
          path: "progress",
      }, 
      {
          path: "unit",
      }
  ];
  
    const lst_map = await this.entityModel.populate(lst_training.items, populateQuery);

    const ans = lst_map.map((item) => {

      return {
        _id: item._id,
        day_of_week: item.progress.day_of_week,
        unit: item.unit.name,
        content: item.progress.content,
        sum_people:  item.sum_people,
        sum_joiner: item.sum_joiner,
        sum_time_train: item.progress.sum_time_train,
        time_train_actual: item.time_train_actual,
        evaluation: item.evaluation 
      }
    })

    return {
      items: ans,
      total: lst_training.total,
      size: lst_training.size,
      page: lst_training.page,
      offset: lst_training.offset,
    };
  }

  async getResultTrainingOfMonth(
    userUnitID: string,
    unitTraining: string,
    query: QueryParams,
  ) {
    
    const checkPermisison = await this.unitDBService.checkUnitPermission(userUnitID, unitTraining)
    if(!checkPermisison) throw new ForbiddenException();

    let lst_training = await this.getItems(query)
    const populateQuery = [
      {
          path: "progress",
      }, 
      {
          path: "unit",
      }
  ];
  
    const lst_training_map = await this.entityModel.populate(lst_training.items, populateQuery);

    const objTraining = lst_training_map.map((recordOfDay) => {

      if(recordOfDay.element_join.length > 0){
        return {
          date: recordOfDay.progress.date,
          joiner: recordOfDay.element_join.reduce((acc, child_obj) => acc.concat(child_obj.list_people), []) 
        }
      }
    })

    const objTrainingFilter = objTraining.filter( item => {
      return (item !== null) && (item !== undefined)
    })

    const lst_date = objTrainingFilter.map(item => item.date)
    const lst_personID : Array<string> = objTrainingFilter.reduce((acc, child_obj) => {
      return acc.concat(child_obj.joiner.map( item => item._id))
    }, [])
    const lst_personIDUnique : Array<string> = [... new Set(lst_personID)]
    
    let temp = {}
    for (let obj of objTrainingFilter){
      for(let childObj of obj.joiner){
        for(let id of lst_personIDUnique){
          if(id === childObj._id){
            if(!temp.hasOwnProperty(id)){
              const user = await this.userDBService.getItemById(id)

              temp[id] = { 
                full_name: user.full_name, 
                rank: user.rank, 
                position: user.position,
                train: [{
                  "date": obj.date, 
                  "joined": childObj.joined
                }]}
            } else {

              temp[id].train.push({
                "date": obj.date, 
                "joined": childObj.joined
              })              
            }
          }
        }
      }
    }
    const ans = {
      "date": lst_date,
      "statistic": Object.values(temp)
    }
    return ans
  }

  async updateTraining(
    userUnitID: string,
    id: string,
    entity: any,
  ) {
    const training = await this.getItemById(id)
    if(!training) throw new NotFoundException();

    const checkPermisison = await this.unitDBService.checkUnitPermission(userUnitID, training.unit)
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

  async getTrainingOfUser(
    user: any,
  ): Promise<ResponseQuery<any>> {
    
    const lstUnitID = await this.unitDBService.getAncestorUnit(user.unit)

    const query: QueryParams = {
      skip: 0,
      limit: MAX_ITEM_QUERYS,
      filter: {
        unit: {
          $in: lstUnitID
        },
      },
    };

    let lst_training = await this.getItems(query)
    const populateQuery = [
      {
          path: "progress",
      }, 
      {
          path: "unit",
      }
  ];
  
    const lst_map = await this.entityModel.populate(lst_training.items, populateQuery);
    
    const lst_filter = lst_map.filter((item) => {
      
      if(item.element_join.length > 0){
        const lstUserID = item.element_join.reduce((acc, obj) =>{

            const lstUser = obj.list_people.length > 0 ? obj.list_people.filter(people => {
              if(people._id === user._id.toString() && people.joined === 1)
                return true;
            }): []

            return acc + lstUser
        }, [])
        return lstUserID.length > 0
      }
      return false
    })

    const ans = lst_filter.map((item) => {
      return {
        _id: item._id,
        date: item.progress.date,
        content: item.progress.content,
        train_time_actual: item.time_train_actual,
        sum_joiner: item.sum_joiner,
        evaluation: item.evaluation,
        week: item.week,
        month: item.month,
        year: item.year,
        unit_charge: item.progress.unit_charge
      }
    })

    return {
      items: ans,
      total: lst_training.total,
      size: lst_training.size,
      page: lst_training.page,
      offset: lst_training.offset,
    };
  }
}
