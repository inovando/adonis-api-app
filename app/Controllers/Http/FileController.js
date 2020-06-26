'use strict';
const repository = use('App/Repositories/FileRepository');

class FileController extends use('/BaseController') {
  constructor() {
    super(repository);
    this.respository = repository;
  }

  async show(ctx) {
    return await repository.download(ctx);
  }
}

module.exports = FileController;
