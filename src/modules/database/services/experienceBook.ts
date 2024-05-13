// import { InjectModel } from '@nestjs/mongoose';
// import { PersonalDiary } from '../schemas/personal-diarys.schema';
// import { BaseDBService } from './base';
// import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
// import { UnitDBService } from './unitDBService';
// import { PositionDBService } from './positionDBService';
// import { UserDBService } from './userDbService';
// import { ExperienceBook } from '../schemas/experience-book.schem';

// @Injectable()
// export class ExperienceBookDBService extends BaseDBService<ExperienceBook> {

//   @Inject(UnitDBService)
//   unitDBService: UnitDBService;
 
//   @Inject(PositionDBService)
//   positionDBService: PositionDBService;

//   constructor(@InjectModel(ExperienceBook.name) private readonly entityModel) {
//     super(entityModel);
//   }

//   async getExperienceBookById(
//     unitUserID: string,
//     id: string,
//   ): Promise<ExperienceBook> {
    
//     const experienceBook = await this.getItemById(id);
//     if(!experienceBook) throw new NotFoundException();

//     const checkPermission = await this.unitDBService.checkUnitIsDescenants(unitUserID, experienceBook.unit)        
//     if(!checkPermission) throw new ForbiddenException();

//     return experienceBook;
//   }

//   async createPersonalBook(user: any, entity: any): Promise<any> {
    
//     const progress = await this.progressDBService.getItemById(entity.training)
    
//     if(!progress) throw new NotFoundException();
//     if(progress.time_train_detail.length === 0) throw new ForbiddenException();

//     const objectTrainOfProgress = progress.time_train_detail.map( (item: { object: any; }) => item.object.toString())
  
//     if(objectTrainOfProgress.includes(user.position.toString())) 
//     {
//       entity.user = user._id;
//       return await this.insertItem(entity)
//     }
//     throw new ForbiddenException()
//   }

//   async updatePersonalBook(userID: string, id: string, entity: any): Promise<any> {
   
//     const personalBook = await this.getItemById(id)
//     if(!personalBook) throw new NotFoundException();

//     if(personalBook.user.toString() !== userID.toString()) throw new ForbiddenException();

//     return await this.updateItem(id, entity)
//   }
// }
