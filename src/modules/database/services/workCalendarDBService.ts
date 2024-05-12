import { InjectModel } from '@nestjs/mongoose';
import { BaseDBService } from './base';
import { Injectable } from '@nestjs/common';
import { WorkCalendar } from '../schemas/work-calendar.schema';
import { QueryParams, ResponseQuery } from 'src/interface/i-base-db-service';

@Injectable()
export class WorkCalendarDBService extends BaseDBService<WorkCalendar> {
  constructor(@InjectModel(WorkCalendar.name) private readonly entityModel) {
    super(entityModel);
  }

  async getItems(query: QueryParams): Promise<ResponseQuery<WorkCalendar>> {
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
          from: 'workcalendarassigns',
          let: {
            id: '$_id',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [{ $toString: '$work_calendar' }, { $toString: '$$id' }],
                },
              },
            },
          ],
          as: 'assigns',
        },
      },
      {
        $project: {
          password: 0,
        },
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

  async getCalendarOfUser(
    userId: string,
    startTime: number = 0,
    endTime: number = 100000000000000000,
  ) {
    const queryDb: any = [
      {
        $match: {
          time_start: {
            $gte: startTime,
            $lte: endTime,
          },
        },
      },
      {
        $lookup: {
          from: 'workcalendarassigns',
          let: {
            id: '$_id',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [{ $toString: '$work_calendar' }, { $toString: '$$id' }],
                },
              },
            },
            {
              $match: {
                $expr: {
                  $eq: ['$isUnit', false],
                },
              },
            },
            {
              $match: {
                $expr: {
                  $eq: [{ $toString: '$user' }, userId],
                },
              },
            },
          ],
          as: 'assigns',
        },
      },
      {
        $match: {
          $expr: {
            $ne: [
              0,
              {
                $size: '$assigns',
              },
            ],
          },
        },
      },
      {
        $unset: 'assigns',
      },
      {
        $lookup: {
          from: 'workcalendarassigns',
          let: {
            id: '$_id',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [{ $toString: '$work_calendar' }, { $toString: '$$id' }],
                },
              },
            },
          ],
          as: 'assigns',
        },
      },
    ];

    const ans = await this.entityModel.aggregate(queryDb).exec();
    return ans;
  }

  async getCalendarOfUnit(
    unitId: string,
    startTime: number = 0,
    endTime: number = 100000000000000000,
  ) {
    const queryDb: any = [
      {
        $match: {
          time_start: {
            $gte: startTime,
            $lte: endTime,
          },
        },
      },
      {
        $lookup: {
          from: 'workcalendarassigns',
          let: {
            id: '$_id',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [{ $toString: '$work_calendar' }, { $toString: '$$id' }],
                },
              },
            },
            {
              $match: {
                $expr: {
                  $eq: ['$isUnit', true],
                },
              },
            },
            {
              $match: {
                $expr: {
                  $eq: [{ $toString: '$unit' }, unitId],
                },
              },
            },
          ],
          as: 'assigns',
        },
      },
      {
        $match: {
          $expr: {
            $ne: [
              0,
              {
                $size: '$assigns',
              },
            ],
          },
        },
      },
      {
        $unset: 'assigns',
      },
      {
        $lookup: {
          from: 'workcalendarassigns',
          let: {
            id: '$_id',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [{ $toString: '$work_calendar' }, { $toString: '$$id' }],
                },
              },
            },
          ],
          as: 'assigns',
        },
      },
    ];

    const ans = await this.entityModel.aggregate(queryDb).exec();
    return ans;
  }
}
