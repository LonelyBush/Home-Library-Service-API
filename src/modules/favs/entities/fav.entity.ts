import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class Favorites {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('uuid', { array: true, default: [] })
  artists: string[];

  @Column('uuid', { array: true, default: [] })
  albums: string[];

  @Column('uuid', { array: true, default: [] })
  tracks: string[];
}
