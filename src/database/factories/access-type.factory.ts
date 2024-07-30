import { AccessType } from '../../accesses/entities/access-type.entity';
import { accessTypesEnum } from '../../accesses/access-types.enum';

export const AccessTypeFactory = async () => {
  const get = async (title: string) => {
    const accessType = new AccessType();
    accessType.title = title;
    return accessType;
  };

  const getMany = async (count: number) => {
    const accessTypes: AccessType[] = [];

    for (let i = 0; i < count; i++) {
      accessTypes.push(await get(accessTypesEnum[i]));
    }
    return accessTypes;
  };

  return { get, getMany };
};
