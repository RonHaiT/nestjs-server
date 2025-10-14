import { User } from 'src/user/entities/user.entity';
import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity()
export default class Roles {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => User, (user) => user.roles)
  @JoinTable()
  user: User;
}
