var fulldata;
var cindex = 0;//to initialize the sticky index

$(function () {
	var readanddisplay = read();

	readanddisplay.display();

	$('.backimages').css('height', $('.content').css('height'));

	popup();

	rotateprojimgs().preload();
});

var read = function(){
	return {
		display: function(){
			var url = "js/json/data.json";

			$.getJSON(url, function (data) {
				fulldata = data;

				var parent = read();

				//retrieve and display web and desktop projects data
				parent.retrieveprojects(data.web, 'webimage', '#webprojects');
				parent.retrieveprojects(data.desktop, 'desktopimage', '#desktopprojects');

				//retrieve and display skills and experience data
				parent.retrieveskills(data.skills);
				parent.retrieveexperience(data.experience);
				
				//retrieve and display biography
				content().biography(data.biography);

				parent.retrieveservices(data.services);

				// initialize the tooltip function, from popperjs
				$('[data-toggle="tooltip"]').tooltip();

				var md = modal();

				//display more details, in relation with the selected project
				md.show();

				//append a sections title to the top, when it gets to 
				statictop();
		    });
		},
		retrieveprojects: function(data, type, parent){
			read().retrieve(data, $(parent+' .projs'), type, 'projects');
		},
		retrieveskills: function(data){
			read().retrieve(data, $('.skillslist'), '', 'skills');

			// $('.leadBody').slideUp(1);
			// menudrop();
		},
		retrieveexperience: function(data){
			read().retrieve(data, $('.workexperience'), '', 'experience');
		},
		retrieveservices: function(data){
			read().retrieve(data, $('.projecttypebody'), '', 'services');
			
			$('.about, .leadBody').slideUp(1);
			menudrop();
		},
		retrieve: function(data, sel, type, sect){
			var getcontent = '';

			var con = content();

			$.each(data, function (key, value) {
				if(sect=='projects')
	    			getcontent += con.projects(value, type);
	    		else if(sect=='skills')
	    			getcontent += con.skills(value);
	    		else if(sect=='experience')
	    			getcontent += con.experience(value);
	    		else if(sect=='services')
	    			getcontent += con.services(value);
	        });

	    	sel.html(getcontent);//pastes projects to browser
		}
	}
}

