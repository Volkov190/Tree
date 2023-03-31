export enum Kind {
  CLUSTER = 'CLUSTER',
  GROUP = 'GROUP',
  ITEM = 'ITEM',
}

export type Item =
  | {
      kind: Kind.ITEM;
      uuid: string;
      groupUuid: string | null;
      important: boolean;
      name: string;
      description: string;
    }
  | {
      kind: Kind.GROUP;
      uuid: string;
      clusterUuid: string;
      name: string;
    }
  | {
      kind: Kind.CLUSTER;
      uuid: string;
      name: string;
    };

export type Items = Item[];
