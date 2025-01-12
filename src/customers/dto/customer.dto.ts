import {
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  IsDate,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { GenderEnum } from 'src/utils/enums';

export class CreateCustomerDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  middleName?: string;

  @IsNotEmpty()
  @IsDate()
  lastFileUpdated: Date;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  countryCode?: string;

  @IsOptional()
  @IsString()
  mobile?: string;

  @IsOptional()
  @IsString()
  dateOfBirth?: string;

  @IsEnum(GenderEnum)
  @IsOptional()
  gender: string;

  @IsBoolean()
  @IsOptional()
  hasRegistrationDetails: boolean;

  @IsBoolean()
  @IsOptional()
  registrationDetailsCompleted: boolean;

  @IsBoolean()
  @IsOptional()
  isActive: boolean = true;

  @IsBoolean()
  @IsOptional()
  hasPassportCopy: boolean;
  
  @IsString()
  @IsOptional()
  passportCountry: string;
}
