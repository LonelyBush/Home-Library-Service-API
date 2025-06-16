import { SetMetadata } from '@nestjs/common';

const { PUBLIC_KEY } = process.env;

export const Public = () => SetMetadata(PUBLIC_KEY, true);
