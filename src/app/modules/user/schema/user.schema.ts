import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

@Entity()
export class UserSchema {
  @ApiProperty({ example: 1, description: "The unique identifier of the User", type: Number })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: "Asharib", description: "The first name of User", type: String })
  @Column()
  firstName: string;

  @ApiPropertyOptional({ example: "Ahmed", description: "The last name of User", type: String })
  @Column({ nullable: true })
  lastName: string;

  @ApiProperty({
    example: 'asharibahmed143@gmail.com', description: "The unique email of the User", uniqueItems: true, type: String,
    format: 'email'

  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ example: 'asharib90', description: "The unique username of the User", type: String })
  @Column({ unique: true })
  userName: string;

  @ApiProperty({ example: 'Admin', description: "The role of the User", type: String })
  @Column()
  role: string;

  @ApiProperty({ example: '123456', description: "The password of the User", type: String })
  @Column()
  password: string;
}