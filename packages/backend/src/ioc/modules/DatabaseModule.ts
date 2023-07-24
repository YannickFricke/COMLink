import { AllEntities } from '@comlink/framework/dist/entity';
import { AsyncContainerModule } from 'inversify';
import { Connection, createConnection } from 'typeorm';

export class DatabaseModule extends AsyncContainerModule {
    constructor() {
        super(async (bind) => {
            const connection = await createConnection({
                type: 'sqlite',
                database: './data/database.db',
                entities: AllEntities,
                synchronize: true,
            });

            bind(Connection).toConstantValue(connection);
        });
    }
}
