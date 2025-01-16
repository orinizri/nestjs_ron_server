import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { GenderEnum } from 'src/utils/enums';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @IsNotEmpty()
  id: number;

  @Column()
  @Field()
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  middleName: string;

  @Column()
  @Field()
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @Column()
  @Field()
  @IsNotEmpty()
  @IsString()
  countryCode: string;

  @Column()
  @Field()
  @IsNotEmpty()
  @IsString()
  mobile: string;

  @Column()
  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Column({ default: null })
  @Field()
  @IsNotEmpty()
  @IsDate()
  dateOfBirth: string;

  @Column({ type: 'enum', enum: GenderEnum })
  @Field()
  @IsEnum(GenderEnum, { message: 'Role must be one of male, female, other' })
  gender: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  @IsBoolean()
  hasID: boolean;

  @Column({ nullable: true })
  @Field({ nullable: true })
  @IsBoolean()
  hasRegistrationDocument: boolean;

  @Column()
  @Field()
  @IsOptional()
  @IsDate()
  registrationDocumentUpdatedAt: Date;

  @Column({ nullable: false })
  @Field({ nullable: false })
  @IsBoolean()
  familyTreeFile: boolean;

  @Column({ nullable: false })
  @Field({ nullable: false })
  @IsOptional()
  @IsDate()
  familyTreeFileUpdatedAt: Date;

  @Column({ type: 'text', nullable: true })
  @Field({ nullable: true })
  @IsString()
  passports: string;

  @Column({ type: 'text', nullable: true })
  @Field({ nullable: true })
  @IsString()
  additional_files: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  @IsString()
  country: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  @IsBoolean()
  receivedPriceOffer: Boolean;

  @Column({ nullable: true })
  @Field({ nullable: true })
  @IsBoolean()
  signedPriceOffer: boolean;

  @Column({ default: true })
  @Field({ defaultValue: true })
  isActive: boolean;

  // Created at
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  // Updated at
  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;
}
