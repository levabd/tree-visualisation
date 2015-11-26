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
update(root);

function update(source) {

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
          return "translate(" + d.y + "," + d.x + ")"; });

  nodeEnter.append("circle")
      .attr("r", 10)
      .style("fill", function(d) { 
        return d.fake ? "red" : "green"
      })
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

  /*nodeEnter.append("text")
      .attr("x", function(d) { 
          return d.children || d._children ? -13 : 13; })
      .attr("dy", ".35em")
      .attr("text-anchor", function(d) { 
          return d.children || d._children ? "end" : "start"; })
      .text(function(d) { return d.name; })
      .style("fill-opacity", 1);*/

  // Declare the links…
  var link = svg.selectAll("path.link")
      .data(links, function(d) { return d.target.id; });

  // Enter the links.
  link.enter().insert("path", "g")
      .attr("class", "link")
      .attr("d", diagonal);

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
