const Walker = (data, sortedData, tree, optionData) => {
    let t = "";

    if (data.length == 0) {
        return optionData;
    }

    let v = data.pop();

    if (v.parent == 0) {
        sortedData[v.id] = [];
        sortedData[v.id]['object'] = v;
        sortedData[v.id]['children'] = [];
        tree[v.id] = [0];

        t = {
            'id': v.id,
            'className': "checkbox-categories",
            'name': v.name,
            'parent': v.parent,
            "value": v.id,
            "count": 0
        };

        optionData.push(t);
    } else {
        if (sortedData[v.parent] == undefined) {
            if (tree[v.parent] != undefined) {
                let obj = sortedData;
                let count = tree[v.parent].length * 8;
                tree[v.parent].forEach((j, l) => {
                    if (j != 0) {
                        obj = obj[j]['children'];
                    }
                })

                obj = obj[v.parent]['children'];

                obj[v.id] = [];
                obj[v.id]['children'] = [];
                obj[v.id]['object'] = v;

                let prevList = tree[v.parent];
                prevList = prevList.concat(v.parent);
                tree[v.id] = prevList;

                t = {
                    'id': v.id,
                    'className': "checkbox-categories",
                    'name': v.name,
                    'parent': v.parent,
                    "value": v.id,
                    "count": count
                };
                optionData.push(t);
            } else {
                console.log("cannot find");
                return optionData;
            }
        } else {
            let k1 = sortedData[v.parent]['children'].length;
            sortedData[v.parent]['children'][v.id] = [];
            sortedData[v.parent]['children'][v.id]['children'] = [];
            sortedData[v.parent]['children'][v.id]['object'] = v;

            let prevList = tree[v.parent];
            prevList = prevList.concat(v.parent);
            tree[v.id] = prevList;


            t = {
                'id': v.id,
                'className': "checkbox-categories",
                'name': v.name,
                'parent': v.parent,
                "value": v.id,
                "count": 10
            };

            optionData.push(t);
        }
    }

    return Walker(data, sortedData, tree, optionData);
}

export default Walker

