var m = [20, 120, 20, 120],
    w = 1280 - m[1] - m[3],
    h = 900 - m[0] - m[2],
    i = 0,
    root = {};
var spendField = "sum_Federal";
var spendField = "sent";
var actField = "sum_Federal";
var sumFields = ["Federal", "GovXFer", "State", "Local"];
var formatCurrency = function (treeNode) {
    return "" + treeNode + " Экземпляров";
};
var tree = d3.layout.tree();
tree.children(function (treeNode) {
    return treeNode.values;
});
tree.size([h, w]);
var toolTip = d3.select(document.getElementById("toolTip"));
var header = d3.select(document.getElementById("head"));
var sent = d3.select(document.getElementById("sent"));
var received = d3.select(document.getElementById("received"));
var defective = d3.select(document.getElementById("defective"));;
var defectiveButton = d3.select(document.getElementById("defectiveButton"));
var receivedButton = d3.select(document.getElementById("receivedButton"));
var sentButton = d3.select(document.getElementById("sentButton"));
var defectiveDiv = d3.select(document.getElementById("defectiveDiv"));
var receivedDiv = d3.select(document.getElementById("receivedDiv"));
var sentDiv = d3.select(document.getElementById("sentDiv"));
var diagonal = d3.svg.diagonal().projection(function (treeNode) {
    return [treeNode.y, treeNode.x];
});
var vis = d3.select("#body").append("svg:svg").attr("width", w + m[1] + m[3]).attr("height", h + m[0] + m[2]).append("svg:g").attr("transform", "translate(" + m[3] + "," + m[0] + ")");
var level1Max = {};
var level2Max = {};
var level3Max = {};
var level4Max = {};
var level1Radius;
var level2Radius;
var level3Radius;
var level4Radius;
var alreadySummed = false;

/*
dren: Array[3]
depth: 0
id: 7
linkColor: undefined
numChildren: 3
values: Array[3]
x: 344
x0: 344
y: 0
y0: 0
__proto__: Object
*/

function prepareRadius() {
    level1Radius = d3.scale.sqrt().domain([0, level1Max[spendField]]).range([1, 40]);
    level2Radius = d3.scale.sqrt().domain([0, level2Max[spendField]]).range([1, 40]);
    level3Radius = d3.scale.sqrt().domain([0, level3Max[spendField]]).range([1, 40]);
    level4Radius = d3.scale.sqrt().domain([0, level4Max[spendField]]).range([1, 40]);
};

function promoteSumNodes() {
    for (var i = 0; i < sumFields.length; i++) {
        level1Max["sum_" + sumFields[i]] = 0;
        level2Max["sum_" + sumFields[i]] = 0;
        level3Max["sum_" + sumFields[i]] = 0;
        level4Max["sum_" + sumFields[i]] = 0;
    };
    sumNodes(root.children);
};

root = treeData;
root.x0 = h / 2;
root.y0 = 0;

console.log(root);

var currentNodes = tree.nodes(root).reverse();
tree.children(function (treeNode) {
    return treeNode.children;
});
//promoteSumNodes();
prepareRadius();
update(root);

receivedButton.on("click", function (treeNode) {
    receivedButton.attr("class", "selected");
    defectiveButton.attr("class", null);
    sentButton.attr("class", null);
    receivedDiv.attr("class", "selected");
    defectiveDiv.attr("class", null);
    sentDiv.attr("class", null);
    spendField = "received";
    actField = "sum_State";
    prepareRadius();
    update(root);
});
sentButton.on("click", function (treeNode) {
    sentButton.attr("class", "selected");
    receivedButton.attr("class", null);
    defectiveButton.attr("class", null);
    sentDiv.attr("class", "selected");
    defectiveDiv.attr("class", null);
    receivedDiv.attr("class", null);
    spendField = "sent";
    actField = "sum_Local";
    prepareRadius();
    update(root);
});
defectiveButton.on("click", function (treeNode) {
    defectiveButton.attr("class", "selected");
    receivedButton.attr("class", null);
    sentButton.attr("class", null);
    defectiveDiv.attr("class", "selected");
    receivedDiv.attr("class", null);
    sentDiv.attr("class", null);
    spendField = "defective";
    prepareRadius();
    update(root);
});

