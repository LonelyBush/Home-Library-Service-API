import { Inject, Module } from '@nestjs/common';
import { InMemoryMapDB } from 'src/innerDb/innerDb';

@Module({
  providers: [
    {
      provide: 'DATABASE',
      useValue: new InMemoryMapDB(),
    },
  ],
  exports: ['DATABASE'],
})
export class DatabaseModule {
  constructor(@Inject('DATABASE') private readonly db: InMemoryMapDB) {}

  onModuleInit() {
    this.db.createCollection('Users');

    //hardcoded Tracks
    // Hardcoded Tracks (исправленные связи)
    this.db.insert(
      'Tracks',
      {
        id: '7a15c356-f008-4fa4-9a31-673fa747c60e',
        name: 'Bohemian Rhapsody',
        artistId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        albumId: '1e9d8c7b-6f45-4a23-9a7b-2d3c4d5e6f70',
        duration: 354,
      },
      '7a15c356-f008-4fa4-9a31-673fa747c60e',
    );
    this.db.insert(
      'Tracks',
      {
        id: '58ef7366-5a5f-4eac-9640-78927c658a79',
        name: 'Come Together',
        artistId: 'b1c7d4e9-2f6a-4ac5-9a7d-3e8f6a5b4c7d',
        albumId: '50c98043-d9ad-4086-b894-c508ef954e08',
        duration: 259,
      },
      '58ef7366-5a5f-4eac-9640-78927c658a79',
    );
    this.db.insert(
      'Tracks',
      {
        id: '68b68fe7-7534-406b-8272-55bed7b397de',
        name: 'Jigsaw Falling Into Place',
        artistId: '92b44df4-3632-496f-8d92-ba9150768758', // Исправленный ID Radiohead
        albumId: '75fc377e-6bbc-4c50-ae66-fe298b6771ea', // Исправленный ID In Rainbows
        duration: 248,
      },
      '68b68fe7-7534-406b-8272-55bed7b397de',
    );
    this.db.insert(
      'Tracks',
      {
        id: 'aa90d0cc-d92b-4788-a89b-a4b511e83d8b',
        name: 'Untitled Demo Track',
        artistId: null,
        albumId: null,
        duration: 182,
      },
      'aa90d0cc-d92b-4788-a89b-a4b511e83d8b',
    );
    //hardcoded Albums
    this.db.insert(
      'Albums',
      {
        id: '1e9d8c7b-6f45-4a23-9a7b-2d3c4d5e6f70',
        name: 'A Night at the Opera',
        year: 1975,
        artistId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      },
      '1e9d8c7b-6f45-4a23-9a7b-2d3c4d5e6f70',
    );
    this.db.insert(
      'Albums',
      {
        id: '50c98043-d9ad-4086-b894-c508ef954e08',
        name: 'Abbey Road',
        year: 1969,
        artistId: 'b1c7d4e9-2f6a-4ac5-9a7d-3e8f6a5b4c7d',
      },
      '50c98043-d9ad-4086-b894-c508ef954e08',
    );
    this.db.insert(
      'Albums',
      {
        id: '75fc377e-6bbc-4c50-ae66-fe298b6771ea',
        name: 'In Rainbows',
        year: 2007,
        artistId: '92b44df4-3632-496f-8d92-ba9150768758',
      },
      '75fc377e-6bbc-4c50-ae66-fe298b6771ea',
    );
    this.db.insert(
      'Albums',
      {
        id: 'eede4bbe-3300-4985-a195-21f0c8676f1a',
        name: 'Unknown Compilation',
        year: 2020,
        artistId: null,
      },
      'eede4bbe-3300-4985-a195-21f0c8676f1a',
    );
    //hardcoded Artists
    this.db.insert(
      'Artists',
      {
        id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        name: 'Queen',
        grammy: true,
      },
      'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    );
    this.db.insert(
      'Artists',
      {
        id: '92b44df4-3632-496f-8d92-ba9150768758',
        name: 'Radiohead',
        grammy: true,
      },
      '92b44df4-3632-496f-8d92-ba9150768758',
    );
    this.db.insert(
      'Artists',
      {
        id: 'b1c7d4e9-2f6a-4ac5-9a7d-3e8f6a5b4c7d',
        name: 'The Beatles',
        grammy: true,
      },
      'b1c7d4e9-2f6a-4ac5-9a7d-3e8f6a5b4c7d',
    );
    this.db.insert(
      'Artists',
      {
        id: '52ad0dec-6dd9-4bd7-becf-c4f90131d461',
        name: 'Local Underground Band',
        grammy: false,
      },
      '52ad0dec-6dd9-4bd7-becf-c4f90131d461',
    );
  }
}
