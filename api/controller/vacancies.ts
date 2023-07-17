import { IVacancy } from "../../shared/types";
import { DB } from '../../shared/services/db';

export default class Vacancy {
  private DB: DB<IVacancy>;

  constructor({ DB }: { DB: DB<IVacancy>; }) {
    this.DB = DB;
  }

  async deleteAll() {
    await this.DB.deleteAll();
  }

  async getAll() {
    const data = await this.DB.getAll();

    return data;
  }

  async create(data: IVacancy) {
    const newData = await this.DB.create(data);

    return newData;
  }
}
