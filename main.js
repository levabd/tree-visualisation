var fbMask = d3["select"](document["getElementById"]("fbMask"));

function fb_mouseOver() {
    fbMask["style"]("display", "none");
};

function fb_mouseOut() {
    fbMask["style"]("display", "block");
};


var m = [20, 120, 20, 120],
    w = 1280 - m[1] - m[3],
    h = 900 - m[0] - m[2],
    i = 0,
    root = {};
var spendField = "sum_Federal";
var actField = "sum_Federal";
var sumFields = ["Federal", "GovXFer", "State", "Local"];
var sourceFields = ["Category", "Level1", "Level2", "Level3", "Level4"];
var colors = [ "#bd0026", "#fecc5c", "#fd8d3c", "#f03b20", "#B02D5D", "#9B2C67", "#982B9A", "#692DA7", "#5725AA", "#4823AF", "#d7b5d8", "#dd1c77", "#5A0C7A", "#5A0C7A" ];
var formatNumber = d3["format"](",.3f");
var formatCurrency = function (treeNode) {
    return "$" + formatNumber(treeNode) + " Billion";
};
var tree = d3["layout"]["tree"]();
tree["children"](function (treeNode) {
    return treeNode["values"];
});
tree["size"]([h, w]);
var toolTip = d3["select"](document["getElementById"]("toolTip"));
var header = d3["select"](document["getElementById"]("head"));
var header1 = d3["select"](document["getElementById"]("header1"));
var header2 = d3["select"](document["getElementById"]("header2"));
var fedSpend = d3["select"](document["getElementById"]("fedSpend"));
var stateSpend = d3["select"](document["getElementById"]("stateSpend"));
var localSpend = d3["select"](document["getElementById"]("localSpend"));
var federalButton = d3["select"](document["getElementById"]("federalButton"));
var stateButton = d3["select"](document["getElementById"]("stateButton"));
var localButton = d3["select"](document["getElementById"]("localButton"));
var federalDiv = d3["select"](document["getElementById"]("federalDiv"));
var stateDiv = d3["select"](document["getElementById"]("stateDiv"));
var localDiv = d3["select"](document["getElementById"]("localDiv"));
var diagonal = d3["svg"]["diagonal"]()["projection"](function (treeNode) {
    return [treeNode["y"], treeNode["x"]];
});
var vis = d3["select"]("#body")["append"]("svg:svg")["attr"]("width", w + m[1] + m[3])["attr"]("height", h + m[0] + m[2])["append"]("svg:g")["attr"]("transform", "translate(" + m[3] + "," + m[0] + ")");
var level1Max = {};
var level2Max = {};
var level3Max = {};
var level4Max = {};
var level1Radius;
var level2Radius;
var level3Radius;
var level4Radius;
var alreadySummed = false;
d3["csv"]("http://www.brightpointinc.com/interactive/budget/FederalBudget_2013_a.csv", function (entry) {
    var treeNodeArray = [];
    entry["forEach"](function (treeNode) {
        var _0xe16ax2c = 0;
        for (var i = 0; i < sumFields["length"]; i++) {
            _0xe16ax2c += Number(treeNode[sumFields[i]]);
        };
        if (_0xe16ax2c > 0) {
            treeNodeArray["push"](treeNode);
        };
    });
    var _0xe16ax2d = d3["nest"]()["key"](function (treeNode) {
        return treeNode["Level1"];
    })["key"](function (treeNode) {
        return treeNode["Level2"];
    })["key"](function (treeNode) {
        return treeNode["Level3"];
    })["entries"](treeNodeArray);
    root = {};
    root["values"] = _0xe16ax2d;
    root["x0"] = h / 2;
    root["y0"] = 0;
    var _0xe16ax2e = tree["nodes"](root)["reverse"]();
    tree["children"](function (treeNode) {
        return treeNode["children"];
    });
    _0xe16ax2f();
    _0xe16ax30();
    alreadySummed = true;
    root["values"]["forEach"](_0xe16ax31);
    toggle(root["values"][2]);
    update(root);
    stateButton["on"]("click", function (treeNode) {
        stateButton["attr"]("class", "selected");
        federalButton["attr"]("class", null);
        localButton["attr"]("class", null);
        stateDiv["attr"]("class", "selected");
        federalDiv["attr"]("class", null);
        localDiv["attr"]("class", null);
        spendField = "sum_State";
        actField = "sum_State";
        _0xe16ax30();
        update(root);
    });
    localButton["on"]("click", function (treeNode) {
        localButton["attr"]("class", "selected");
        stateButton["attr"]("class", null);
        federalButton["attr"]("class", null);
        localDiv["attr"]("class", "selected");
        federalDiv["attr"]("class", null);
        stateDiv["attr"]("class", null);
        spendField = "sum_Local";
        actField = "sum_Local";
        _0xe16ax30();
        update(root);
    });
    federalButton["on"]("click", function (treeNode) {
        federalButton["attr"]("class", "selected");
        stateButton["attr"]("class", null);
        localButton["attr"]("class", null);
        federalDiv["attr"]("class", "selected");
        stateDiv["attr"]("class", null);
        localDiv["attr"]("class", null);
        spendField = "sum_Federal";
        _0xe16ax30();
        update(root);
    });

    function _0xe16ax2f() {
        for (var i = 0; i < sumFields["length"]; i++) {
            level1Max["sum_" + sumFields[i]] = 0;
            level2Max["sum_" + sumFields[i]] = 0;
            level3Max["sum_" + sumFields[i]] = 0;
            level4Max["sum_" + sumFields[i]] = 0;
        };
        sumNodes(root["children"]);
    };

    function _0xe16ax30() {
        level1Radius = d3["scale"]["sqrt"]()["domain"]([0, level1Max[spendField]])["range"]([1, 40]);
        level2Radius = d3["scale"]["sqrt"]()["domain"]([0, level2Max[spendField]])["range"]([1, 40]);
        level3Radius = d3["scale"]["sqrt"]()["domain"]([0, level3Max[spendField]])["range"]([1, 40]);
        level4Radius = d3["scale"]["sqrt"]()["domain"]([0, level4Max[spendField]])["range"]([1, 40]);
    };

    function _0xe16ax31(treeNode) {
        if (treeNode["values"] && treeNode["values"]["actuals"]) {
            treeNode["values"]["actuals"]["forEach"](_0xe16ax31);
            toggle(treeNode);
        } else {
            if (treeNode["values"]) {
                treeNode["values"]["forEach"](_0xe16ax31);
                toggle(treeNode);
            };
        };
    };
});

