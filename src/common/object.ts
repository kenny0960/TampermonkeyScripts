export const mergeObject = (obj1: Object, obj2: Object) => {
    for (const key in obj2) {
        try {
            // Property in destination object set; update its value.
            if (obj2[key].constructor == Object) {
                obj1[key] = mergeObject(obj1[key], obj2[key]);
            } else {
                obj1[key] = obj2[key];
            }
        } catch (e) {
            // Property in destination object not set; create it and set its value.
            obj1[key] = obj2[key];
        }
    }

    return obj1;
};