var content = function(){
	return {
		projects: function(data, type){
			var icon = type=="webimage" ? 'globe' : 'desktop';

			var projcontent = '<div class="proj container-fluid">' +
						'<div class="title" data-toggle="tooltip" data-placement="auto" title="'+data.shortdescription+'"><i class="fa fa-'+icon+' sectid"></i> '+data.name+'</div>' +
			
				'<div class="row">';

				projcontent += content().randomizeprojectpos(data, type);
					
				projcontent += '</div></div>';
							
			return projcontent;
		},
		skills: function(data){
			var skillscontent = '<div class="col-12 col-sm-6 container-fluid">' +
					'<h2 class="lead">'+data.skill+' <span><i class="fa fa-angle-down"></i><i class="fa fa-angle-up"></i></span></h2>' +
					'<div class="leadBody row">';

			if(data.skill!='Others')
				skillscontent += '<h3 class="col-12 col-sm-12">Tools and Technologies <hr class="nodecor"></h3>';

			var techlist = data.tools;//tech list reference ids
			var toolslist = fulldata.tools;//tech list

			for (var i = 0; i < techlist.length; i++) {
				var tool = toolslist[techlist[i] - 1];
				var imgpath = fulldata.path.techimage + tool.imagepath;
 				
				skillscontent += '<h4 class="col-6 col-sm-4"><img src="'+imgpath+'" class="img img-fluid skillimg"' +'alt="awalkwithsolzy image"> '+tool.name+'</h4>';
			}

			skillscontent += '</div>' +
				'</div>';

			return skillscontent;
		},
		experience: function(data){
			var expcontent = '<div class="col-12 col-sm-12 col-md-6 container-fluid">' +
					'<div class="lead exphead row">' +
						'<div class="col-12 col-sm-12 expheadtitle">'+data.role+', '+data.company+'<span class="expheadduration">'+data.duration+'</span>' +'</div>' +
					'</div>' +

					'<div class="expBody row">' +
						'<h3 class="col-12 col-sm-4">Project type</h3><h4 class="col-12 col-sm-8">';

			var projtypes = data.projecttypes;//tech list reference ids
			var ptslist = fulldata.projecttypes;//tech list

			for (var i = 0; i < projtypes.length; i++) {
				var pjt = ptslist[projtypes[i] - 1];

				expcontent += pjt.name + '. ';
			}

			expcontent += '</h4><h3 class="col-12 col-sm-4">Tools and Technologies</h3>' +
						'<h4 class="col-12 col-sm-8">';

			var techlist = data.tools;//tech list reference ids
			var toolslist = fulldata.tools;//tech list

			for (var i = 0; i < techlist.length; i++) {
				var tool = toolslist[techlist[i] - 1];
				var imgpath = fulldata.path.techimage + tool.imagepath;
 				
				expcontent += '<img src="'+imgpath+'" class="img img-fluid skillimg" alt="awalkwithsolzy image"> ' + tool.name + '. ';
			}	

			expcontent += '</h4></div>' +
				'</div>';

			return expcontent;
		},
		biography: function(data){
			//first part of bio
			var bioone = '<h3 class="col-12 col-sm-4 hindex">Full name</h3>' +
							'<h4 class="col-12 col-sm-8 hvalue">'+data.name+'</h4>' +
							'<h3 class="col-12 col-sm-4 hindex">D.O.B</h3>' +
							'<h4 class="col-12 col-sm-8 hvalue">'+data.dob+'</h4>' +
							'<h3 class="col-12 col-sm-4 hindex">Education</h3>' +
							'<h4 class="col-12 col-sm-8 hvalue">'+data.education+'</h4>' +
							'<h3 class="col-12 col-sm-4 hindex">NYSC</h3>' +
							'<h4 class="col-12 col-sm-8 hvalue">'+data.nysc+'</h4>';

			$('.biopartone').html(bioone);

			// second part of bio

			//add the summary part of bio to the document
			$('.summarybody').prepend(data.summary);

			//add the mantra part of bio to the document
			var mantras = data.mantras;

			for (var i = 0; i < mantras.length; i++)
				$('.mantrabody').append('<span class="col-12 col-sm-12">'+mantras[i]+'</span>');//append the mantras to the document
			
			//add the hobbies and interests part of bio to the document
			var interests = data.interests;

			for (var i = 0; i < interests.length; i++)
				$('.interestbody').append('<span class="col-12 col-sm-12">'+interests[i]+'</span>');//append the mantras to the document

			bioshowmoreorless();//show me more or less of biography
		},
		services: function(data){
			console.log(data.title);
			var sercontent = '<div class="col-12 col-sm-6 col-md-4 col-lg-3">' +
					'<h3 class="hindex projecttype">'+ data.title +' '+ data.type +' <span><i class="fa fa-angle-down"></i><i class="fa fa-angle-up"></i></span></h3>' +
					'<div class="about">'+data.about+'</div>' +
				'</div>';

			return sercontent;
		},
		visuals: function(data, type){
			var projcontent = '<div class="col-6 col-sm-6 visuals">'+
					'<input type="hidden" class="projid" value="'+data.id+'">' +
					'<input type="hidden" class="projtype" value="'+type+'">';

			var path = fulldata.path[type] + data.imagepath;//adds the default path, depending on the type (web, desktop or tech image)

			for (var i = 0; i < data.imagespath.length; i++) {
				var imgpath = path + data.imagespath[i];

				projcontent += '<img src="'+imgpath+'" class="img img-responsive projimg" alt="'+data.name+' image">';
				
				if(i > 4)
					break;
			}

			projcontent += '</div>';

			return projcontent;
		},
		description: function(data, type){
			var projcontent = '<div class="col-6 col-sm-6 description">' +
							'<h2>'+data.fulldescription+'</h2>' +
							'<div class="details container-fluid">' +
								'<h3>Tools and Technologies used</h3>' +
								'<hr>' +
								'<div class="techlist row">';

				var techlist = data.tools;//tech list reference ids
				var toolslist = fulldata.tools;//tech list

				for (var i = 0; i < techlist.length; i++) {
					var tool = toolslist[techlist[i] - 1];
					var imgpath = fulldata.path.techimage + tool.imagepath;
	 				
					projcontent += '<a href="'+tool.url+'" class="col-3 col-sm-3"><img src="'+imgpath+'" alt="awalkwithsolzy" class="img img-fluid techimg"></a>';

					if(i > 2)
						break;
				}

				projcontent += '<a href="#" class="col-3 col-sm-3 more" data-toggle="tooltip" data-placement="auto" title="click me to see full details">' +
											'<input type="hidden" class="projid" value="'+data.id+'">' +
											'<input type="hidden" class="projtype" value="'+type+'">' +
											'<i class="fa fa-chevron-right"></i></a>' +
									'</div>' +
								'</div>' +
							'</div>';

			return projcontent;
		},
		randomizeprojectpos: function(data, type){
			var firstpos = Math.floor(Math.random() * 2);

			var con = content();

			var visuals = con.visuals(data, type);//for random no 0
			var description = con.description(data, type);//for random no 1

			var projcontent = firstpos==1 ? description : visuals;
			projcontent += firstpos==1 ? visuals : description;

			return projcontent;
		}
	}
}

