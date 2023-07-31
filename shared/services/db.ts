import mongoose, { Model } from 'mongoose';

export class DB<T> {
    private model: Model<T>;

    constructor({ model }: { model: Model<T>; }) {
        this.model = model;
    }

    async deleteAll() {
        await this.model.deleteMany();
    }

    async getAll(sorting?: Record<string, 1 | -1>) {
        const data = await this.model.find().sort(sorting);

        return data;
    }

    async create(data: T) {
        const newData = new this.model(data);

        await newData.save();

        return newData;
    }
}

export const connectToDB = async ({ DB_HOST }: { DB_HOST: string; }) => {
    console.log('Connecting to DB')
    await mongoose.connect(`mongodb://${DB_HOST}`);
    console.log('Connected to DB successfully')
}
