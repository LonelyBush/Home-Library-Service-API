import { Favorites } from 'src/modules/favs/entities/fav.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
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
  version: number;
  @CreateDateColumn({
    transformer: {
      to: (val: number) => val,
      from: (val: Date) => (val ? val.getTime() : null),
    },
  })
  createdAt: Date;
  @UpdateDateColumn({
    transformer: {
      to: (val: number) => val,
      from: (val: Date) => (val ? val.getTime() : null),
    },
  })
  updatedAt: Date;

  @OneToOne(() => Favorites, (favorites) => favorites.user, {
    cascade: true,
    eager: true,
    nullable: true,
  })
  @JoinColumn()
  favorites: Favorites;
}
