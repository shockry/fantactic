import {game} from '../game';
function findObjectsByType(map, layer, type) {
  return map.objects[layer].filter((object) => object.type === type);
}

//This should be used when you know for sure there's only one object of that type
function createOneOfType(map, layer, type, group) {
  //Extract the first object of that type
  const obj = findObjectsByType(map, layer, type)[0];
  if (group) {
    return group.create(obj.x, obj.y, obj.properties.sprite);
  } else {
    return game.add.sprite(obj.x, obj.y, obj.properties.sprite);
  }
}

export default {
  findObjectsByType,
  createOneOfType,
}
