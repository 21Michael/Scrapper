import { DB } from '../shared/services/db';
import { ICandidate } from '../shared/types';

export default class Candidate {
  private DB: DB<ICandidate>;

  constructor({ DB }: { DB: DB<ICandidate>; }) {
    this.DB = DB;
  }

  async deleteAll() {
    await this.DB.deleteAll();
  }

  async getAll() {
    const data = await this.DB.getAll();

    return data;
  }

  async create(data: ICandidate) {
    const newData = await this.DB.create(data);

    return newData;
  }
}
