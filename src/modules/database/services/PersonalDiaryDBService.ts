import { InjectModel } from '@nestjs/mongoose';
import { PersonalDiary } from '../schemas/personal-diarys.schema';
import { BaseDBService } from './base';
import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { QueryParams, ResponseQuery } from 'src/interface/i-base-db-service';
import { UnitDBService } from './unitDBService';
import { Training } from '../schemas/trainnings.schema';
import { PositionDBService } from './positionDBService';
import { UserDBService } from './userDbService';
import { ProgressDBService } from './progressDBService';

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
    id: string,
  ): Promise<PersonalDiary> {
    
    const personalBook = await this.getItemById(id);

    if(!personalBook) throw new NotFoundException();
    //if(personalBook.user.toString() !== userID.toString()) throw new ForbiddenException();
    
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
  
    const personalBook_map = await this.entityModel.populate(personalBook, populateQuery);
    const lstPeople = personalBook_map.training.element_join.reduce(
      (acc, current) =>  acc.list_people + current.list_people, []
    )
    
    // const lstPeopleID = lstPeople.map((person: any) => {
      
    // })
    return personalBook_map
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
