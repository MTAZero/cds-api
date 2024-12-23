import { InjectModel } from '@nestjs/mongoose';
import { BaseDBService } from './base';
import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UnitDBService } from './unitDBService';
import { PositionDBService } from './positionDBService';
import { RelatedDocument } from '../schemas/related-documents.schema';
import { QueryParams, ResponseQuery } from 'src/interface/i-base-db-service';
import { readFileSync, rmSync   } from 'fs'
import { archiveConfig } from './../../../configs/configuration.config';
import { TypeBookDBService } from './typeBookDBService';

@Injectable()
export class RelatedDocumentDBService extends BaseDBService<RelatedDocument> {

  @Inject(UnitDBService)
  unitDBService: UnitDBService;z
 
  @Inject(PositionDBService)
  positionDBService: PositionDBService;

  @Inject(TypeBookDBService)
  typeBookDBService: TypeBookDBService;

  constructor(@InjectModel(RelatedDocument.name) private readonly entityModel) {
    super(entityModel);
  }

  async getListDocuments(query: QueryParams): Promise<ResponseQuery<any>> {

    let { filter } = query;
    const { skip, limit } = query;
    const pageIndex = skip / limit + 1;

    const typeBook = await this.typeBookDBService.getFirstItem(filter)

    filter = {
      ...filter,
      type: typeBook._id.toString()
    }

    const lstDocuments = await this.getItems({
      ...query,
      ...{
        filter,
      },
    });
    
    const populateQuery = [
      {
        path: "user",
        populate: 
        { 
          path: 'unit' 
        }
      },
      {
        path: 'type'
      },
      {
        path: 'unit'
      }
  ];
  
    const lst_map = await this.entityModel.populate(lstDocuments.items, populateQuery);
    const ans = lst_map.map( (item) => {

      return {
        _id: item._id,
        name: item.name,
        user: item.user._id,
        nameOfUser: item.user.full_name,
        unitOfUser: item.user.unit.name,
        type: item.type.type,
        typeName: item.type.name,
        unit: item.unit._id,
        unitName: item.unit.name,
        url: item.url,
        create_at: item.created_date,
        update_at: item.last_update
      }
    })
    return ans;
  }

  async getContentDocument(id: string): Promise<any> {

    const document = await this.getItemById(id);
    if(!document) throw new NotFoundException();
    const uploadFolder = archiveConfig().folder_saved;

    const file = readFileSync(uploadFolder + document.url);
    const encodeFile = file.toString('base64');

    return encodeFile;
  }

  async removeFile(id: string): Promise<any> {
    const document = await this.getItemById(id);
    if(!document) throw new NotFoundException();

    const ans = await this.removeItem(id)
    if(!ans) throw new BadRequestException();
  
    try {
      rmSync( archiveConfig().folder_saved + document.url, {
        force: true
      })
    } catch (e) {
      console.log(e)
    }
  }

   async insertItem(entity: any): Promise<any> {
      const typeBook = await this.typeBookDBService.getFirstItem({ type: entity.type });
      
      if(!typeBook) throw new BadRequestException("Loại document không tồn tại")

      let _entity = {
        ...entity,
        type: typeBook._id.toString()
      }
      return await super.insertItem(_entity);
  }
}
