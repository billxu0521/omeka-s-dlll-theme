function setNodeData(data){
    
    var namelist = [];
    var nodes = [];
    var links = [];
    for(var i in data){
        
        namelist.push(data[i]['source_name']);
        namelist.push(data[i]['target_name']);
        links.push({'source':data[i]['source_name'],'target':data[i]['target_name'],'relationship':data[i]['relationship']});
    }
    
    //處理重複
    var result = namelist.filter(function(element, index, arr){
        return arr.indexOf(element) === index;
    });
    for(var i in result){
        nodes.push({'id':result[i],'group':1});
    }
   
    var resultData = {'links':links,'nodes':nodes};
    
    return resultData;
}


function starGraph(data){
    
    var colors = d3.scaleOrdinal(d3.schemeCategory20);
    var margin = { top: -5, right: -5, bottom: -5, left: -5 },
        width = $('.social-network-relationship').innerWidth(),
        height = $('.social-network-relationship').innerHeight();

    var linkedByIndex = {};
    data.links.forEach(function(d) {
        linkedByIndex[d.source + "," + d.target] = true;
    });
    function isConnected(a, b) {
        return linkedByIndex[a.id + "," + b.id] ||  a.id == b.id;
    }


    var zoom = d3.zoom()
            .scaleExtent([0.5, 3])
            .on("zoom", zoomed);
    
    //var slider = d3.select("#SvgRange")
    //        .datum({});
    
    // Update the current slider value (each time you drag the slider handle)
    $("#SvgRange").on('input',function() {
        zoom.scaleTo(svg, this.value/10 );
    });

    
    var _svg = d3.select("svg"),
        s_width = + _svg.attr("width"),
        s_height = + _svg.attr("height");

    var svg = _svg.append('g')
        .attr("width",  460)
        .attr("height",  460)
        .attr("transform", "translate(0,0) scale(.7)")
        .style("cursor","move")
        .call(zoom)
        .append("g");
   
   var rect = svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "none")
        .style("pointer-events", "all");
   
    var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) { return d.id; }).distance(function(d) {return 400;}))
        .force("charge", d3.forceManyBody()
            .strength(-600)
            .theta(2)
            .distanceMin(100)
            .distanceMax(1000))
        .force('collide', d3.forceCollide(1))
        .force("center", d3.forceCenter(width / 2 + 100, (height / 2) + 60));

    var link = svg.append("g")
            .selectAll(".link")
            .data(data.links)
            .enter()
            .append("line")
            .attr("class", "link");
   
    link.append("title")
            .text(function (d) {return d.relationship;});
    var svg_h = $('.social-network-relationship').innerHeight();
    var svg_w = $('.social-network-relationship').innerWidth();
    
    var node = svg.append("g")
        .attr("class", "node")
        .selectAll(".node")
        .data(data.nodes)
        .enter()
        .append("g");
        
    node.append("circle")
        .attr("r", 20)
        .style("fill", function (d, i) {return colors(i);})

    node.append("title")
        .attr("dy", -10)
        .text(function (d) {return d.id;});

    var lables = node.append("text")
        .attr("dy", -20)
        .text(function(d) {
          return d.id;
        });
        
    var linklables = link.append("text")
        .attr("dy", -10)
        .text(function(d) {
          return d.relationship;
        });
        
    var edgepaths = svg.append("g")
        .selectAll(".edgepath")
        .data(data.links)
        .enter()
        .append('path')
        .attr('class','edgepath')
        .attr('fill-opacity',0)
        .attr('stroke-opacity',0)
        .attr('id',function (d, i) {return 'edgepath' + i;})
        .style("pointer-events", "none");
    
    var edgelabels = svg.append("g")
        .selectAll(".edgelabel")
        .data(data.links)
        .enter()
        .append('text')
        .style("pointer-events", "none")
        .attr('class','edgelabel')
        .attr("dy", -10)
        .attr('id',function (d, i) {return 'edgelabel' + i;})
        .attr('font-size','10px')
        .attr('fill','#aaa');

    edgelabels.append('textPath')
        .attr('xlink:href', function (d, i) {return '#edgepath' + i;})
        .style("text-anchor", "middle")
        .style("pointer-events", "none")
        .attr("startOffset", "50%")
        .text(function (d) {return d.relationship;});    
        
    simulation
        .nodes(data.nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(data.links);


    //節點的動作處理
    node.on("mouseover", function(d) {
            set_highlight(d);
        }).on("mouseout", function(d) {
            exit_highlight();
        });
    node.on("click", function() {
        var _label_name = $(this).find('text').text();
        console.log(_label_name);
        var _btn_label = '搜尋' + _label_name;
        $('#searchnode').show();
        $('#searchnode').attr('href','http://ccstwlib.ccstw.nccu.edu.tw/s/malaysiaperson/solr?q='+_label_name);
        $('#searchnode').html(_btn_label);

    });
        

    function ticked() {
        link
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node
            .attr("transform", function(d) {
              return "translate(" + d.x + "," + d.y + ")";
            })
             .style("stroke", "#424242")
             .style("stroke-width", "1px")
             .attr("group",  function(d) { return "group_"+d.group; })
             .attr("cx", function (d) { return d.x+5; })
             .attr("cy", function(d) { return d.y-3; });

        edgepaths.attr('d', function (d) {
              return 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y;
          });

        edgelabels.attr('transform', function (d) {
            if (d.target.x < d.source.x) {
                var bbox = this.getBBox();

                rx = bbox.x + bbox.width / 2;
                ry = bbox.y + bbox.height / 2;
                return 'rotate(180 ' + rx + ' ' + ry + ')';
            }
            else {
                return 'rotate(0)';
            }
        });
        
        
    }
    function zoomed() {
            svg.attr("transform", d3.event.transform);
            console.log(d3.event.transform.k * 10 );
            $('#SvgRange').attr( "value", d3.event.transform.k * 10 );
        };
    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.5).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
    
    var focus_node = null, highlight_node = null;
    var highlight_color = "blue";
    var highlight_trans = 0.1;
    var towhite = "stroke";
    var default_link_color = "#888";
    
    function set_highlight(d){
        if (focus_node!==null) d = focus_node;
        highlight_node = d;
        if (highlight_color!="white")
        {
            node.style(towhite, function(o) {
                return isConnected(d, o) ? highlight_color : "white";});
            lables.style("font-weight", function(o) {
                return isConnected(d, o) ? "bold" : "normal";});
            link.style("stroke", function(o) {
                return o.source.index == d.index || o.target.index == d.index ? highlight_color : ( o.score>=0?color(o.score):default_link_color);
                });
        }
    }
    function exit_highlight(){
        highlight_node = null;
        if (focus_node===null){
            svg.style("cursor","move");
            if (highlight_color!="white"){
                node.style(towhite, "white");
                lables.style("font-weight", "normal");
                link.style("stroke", function(o) {return  o.score>=0?color(o.score):default_link_color});
            }
        }
    }
    
}


