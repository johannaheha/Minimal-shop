import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { array: true })
  productIds: string[];

  @Column('float')
  totalPrice: number;

  @Column()
  customerId: string;
}
