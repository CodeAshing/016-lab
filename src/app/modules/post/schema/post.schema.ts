import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class postEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}

