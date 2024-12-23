import { IsDate, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { LoaiNoiDungHuanLuyenThang } from 'src/enums';

export class UpdateMonthlyPlanDetailDto {

    @IsNotEmpty()
    @IsMongoId()
    ke_hoach_thang: string;

    @IsNotEmpty()
    @IsNumber()
    thu_tu: number;

    @IsNotEmpty()
    @IsString()
    loai_doi_tuong: string;

    @IsNotEmpty()
    @IsString()
    loai_noi_dung: LoaiNoiDungHuanLuyenThang;

    @IsNotEmpty()
    @IsString()
    type: string;

    @IsNotEmpty()
    @IsString()
    tham_gia: string;

    @IsNotEmpty()
    @IsString()
    noi_dung: string;

    @IsNotEmpty()
    @IsString()
    cap_phu_trach: string;

    @IsNotEmpty()
    @IsString()
    bien_phap_tien_hanh: string;

    @IsOptional()
    @IsNumber()
    created_date: number;

    @IsOptional()
    @IsNumber()
    last_update: number;

    @IsOptional()
    @IsNumber()
    tong_gio: number;

    @IsOptional()
    @IsNumber()
    tuan_1: number;

    @IsOptional()
    @IsNumber()
    tuan_2: number;

    @IsOptional()
    @IsNumber()
    tuan_3: number;

    @IsOptional()
    @IsNumber()
    tuan_4: number;

    @IsOptional()
    @IsNumber()
    tuan_5: number;
}