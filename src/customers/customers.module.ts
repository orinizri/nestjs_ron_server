import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './customers.entity';
import { CustomersService } from './customers.service';
import { CustomersResolver } from './customers.resolver';


@Module({
  imports: [TypeOrmModule.forFeature([Customer])],
  providers: [CustomersService, CustomersResolver],
  controllers: [],
})
export class CustomerModule {}