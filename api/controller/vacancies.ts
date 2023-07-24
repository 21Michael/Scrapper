import { IVacancyTransformed } from '../../shared/types';
import { DB } from '../../shared/services/db';

export default class Vacancy {
  private DB: DB<IVacancyTransformed>;

  constructor({ DB }: { DB: DB<IVacancyTransformed>; }) {
    this.DB = DB;
  }

  async deleteAll() {
    await this.DB.deleteAll();
  }

  async getAll({ sortParams } : { sortParams?: Record<string, 1 | -1> }) {
    const data = await this.DB.getAll(sortParams);

    return data;
  }

  async create(data: IVacancyTransformed) {
    const newData = await this.DB.create(data);

    return newData;
  }
}
