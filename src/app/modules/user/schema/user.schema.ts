import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserSchema {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;
}