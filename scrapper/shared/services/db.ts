import { Model } from 'mongoose';

export class DB<T> {
    private model: Model<T>;

    constructor({ model }: { model: Model<T>; }) {
        this.model = model;
    }

    async deleteAll() {
        await this.model.deleteMany();
    }


    async getAll() {
        const data = await this.model.find();

        return data;
    }

    async create(data: T) {
        const newData = new this.model(data);

        await newData.save();

        return newData;
    }
}
