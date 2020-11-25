
 /**
 * 深度克隆对象和数组类型数据(set,map,array,object)，可以给array扩展上add方法，object扩展set和get方法
 * @param obj
 * @returns {*}
 */
export function cloneObj (obj) {
  let typeAry = ['array', 'object', 'set', 'map'];
  if (!dataType(obj, typeAry)) {
    return obj;
  }
  let returnObj;
  if (dataType(obj, 'array', 'set')) {
    let isArray = dataType(obj, 'array');
    returnObj = isArray ? [] : new Set();
    obj.forEach((p) => {
      if (dataType(p, typeAry)) {
        isArray ? returnObj.push(cloneObj(p)) : returnObj.add(cloneObj(p));
      } else {
        isArray ? returnObj.push(p) : returnObj.add(p);
      }
    });
  } else {
    if (dataType(obj, 'object', 'map')) {
      let isObject = dataType(obj, 'object');
      returnObj = isObject ? {} : new Map();
      for (let i in obj) {
        let value = isObject ? obj[i] : obj.get(i);
        if (dataType(value, typeAry)) {
          isObject ? returnObj[i] = cloneObj(value) : returnObj.set(i, cloneObj(value));
        } else {
          isObject ? returnObj[i] = value : returnObj.set(i, value);
        }
      }
    }
  }
  return returnObj;
}


/**
 * 判断数据是否属于指定的类型
 * @param data
 * @param dataType 可以传一个类型数组集合，也可以是多个类型字符串
 * @returns {string}
 * arguments类数组的数据使用数组的方法，随便列举两种
 * 1. Array.prototype.slice.call(arguments, 1)
 * 2.[...arguments].slice(1)
 */
export function dataType (data, dataType) {
  let type = Object.prototype.toString.call(data).slice(8, -1).toLowerCase();
  dataType = Object.prototype.toString.call(dataType).slice(8, -1).toLowerCase() === 'string' ? [...arguments].slice(1) : dataType;
  return dataType.includes(type);
}

