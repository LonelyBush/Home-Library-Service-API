import { User } from 'src/modules/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Favorites {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { array: true, nullable: true, default: null })
  artists: string[];

  @Column('uuid', { array: true, nullable: true, default: null })
  albums: string[];

  @Column('uuid', { array: true, nullable: true, default: null })
  tracks: string[];
  @Column('uuid')
  userId: string;

  @OneToMany(() => User, (user) => user.user)
  users: User;
  @JoinColumn({ name: 'userId' })
  user: User;
}