/*d3.csv("FederalBudget_2013_a.csv", function (entry) {
    var treeNodeArray = [];
    entry.forEach(function (treeNode) {
        var nodeValuesSum = 0;
        for (var i = 0; i < sumFields.length; i++) {
            nodeValuesSum += Number(treeNode[sumFields[i]]);
        };
        if (nodeValuesSum > 0) {
            treeNodeArray.push(treeNode);
        };
    });
    console.log(treeNodeArray);
    var levelValues = d3.nest().key(function (treeNode) {
        return treeNode.Level1;
    }).key(function (treeNode) {
        return treeNode.Level2;
    }).key(function (treeNode) {
        return treeNode.Level3;
    }).entries(treeNodeArray);
    console.log(levelValues);
    root = {};
    root.values = levelValues;
    root.x0 = h / 2;
    root.y0 = 0;
    console.log(root);
    var currentNodes = tree.nodes(root).reverse();
    tree.children(function (treeNode) {
        return treeNode.children;
    });
    promoteSumNodes();
    prepareRadius();
    alreadySummed = true;
    root.values.forEach(treeNodeVisibility);
    toggle(root.values[2]);
    update(root);
    receivedButton.on("click", function (treeNode) {
        receivedButton.attr("class", "selected");
        defectiveButton.attr("class", null);
        sentButton.attr("class", null);
        receivedDiv.attr("class", "selected");
        defectiveDiv.attr("class", null);
        sentDiv.attr("class", null);
        spendField = "sum_State";
        actField = "sum_State";
        prepareRadius();
        update(root);
    });
    sentButton.on("click", function (treeNode) {
        sentButton.attr("class", "selected");
        receivedButton.attr("class", null);
        defectiveButton.attr("class", null);
        sentDiv.attr("class", "selected");
        defectiveDiv.attr("class", null);
        receivedDiv.attr("class", null);
        spendField = "sum_Local";
        actField = "sum_Local";
        prepareRadius();
        update(root);
    });
    defectiveButton.on("click", function (treeNode) {
        defectiveButton.attr("class", "selected");
        receivedButton.attr("class", null);
        sentButton.attr("class", null);
        defectiveDiv.attr("class", "selected");
        receivedDiv.attr("class", null);
        sentDiv.attr("class", null);
        spendField = "sum_Federal";
        prepareRadius();
        update(root);
    });

    function promoteSumNodes() {
        for (var i = 0; i < sumFields.length; i++) {
            level1Max["sum_" + sumFields[i]] = 0;
            level2Max["sum_" + sumFields[i]] = 0;
            level3Max["sum_" + sumFields[i]] = 0;
            level4Max["sum_" + sumFields[i]] = 0;
        };
        sumNodes(root.children);
    };

    function prepareRadius() {
        level1Radius = d3.scale.sqrt().domain([0, level1Max[spendField]]).range([1, 40]);
        level2Radius = d3.scale.sqrt().domain([0, level2Max[spendField]]).range([1, 40]);
        level3Radius = d3.scale.sqrt().domain([0, level3Max[spendField]]).range([1, 40]);
        level4Radius = d3.scale.sqrt().domain([0, level4Max[spendField]]).range([1, 40]);
    };

    function treeNodeVisibility(treeNode) {
        if (treeNode.values && treeNode.values.actuals) {
            treeNode.values.actuals.forEach(treeNodeVisibility);
            toggle(treeNode);
        } else {
            if (treeNode.values) {
                treeNode.values.forEach(treeNodeVisibility);
                toggle(treeNode);
            };
        };
    };
});*/

function setSourceFields(values, sourceFields) {
    if (sourceFields) {
        for (var i = 0; i < sourceFields.length; i++) {
            var valueKey = sourceFields[i];
            if (values[valueKey] != undefined) {
                values["source_" + valueKey] = values[valueKey];
            };
            sourceFields["source_" + valueKey] = (values["source_" + valueKey]) ? values["source_" + valueKey] : values[valueKey];
        };
    };
};

