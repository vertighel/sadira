
template_ui_builders.double=function(ui_opts, tpl_item){
    //console.log("double builder :  " + JSON.stringify(ui_opts));
    if(typeof ui_opts.type=='undefined') ui_opts.type="short";
    switch (ui_opts.type){
    case "short":
	var ui=tpl_item.ui=ce("span");
	ui.className="value";
	tpl_item.set_value=function(nv){if(typeof nv !='undefined')tpl_item.value=nv; ui.innerHTML=Math.floor(tpl_item.value*1000)/1000;}
	break;
    case "edit": 
	var ui=tpl_item.ui=ce("input");
	if(ui_opts.input_type)
	    ui.type=ui_opts.input_type;
	else
	    ui.type="number";
	if(tpl_item.min) ui.min=tpl_item.min;
	if(tpl_item.max) ui.max=tpl_item.max;
	if(tpl_item.step) ui.step=tpl_item.step;

	tpl_item.get_value=function(){return tpl_item.value;}
	tpl_item.set_value=function(nv){if(typeof nv !='undefined')tpl_item.value=nv; ui.value=tpl_item.value}

	ui.addEventListener("change",function(){
	    tpl_item.value=this.value*1.0; 
	    if(tpl_item.onchange){
		tpl_item.onchange();
	    }
	},false);
	break;
    default: 
	throw "Unknown UI type " + ui_opts.type + " for " + tpl_item.name;
    }
    return tpl_item.ui;
}


template_ui_builders.labelled_vector=function(ui_opts, tpl_item){

    var ui=tpl_item.ui=ce("ul");
    
    ui.className="labelled_vector";
    tpl_item.inputs=[];
    
    for(var v=0;v<tpl_item.value.length;v++){
	var li=ce("li"), label=ce("label"); 
	tpl_item.inputs[v]={ 
	    id : v,
	    type : typeof tpl_item.vector_type == 'undefined' ? "double" : tpl_item.vector_type,
	    name : tpl_item.value_labels[v],
	    min : tpl_item.min, 
	    max : tpl_item.max, 
	    step : tpl_item.step, 
	    value : tpl_item.value[v],
	    parent : { 
		ui_childs : { 
		    add_child : function(e,nui){ui.appendChild(nui);},
		    replace_child : function(nui,oui){
			ui.replaceChild(nui, oui);
			console.log("LAB VECTOR container Replaced UI!");
		    }
		}
	    },
	    onchange : function(v){
		tpl_item.value[this.id]=this.value;
		if(tpl_item.onchange) tpl_item.onchange(this.id);
	    }
	    
	}; 
	
	
	//var vui=create_ui(ui_opts, tpl_item.inputs[v]);
	var vui=create_ui({ editable : ui_opts.editable, type: ui_opts.type}, tpl_item.inputs[v]);
	ui.appendChild(vui);
    }
    
    tpl_item.set_value=function(nv){
	//console.log("TPLI set value " + JSON.stringify(nv));
	if(typeof nv !='undefined'){
	    this.value=nv;
	}
	for(var v=0;v<this.inputs.length;v++){
	    //console.log("TPLI set value " + JSON.stringify(this.value[v]) + " on " + tpl_item.inputs[v].name );
	    tpl_item.inputs[v].set_value(this.value[v]);
	}
	
	
	//if(tpl_item.onchange) tpl_item.onchange();
	
	//ui.innerHTML=tpl_item.value? "yes":"no";
    }

    //console.log("Done building LABVEC : " + tpl_item.name);

    return tpl_item.ui;
    
}

template_ui_builders.local_file=function(ui_opts, tpl_item){

    switch (ui_opts.type){
    case "short":
	var ui=tpl_item.ui=ce("span");
	ui.className="local_file";
	ui.innerHTML=tpl_item.value;

	break;
    case "edit": 
	var ui=tpl_item.ui=ce("input");
	ui.className="local_file";
	ui.type="file";

	ui.addEventListener("change",function(evt){
	    tpl_item.value=this.value;
	    if(tpl_item.onchange){
		tpl_item.onchange(evt);
	    }
	}, false);
	break;
    default: 
	throw "Unknown UI type ";
    }

    tpl_item.set_value=function(nv){
	if(typeof nv !='undefined')tpl_item.value=nv;
	ui.innerHTML=tpl_item.value;
    }
    return tpl_item.ui;
}

