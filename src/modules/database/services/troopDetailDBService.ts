import { InjectModel } from '@nestjs/mongoose';
import { BaseDBService } from './base';
import { Injectable } from '@nestjs/common';
import { TroopDetail } from '../schemas/troop-detail.schema';
import { convertTimeStampToStartDay, getDayMonthAndYear, getMidnightDate, getNumDaysOfMonth, getStartOfMonthTimestamp, getWeekday } from 'src/utils/time.helper';
import { MAX_ITEM_QUERYS } from 'src/const';
import { TroopStatus } from 'src/enums';
import { User } from '../schemas/users.schema';

@Injectable()
export class TroopDetailDBService extends BaseDBService<TroopDetail> {
  constructor(@InjectModel(TroopDetail.name) private readonly entityModel) {
    super(entityModel);
  }

  async insertOrUpdate(entity) {
    const res = await this.getFirstItem({
      time: entity.time,
      user: entity.user,
      // report: entity.report,
    });

    if (!res) {
      const ans = await this.insertItem(entity);
      return ans;
    }

    const ans = await this.updateItem(res._id.toString(), {
      status: entity.status,
    });
    return ans;
  }

  // lấy dự kiến quân số của cá nhân trong tháng
  async getListPersonalTroopReportPersonal(userId: string, time: number){
    const exactTime = getStartOfMonthTimestamp(time);
    const timeObject = getDayMonthAndYear(new Date(exactTime));
    const numDays = getNumDaysOfMonth(timeObject.month, timeObject.year);

    let curWeek = 1;
    let curDataWeek = {
      title: `Tuần ${curWeek} tháng ${timeObject.month}`,
      days: [],
    };

    const ans = [];

    for (let day = 1; day <= numDays; day++) {
      const weekDay = getWeekday(day, timeObject.month, timeObject.year);
      if (weekDay === 1 && day !== 1) {
        ans.push(curDataWeek);
        curWeek++;
        curDataWeek = {
          title: `Tuần ${curWeek} tháng ${timeObject.month}`,
          days: [],
        };
      }

      const newTime = getMidnightDate(day, timeObject.month, timeObject.year);
      const timeDay = convertTimeStampToStartDay(newTime.getTime());
      const data = await this.getItems({
        skip: 0,
        limit: MAX_ITEM_QUERYS,
        filter: {
          user: userId,
          time: timeDay
        }
      });
      const { items, total } = data;

      curDataWeek.days.push({
        dayOfWeek: weekDay,
        title: `${day}/${timeObject.month}/${timeObject.year}`,
        items,
        total,
      });
    }

    if (curDataWeek && curDataWeek.days.length) ans.push(curDataWeek);

    return ans;
  }

  // cá nhân báo quân số
  async personalReport(user: User, time: number, status: TroopStatus) {
    const timeExact = convertTimeStampToStartDay(time);

    const detailItem = {
      time: timeExact,
      status,
      user: user._id.toString(),
    };
    return this.insertOrUpdate(detailItem);
  }
}
