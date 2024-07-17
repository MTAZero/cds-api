import { InjectModel } from '@nestjs/mongoose';
import { PersonalDiary } from '../schemas/personal-diarys.schema';
import { BaseDBService } from './base';
import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { QueryParams, ResponseQuery } from 'src/interface/i-base-db-service';
import { UnitDBService } from './unitDBService';
import { PositionDBService } from './positionDBService';
import { UserDBService } from './userDbService';
import { ProgressDBService } from './progressDBService';
import { MAX_ITEM_QUERYS } from 'src/const';

@Injectable()
export class PersonalDiaryDBService extends BaseDBService<PersonalDiary> {

  @Inject(UnitDBService)
  unitDBService: UnitDBService;

  @Inject(PositionDBService)
  positionDBService: PositionDBService;

  @Inject(UserDBService)
  userDBService: UserDBService;

  @Inject(ProgressDBService)
  progressDBService: ProgressDBService;
  
  constructor(@InjectModel(PersonalDiary.name) private readonly entityModel) {
    super(entityModel);
  }

  async getPersonalBookById(
    userID: string,
    trainingID: string,
  ): Promise<any> {
    
    const query: QueryParams = {
      skip: 0,
      limit: MAX_ITEM_QUERYS,
      filter: {
        training: trainingID,
        user: userID
      },
    };
    const personalBook = (await this.getItems(query)).items;
    if (personalBook.length === 0) return null;
    
    const populateQuery = [
      {
          path: "training",
          populate: 
          { 
            path: 'progress' 
          }
      }, 
      {
          path: "user",
      }
  ];
  
    const personalBook_map = await this.entityModel.populate(personalBook[0], populateQuery);
    
    const ans = {
      _id: personalBook_map._id,
      type: personalBook_map.type,
      note: personalBook_map.note,
      year: personalBook_map.training.year,
      month: personalBook_map.training.month,
      week: personalBook_map.training.week,
      date: personalBook_map.training.progress.date,
      dayOfWeek: personalBook_map.training.progress.dayOfWeek,
      unit_charge: personalBook_map.training.progress.unit_charge,
      location: personalBook_map.training.progress.location,
      guaranteed_material: personalBook_map.training.progress.guaranteed_material,
      unit: (await this.unitDBService.getItemById(personalBook_map.training.progress.unit)).name,
      content: personalBook_map.training.progress.content
    }
    return ans
  }

  async createPersonalBook(user: any, entity: any): Promise<any> {
    
    const progress = await this.progressDBService.getItemById(entity.training)
    
    if(!progress) throw new NotFoundException();
    if(progress.time_train_detail.length === 0) throw new ForbiddenException();

    const objectTrainOfProgress = progress.time_train_detail.map( (item: { object: any; }) => item.object.toString())
  
    if(objectTrainOfProgress.includes(user.position.toString())) 
    {
      entity.user = user._id;
      return await this.insertItem(entity)
    }
    throw new ForbiddenException()
  }

  async updatePersonalBook(userID: string, id: string, entity: any): Promise<any> {
   
    const personalBook = await this.getItemById(id)
    if(!personalBook) throw new NotFoundException();

    if(personalBook.user.toString() !== userID.toString()) throw new ForbiddenException();

    return await this.updateItem(id, entity)
  }
}
