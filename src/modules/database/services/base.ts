import { Injectable } from '@nestjs/common';
import { Model, Document } from 'mongoose';
import {
  IBaseDBService,
  QueryParams,
  ResponseQuery,
} from 'src/interface/i-base-db-service';

@Injectable()
export class BaseDBService<T extends Document> implements IBaseDBService<T> {
  constructor(private readonly model: Model<T>) {}

  async getItems(query: QueryParams): Promise<ResponseQuery<T>> {
    let { sort, filter } = query;
    const { textSearch, skip, limit } = query;

    if (textSearch !== '')
      filter = {
        ...filter,
        ...{
          $text: {
            $search: `"${textSearch}"`,
          },
        },
      };

    sort = {
      ...sort,
      ...{
        _id: 1,
      },
    };

    const queryDb: any = [
      {
        $match: filter,
      },
      {
        $sort: sort,
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ];

    const ans = await this.model.aggregate(queryDb).exec();
    const res_total = await this.model.aggregate([
      {
        $match: filter,
      },
      {
        $count: 'total',
      },
    ]);

    const total = res_total[0] ? res_total[0].total : 0;
    const pageIndex = skip / limit + 1;

    return {
      items: ans,
      total: total,
      size: limit,
      page: pageIndex,
      offset: skip,
    };
  }

  async getItemById(id: any): Promise<T | null> {
    return await this.model.findById(id).exec();
  }

  async updateItem(id: any, entity: Partial<T>): Promise<T | null> {
    await this.model
      .updateOne(
        {
          _id: id,
        },
        entity,
      )
      .exec();

    return await this.model.findById(id);
  }

  async removeItem(id: any): Promise<boolean> {
    try {
      await this.model
        .deleteOne({
          _id: id,
        })
        .exec();

      return true;
    } catch (ex: any) {
      return false;
    }
  }

  async insertItem(entity: Partial<T>): Promise<any> {
    const _entity = new this.model(entity);
    return _entity.save();
  }

  async getFirstItem(query: object = {}, sort: any = { _id: 1 }) {
    const ans = await this.model.find(query).sort(sort).limit(1).lean().exec();
    const res = ans[0];
    return res;
  }

  async removeMany(query: object = {}): Promise<boolean> {
    try {
      await this.model.deleteMany(query).exec();
      return true;
    } catch (ex: any) {
      return false;
    }
  }

  async updateMany(query: object = {}, entity: any) {
    entity.last_update = new Date().getTime();
    const ans = await this.model.updateMany(query, entity);
    return ans;
  }
}
