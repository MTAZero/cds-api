import { InjectModel } from '@nestjs/mongoose';
import { BaseDBService } from './base';
import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UnitDBService } from './unitDBService';
import { QueryParams, ResponseQuery } from 'src/interface/i-base-db-service';
import { StatisticDocumentBook } from '../schemas/statistic-document-book.schema';

@Injectable()
export class StatisticDocumentBookDBService extends BaseDBService<StatisticDocumentBook> {
  
  @Inject(UnitDBService)
  unitDBService: UnitDBService;
  
  constructor(@InjectModel(StatisticDocumentBook.name) private readonly entityModel) {
    super(entityModel);
  }

  async getStatisticDocumentBookBelongUnit(
    userUnitId: string,
    unitId: string,
    query: QueryParams,
  ): Promise<ResponseQuery<any>> {
    let { filter } = query;
    const { skip, limit } = query;
    const pageIndex = skip / limit + 1;

    const checkPermisison = await this.unitDBService.checkUnitPermission(userUnitId, unitId)
    if(!checkPermisison) throw new ForbiddenException();

    let lstStatisticDocumentBook = await this.getItems({
      ...query,
      ...{
        filter,
      },
    });

    const populateQuery = [
      {
          path: "unitId",
      }
  ];
  
    const lst = await this.entityModel.populate(lstStatisticDocumentBook.items, populateQuery);

    const ans = lst.map(
      (item) => {
        return {
          ...item,
          ...{
            unitId: item.unitId._id,
            unitName: item.unitId.name
          }
        }
      }
    )

    return ans;
  }

  async insert(userUnitID: string, entity: any): Promise<StatisticDocumentBook> {
    
    const checkPermisison = await this.unitDBService.checkUnitPermission(userUnitID, entity.unitId)
    if(!checkPermisison) throw new ForbiddenException();
    const statisticDocumentBook =  await this.insertItem(entity);
    return statisticDocumentBook;

  }

  async update(userUnitID: string, statisticDocumentBookID: string ,entity: any): Promise<StatisticDocumentBook> {

    const statisticDocumentBook = await this.getItemById(statisticDocumentBookID);
    if(!statisticDocumentBook) throw new NotFoundException();

    const checkPermisison = await this.unitDBService.checkUnitPermission(userUnitID, statisticDocumentBook.unitId)
    if(!checkPermisison) throw new ForbiddenException();

    return await this.updateItem(statisticDocumentBookID, entity);

  }

  async remove(userUnitID: string, statisticDocumentBookID: string): Promise<any> {
    const statisticDocumentBook = await this.getItemById(statisticDocumentBookID);
    if(!statisticDocumentBook) throw new NotFoundException();

    const checkPermisison = await this.unitDBService.checkUnitPermission(userUnitID, statisticDocumentBook.unitId)
    if(!checkPermisison) throw new ForbiddenException();

    return await this.removeItem(statisticDocumentBookID);
  }

  async getDetail(userUnitID: string, statisticDocumentBookID: string): Promise<any> {

    const statisticDocumentBook = await this.getItemById(statisticDocumentBookID)
    if(!statisticDocumentBook) throw new NotFoundException();

    const checkPermisison = await this.unitDBService.checkUnitPermission(userUnitID, statisticDocumentBook.unitId)
    if(!checkPermisison) throw new ForbiddenException();

    const ans = {
      ...statisticDocumentBook,
      unitName: (await this.unitDBService.getItemById(statisticDocumentBook.unitId)).name,
    };

    return ans;
  }

}