function setSourceFields(_0xe16ax33, _0xe16ax34) {
    if (_0xe16ax34) {
        for (var i = 0; i < sourceFields["length"]; i++) {
            var _0xe16ax35 = sourceFields[i];
            if (_0xe16ax33[_0xe16ax35] != undefined) {
                _0xe16ax33["source_" + _0xe16ax35] = _0xe16ax33[_0xe16ax35];
            };
            _0xe16ax34["source_" + _0xe16ax35] = (_0xe16ax33["source_" + _0xe16ax35]) ? _0xe16ax33["source_" + _0xe16ax35] : _0xe16ax33[_0xe16ax35];
        };
    };
};

function sumNodes(_0xe16ax2e) {
    for (var _0xe16ax37 = 0; _0xe16ax37 < _0xe16ax2e["length"]; _0xe16ax37++) {
        var _0xe16ax38 = _0xe16ax2e[_0xe16ax37];
        if (_0xe16ax38["children"]) {
            sumNodes(_0xe16ax38["children"]);
            for (var _0xe16ax39 = 0; _0xe16ax39 < _0xe16ax38["children"]["length"]; _0xe16ax39++) {
                var _0xe16ax33 = _0xe16ax38["children"][_0xe16ax39];
                for (var i = 0; i < sumFields["length"]; i++) {
                    if (isNaN(_0xe16ax38["sum_" + sumFields[i]])) {
                        _0xe16ax38["sum_" + sumFields[i]] = 0;
                    };
                    _0xe16ax38["sum_" + sumFields[i]] += Number(_0xe16ax33["sum_" + sumFields[i]]);
                    if ((_0xe16ax38["parent"])) {
                        if (_0xe16ax38["depth"] == 1) {
                            level1Max["sum_" + sumFields[i]] = Math["max"](level1Max["sum_" + sumFields[i]], Number(_0xe16ax38["sum_" + sumFields[i]]));
                        } else {
                            if (_0xe16ax38["depth"] == 2) {
                                level2Max["sum_" + sumFields[i]] = Math["max"](level2Max["sum_" + sumFields[i]], Number(_0xe16ax38["sum_" + sumFields[i]]));
                            } else {
                                if (_0xe16ax38["depth"] == 3) {
                                    level3Max["sum_" + sumFields[i]] = Math["max"](level3Max["sum_" + sumFields[i]], Number(_0xe16ax38["sum_" + sumFields[i]]));
                                } else {
                                    if (_0xe16ax38["depth"] == 4) {
                                        level4Max["sum_" + sumFields[i]] = Math["max"](level4Max["sum_" + sumFields[i]], Number(_0xe16ax38["sum_" + sumFields[i]]));
                                    };
                                };
                            };
                        };
                        setSourceFields(_0xe16ax38, _0xe16ax38["parent"]);
                    };
                };
            };
        } else {
            for (var i = 0; i < sumFields["length"]; i++) {
                _0xe16ax38["sum_" + sumFields[i]] = Number(_0xe16ax38[sumFields[i]]);
                if (isNaN(_0xe16ax38["sum_" + sumFields[i]])) {
                    _0xe16ax38["sum_" + sumFields[i]] = 0;
                };
            };
        };
        setSourceFields(_0xe16ax38, _0xe16ax38["parent"]);
    };
};

