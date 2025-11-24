export class CreateCustomerDto {
  name: string;
  email: string;
  password: string;
  orderIds?: string[];
}