function sumNodes(nodeToSum) {
    for (var j = 0; j < nodeToSum.length; j++) {
        var currentNode = nodeToSum[j];
        if (currentNode.children) {
            sumNodes(currentNode.children);
            for (var nodeCounter = 0; nodeCounter < currentNode.children.length; nodeCounter++) {
                var values = currentNode.children[nodeCounter];
                for (var i = 0; i < sumFields.length; i++) {
                    if (isNaN(currentNode["sum_" + sumFields[i]])) {
                        currentNode["sum_" + sumFields[i]] = 0;
                    };
                    currentNode["sum_" + sumFields[i]] += Number(values["sum_" + sumFields[i]]);
                    if ((currentNode.parent)) {
                        if (currentNode.depth == 1) {
                            level1Max["sum_" + sumFields[i]] = Math.max(level1Max["sum_" + sumFields[i]], Number(currentNode["sum_" + sumFields[i]]));
                        } else {
                            if (currentNode.depth == 2) {
                                level2Max["sum_" + sumFields[i]] = Math.max(level2Max["sum_" + sumFields[i]], Number(currentNode["sum_" + sumFields[i]]));
                            } else {
                                if (currentNode.depth == 3) {
                                    level3Max["sum_" + sumFields[i]] = Math.max(level3Max["sum_" + sumFields[i]], Number(currentNode["sum_" + sumFields[i]]));
                                } else {
                                    if (currentNode.depth == 4) {
                                        level4Max["sum_" + sumFields[i]] = Math.max(level4Max["sum_" + sumFields[i]], Number(currentNode["sum_" + sumFields[i]]));
                                    };
                                };
                            };
                        };
                        setSourceFields(currentNode, currentNode.parent);
                    };
                };
            };
        } else {
            for (var i = 0; i < sumFields.length; i++) {
                currentNode["sum_" + sumFields[i]] = Number(currentNode[sumFields[i]]);
                if (isNaN(currentNode["sum_" + sumFields[i]])) {
                    currentNode["sum_" + sumFields[i]] = 0;
                };
            };
        };
        setSourceFields(currentNode, currentNode.parent);
    };
};