var rotateprojimgs = function(){
	return{
		execute: function(){
			var imgcontainer = $('.visuals');

			var rotate = rotateprojimgs();

			var i = Math.floor(Math.random() * imgcontainer.length);

			rotate.action(imgcontainer.eq(i));
		},
		action: function(value){
			var imgs = value.children('img');

			var index = Math.floor(Math.random() * imgs.length);

			imgs.fadeOut(6000);
			imgs.eq(index).fadeIn(7000);
		},
		preload: function(){
			var imgcontainer = $('.visuals');

			for (var i = 0; i < imgcontainer.length; i++) {
				imgcontainer.eq(i).children('img:gt(0)').fadeOut(1);
			}
		}
	}
}

var modal = function(){
	return{
		show: function(){
			$('.more, .visuals').click(function(){
				var id = $(this).children('.projid').val();
				var type = $(this).children('.projtype').val();

				modal().retrieveData(id, type);

				$("#moreModal").modal({show:true});
			});
		},
		retrieveData: function(id, type){
			//determines what json object is queried
			var data = type=='webimage' ? fulldata.web : fulldata.desktop;

			var path = fulldata.path[type];//adds the default path, depending on the type (web, desktop or tech image)

			
			for (var i = 0; i < data.length; i++) {
				if(data[i].id==id){
					path += data[i].imagepath;

					var md = modal();

					md.appendProjImg(path, data[i].imagespath);
					md.append(data[i]);
					md.appendTools(data[i].tools);

					break;
				}
			}
		},
		appendProjImg: function(imgpath, imgs){
			var lis = '';
			var imgList = '';

			imgs.forEach(function(value, index){
				var path = imgpath + value;

				lis += '<li data-target="#carouselExampleIndicators" data-slide-to="'+index+'"';
				if(index == 0)
					lis += ' class="active"';

				lis += '></li>';	

				imgList += '<div class="carousel-item';
				if(index == 0)
					imgList += ' active';

				imgList += '">' +
					      '<img class="d-block w-100 img-responsive modalprojimages" src="'+path+'" alt="awalkwithsolzy image">' +
					    '</div>';
			});

			$('.modalimgsindicators').html(lis);
			$('.modalprojimgs').html(imgList);
		},
		append: function(data){
			var coll = [{'sel': '.projtitle', 'name': 'Project Title', 'value': data.name},
			 {'sel': '.projtype', 'name': 'Project Type', 'value': data.type},
			 {'sel': '.projdesc', 'name': 'About', 'value': data.shortdescription},
			 {'sel': '.fdescription', 'name': 'Description', 'value': data.fulldescription},
			 {'sel': '.domain', 'name': 'Domain name', 'value': data.domain},
			 {'sel': '.repo', 'name': 'Project Repository', 'value': data.repository},
			 {'sel': '.projduration', 'name': 'Project Duration', 'value': data.duration},
			 {'sel': '.teamno', 'name': 'Team Size', 'value': data.teamno},
			 {'sel': '.teammates', 'name': 'Team Mate(s)', 'value': data.teammates}];

			coll.forEach(function(item, index){
				var content = '<h3 class="modaltitle">'+item.name+'</h3><hr class="formodal"><span>'+item.value+'</span>';
				$(item.sel).html(content);
			});
		},
		appendTools: function(imgrefs){
			var tools = '';
			var toolslist = fulldata.tools;//tech list

			for (var i = 0; i < imgrefs.length; i++) {
				var tool = toolslist[imgrefs[i] - 1];
				var imgpath = fulldata.path.techimage + tool.imagepath;
 				
				tools += '<a href="'+tool.url+'" class="col-4 col-sm-3"><img src="'+imgpath+'" alt="awalkwithsolzy" class="techimg" data-toggle="tooltip" data-placement="top" title="see more"></a>';
			}

			$('.modaltools').children('a').remove();
			$('.modaltools').append(tools);
		}
	}
}

