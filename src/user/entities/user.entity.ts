import { Logs } from 'src/logs/entities/log.entity';
import Roles from 'src/roles/entities/role.entity';
import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  JoinColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @OneToMany((type) => Logs, (logs) => logs.user)
  @JoinColumn({ name: 'logs_id' })
  logs: Logs[];

  @ManyToMany((type) => Roles, (roles) => roles.user)
  @JoinTable({ name: 'user_roles' })
  roles: Roles;
}
