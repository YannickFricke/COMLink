import { injectable } from 'inversify';

@injectable()
export abstract class BaseService<T> {
    private blacklistedProperties = [
        'id',
        'password',
    ];

    updateEntity(data: Partial<T>, entity: T) {
        Object.keys(entity)
              .filter(key => !this.blacklistedProperties.includes(key))
              .forEach((key) => {
                  const propertyName = key as keyof T;

                  if (data[propertyName] === undefined) {
                      return;
                  }

                  if (data[propertyName] === entity[propertyName]) {
                      return;
                  }

                  entity[propertyName] = data[propertyName]!;
              });
    }
}
