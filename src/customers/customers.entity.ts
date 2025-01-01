import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsEnum } from 'class-validator';
import { GenderEnum } from 'src/utils/enums';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn()
  @Field()
  id: number;

  @Column()
  @Field()
  firstName: string;

  @Column()
  @Field()
  lastName: string;

  @Column()
  @Field()
  lastFileUpdated: Date;

  @Column({ length: 11 })
  @Field()
  mobile: string;

  @Column({ default: null })
  @Field()
  dateOfBirth: string;

  @Column({ type: 'enum', enum: GenderEnum })
  @Field()
  @IsEnum(GenderEnum, { message: 'Role must be one of male, female, other' })
  gender: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;

  @Column({ default: true })
  @Field()
  isActive: boolean;
}
