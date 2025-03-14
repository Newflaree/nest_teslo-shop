import { Response } from 'express';
import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FilesService } from './files.service';
import { fileFilter } from './helpers/file-filter.helper';
import { fileNamer } from './helpers/file-namer.helper';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService
  ) {}

  @Get('product/:imageName')
  findOProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string
  ) {
    const path = this.filesService.getStaticProductImage( imageName );

    res.sendFile( path );
  }

  @Post('product')
  @UseInterceptors( FileInterceptor('file', {
    fileFilter: fileFilter,
    //limits: { fileSize: 1000 },
    storage: diskStorage({
      destination: './static/uploads',
      filename: fileNamer
    })
  }))
  uploadProductFile( @UploadedFile() file: Express.Multer.File ) {
    if ( !file )
      throw new BadRequestException( `Make sure that file is an image` );

    //const secureUrl = `${ file.filename }`;
    const secureUrl = `http://localhost:3000/api/files/product/b8e6b0d1-7bca-4b98-b33e-4e7e267830d7.jpeg`;

    return {
      secureUrl
    };
  }
}