var statictop = function(){
	$(window).scroll(function() {
		var titleLen = $('.title').length;

		var mark = $('.title').eq(cindex);
		var sticky = mark.position().top - 50;
		
		var nindex = cindex + 1 >= titleLen ? cindex : cindex + 1;

		var nmark = $('.title').eq(nindex).position().top - 50;

		if (window.pageYOffset >= sticky && window.pageYOffset < nmark) {
			staticvalue($.trim(mark.html()));   
		} 
		else if(window.pageYOffset >= nmark){
			staticvalue($.trim(mark.html()));

		    cindex = cindex >= titleLen - 1 ? titleLen - 1 : cindex + 1;
		}
		else{
		    cindex = cindex < 0 ? 0 : cindex - 1;
		}
		
		if(window.pageYOffset < $('.title').eq(0).position().top)
			$('.header').attr('hidden', true);
	});
}

var menudrop = function(){
	$('h2.lead, .projecttype').click(function(){
		$(this).next().slideToggle('slow');
	});
}

var staticvalue = function(value){
	var header = $('.header');

	if(header.attr('hidden'))
		header.removeAttr('hidden');
	
	header.html(value);
}

var introcarousel = function(){
	var path = 'img/intro/';
	var imgs = ['intro13.jpeg', 'intro06.jpg', 'intro11.jpeg', 'intro12.jpeg', 'intro05.jpg', 'intro15.jpeg', 'intro15.jpg', 'intro18.jpeg', 'intro19.jpeg', 'intro08.jpg', 'intro13.jpeg', 'intro14.jpeg'];

	var index = Math.floor(Math.random() * imgs.length);
	path += imgs[index];

	$('.backimage').fadeOut(1).attr('src', path).fadeIn(1000);
}

var popup = function(){
	var menubody = $('.menubody');

	menubody.slideToggle(0.1);

	var menuclose = $('.menuheader .fa-times');
	var menuopen = $('.menuheader .fa-align-left');

	menuclose.hide(1);

	$('.menuheader').click(function(){
		var menusplit = $('.menusplit');

		menusplit.toggleClass('shownow', 2000);

		menubody.slideToggle('slow');

		if(menusplit.hasClass('shownow')){
			menuclose.show('slow');
			menuopen.hide('slow');
		}
		else{
			menuclose.hide('slow');
			menuopen.show('slow');
		}	
	});
}

var bioshowmoreorless = function(){
	$('.showless').fadeOut(0.1);

	var biomore = $('.biomore');

	biomore.slideUp(0.1);

	$('.showornot').click(function(){
		biomore.slideToggle('slow');
		$('.showmore, .showless').fadeToggle('slow');
	});
}

window.setInterval(rotateprojimgs().execute, 15000);
window.setInterval(introcarousel, 22000);