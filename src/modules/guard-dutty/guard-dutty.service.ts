import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import {
  convertTimeStampToStartDay,
  getDayMonthAndYear,
  getMidnightDate,
  getNumDaysOfMonth,
  getStartNextMonth,
} from 'src/utils/time.helper';
import { GuardDuttyPositionDBService } from '../database/services/guardDuttyPostionDBService';
import { MAX_ITEM_QUERYS } from 'src/const';
import { GuardDuttyDBService } from '../database/services/guardDuttyDBService';

@Injectable()
export class GuardDuttyService {
  @Inject(GuardDuttyPositionDBService)
  guardDuttyPositionDBService: GuardDuttyPositionDBService;

  @Inject(GuardDuttyDBService)
  guardDuttyDBService: GuardDuttyDBService;

  @Cron('0 0 20 * *') // '0 0 20 * *'
  async generateGuardDutty() {
    const date = getDayMonthAndYear(new Date());

    const nextDate = getStartNextMonth(date.month, date.year);

    const { items } = await this.guardDuttyPositionDBService.getItems({
      skip: 0,
      limit: MAX_ITEM_QUERYS,
      filter: {},
    });

    const numDays = getNumDaysOfMonth(nextDate.month, nextDate.year);
    for (let index = 0; index < items.length; index++) {
      const position = items[index];

      for (let num = 1; num <= position.number; num++) {
        for (let day = 1; day <= numDays; day++) {
          const newTime = getMidnightDate(day, nextDate.month, nextDate.year);
          const timeDay = convertTimeStampToStartDay(newTime.getTime());

          const guardDutty = {
            time: timeDay,
            guard_dutty_position: position._id,
            unit: position.unit,
            unit_default: position.unit,
            note: `${day}/${nextDate.month}/${nextDate.year}`,
            is_complete: false,
            number: num,
          };

          console.log(guardDutty);

          const count = await this.guardDuttyDBService.countByFilter({
            time: timeDay,
            guard_dutty_position: position._id,
            number: num,
          });

          if (count === 0) this.guardDuttyDBService.insertItem(guardDutty);
        }
      }
    }
  }
}
