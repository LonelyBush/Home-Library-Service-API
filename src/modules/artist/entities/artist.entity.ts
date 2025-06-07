import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Artist {
  @PrimaryGeneratedColumn('uuid')
  id: string; // uuid v4
  @Column()
  name: string;
  @Column({ type: 'boolean', default: 'false' })
  grammy: boolean;
}
