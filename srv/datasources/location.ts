import { DataSource, DataSourceConfig } from 'apollo-datasource';
import { IStore } from '../store';
import { IContextBase, ILocation } from '../types';


export class LocationAPI implements DataSource {

    context: IContextBase;
    constructor(private store: IStore) {
        console.log('new LocationAPI');
    }
    initialize(config: DataSourceConfig<IContextBase>) {
        this.context = config.context;
    }
    async getLocations(all: boolean = false, ids: string[] = null): Promise<ILocation[]> {
        const q = all ? {} : {archived: {$ne: true}};
        if (ids !== null) {
            console.log('getLocations', ids);
            const q_ids = {_id: { $in: ids}, ...q};
            return this.store.locationModel.find(q_ids);
        }
        return this.store.locationModel.find(q);
    }
    async getLocation(_id: string): Promise<ILocation> {
        return this.store.locationModel.findById(_id);
    }

    async createLocation(name: string, address: string): Promise<ILocation> {
        return this.store.locationModel.create({
            archived: false,
            name,
            address,
        });
    }

    async updateLocation(_id: string, archived: boolean, name: string, address: string): Promise<ILocation> {
        const loc = await this.store.locationModel.findById(_id);
        if (!loc) {
            throw new Error('Something bad happened');
        }
        loc.set({archived, name, address});
        return loc.save();
    }

}


