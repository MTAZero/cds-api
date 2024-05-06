import { InjectModel } from '@nestjs/mongoose';
import { BaseDBService } from './base';
import { Injectable } from '@nestjs/common';
import { GuardDuttyPosition } from '../schemas/guard-dutty-position.schema';
import { QueryParams, ResponseQuery } from 'src/interface/i-base-db-service';

@Injectable()
export class GuardDuttyPositionDBService extends BaseDBService<GuardDuttyPosition> {
  constructor(
    @InjectModel(GuardDuttyPosition.name) private readonly entityModel,
  ) {
    super(entityModel);
  }

  async getItems(
    query: QueryParams,
  ): Promise<ResponseQuery<GuardDuttyPosition>> {
    let { sort, filter } = query;
    const { textSearch, skip, limit } = query;

    if (textSearch && textSearch !== '')
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
        $lookup: {
          from: 'units',
          let: {
            unit: '$unit',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [{ $toString: '$_id' }, '$$unit'],
                },
              },
            },
          ],
          as: 'unit_infos',
        },
      },
      {
        $set: {
          unit_info: {
            $arrayElemAt: ['$unit_infos', 0],
          },
        },
      },
      {
        $unset: 'unit_infos',
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

    const ans = await this.entityModel.aggregate(queryDb).exec();
    const res_total = await this.entityModel.aggregate([
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
}