template_ui_builders.bytesize=function(ui_opts, tpl_item){
    template_ui_builders.double(ui_opts, tpl_item);
    var ui=tpl_item.ui;
    switch (ui_opts.type){
    case "short":
	tpl_item.format_number=function(v){
	    var u=["","k","M","G","T"];
	    var id=0,idmax=4;
	    var val=v, unit='bytes';
	    while(val>1024 && id<idmax){
		val=val/1024.0;
		id++;
	    };
	    return val + " " +u[id]+unit;
	};
	tpl_item.set_value=function(nv){
	    if(typeof nv!='undefined')tpl_item.value=nv;
	    //ui.innerHTML=nv;
	    //console.log("Bytesize setting val : " + tpl_item.value + " nv = " + nv);
	    ui.innerHTML=tpl_item.format_number(tpl_item.value);
	}
	break;
    case "edit": 
	break;
    default: 
	throw "Unknown UI type ";
    }
    
    return ui;
}

template_ui_builders.bool=function(ui_opts, tpl_item){

    switch (ui_opts.type){


    case "short":
	var ui=tpl_item.ui=ce("span");
	ui.className="value";
	tpl_item.set_value=function(nv){
	    if(typeof nv !='undefined')tpl_item.value=nv;
	    ui.innerHTML=tpl_item.value? "yes":"no";
	}
	break;
    case "edit": 
	var ui=tpl_item.ui=ce("input");
	ui.type="checkbox";
	tpl_item.set_value=function(nv){
	    if(typeof nv !='undefined')tpl_item.value=nv;
	    ui.checked=tpl_item.value;
	}
	tpl_item.get_value=function(){
	    return ui.checked;
	}
	break;
    default: 
	throw "Unknown UI type ";
    }
    
    
    if(tpl_item.onchange){
	ui.onchange=function(){
	    tpl_item.value=this.checked; 
	    tpl_item.onchange();
	}
    }
    
    return tpl_item.ui;
}


template_ui_builders.string=function(ui_opts, tpl_item){

    switch (ui_opts.type){

    case "short":
	var ui=tpl_item.ui=ce("span");
	ui.className="value";
	tpl_item.set_value=function(nv){
	    if(typeof nv !='undefined')tpl_item.value=nv;
	    ui.innerHTML=tpl_item.value;
	}
	break;
    case "edit": 
	var ui=tpl_item.ui=ce("input");
	ui.type="text";
	tpl_item.set_value=function(nv){
	    if(typeof nv !='undefined')tpl_item.value=nv;
	    ui.value=tpl_item.value;
	}
	tpl_item.get_value=function(){
	    return ui.value;
	}
	if(tpl_item.onchange){
	    ui.onchange=function(){
		tpl_item.value=this.value; 
		tpl_item.onchange();
	    }
	}
	break;
    default: 
	throw "Unknown UI type ";
    }
    
    return tpl_item.ui;
}


template_ui_builders.date=function(ui_opts, tpl_item){

    switch (ui_opts.type){

    case "short":
	var ui=tpl_item.ui=ce("span");
	ui.className="value";
	tpl_item.set_value=function(nv){
	    if(typeof nv !='undefined')tpl_item.value=nv;
	    ui.innerHTML=tpl_item.value;
	}
	break;
    case "edit": 
	var ui=tpl_item.ui=ce("input");
	ui.type="date";
	tpl_item.set_value=function(nv){
	    if(typeof nv !='undefined')tpl_item.value=nv;
	    ui.value=tpl_item.value;
	}
	tpl_item.get_value=function(){
	    return ui.value;
	}

	ui.onchange=function(){
	    tpl_item.value=this.value; 
	    if(tpl_item.onchange)
		tpl_item.onchange();
	}
	break;
    default: 
	throw "Unknown UI type ";
    }
    
    return tpl_item.ui;
}


template_ui_builders.url=function(ui_opts, tpl_item){

    switch (ui_opts.type){

    case "short":
	var ui=tpl_item.ui=ce("span");
	ui.className="value";
	tpl_item.set_value=function(nv){
	    if(typeof nv !='undefined')tpl_item.value=nv;
	    ui.innerHTML=tpl_item.value;
	}
	break;
    case "edit": 
	var ui=tpl_item.ui=ce("input");
	ui.type="url";
	tpl_item.set_value=function(nv){
	    if(typeof nv !='undefined')tpl_item.value=nv;
	    ui.value=tpl_item.value;
	}
	tpl_item.get_value=function(){
	    return ui.value;
	}

	ui.onchange=function(){
	    tpl_item.value=this.value; 
	    if(tpl_item.onchange)
		tpl_item.onchange();
	}
	break;
    default: 
	throw "Unknown UI type ";
    }
    
    return tpl_item.ui;
}


