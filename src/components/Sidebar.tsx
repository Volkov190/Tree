import { FC, memo, useState, useCallback } from 'react';
import styled from 'styled-components';
import useItems from '../hooks/useItems';
import { ClusterItem, GroupItem, Kind, ProductItem } from '../types/item';
import Select from 'react-select';
import Button from './Button';
import { CloseOutline } from '../assets/icons';

const Sidebar: FC = () => {
  const {
    selectedItem,
    onSelectItem,
    groups,
    products,
    clusters,
    changeProductItem,
    changeGroupItem,
    changeGroupItems,
  } = useItems();
  const [newGroup, setNewGroup] = useState<GroupItem | null | undefined>();
  const [newGroups, setNewGroups] = useState<GroupItem[] | null | undefined>();
  const [newProducts, setNewProducts] = useState<ProductItem[] | null | undefined>();
  const [newCluster, setNewCluster] = useState<ClusterItem | null | undefined>();

  const onSubmit = useCallback(() => {
    if (selectedItem?.kind === Kind.ITEM) {
      changeProductItem(selectedItem, { groupUuid: newGroup?.uuid || null });
      setNewGroup(undefined);
    }
    if (selectedItem?.kind === Kind.GROUP) {
      if (newGroup !== undefined) {
        changeGroupItem(selectedItem, { clusterUuid: newCluster?.uuid || null });
        setNewCluster(undefined);
      }
      if (!newProducts) return;
      const selectedProducts = products.filter((item) => item.groupUuid === selectedItem.uuid);
      changeGroupItems([
        ...newProducts.map((item) => ({
          beforeChangeItem: item,
          afterChangeItem: { ...item, groupUuid: selectedItem.uuid },
        })),
        ...selectedProducts
          .filter((group) => !newProducts.map((newGroup) => newGroup.uuid).includes(group.uuid))
          .map((item) => ({
            beforeChangeItem: item,
            afterChangeItem: null,
          })),
      ]);
      setNewGroups(undefined);
    }
    if (selectedItem?.kind === Kind.CLUSTER) {
      if (!newGroups) return;
      const selectedGroups = groups.filter((group) => group.clusterUuid === selectedItem.uuid);
      changeGroupItems([
        ...newGroups.map((item) => ({
          beforeChangeItem: item,
          afterChangeItem: { ...item, clusterUuid: selectedItem.uuid },
        })),
        ...selectedGroups
          .filter((group) => !newGroups.map((newGroup) => newGroup.uuid).includes(group.uuid))
          .map((item) => ({
            beforeChangeItem: item,
            afterChangeItem: null,
          })),
      ]);
      setNewGroups(undefined);
    }
  }, [
    selectedItem,
    changeProductItem,
    newGroup,
    newProducts,
    products,
    changeGroupItems,
    changeGroupItem,
    newCluster?.uuid,
    newGroups,
    groups,
  ]);

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

      const selectedProducts =
        (newProducts !== undefined ? newProducts : products.filter((group) => group.groupUuid === selectedItem.uuid)) ||
        null;

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
            className={'mb-1'}
            onChange={(item) => {
              setNewCluster(item || null);
            }}
          />
          <Label className="mb-1">Продукты:</Label>
          <Select
            isClearable
            isMulti
            placeholder="Ничего не выбрано"
            options={products}
            value={selectedProducts}
            getOptionLabel={(item) => item.name}
            getOptionValue={(item) => item.uuid}
            onChange={(item) => {
              setNewProducts([...item]);
            }}
          />
        </div>
      );
    }

    if (selectedItem.kind === Kind.CLUSTER) {
      const selectedGroups =
        (newGroups !== undefined ? newGroups : groups.filter((group) => group.clusterUuid === selectedItem.uuid)) ||
        null;

      return (
        <div className="mb-2">
          <Label className="mb-1">Группы:</Label>
          <Select
            isClearable
            isMulti
            placeholder="Ничего не выбрано"
            options={groups}
            value={selectedGroups}
            getOptionLabel={(item) => item.name}
            getOptionValue={(item) => item.uuid}
            onChange={(item) => {
              setNewGroups([...item]);
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
          <Button
            onClick={onSubmit}
            disabled={
              newGroup === undefined && newCluster === undefined && newGroups === undefined && newProducts === undefined
            }
            className="me-2"
          >
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
