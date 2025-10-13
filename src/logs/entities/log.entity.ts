import { Column, PrimaryGeneratedColumn, Entity } from 'typeorm';

@Entity('logs')
export class Logs {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;
}
