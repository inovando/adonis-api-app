'use strict';
const BaseRepository = use('./BaseRepository');
const { ioc } = require('@adonisjs/fold');
const Helpers = use('Helpers');
const { generateFromFile } = require('../Util/fileNameGenerator');

const UPLOAD_PATH = Helpers.appRoot('uploads/');

class FileRepository extends BaseRepository {
  async store({ request, response }) {
    const file = request.file('file', {
      size: '20mb',
    });

    const fileName = generateFromFile(file);

    await file.move(UPLOAD_PATH, {
      name: fileName,
      overwrite: true,
    });

    if (!file.moved()) {
      return file.error();
    }

    const fileUploaded = await this.model.create({
      path: UPLOAD_PATH + fileName,
      name: file.clientName,
    });

    return response
      .status(201)
      .json({ msg: 'File upload sucessefuly', data: fileUploaded });
  }

  async download({ params, response }) {
    const arquivo = await this.model.find(params.id);
    const arquivoJson = arquivo.toJSON();
    if (arquivo) {
      return response.attachment(arquivoJson.path);
    }

    response.status(404).json('File not found');
  }
}

ioc.singleton('FileRepository', function (app) {
  return new FileRepository(app.use('App/Models/File'));
});

module.exports = ioc.use('FileRepository');
