import {EEntityType} from './enums';

export interface IEntity {
    id: string;
    type: EEntityType;
    name: string;
    children?: IEntity[];
}

export interface INodeInf {
    id: string | null;
    newId?: string | null;
}

export interface IChangeNode {
    [EEntityType.Cluster]: INodeInf;
    [EEntityType.Group]: INodeInf | IEntity | null;
    [EEntityType.Product]: IEntity | null;
}
