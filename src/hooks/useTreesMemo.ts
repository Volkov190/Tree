import { isEqual } from 'lodash';
import { useMemo, useState } from 'react';
import { Item } from '../types/item';

const useTreesMemo = (tree: Item[][]) => {
  const [prevTrees, setPrevTrees] = useState<Item[][]>([]);

  return useMemo(() => {
    const fixedTrees = tree.map((tree, idx) => {
      if (prevTrees.length <= idx || prevTrees[idx].length !== tree.length) {
        return tree;
      }
      if (prevTrees[idx].every((originTreeNode, nodeIdx) => isEqual(originTreeNode, tree[nodeIdx]))) {
        return prevTrees[idx];
      }

      return tree;
    });

    setPrevTrees(fixedTrees);

    return fixedTrees;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tree]);
};

export default useTreesMemo;
