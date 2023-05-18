import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class PostSchema {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  createdBy: string;

  @Column()
  image: string;
}
