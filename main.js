var toolTip = d3.select(document.getElementById("toolTip"));
var header = d3.select(document.getElementById("head"));
var sent = d3.select(document.getElementById("sent"));
var received = d3.select(document.getElementById("received"));
var defective = d3.select(document.getElementById("defective"));;
var defectiveButton = d3.select(document.getElementById("defectiveButton"));
var receivedButton = d3.select(document.getElementById("receivedButton"));
var sentButton = d3.select(document.getElementById("sentButton"));
var sumButton = d3.select(document.getElementById("sumButton"));
var defectiveDiv = d3.select(document.getElementById("defectiveDiv"));
var receivedDiv = d3.select(document.getElementById("receivedDiv"));
var sentDiv = d3.select(document.getElementById("sentDiv"));

// ************** Generate the tree diagram  *****************
var margin = {top: 20, right: 120, bottom: 20, left: 120},
    width = 960 - margin.right - margin.left,
    height = 500 - margin.top - margin.bottom;
    
var i = 0;

var tree = d3.layout.tree()
    .size([height, width]);

var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.y, d.x]; });

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// load data
root = treeData;
update(root, "sum");

receivedButton.on("click", function (treeNode) {
    receivedButton.attr("class", "selected");
    defectiveButton.attr("class", null);
    sentButton.attr("class", null);
    receivedDiv.attr("class", "selected");
    sumButton.attr("class", null);
    defectiveDiv.attr("class", null);
    sentDiv.attr("class", null);
    update(root, "received");
});
sentButton.on("click", function (treeNode) {
    sentButton.attr("class", "selected");
    receivedButton.attr("class", null);
    defectiveButton.attr("class", null);
    sentDiv.attr("class", "selected");
    sumButton.attr("class", null);
    defectiveDiv.attr("class", null);
    receivedDiv.attr("class", null);
    update(root, "sent");
});
defectiveButton.on("click", function (treeNode) {
    defectiveButton.attr("class", "selected");
    receivedButton.attr("class", null);
    sentButton.attr("class", null);
    defectiveDiv.attr("class", "selected");
    sumButton.attr("class", null);
    receivedDiv.attr("class", null);
    sentDiv.attr("class", null);
    update(root, "defective");
});
sumButton.on("click", function (treeNode) {
    sumButton.attr("class", "selected");
    defectiveButton.attr("class", null);
    receivedButton.attr("class", null);
    sentButton.attr("class", null);
    defectiveButton.attr("class", null);
    defectiveDiv.attr("class", null);
    receivedDiv.attr("class", null);
    sentDiv.attr("class", null);
    update(root, "sum");
});

function update(source, mode) {
  var durationValue = d3.event && d3.event.altKey ? 5000 : 500;
  console.log(mode);
  // Compute the new tree layout.
  var nodes = tree.nodes(root).reverse(),
      links = tree.links(nodes);

  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth * 180; });

  // Declare the nodes…
  var node = svg.selectAll("g.node")
      .data(nodes, function(d) { return d.id || (d.id = ++i); });

  // Enter the nodes.
  var nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { 
          return "translate(" + d.y + "," + d.x + ")"; })
      .on("click", function (treeNode) {
        if (treeNode.numChildren > 50) {
            alert(treeNode.name + " отправил очень многим поставщикам (" + treeNode.numChildren + "). Корректно визуализировать невозможно.");
        } else {
            toggle(treeNode);
            update(treeNode, mode);
        };
    });;

  var nodeTransform = node.transition().duration(durationValue).attr("transform", function (treeNode) {
        return "translate(" + treeNode.y + "," + treeNode.x + ")";
    });

  nodeTransform.select("circle")
  .attr("r", function(d){
    var rez = (d.received - d.defective - d.sent) / 4;
    
    switch(mode) {
        case "sum":
            break;
        case "received":
            rez =  d.received / 4;
            break;
        case "defective":
            rez = d.defective;
            break;
        case "sent":
            rez = d.sent / 4;
            break;
        default:
            break;
    }
    
    return (rez > 5) ? rez : 5;
  });

  nodeEnter.append("circle")
      .attr("r", function(d){
        var rez = (d.received - d.defective - d.sent) / 4;
        
        switch(mode) {
            case "sum":
                break;
            case "received":
                rez =  d.received / 100;
                break;
            case "defective":
                rez = d.defective / 100;
                break;
            case "sent":
                rez = d.sent / 1000;
                break;
            default:
                break;
        }
        
        return (rez > 5) ? rez : 5;
      })
      .style("fill", function(d) { 
        return d.fake ? "red" : "green"
      })
      .style("stroke", "#444")
      .style("stroke-width", "2px")
      .on("mouseover", function (d) {
        animateNode(d);
      })
      .on("mouseout", function (d) {
        toolTip.transition().duration(500).style("opacity", "0");
      })/*.style("fill", function (treeNode) {
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
    });*/

  nodeEnter.append("text")
      .attr("x", function(d) { 
          return d.children || d._children ? 20 : 15; })
      .attr("dy", "-1.35em")
      .style("font-size","12px")
      .attr("text-anchor", function(d) { 
          return d.children || d._children ? "end" : "start"; })
      .text(function(d) { return d.name; })
      .style("fill-opacity", 1);

  // Declare the links…
  var link = svg.selectAll("path.link")
      .data(links, function(d) { return d.target.id; });

  // Enter the links.
  link.enter().insert("path", "g")
      .attr("class", "link")
      .attr("d", diagonal)
      .style("stroke", "#888")
      .style("stroke-width", "3px");

  function animateNode(treeNode) {
        toolTip.transition().duration(200).style("opacity", ".9");
        var text = treeNode.name.concat(treeNode.fake ? "(Обнаружено странное поведение)" : "");
        header.text(text);
        defective.text(treeNode.defective);
        received.text(treeNode.received);
        sent.text(treeNode.sent);
        toolTip.style("left", (d3.event.pageX + 15) + "px").style("top", (d3.event.pageY - 75) + "px");
    };

}

function toggle(treeNode) {
    if (treeNode.children) {
        treeNode._children = treeNode.children;
        treeNode.children = null;
    } else {
        treeNode.children = treeNode._children;
        treeNode._children = null;
    };
};
