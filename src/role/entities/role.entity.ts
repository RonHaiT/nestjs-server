import { Column, PrimaryGeneratedColumn, Entity } from 'typeorm';
@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
