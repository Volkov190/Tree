import { FC, memo, useState, useCallback } from 'react';
import styled from 'styled-components';
import CloseOutline from '../assets/icons/CloseOutline';
import useItems from '../hooks/useItems';
import { ClusterItem, GroupItem, Kind } from '../types/item';
import Select from 'react-select';
import Button from './Button';

const Sidebar: FC = () => {
  const { selectedItem, onSelectItem, groups, clusters, changeProductItem, changeGroupItem } = useItems();
  const [newGroup, setNewGroup] = useState<GroupItem | null | undefined>();
  const [newCluster, setNewCluster] = useState<ClusterItem | null | undefined>();

  const onSubmit = useCallback(() => {
    if (selectedItem?.kind === Kind.ITEM) {
      changeProductItem(selectedItem, { groupUuid: newGroup?.uuid || null });
      setNewGroup(undefined);
    }
    if (selectedItem?.kind === Kind.GROUP) {
      changeGroupItem(selectedItem, { clusterUuid: newCluster?.uuid || null });
      setNewCluster(undefined);
    }
  }, [changeGroupItem, changeProductItem, newCluster?.uuid, newGroup?.uuid, selectedItem]);

  if (!selectedItem) return null;

  const title = selectedItem.kind === Kind.ITEM ? 'Продукт' : selectedItem.kind === Kind.GROUP ? 'Группа' : 'Кластер';

  const ItemContent: FC = () => {
    if (selectedItem.kind === Kind.ITEM) {
      const selectedGroup =
        (newGroup !== undefined ? newGroup : groups.find((group) => group.uuid === selectedItem.groupUuid)) || null;

      return (
        <>
          <div className="mb-2">
            <Label className="mb-1">Группа:</Label>
            <Select
              isClearable
              placeholder="Ничего не выбрано"
              options={groups}
              value={selectedGroup}
              getOptionLabel={(item) => item.name}
              getOptionValue={(item) => item.uuid}
              onChange={(item) => {
                setNewGroup(item || null);
              }}
            />
          </div>
          <div className="mb-2">
            <Label className="mb-1">Описание:</Label>
            {selectedItem.description}
          </div>
        </>
      );
    }
    if (selectedItem.kind === Kind.GROUP) {
      const selectedCluster =
        (newCluster !== undefined
          ? newCluster
          : clusters.find((cluster) => cluster.uuid === selectedItem.clusterUuid)) || null;

      return (
        <div className="mb-2">
          <Label className="mb-1">Кластер:</Label>
          <Select
            isClearable
            placeholder="Ничего не выбрано"
            options={clusters}
            value={selectedCluster}
            getOptionLabel={(item) => item.name}
            getOptionValue={(item) => item.uuid}
            onChange={(item) => {
              setNewCluster(item || null);
            }}
          />
        </div>
      );
    }

    return null;
  };

  return (
    <Wrapper className="p-3 flex-shrink-0">
      <CloseIconWrapper>
        <StyledCloseOutline onClick={() => onSelectItem(null)} />
      </CloseIconWrapper>
      <div className="d-flex flex-column h-100">
        <h3 className="mb-4">{title}:</h3>
        <div className="mb-2">
          <Label>Название:</Label>
          <div className="ps-2">{selectedItem.name}</div>
        </div>
        <ItemContent />
        <div className="flex-grow-1"></div>
        <div className="d-flex justify-content-end">
          <Button onClick={onSubmit} disabled={newGroup === undefined && newCluster === undefined} className="me-2">
            Сохранить
          </Button>
          <Button onClick={() => onSelectItem(null)} appearance="secondary">
            Отмена
          </Button>
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
  width: 300px;
  border-left: 1px solid #d1d1d1;
`;

export const CloseIconWrapper = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  height: 24px;
  width: 24px;
`;

export const StyledCloseOutline = styled(CloseOutline)`
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #e9e9e9;

    > path {
      fill: black;
    }
  }
`;

const Label = styled.div`
  font-size: 0.8rem;
  color: #969696;
`;

export default memo(Sidebar);
