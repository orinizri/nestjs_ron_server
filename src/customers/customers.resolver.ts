import { Args, Int, Resolver, Query } from '@nestjs/graphql';
import { Customer } from "./customers.entity";
import { CustomersService } from "./customers.service";

@Resolver(() => Customer)
export class CustomersResolver {
  constructor(
    private customersService: CustomersService,
  ) {}

  @Query(() => [Customer])
  async customers(): Promise<Customer[]>{
    return await this.customersService.findAll()
  }
}