import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string; // uuid v4

  @Column()
  login: string;
  @Column()
  password: string;
  @VersionColumn()
  version: number; // integer number, increments on update
  @CreateDateColumn({
    transformer: {
      to: (val: number) => val,
      from: (val: Date) => (val ? val.getTime() : null),
    },
  })
  createdAt: Date; // timestamp of creation
  @UpdateDateColumn({
    transformer: {
      to: (val: number) => val,
      from: (val: Date) => (val ? val.getTime() : null),
    },
  })
  updatedAt: Date; // timestamp of last update
}
