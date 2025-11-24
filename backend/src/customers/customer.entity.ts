import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column('text', { array: true, nullable: true })
  orderIds?: string[];

  @Column({ select: false, nullable: true })
  passwordHash: string;

  @Column({ default: 'user' })
  role: 'user' | 'admin';
}
