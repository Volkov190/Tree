export enum Kind {
  CLUSTER = 'CLUSTER',
  GROUP = 'GROUP',
  ITEM = 'ITEM',
}

export enum NodeType {
  INPUT = 'input',
  DEFAULT = 'default',
  OUTPUT = 'output',
}

export type Item = ClusterItem | GroupItem | ProductItem;

export type HistoryNode = {
  beforeChangeItem: Item;
  afterChangeItem: Item | null;
};

export type History = HistoryNode[];

export interface ClusterItem {
  kind: Kind.CLUSTER;
  uuid: string;
  important: boolean;
  name: string;
}

export interface GroupItem {
  kind: Kind.GROUP;
  uuid: string;
  important: boolean;
  clusterUuid: string | null;
  name: string;
}

export interface ProductItem {
  kind: Kind.ITEM;
  uuid: string;
  groupUuid: string | null;
  important: boolean;
  name: string;
  description: string;
}

interface GroupedProductItem extends ProductItem {
  groupUuid: string;
}

export const isCluster = (item: Item): item is ClusterItem => {
  return item.kind === Kind.CLUSTER;
};

export const isGroup = (item: Item): item is GroupItem => {
  return item.kind === Kind.GROUP;
};

export const isProduct = (item: Item): item is ProductItem => {
  return item.kind === Kind.ITEM;
};

export const isGroupedProduct = (item: Item): item is GroupedProductItem => {
  return isProduct(item) && !!item.groupUuid;
};

export const isImportantItem = (item: Item) => {
  return !!item.important;
};

export type Items = Item[];

type Falsy = false | 0 | '' | null | undefined;

export const truthy = <T>(x: T | Falsy): x is T => !!x;

export type ItemId = Item['uuid'];
