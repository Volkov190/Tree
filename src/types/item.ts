export enum Kind {
  CLUSTER = 'CLUSTER',
  GROUP = 'GROUP',
  ITEM = 'ITEM',
}

export type Item = ClusterItem | GroupItem | ProductItem;

export type History = {
  beforeChangeItem: Item;
  afterChangeItem: Item;
};

export interface ClusterItem {
  kind: Kind.CLUSTER;
  uuid: string;
  name: string;
}

export interface GroupItem {
  kind: Kind.GROUP;
  uuid: string;
  clusterUuid: string;
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

export type Items = Item[];
