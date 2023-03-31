import items from '../assets/x5.json';
import { Item } from '../types/item';

export default async function fetchItems() {
  return { data: items as Item[] };
}
