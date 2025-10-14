import { User } from 'src/user/entities/user.entity';
import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Logs {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  path: string;

  @Column()
  method: string;

  @Column()
  data: string;

  @Column()
  result: number;

  @ManyToOne(() => User, (user) => user.logs)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
