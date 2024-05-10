import { InjectModel } from '@nestjs/mongoose';
import { BaseDBService } from './base';
import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UnitDBService } from './unitDBService';
import { PositionDBService } from './positionDBService';
import { ExperienceBook } from '../schemas/experience-book.schema';
import { QueryParams, ResponseQuery } from 'src/interface/i-base-db-service';

@Injectable()
export class ExperienceBookDBService extends BaseDBService<ExperienceBook> {

  @Inject(UnitDBService)
  unitDBService: UnitDBService;
 
  @Inject(PositionDBService)
  positionDBService: PositionDBService;

  constructor(@InjectModel(ExperienceBook.name) private readonly entityModel) {
    super(entityModel);
  }

  async getListExperienceBook(
    userUnitID: string,
    bookUnitID: string,
    query: QueryParams
  ): Promise<ResponseQuery<any>> {

    const checkPermisison = await this.unitDBService.checkUnitPermission(userUnitID, bookUnitID)
    if(!checkPermisison) throw new ForbiddenException();

    const ans = await this.getItems(query)
    return ans;
  }

  async getExperienceBookById(
    userUnitID: string,
    id: string,
  ): Promise<ExperienceBook> {
    
    const experienceBook = await this.getItemById(id);
    if(!experienceBook) throw new NotFoundException();

    const checkPermission = await this.unitDBService.checkUnitPermission(userUnitID, experienceBook.unit)        
    if(!checkPermission) throw new ForbiddenException();
    const unitName = (await this.unitDBService.getItemById(experienceBook.unit)).name;
    const ans = {
      ...experienceBook,
      ...{
        unitName: unitName   
      }
    }
    return ans;
  }

  async createExprienceBook(userUnitID: string, entity: any): Promise<any> {

    const checkPermission = await this.unitDBService.checkUnitPermission(userUnitID, entity.unit)
    
    if(!checkPermission) throw new ForbiddenException();

    const experienceBook = await this.insertItem(entity)
    return experienceBook;
  }

  async updateExperienceBook(userUnitID: string, id: string, entity: any): Promise<any> {
   
    const experienceBook = await this.getItemById(id);
    if(!experienceBook) throw new NotFoundException();

    const checkPermission = await this.unitDBService.checkUnitPermission(userUnitID, experienceBook.unit)        
    if(!checkPermission) throw new ForbiddenException();

    return await this.updateItem(id, entity)
  }
}
