import { TroopStatus } from 'src/enums';
import { TroopReportType } from 'src/types/troop-report';

export const getTextOfReport = (a: TroopReportType): string => {
  let ans = '';

  ans = `Quân số ${a.name}: Có mặt: ${getTextNumber(a.totalAttendance)}/${getTextNumber(a.total)}(`;

  for (let index = 0; index < a.troopEachTypes.length; index++) {
    const item = a.troopEachTypes[index];
    let itemRes = `${item.type}: ${getTextNumber(item.totalAttendance)}/${getTextNumber(item.total)}`;
    if (index < a.troopEachTypes.length - 1) itemRes += '; ';
    ans = ans + itemRes;
  }

  ans += `). Vắng: ${getTextNumber(a.totalLeft)}`;
  if (a.totalLeft) ans += ` (Trong đó: `;

  for (let index = 0; index < a.leftReasons.length; index++) {
    const item = a.leftReasons[index];
    let itemRes = `${getReasonText(item.status)}: ${getTextNumber(item.number)}`;
    if (index < a.leftReasons.length - 1) itemRes += '; ';
    ans = ans + itemRes;
  }
  if (a.totalLeft) ans += `)`;

  return ans;
};

export const getTextNumber = (a: number): string => {
  if (a < 10) return '0' + a;
  return a.toString();
};

export const getReasonText = (status: TroopStatus) => {
  switch (status) {
    case TroopStatus.CoMat:
      return 'có mặt';

    case TroopStatus.NghiPhep:
      return 'nghỉ phép';

    case TroopStatus.NghiOm:
      return 'nghỉ ốm';

    case TroopStatus.DiVien:
      return 'đi viện';

    case TroopStatus.TranhThu:
      return 'tranh thủ';

    case TroopStatus.NghiCuoiTuan:
      return 'nghỉ cuối tuần';

    case TroopStatus.CongTac:
      return 'công tác';

    case TroopStatus.ChinhSach:
      return 'chính sách';

    case TroopStatus.Khac:
      return 'khác';

    case TroopStatus.DiHoc:
      return 'đi học';

    default:
      return '';
  }
};