template_ui_builders.image_url=function(ui_opts, tpl_item){
    var ui=tpl_item.ui=ce("div");
    
    function load_image(){
	if(typeof tpl_item.value!='undefined') img.src=tpl_item.value;
    }

    switch (ui_opts.type){
    case "short":
	//var utext=cc("div",ui);
	//utext.add_class("value");
	
	tpl_item.set_value=function(nv){
	    if(typeof nv !='undefined')tpl_item.value=nv;
	  //  utext.innerHTML=tpl_item.value;
	    load_image();
	}
	break;
    case "edit": 
	var utext=tpl_item.ui=ce("input");
	utext.type="url";
	tpl_item.set_value=function(nv){
	    if(typeof nv !='undefined')tpl_item.value=nv;
	    utext.value=tpl_item.value;
	    load_image();
	}
	tpl_item.get_value=function(){
	    return utext.value;
	}

	utext.onchange=function(){
	    tpl_item.value=this.value; 
	    load_image();
	    if(tpl_item.onchange)
		tpl_item.onchange();
	}
	break;
    default: 
	throw "Unknown UI type ";
    }
    var img=cc("img",ui);
    load_image();

    return tpl_item.ui;
}


template_ui_builders.html=function(ui_opts, tpl_item){

    var ui=tpl_item.ui=ce("div");
    ui.className="html_content";
    tpl_item.set_value=function(nv){
	if(typeof nv !='undefined')tpl_item.value=nv;
	ui.innerHTML=tpl_item.value;
    }

    switch (ui_opts.type){
	
    case "short":
	break;
    case "edit": 
	ui.add_class("editable");
	if(tpl_item.onchange){
	    ui.onchange=function(){
		tpl_item.value=this.value; 
		tpl_item.onchange();
	    }
	}
	break;
    default: 
	throw "Unknown UI type ";
    }

    if(tpl_item.url){
	download_url(tpl_item.url,function(error, html_content){
	    tpl_item.set_value(html_content);
	});
    }
    
    return tpl_item.ui;
}




template_ui_builders.action=function(ui_opts, tpl_item){
    var ui=tpl_item.ui=ce("input"); ui.type="button";
    ui.value=tpl_item.name;

    ui.addEventListener("click",function(e){
	if(tpl_item.onclick){
	    tpl_item.onclick(e);
	}
    },false);

    //if(tpl_item.ui_name)
    //	tpl_item.ui_root.removeChild(tpl_item.ui_name);
    tpl_item.set_title("");
    
    return ui;
}

