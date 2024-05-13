import { InjectModel } from '@nestjs/mongoose';
import { BaseDBService } from './base';
import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UnitDBService } from './unitDBService';
import { PositionDBService } from './positionDBService';
import { RelatedDocument } from '../schemas/related-documents.schema';
import { QueryParams, ResponseQuery } from 'src/interface/i-base-db-service';
import { readFileSync } from 'fs'

@Injectable()
export class RelatedDocumentDBService extends BaseDBService<RelatedDocument> {

  @Inject(UnitDBService)
  unitDBService: UnitDBService;
 
  @Inject(PositionDBService)
  positionDBService: PositionDBService;

  constructor(@InjectModel(RelatedDocument.name) private readonly entityModel) {
    super(entityModel);
  }

  async getListDocuments(query: QueryParams): Promise<ResponseQuery<any>> {

    const lstDocuments = await this.getItems(query)
    const populateQuery = [
      {
          path: "user",
          populate: 
          { 
            path: 'unit' 
          }
          
      }
  ];
  
    const lst_map = await this.entityModel.populate(lstDocuments.items, populateQuery);
    const ans = lst_map.map( (item) => {

      return {
        _id: item._id,
        nameOfUser: item.user.full_name,
        unitOfUser: item.user.unit.name,
        name: item.name,
        type: item.type,
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
    const uploadFolder = "files/";

    const file = readFileSync(uploadFolder + document.url);
    const encodeFile = file.toString('base64');

    return encodeFile;
  }
}
