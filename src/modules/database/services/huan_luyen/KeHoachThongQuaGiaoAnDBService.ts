import { InjectModel } from '@nestjs/mongoose';
import { BaseDBService } from '../base';
import { Injectable } from '@nestjs/common';
import { KeHoachThongQuaGiaoAn } from '../../schemas/huan_luyen/ke_hoach_thong_qua_giao_an.schema';
import { QueryParams, ResponseQuery } from 'src/interface/i-base-db-service';

@Injectable()
export class KeHoachThongQuaGiaoAnDBService extends BaseDBService<KeHoachThongQuaGiaoAn> {
  constructor(
    @InjectModel(KeHoachThongQuaGiaoAn.name) private readonly entityModel,
  ) {
    super(entityModel);
  }

  async getItems(query: QueryParams): Promise<ResponseQuery<KeHoachThongQuaGiaoAn>> {
    let { sort, filter } = query;
    const { textSearch, skip, limit } = query;
  
    if (textSearch && textSearch !== '') {
      filter = {
        ...filter,
        ...{
          $text: {
            $search: `"${textSearch}"`,
          },
        }
      }
    }
  
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
          from: 'giaoans', // Tên bảng giao_ans
          let: { giaoAnId: '$giao_an' }, // Biến cục bộ lấy giá trị giao_an
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [{$toString: '$_id'}, { $toString: '$$giaoAnId' }], // So sánh _id của giao_ans với giao_an
                },
              },
            },
          ],
          as: 'giao_an_detail', // Tên trường mới chứa dữ liệu từ bảng giao_ans
        },
      },
      {
        $unwind: {
          path: '$giao_an_detail', // Giải nén mảng giao_an_detail
          preserveNullAndEmptyArrays: true, // Giữ bản ghi ngay cả khi không có giáo án liên kết
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
}
