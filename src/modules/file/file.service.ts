import { Inject, Injectable } from '@nestjs/common';
import { createWriteStream, WriteStream } from 'fs';
import { join, extname, basename, dirname } from 'path';
import { __basedir } from 'src/main';
import { checkIfFileExists } from 'src/utils/checkIfFileExists';
import { getFileSize } from 'src/utils/getFileSize';
import { renameFile } from 'src/utils/renameFile';
import { uncolorize } from 'src/utils/uncolorise';

@Injectable()
export class RotatingFileService {
  currentSize: number;
  writable: null | WriteStream;
  filepath: string;
  constructor(
    @Inject('FILE_NAME')
    private filename: string = 'home-lib',
    @Inject('MAX_SIZE_KB')
    private maxSize: number,
    @Inject('MAX_FILES_IN_ROW')
    private maxFilesInRotateRow: number = 2,
  ) {
    this.filename = `${filename}.log`;
    this.filepath = join(__basedir, `/logs/${this.filename}`);
    this.maxSize = maxSize;
    this.maxFilesInRotateRow = maxFilesInRotateRow;
    this.currentSize = 0;
    this.init();
  }

  createWriteStream() {
    this.writable = createWriteStream(this.filepath, {
      flags: 'a',
      encoding: 'utf8',
    });
  }

  async rotate() {
    const filename = basename(this.filepath, '.log');
    const ext = extname(this.filepath);
    const dir = dirname(this.filepath);

    for (let i = this.maxFilesInRotateRow - 1; i > 0; i--) {
      const current = join(dir, `${filename}.${i}${ext}`);
      const next = join(dir, `${filename}.${i + 1}${ext}`);

      const isExists = await checkIfFileExists(current);

      if (isExists) {
        await renameFile(current, next);
      }
    }
    this.writable.end();

    await renameFile(this.filepath, join(dir, `${filename}.1${ext}`));
    this.currentSize = 0;
    this.createWriteStream();
  }

  async init() {
    this.filepath = join(__basedir, `/logs/${this.filename}`);
    const isExists = await checkIfFileExists(this.filepath);

    if (isExists) {
      this.currentSize = await getFileSize(this.filepath);
    }
    this.createWriteStream();
  }
  async write(data: string) {
    const dataSize = Buffer.byteLength(data, 'utf8') / 1000;
    if (dataSize + this.currentSize > this.maxSize) {
      await this.rotate();
    }

    this.currentSize += dataSize;
    console.log(this.currentSize);
    this.writable.write(`\n${uncolorize(data)}`);
  }
}