function update(nodeToUpdate) {
    var durationValue = d3.event && d3.event.altKey ? 5000 : 500;
    console.log(tree);
    var currentNodes = tree.nodes(root).reverse();
    console.log(currentNodes);
    currentNodes.forEach(function (treeNode) {
        treeNode.y = treeNode.depth * 180;
        treeNode.numChildren = (treeNode.children) ? treeNode.children.length : 0;
        if (treeNode.depth == 1) {
            treeNode.linkColor = "#006600";
        };
        if (treeNode.numChildren == 0 && treeNode._children) {
            treeNode.numChildren = treeNode._children.length;
        };
    });
    currentNodes.forEach(function (treeNode) {
        var currentNodeToDraw = treeNode;
        while ((currentNodeToDraw.source && currentNodeToDraw.source.depth > 1) || currentNodeToDraw.depth > 1) {
            currentNodeToDraw = (currentNodeToDraw.source) ? currentNodeToDraw.source.parent : currentNodeToDraw.parent;
        };
        treeNode.linkColor = (currentNodeToDraw.source) ? currentNodeToDraw.source.linkColor : currentNodeToDraw.linkColor;
    });
    var currentNode = vis.selectAll("g.node").data(currentNodes, function (treeNode) {
        return treeNode.id || (treeNode.id = ++i);
    });
    var drawedNode = currentNode.enter().append("svg:g").attr("class", "node").attr("transform", function (treeNode) {
        return "translate(" + nodeToUpdate.y0 + "," + nodeToUpdate.x0 + ")";
    }).on("click", function (treeNode) {
        if (treeNode.numChildren > 50) {
            alert(treeNode.key + " отправил очень многим поставщикам (" + treeNode.numChildren + "). Корректно визуализировать невозможно.");
        } else {
            toggle(treeNode);
            update(treeNode);
        };
    });
    drawedNode.append("svg:circle").attr("r", 1e-6).on("mouseover", function (treeNode) {
        animateNode(treeNode);
    }).on("mouseout", function (treeNode) {
        toolTip.transition().duration(500).style("opacity", "0");
    }).style("fill", function (treeNode) {
        return treeNode.source ? treeNode.source.linkColor : treeNode.linkColor;
    }).style("fill-opacity", ".8").style("stroke", function (treeNode) {
        return treeNode.source ? treeNode.source.linkColor : treeNode.linkColor;
    });
    drawedNode.append("svg:text").attr("x", function (treeNode) {
        return treeNode.children || treeNode._children ? -10 : 10;
    }).attr("dy", ".35em").attr("text-anchor", function (treeNode) {
        return treeNode.children || treeNode._children ? "end" : "start";
    }).text(function (treeNode) {
        var nodeDescription = (treeNode.depth == 4) ? treeNode.Level4 : treeNode.key;
        nodeDescription = (String(nodeDescription).length > 25) ? String(nodeDescription).substr(0, 22) + "..." : nodeDescription;
        return nodeDescription;
    }).on("mouseover", function (treeNode) {
        animateNode(treeNode);
    }).on("mouseout", function (treeNode) {
        toolTip.transition().duration(500).style("opacity", "0");
    }).style("fill-opacity", "0");
    var nodeTransform = currentNode.transition().duration(durationValue).attr("transform", function (treeNode) {
        return "translate(" + treeNode.y + "," + treeNode.x + ")";
    });
    nodeTransform.select("circle").attr("r", function (treeNode) {
        if (treeNode.depth == 0) {
            return 10;
        } else {
            if (treeNode.depth == 1) {
                var nodeRadius = level1Radius(treeNode[spendField]);
                return (isNaN(nodeRadius) ? 2 : nodeRadius);
            } else {
                if (treeNode.depth == 2) {
                    var nodeRadius = level2Radius(treeNode[spendField]);
                    return (isNaN(nodeRadius) ? 2 : nodeRadius);
                } else {
                    if (treeNode.depth == 3) {
                        var nodeRadius = level3Radius(treeNode[spendField]);
                        return (isNaN(nodeRadius) ? 2 : nodeRadius);
                    } else {
                        if (treeNode.depth == 4) {
                            var nodeRadius = level4Radius(treeNode[spendField]);
                            return (isNaN(nodeRadius) ? 2 : nodeRadius);
                        };
                    };
                };
            };
        };
    }).style("fill", function (treeNode) {
        return treeNode.source ? treeNode.source.linkColor : treeNode.linkColor;
    }).style("fill-opacity", function (treeNode) {
        var nodeFill = ((treeNode.depth + 1) / 5);
        return nodeFill;
    });
    nodeTransform.select("text").style("fill-opacity", 1);
    var nodeOpacity = currentNode.exit().transition().duration(durationValue).attr("transform", function (treeNode) {
        return "translate(" + nodeToUpdate.y + "," + nodeToUpdate.x + ")";
    }).remove();
    nodeOpacity.select("circle").attr("r", 1e-6);
    nodeOpacity.select("text").style("fill-opacity", 1e-6);
    var nodeClass = vis.selectAll("path.link").data(tree.links(currentNodes), function (treeNode) {
        return treeNode.target.id;
    });
    var nodeDepth = 0;
    nodeClass.enter().insert("svg:path", "g").attr("class", "link").attr("d", function (treeNode) {
        if (Number(treeNode.target[spendField]) > 0) {
            var nodeToExpland = {
                x: nodeToUpdate.x0,
                y: nodeToUpdate.y0
            };
            return diagonal({
                source: nodeToExpland,
                target: nodeToExpland
            });
        } else {
            null;
        };
    }).style("stroke", function (treeNode, i) {
        if (treeNode.source.depth == 0) {
            nodeDepth++;
            return (treeNode.source.children[nodeDepth - 1].linkColor);
        } else {
            return (treeNode.source) ? treeNode.source.linkColor : treeNode.linkColor;
        };
    }).style("stroke-width", function (treeNode, i) {
        if (treeNode.source.depth == 0) {
            var nodeRadius = level1Radius(treeNode.target[spendField]) * 2;
            return (isNaN(nodeRadius) ? 4 : nodeRadius);
        } else {
            if (treeNode.source.depth == 1) {
                var nodeRadius = level2Radius(treeNode.target[spendField]) * 2;
                return (isNaN(nodeRadius) ? 4 : nodeRadius);
            } else {
                if (treeNode.source.depth == 2) {
                    var nodeRadius = level3Radius(treeNode.target[spendField]) * 2;
                    return (isNaN(nodeRadius) ? 4 : nodeRadius);
                } else {
                    if (treeNode.source.depth == 3) {
                        var nodeRadius = level4Radius(treeNode.target[spendField]) * 2;
                        return (isNaN(nodeRadius) ? 4 : nodeRadius);
                    };
                };
            };
        };
    }).style("stroke-opacity", function (treeNode) {
        var nodeFill = ((treeNode.source.depth + 1) / 4.5);
        if (treeNode.target[spendField] <= 0) {
            nodeFill = 0.1;
        };
        return nodeFill;
    }).style("stroke-linecap", "round").transition().duration(durationValue);
    var nodeStroke = nodeClass.transition().duration(durationValue).attr("d", diagonal);
    nodeStroke.style("stroke-width", function (treeNode, i) {
        if (treeNode.source.depth == 0) {
            var nodeRadius = level1Radius(Number(treeNode.target[spendField])) * 2;
            return (isNaN(nodeRadius) ? 4 : nodeRadius);
        } else {
            if (treeNode.source.depth == 1) {
                var nodeRadius = level2Radius(Number(treeNode.target[spendField])) * 2;
                return (isNaN(nodeRadius) ? 4 : nodeRadius);
            } else {
                if (treeNode.source.depth == 2) {
                    var nodeRadius = level3Radius(Number(treeNode.target[spendField])) * 2;
                    return (isNaN(nodeRadius) ? 4 : nodeRadius);
                } else {
                    if (treeNode.source.depth == 3) {
                        var nodeRadius = level4Radius(Number(treeNode.target[spendField])) * 2;
                        return (isNaN(nodeRadius) ? 4 : nodeRadius);
                    };
                };
            };
        };
    }).style("stroke-opacity", function (treeNode) {
        var nodeFill = ((treeNode.source.depth + 1) / 4.5);
        if (treeNode.target[spendField] <= 0) {
            nodeFill = 0.1;
        };
        return nodeFill;
    });
    nodeClass.exit().transition().duration(durationValue).attr("d", diagonal).remove();
    currentNodes.forEach(function (treeNode) {
        treeNode.x0 = treeNode.x;
        treeNode.y0 = treeNode.y;
    });

    function animateNode(treeNode) {
        toolTip.transition().duration(200).style("opacity", ".9");
        header.text(treeNode.key);
        defective.text(formatCurrency(treeNode.sum_Federal));
        received.text(formatCurrency(treeNode.sum_State));
        sent.text(formatCurrency(treeNode.sum_Local));
        toolTip.style("left", (d3.event.pageX + 15) + "px").style("top", (d3.event.pageY - 75) + "px");
    };
};

function toggleButton(buttonToTogle) {
    buttonToTogle.attr("class", "selected");
    if (buttonToTogle == defectiveButton) {
        sentButton.attr("class", "unselected");
        receivedButton.attr("class", "unselected");
    } else {
        if (buttonToTogle == receivedButton) {
            sentButton.attr("class", "unselected");
            defectiveButton.attr("class", "unselected");
        } else {
            defectiveButton.attr("class", "unselected");
            receivedButton.attr("class", "unselected");
        };
    };
};

function toggle(treeNode) {
    if (treeNode.children) {
        treeNode._children = treeNode.children;
        treeNode.children = null;
    } else {
        treeNode.children = treeNode._children;
        treeNode._children = null;
    };
};