template_ui_builders.vector=function(ui_opts, tpl_item){

    //var ui=tpl_item.ui=ce("div"); ui.className="plot_container";
    
    //  var ui=tpl_item.ui=ce("ul");
    //  ui.className="vector";
    if(typeof tpl_item.value=='undefined'){
	tpl_item.value = [];
    }
    if(typeof tpl_item.step=='undefined'){
	tpl_item.step = 1;
    }
    if(typeof tpl_item.start=='undefined'){
	tpl_item.start = 0;
    }

    console.log("Building vector ");

    var svg;
    var brush;
    var selection=tpl_item.elements.selection;
    
    selection.value=[tpl_item.start, 
		     tpl_item.start + tpl_item.value.length*tpl_item.step ];


    tpl_item.elements.zoom.onclick=function(){
	if(typeof tpl_item.on_range_change!='undefined') tpl_item.on_range_change(selection.value);
	tpl_item.redraw();
    };
    tpl_item.elements.unzoom.onclick = function(){
	selection.set_value([tpl_item.min, tpl_item.max]);
	// cuts.set_value([tpl_item.start, 
	// 		   tpl_item.start + tpl_item.value.length*tpl_item.step ]);
	console.log("unzoom to " + JSON.stringify(selection.value) + " start = " + tpl_item.start);
	if(typeof tpl_item.on_range_change!='undefined') tpl_item.on_range_change(selection.value);
	tpl_item.redraw();
    }

    

    tpl_item.set_range=function(new_range){
	selection.set_value(new_range);
	brush.extent(new_range);
    };

    
    function brushed() {
	
	selection.value[0]=brush.extent()[0];
	selection.value[1]=brush.extent()[1];
	
	selection.set_value();

	svg.select(".brush").call(brush);
	
	if(brg!=null){
	    //cmap.domnode.style.width=(brg[1].getBBox().width+0.0)+'px';
	    //cmap.domnode.style.marginLeft=(brg[1].getBBox().x+xmarg)+'px';
	    var bid=0;
	    
	    brg.selectAll("rect").each(function(){
		// brg.each(function(){
		//console.log("BRUSH "+bid+": x=" + this.getBBox().x + " y=" + this.getBBox().y+ " w=" + this.getBBox().width+ " h=" + this.getBBox().height);
		if(bid==1){
		    //cmap.domnode.style.width=(this.getBBox().width+0.0)+'px';
		   // cmap.domnode.style.marginLeft=(this.getBBox().x+xmarg)+'px';
		    
		}
		bid++;
		
	    });	       	
	    
	}else
	    console.log("brg is NULL !");
	
	if(tpl_item.selection_change)
	    tpl_item.selection_change(selection.value);

	//	    fv.cmap.display();
    }

    //{width: 200, height: 100, margin : {top: 0, right: 10, bottom: 30, left: 50} };

    
    var ui=tpl_item.ui=ce("div");

    var bn=d3.select(ui);
//    d3.select("svg").remove();

    var brg=null;
//    var xmarg, xw, ymarg;
    
    // if(typeof svg!='undefined')
    // 	if(ui.hasChild(svg))
    // 	    ui.removeChild(svg);
    
    svg = bn.append('svg');
	//base_node.appendChild(svg.ownerSVGElement);
	
    tpl_item.set_value=function(v){
	if(typeof v!='undefined')tpl_item.value=v;
	this.redraw();
    }

    tpl_item.redraw=function(){

	var margin = ui_opts.margin;
	var width = tpl_item.parent.ui_root.clientWidth //ui_opts.width 
	    - margin.left - margin.right - 30;
	
	var height = ui_opts.height- margin.top - margin.bottom;
	console.log("UI w,h  = " + width + "," + height);
	// var width = ui.clientWidth - margin.left - margin.right;
	// var height = ui.clientHeight- margin.top - margin.bottom;
	
	
	
	var x = d3.scale.linear().range([0, width]).domain(selection.value);
	var y = d3.scale.sqrt().range([height, 0]);
	
	var xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(5);    
	var yAxis = d3.svg.axis().scale(y).orient("left").ticks(5);
	brush = d3.svg.brush().x(x).on("brushend", brushed);
	
	var area = d3.svg.area().interpolate("step-before")
	    .x(function(d,i) { return x(tpl_item.start + i*tpl_item.step); })
	    .y0(height)
	    .y1(function(d) { return y(d); });
	
	
	svg.select("g").remove();
	svg.attr("width", width + margin.left + margin.right);
	svg.attr("height", height + margin.top + margin.bottom);

	var context = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");	

	var histo=this.value;
	if(histo.length==0) return;
	
	x.domain(selection.value);//
	//x.domain([fv.viewer_cuts[0],fv.viewer_cuts[1]]);
	y.domain(d3.extent(histo, function(d) { return d; }));
	
	
	
	var xsvg = context.append("g")
	    .attr("class", "x axis")
	    .attr("transform", "translate(0," + height + ")")
	    .call(xAxis);
	
	
	xmarg=margin.left; //this.getBBox().x;
	ymarg=margin.top; //this.getBBox().x;
	
	xsvg.each(function(){
	    //	 console.log("XAXIS: x=" + this.getBBox().x + " y=" + this.getBBox().y+ " w=" + this.getBBox().width+ " h=" + this.getBBox().height);
	    //xw=this.getBBox().width;
	});	       
	
	
	var ysvg=context.append("g")
	    .attr("class", "y axis")
	    .call(yAxis)
	    .append("text")
	    .attr("transform", "rotate(-90)")
	    .attr("y", 6)
	    .attr("dy", ".71em")
	    .style("text-anchor", "end")
	    .text("Number of pixels");
	
	// ysvg.each(function(){
	// 		 console.log("YAXIS: x=" + this.getBBox().x + " y=" + this.getBBox().y+ " w=" + this.getBBox().width+ " h=" + this.getBBox().height);
	// 	     });	       
	
	var pathsvg=context.append("path")
	    .datum(histo)
	    .attr("class", "line")
	//.attr("d", line);
	    .attr("d", area);
	
	// pathsvg.each(function(){
	// 		    console.log("PATH: x=" + this.getBBox().x + " y=" + this.getBBox().y+ " w=" + this.getBBox().width+ " h=" + this.getBBox().height);
	// 		});
	
	
	/*
	  fv.cmap.domnode.style.marginLeft=(xmarg-2.0)+'px';
	  fv.cmap.domnode.style.width=(xw+0.0)+'px';
	  fv.cmap.domnode.style.height=(50+0.0)+'px';
	  fv.cmap.domnode.style.marginTop='-10px';
	*/	       
	
	// cmap.display();
	
	var height2=height;
	
	brg=context.append("g")
	    .attr("class", "brush")
	    .call(brush);
	
	brg.selectAll("rect")
	    .attr("y", -6)
	    .attr("height", height2 + 7);
	
	brg.selectAll(".resize").append("path").attr("d", resizePath);
	
	//			   
	//base_node.appendChild(fv.cmap.domnode);
	//		   brush.extent([data[0].pixvalue*1.0,data[data.length-1].pixvalue*1.0]);
	brush.extent(selection.value);//[fv.viewer_cuts[0],fv.viewer_cuts[1]]);
	
	function resizePath(d) {
	    var e = +(d == "e"),
	    x = e ? 1 : -1,
	    y = height / 3;
	    
	    //brushed();
	    //x+=xmarg;
	    
	    return "M" + (.5 * x) + "," + y
		+ "A6,6 0 0 " + e + " " + (6.5 * x) + "," + (y + 6)
		+ "V" + (2 * y - 6)
		+ "A6,6 0 0 " + e + " " + (.5 * x) + "," + (2 * y)
		+ "Z"
		+ "M" + (2.5 * x) + "," + (y + 8)
		+ "V" + (2 * y - 8)
		+ "M" + (4.5 * x) + "," + (y + 8)
		+ "V" + (2 * y - 8);
	    
	    
	}
	
	
	
	//brush.extent([2000,4000]);
	//svg.select(".brush").call(brush);		   
	brushed();
	//
	//ready_function();
 	//brush(context);
	
	//$('#bottom_space')[0].innerHTML='<br/><br/>The End!<br/>';
	
	//   brush.extent([0.2, 0.8]);
	//  svg.select(".brush").call(brush);		   
	
	// var gBrush = g.append("g").attr("class", "brush").call(brush);
	// gBrush.selectAll("rect").attr("height", height);
	// gBrush.selectAll(".resize").append("path").attr("d", resizePath);
	
    }
    return tpl_item.ui;
}