function update(_0xe16ax3b) {
    var _0xe16ax3c = d3["event"] && d3["event"]["altKey"] ? 5000 : 500;
    var _0xe16ax2e = tree["nodes"](root)["reverse"]();
    var _0xe16ax3d = 0;
    _0xe16ax2e["forEach"](function (treeNode) {
        treeNode["y"] = treeNode["depth"] * 180;
        treeNode["numChildren"] = (treeNode["children"]) ? treeNode["children"]["length"] : 0;
        if (treeNode["depth"] == 1) {
            treeNode["linkColor"] = colors[(_0xe16ax3d % (colors["length"] - 1))];
            _0xe16ax3d++;
        };
        if (treeNode["numChildren"] == 0 && treeNode["_children"]) {
            treeNode["numChildren"] = treeNode["_children"]["length"];
        };
    });
    _0xe16ax2e["forEach"](function (treeNode) {
        var _0xe16ax3e = treeNode;
        while ((_0xe16ax3e["source"] && _0xe16ax3e["source"]["depth"] > 1) || _0xe16ax3e["depth"] > 1) {
            _0xe16ax3e = (_0xe16ax3e["source"]) ? _0xe16ax3e["source"]["parent"] : _0xe16ax3e["parent"];
        };
        treeNode["linkColor"] = (_0xe16ax3e["source"]) ? _0xe16ax3e["source"]["linkColor"] : _0xe16ax3e["linkColor"];
    });
    var _0xe16ax38 = vis["selectAll"]("g.node")["data"](_0xe16ax2e, function (treeNode) {
        return treeNode["id"] || (treeNode["id"] = ++i);
    });
    var _0xe16ax3f = _0xe16ax38["enter"]()["append"]("svg:g")["attr"]("class", "node")["attr"]("transform", function (treeNode) {
        return "translate(" + _0xe16ax3b["y0"] + "," + _0xe16ax3b["x0"] + ")";
    })["on"]("click", function (treeNode) {
        if (treeNode["numChildren"] > 50) {
            alert(treeNode["key"] + " has too many departments (" + treeNode["numChildren"] + ") to view at once.");
        } else {
            toggle(treeNode);
            update(treeNode);
        };
    });
    _0xe16ax3f["append"]("svg:circle")["attr"]("r", 1e-6)["on"]("mouseover", function (treeNode) {
        _0xe16ax47(treeNode);
    })["on"]("mouseout", function (treeNode) {
        toolTip["transition"]()["duration"](500)["style"]("opacity", "0");
    })["style"]("fill", function (treeNode) {
        return treeNode["source"] ? treeNode["source"]["linkColor"] : treeNode["linkColor"];
    })["style"]("fill-opacity", ".8")["style"]("stroke", function (treeNode) {
        return treeNode["source"] ? treeNode["source"]["linkColor"] : treeNode["linkColor"];
    });
    _0xe16ax3f["append"]("svg:text")["attr"]("x", function (treeNode) {
        return treeNode["children"] || treeNode["_children"] ? -10 : 10;
    })["attr"]("dy", ".35em")["attr"]("text-anchor", function (treeNode) {
        return treeNode["children"] || treeNode["_children"] ? "end" : "start";
    })["text"](function (treeNode) {
        var _0xe16ax40 = (treeNode["depth"] == 4) ? treeNode["Level4"] : treeNode["key"];
        _0xe16ax40 = (String(_0xe16ax40)["length"] > 25) ? String(_0xe16ax40)["substr"](0, 22) + "..." : _0xe16ax40;
        return _0xe16ax40;
    })["on"]("mouseover", function (treeNode) {
        _0xe16ax47(treeNode);
    })["on"]("mouseout", function (treeNode) {
        toolTip["transition"]()["duration"](500)["style"]("opacity", "0");
    })["style"]("fill-opacity", "0");
    var _0xe16ax41 = _0xe16ax38["transition"]()["duration"](_0xe16ax3c)["attr"]("transform", function (treeNode) {
        return "translate(" + treeNode["y"] + "," + treeNode["x"] + ")";
    });
    _0xe16ax41["select"]("circle")["attr"]("r", function (treeNode) {
        if (treeNode["depth"] == 0) {
            return 10;
        } else {
            if (treeNode["depth"] == 1) {
                var _0xe16ax40 = level1Radius(treeNode[spendField]);
                return (isNaN(_0xe16ax40) ? 2 : _0xe16ax40);
            } else {
                if (treeNode["depth"] == 2) {
                    var _0xe16ax40 = level2Radius(treeNode[spendField]);
                    return (isNaN(_0xe16ax40) ? 2 : _0xe16ax40);
                } else {
                    if (treeNode["depth"] == 3) {
                        var _0xe16ax40 = level3Radius(treeNode[spendField]);
                        return (isNaN(_0xe16ax40) ? 2 : _0xe16ax40);
                    } else {
                        if (treeNode["depth"] == 4) {
                            var _0xe16ax40 = level4Radius(treeNode[spendField]);
                            return (isNaN(_0xe16ax40) ? 2 : _0xe16ax40);
                        };
                    };
                };
            };
        };
    })["style"]("fill", function (treeNode) {
        return treeNode["source"] ? treeNode["source"]["linkColor"] : treeNode["linkColor"];
    })["style"]("fill-opacity", function (treeNode) {
        var _0xe16ax40 = ((treeNode["depth"] + 1) / 5);
        return _0xe16ax40;
    });
    _0xe16ax41["select"]("text")["style"]("fill-opacity", 1);
    var _0xe16ax42 = _0xe16ax38["exit"]()["transition"]()["duration"](_0xe16ax3c)["attr"]("transform", function (treeNode) {
        return "translate(" + _0xe16ax3b["y"] + "," + _0xe16ax3b["x"] + ")";
    })["remove"]();
    _0xe16ax42["select"]("circle")["attr"]("r", 1e-6);
    _0xe16ax42["select"]("text")["style"]("fill-opacity", 1e-6);
    var _0xe16ax43 = vis["selectAll"]("path.link")["data"](tree["links"](_0xe16ax2e), function (treeNode) {
        return treeNode["target"]["id"];
    });
    var _0xe16ax44 = 0;
    _0xe16ax43["enter"]()["insert"]("svg:path", "g")["attr"]("class", "link")["attr"]("d", function (treeNode) {
        if (Number(treeNode["target"][spendField]) > 0) {
            var _0xe16ax45 = {
                x: _0xe16ax3b["x0"],
                y: _0xe16ax3b["y0"]
            };
            return diagonal({
                source: _0xe16ax45,
                target: _0xe16ax45
            });
        } else {
            null;
        };
    })["style"]("stroke", function (treeNode, i) {
        if (treeNode["source"]["depth"] == 0) {
            _0xe16ax44++;
            return (treeNode["source"]["children"][_0xe16ax44 - 1]["linkColor"]);
        } else {
            return (treeNode["source"]) ? treeNode["source"]["linkColor"] : treeNode["linkColor"];
        };
    })["style"]("stroke-width", function (treeNode, i) {
        if (treeNode["source"]["depth"] == 0) {
            var _0xe16ax40 = level1Radius(treeNode["target"][spendField]) * 2;
            return (isNaN(_0xe16ax40) ? 4 : _0xe16ax40);
        } else {
            if (treeNode["source"]["depth"] == 1) {
                var _0xe16ax40 = level2Radius(treeNode["target"][spendField]) * 2;
                return (isNaN(_0xe16ax40) ? 4 : _0xe16ax40);
            } else {
                if (treeNode["source"]["depth"] == 2) {
                    var _0xe16ax40 = level3Radius(treeNode["target"][spendField]) * 2;
                    return (isNaN(_0xe16ax40) ? 4 : _0xe16ax40);
                } else {
                    if (treeNode["source"]["depth"] == 3) {
                        var _0xe16ax40 = level4Radius(treeNode["target"][spendField]) * 2;
                        return (isNaN(_0xe16ax40) ? 4 : _0xe16ax40);
                    };
                };
            };
        };
    })["style"]("stroke-opacity", function (treeNode) {
        var _0xe16ax40 = ((treeNode["source"]["depth"] + 1) / 4.5);
        if (treeNode["target"][spendField] <= 0) {
            _0xe16ax40 = 0.1;
        };
        return _0xe16ax40;
    })["style"]("stroke-linecap", "round")["transition"]()["duration"](_0xe16ax3c);
    var _0xe16ax46 = _0xe16ax43["transition"]()["duration"](_0xe16ax3c)["attr"]("d", diagonal);
    _0xe16ax46["style"]("stroke-width", function (treeNode, i) {
        if (treeNode["source"]["depth"] == 0) {
            var _0xe16ax40 = level1Radius(Number(treeNode["target"][spendField])) * 2;
            return (isNaN(_0xe16ax40) ? 4 : _0xe16ax40);
        } else {
            if (treeNode["source"]["depth"] == 1) {
                var _0xe16ax40 = level2Radius(Number(treeNode["target"][spendField])) * 2;
                return (isNaN(_0xe16ax40) ? 4 : _0xe16ax40);
            } else {
                if (treeNode["source"]["depth"] == 2) {
                    var _0xe16ax40 = level3Radius(Number(treeNode["target"][spendField])) * 2;
                    return (isNaN(_0xe16ax40) ? 4 : _0xe16ax40);
                } else {
                    if (treeNode["source"]["depth"] == 3) {
                        var _0xe16ax40 = level4Radius(Number(treeNode["target"][spendField])) * 2;
                        return (isNaN(_0xe16ax40) ? 4 : _0xe16ax40);
                    };
                };
            };
        };
    })["style"]("stroke-opacity", function (treeNode) {
        var _0xe16ax40 = ((treeNode["source"]["depth"] + 1) / 4.5);
        if (treeNode["target"][spendField] <= 0) {
            _0xe16ax40 = 0.1;
        };
        return _0xe16ax40;
    });
    _0xe16ax43["exit"]()["transition"]()["duration"](_0xe16ax3c)["attr"]("d", diagonal)["remove"]();
    _0xe16ax2e["forEach"](function (treeNode) {
        treeNode["x0"] = treeNode["x"];
        treeNode["y0"] = treeNode["y"];
    });

    function _0xe16ax47(treeNode) {
        toolTip["transition"]()["duration"](200)["style"]("opacity", ".9");
        header["text"](treeNode["source_Level1"]);
        header1["text"]((treeNode["depth"] > 1) ? treeNode["source_Level2"] : "");
        header2["html"]((treeNode["depth"] > 2) ? treeNode["source_Level3"] : "");
        if (treeNode["depth"] > 3) {
            header2["html"](header2["html"]() + " - " + treeNode["source_Level4"]);
        };
        fedSpend["text"](formatCurrency(treeNode["sum_Federal"]));
        stateSpend["text"](formatCurrency(treeNode["sum_State"]));
        localSpend["text"](formatCurrency(treeNode["sum_Local"]));
        toolTip["style"]("left", (d3["event"]["pageX"] + 15) + "px")["style"]("top", (d3["event"]["pageY"] - 75) + "px");
    };
};

function toggleButton(_0xe16ax49) {
    _0xe16ax49["attr"]("class", "selected");
    if (_0xe16ax49 == federalButton) {
        localButton["attr"]("class", "unselected");
        stateButton["attr"]("class", "unselected");
    } else {
        if (_0xe16ax49 == stateButton) {
            localButton["attr"]("class", "unselected");
            federalButton["attr"]("class", "unselected");
        } else {
            federalButton["attr"]("class", "unselected");
            stateButton["attr"]("class", "unselected");
        };
    };
};

function toggle(treeNode) {
    if (treeNode["children"]) {
        treeNode["_children"] = treeNode["children"];
        treeNode["children"] = null;
    } else {
        treeNode["children"] = treeNode["_children"];
        treeNode["_children"] = null;
    };
};