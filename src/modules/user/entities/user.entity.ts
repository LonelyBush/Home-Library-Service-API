import { Favorites } from 'src/modules/favs/entities/fav.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
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

  @OneToOne(() => Favorites, (user) => user.userId)
  user: Favorites;
}