template_ui_builders.color=function(ui_opts, tpl_item){

    
    var ui=tpl_item.ui=ce("div"); ui.className="color_container";
    var cui=ce("input"); cui.type="color";
    ui.appendChild(cui);
    
    cui.addEventListener("change", function() {

        ui.style.backgroundColor = cui.value;
	tpl_item.value=cui.value;

	if(tpl_item.onchange){
	    tpl_item.onchange();
	}

	
    },false);

    ui.style.backgroundColor = cui.value;    
    
    tpl_item.set_value=function(nv){
	if(typeof nv !='undefined')
	    tpl_item.value=nv;
	cui.value=tpl_item.value;
	
	if ("createEvent" in document) {
	    var evt = document.createEvent("HTMLEvents");
	    evt.initEvent("change", false, true);
	    cui.dispatchEvent(evt);
	}
	else
	    cui.fireEvent("onchange");

	//cui.trigger(new Event('change'));
    }

    switch (ui_opts.type){
    case "short":
	break;
    case "edit": 
	cui.addEventListener("change",function(){
	    tpl_item.value=this.value; 
	    if(tpl_item.onchange){
		tpl_item.onchange();
	    }
	},false);
	break;
    default: 
	throw "Unknown UI type ";
    }
    
    return tpl_item.ui;
}

template_ui_builders.angle=function(ui_opts, tpl_item){
    return template_ui_builders.double(ui_opts, tpl_item);
}

