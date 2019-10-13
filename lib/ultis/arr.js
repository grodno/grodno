
/** ***********************
 * Arrays.
 */

/**
 * Builds histogram on given field for given list.
 *
 * @param {*} list source
 * @param {*} field to be used as group key
 */
export const histogram = Array.histogram = function histogram(list, field = 'id') {
    const result = {};
    const fieldFn = typeof field === 'string' ? e => e[field] : field;
    const iter = (v, entry) => {
        const slot = result[v] || (result[v] = { key: v, count: 0, subs: [] });
        slot.count++;
        slot.subs.push(entry);
    };
    (list || []).forEach((e) => {
        const value = fieldFn(e);
        if (Array.isArray(value)) {
            value.forEach(v => iter(v, e));
        } else {
            iter(value, e);
        }
    });
    return result;
}

/**
 * Sorts array by element property.
 *
 * @param {*} arr source
 * @param {*} property element property to sort by
 * @param {*} order
 */
export const sortBy = Array.sortBy = function sortBy(arr, property = 'name', order = 1) {
    let fn = property;
    if (typeof property === 'string') {
        if (property[0] === '-') {
            /* eslint-disable */
            order = -1;
            property = property.substr(1);
        }
        fn = e => e[property];
    }

    function compare(a, b) {
        const aa = fn(a);
        const bb = fn(b);
        /* eslint-disable */
        return (aa < bb) ? -order : (aa > bb) ? order : 0;
    }
    return (arr || []).slice(0).sort(compare);
}

/**
 * Transforms array into hash object.
 * @param {*} list source array
 * @param {*} idKey id key
 * @param {*} valKey value key
 */
export const arrayToHash = Array.toHash = (list, idKey = 'id', valKey) => {
    const r = {};
    if (list) {
        const isKeyFn = typeof idKey === 'string' ? e => e[idKey] : idKey
        list.forEach((e) => { r[isKeyFn(e)] = valKey ? e[valKey] : e; });
    }
    return r;
};
