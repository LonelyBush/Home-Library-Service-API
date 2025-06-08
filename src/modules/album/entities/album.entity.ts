import { Artist } from 'src/modules/artist/entities/artist.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Album {
  @PrimaryGeneratedColumn('uuid')
  id: string; // uuid v4\
  @Column()
  name: string;
  @Column({ type: 'integer' })
  year: number;
  @Column({ nullable: true, default: null })
  artistId: string | null; // refers to Artist
  @OneToOne(() => Artist, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'artistId' })
  artist: Artist;
}
