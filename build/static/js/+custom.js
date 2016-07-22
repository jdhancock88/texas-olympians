$(document).ready(function() {

	//custom scripting goes here

	// injecting current year into footer
	// DO NOT DELETE

	var currentDate = new Date();
	var year = currentDate.getFullYear();

	currentDate = Date.parse(currentDate);

	console.log(Date.parse("today"));

	$('.copyright').text(year);

	// data counter will keep track if all of our data is loaded before we build the page
	var dataCounter = 0;

	// variables that will ultimately hold our data
	var sked;
	var athletes;

	// date parser to parse the string into a date object
	var dateParser = d3.time.format("%Y-%m-%d");
	var currentDateParser = d3.time.format("%b %d %Y");

	// date formater turns the date object into the correct Mon. Day, Year format
	var dateFormat = d3.time.format("%b. %d, %Y");

	var todaysAths = [];


	var nVisible = 11;


	/////////////////////////////////////////////
	///// GETTING THE DATA //////////////////////
	/////////////////////////////////////////////
	$.getJSON("http://interactives.dallasnews.com/data-store/2016/062016-texas-olympians-sked.json", function(data) {
		sked = data;

		_.forEach(sked, function(value, key) {
			// cut our date down to just YYYY-MM-DD
			// parse it into a date object
			// then format it into our MMM. DD, YYYY format
			var nextDate = value.nextdate.substring(0,10);
			nextDate = dateParser.parse(nextDate);
			nextDate = dateFormat(nextDate);

			// create a string to get a valid date and time to be parsed into an accurate js date
			dateTime = nextDate + ", " + value.nexttime;
			jsDate = Date.parse(dateTime);
			value.jsDate = jsDate;
			value.next_date = nextDate;
			value.gold = value.gold;
			value.silver = value.silver;
			value.bronze = value.bronze;

			// sorts the individual events on each athlete by next event date and time
			// sked.sort(function(a, b) {
			// 	var keyA = new Date(a.next_date),
			// 		keyB = new Date(b.next_date);
			//
			// 	if (keyA < keyB) {return 1;}
			// 	if (keyA > keyB) {return -1;}
			// 	return 0;
			// });


		});

		sked = _.orderBy(sked, "jsDate", "asc");

		// setting a variable that will be where we splice the events
		// array when we check to see if the events have finished
		var spliceSpot;

		// iterate over each event, and find the last event to already
		// have occurred
		for (i=0; i<sked.length; i++) {
			if (sked[i].jsDate < currentDate){
				spliceSpot = i;
			}
		}

		// create an array of events that are finished and have no upcoming times
		var completedEvents = sked.splice(0, (spliceSpot));

		// merge the events back together in one array
		// with the completed events at the end
		sked = sked.concat(completedEvents);

		dataCounter++;

		if (dataCounter === 2) {
			setupData(athletes, sked);
		}
	});

	$.getJSON("http://interactives.dallasnews.com/data-store/2016/062016-texas-olympians-athletes.json", function(data) {
		athletes = data;
		dataCounter++;

		if (dataCounter === 2) {
			setupData(athletes, sked);
		}
	});




	/////////////////////////////////////////////
	///// SETTING UP OUR DATA FOR ALL ATHLETES //
	/////////////////////////////////////////////



	// for each athlete, we'll cycle through our sked and add each event
	// to an events key on the athlete object

	function setupData(athletes, sked) {

		console.time("marrying");
		_.forEach(athletes, function(value, key) {

			var athlete = value;
			athlete.events = [];

			var found = false;

			athlete.events = _.filter(sked, function(e) {
				return e.athlete == athlete.name;
			});


			// $.each(sked, function() {
			// 	// cut our date down to just YYYY-MM-DD
			// 	// parse it into a date object
			// 	// then format it into our MMM. DD, YYYY format
			// 	var nextDate = this.nextdate.substring(0,10);
			// 	nextDate = dateParser.parse(nextDate);
			// 	nextDate = dateFormat(nextDate);
			//
			// 	// create a string to get a valid date and time to be parsed into an accurate js date
			// 	dateTime = nextDate + ", " + this.nexttime;
			// 	jsDate = Date.parse(dateTime);
			//
			//
			// 	if (athlete.name !== this.athlete && found === true) {
			// 		return false;
			// 	}
			//
			// 	// // add each event into our events key
			// 	// if (athlete.name === this.athlete) {
			// 	// 	var event = {
			// 	// 		"jsdate": jsDate,
			// 	// 		"event": this.event,
			// 	// 		"next_date": nextDate,
			// 	// 		"next_time": this.nexttime,
			// 	// 		"channel": this.channel,
			// 	// 		"roundresult": this.roundresult,
			// 	// 		"gold": this.gold,
			// 	// 		"silver": this.silver,
			// 	// 		"bronze": this.bronze,
			// 	// 		"completed": this.completed
			// 	// 	};
			// 	//
			// 	// 	found = true;
			// 	// 	// push each event to the events array on each athlete
			// 	// 	athlete.events.push(event);
			// 	//
			// 	// 	// sorts the individual events on each athlete by next event date and time
			// 	// 	athlete.events.sort(function(a, b) {
			// 	// 		var keyA = new Date(a.jsdate),
			// 	// 			keyB = new Date(b.jsdate);
			// 	//
			// 	// 		if (keyA < keyB) {return -1;}
			// 	// 		if (keyA > keyB) {return 1;}
			// 	// 		return 0;
			// 	// 	});
			// 	//
			// 	// 	// setting a variable that will be where we splice the events
			// 	// 	// array when we check to see if the events have finished
			// 	// 	var spliceSpot;
			// 	//
			// 	// 	// iterate over each event, and find the last event to already
			// 	// 	// have occurred
			// 	// 	for (i=0; i<athlete.events.length; i++) {
			// 	// 		if (athlete.events[i].jsdate < currentDate){
			// 	// 			spliceSpot = i;
			// 	// 		}
			// 	// 	}
			// 	//
			// 	// 	// create an array of events that are finished and have no upcoming times
			// 	// 	var completedEvents = athlete.events.splice(0, (spliceSpot + 1));
			// 	//
			// 	// 	// merge the events back together in one array
			// 	// 	// with the completed events at the end
			// 	// 	athlete.events = athlete.events.concat(completedEvents);
			// 	//
			// 	// }
			// });

		});
		console.timeEnd("marrying");
		// end each function that marries the two data sets together

		// sorts the athletes by their next event date and time

		athletes.sort(function(a, b) {
			var keyA = new Date(a.events[0].jsDate),
				keyB = new Date(b.events[0].jsDate);
			if (keyA < keyB) {return -1;}
			if (keyA > keyB) {return 1;}
			return 0;
		});

		// getting the current date in the the same format as the next_date value on
		// our athlete objects
		var targetDate = currentDate.toString().substring(4, 15);
		targetDate = currentDateParser.parse(targetDate);
		targetDate = dateFormat(targetDate);

		// checking over each of our athletes and populating the todaysAths array
		// with each of the athletes that match the current date
		for (i = 0; i < athletes.length; i++) {
			for (k = 0; k < athletes[i].events.length; k++) {
				if (athletes[i].events[k].next_date === targetDate) {
					todaysAths.push(athletes[i]);
				}
			}
		}

		// passing our todayAths and the targetDate off to the function
		// that builds out our divs of the athletes competing today
		buildTodaysAths(todaysAths, targetDate);

		// same as above, we're going to run through all the athletes and
		// move the ones who are finished competiting to the end of the list
		var spliceSpot;

		// find the last athlete to have already finished competiting
		for (i=0; i<athletes.length; i++) {
			if (athletes[i].events[0].jsDate < currentDate){
				spliceSpot = i;
			}
		}

		console.log(spliceSpot);

		// create an array of finished athletes, then add it back into the
		// master athletes array at the end
		var finished = athletes.splice(0, (spliceSpot+1));
		athletes = athletes.concat(finished);

		// pass the data off to our olympian drawing function
		buildOlympians(athletes, "#olympians");

		// build the dropdowns
		buildFilters();
	}




	/////////////////////////////////////////////
	///// BUILDING OUT TODAY'S ATHLETES /////////
	/////////////////////////////////////////////


	function buildTodaysAths(data, targetDate) {
		console.log(data);
		if (data.length > 0) {
			var todaysAths = d3.select("#todaysAths").selectAll(".upNext")
				.data(data);

			todaysAths.enter().append("div")
				.attr("class", "upNext clearFix");

			todaysAths.append("img")
				.attr("src", function(d) {
					var country = d.nation.toLowerCase();
					country = country.replace(/ /g, "");
					return "images/_" + country + "Flag.jpg";
				});

			todaysAths.append("h6")
				.text(function(d) {
					return d.name;
				});

			todaysAths.append("p")
				.text(function(d) {
					var content;
					for (i=0; i < d.events.length; i++) {
						if (d.events[i].next_date === targetDate) {
							content = d.events[i].event;
						}
					}
					return content;
				});

			todaysAths.append("p")
				.text(function(d) {
					var content;
					for (i=0; i < d.events.length; i++) {
						if (d.events[i].next_date == targetDate) {
							content = d.events[i].nexttime + ", " + d.events[i].channel;
						}
					}
					return content;
				});
		} else {
			$("#scheduleDisplay").remove();
		}

		// ENDS D3 ATHLETE DIV SETUP AND BEGINS ASSIGNING FUNCTIONS

		// assigning click funtion that expands and displays an athlete when
		// their name is clicked on from the schedule of today's athletes

		$(".upNext h6").click(function() {

			var athlete;

			//grabbing the name of the athlete
			var target = $(this).text();

			// find the corresponding athlete div that matches the target name
			$.each($(".athlete"), function() {
				if ( $(this).attr("data-athlete") === target) {
					athlete = $(this);
				}
			});

			// pass that div off to the checkExpansion function, which will
			// check if it's expanded currently and show it, then reposition
			// the window to accomodate any movement

			showAthletes(1000);
			checkExpansion(athlete);
		});


	}


	/////////////////////////////////////////////
	///// BUILDING OUT THE ATHLETE BLOCKS ///////
	/////////////////////////////////////////////

	// below, we're using d3 to build out our divs for each athletes
	// as with most things in d3, it's magical. mostly just creating
	// html elements based off the data for each athlete

	function buildOlympians(athletes, target) {
		var athDivs = d3.select(target).selectAll(".athlete")
			.data(athletes);

		athDivs.enter().append("div")
			.attr("class", function(d) {
				var sport = d.sport.toLowerCase();
				sport = sport.replace(/ |'|&/g, "");
				if (d.bronze > 0 || d.silver > 0 || d.gold > 0) {
					return "athlete medalWinner " + sport;
				} else {
					return "athlete " + sport;
				}
			})
			.classed("bronzeWinner", function(d) {
				if (d.bronze > 0) {return true;}
			})
			.classed("silverWinner", function(d) {
				if (d.silver > 0) {return true;}
			})
			.classed("goldWinner", function(d) {
				if (d.gold > 0) {return true;}
			})
			.attr("data-athlete", function(d) {
				return d.name;
			});

		var expander = athDivs.append("i")
			.attr("class", "fa fa-plus-circle expander");

		var athImage = athDivs.append("img")
			.attr("src", "images/_defaultImage.jpg");

		athImage.attr("data-src", function(d) {
				var name = d.name.toLowerCase();
				name = name.replace(/ /g, "");
				return "images/_" + name +".jpg";
			})
			.attr("alt", function(d) {return d.name;});

		var athContent = athDivs.append("div")
			.attr("class", "athContent");


		var athMedals = athContent.append("ul")
			.attr("class", "medalGroup clearFix");

			athMedals.append("li")
				.attr("class", "gold")
				.text(function(d) {return d.gold;});

			athMedals.append("li")
				.attr("class", "silver")
				.text(function(d) {return d.silver;});

			athMedals.append("li")
				.attr("class", "bronze")
				.text(function(d) {return d.bronze;});


		var athName = athContent .append("div")
			.attr("class", "nameBlock clearFix");

		athName.append("img")
			.attr("src", function(d) {
				var country = d.nation.toLowerCase();
				country = country.replace(/ /g, "");
				return "images/_" + country + "Flag.jpg";
			})
			.attr("alt", function(d) {
				return d.nation;
			})
			.attr("class", "flag");

		athName.append("h4")
			.html(function(d){
				return d.name;
			});

		athName.append("h5")
			.attr("class", "country")
			.text(function(d) {
				return d.nation;
			});

		var athBio = athContent.append("div")
			.attr("class", "bio");

			athBio.append("div")
				.attr("class", "info")
				.html(function(d) {
					var bioContent = "<p class='label'>Age</p>";
					bioContent += "<h6>" + d.age + "</h6>";
 					return bioContent;
				});

			athBio.append("div")
				.attr("class", "info")
				.html(function(d) {
					var bioContent = "<p class='label'>Texas tie</p>";
					bioContent += "<h6>" + d.texastie + "</h6>";
 					return bioContent;
				});

			athBio.append("div")
				.attr("class", "info")
				.html(function(d) {
					var bioContent = "<p class='label'>Sport</p>";
					bioContent += "<h6>" + d.sport + "</h6>";
 					return bioContent;
				});

		athContent.append("p")
			.attr("class", "blurb")
			.html(function(d){return d.bio;});

		var athTable = athContent.append("div")
			.attr("class", "schedule");

			athTable.append("p")
				.attr("class", "label")
				.text("Schedule and Results");

			athTable.append("table")
			.attr("class", "scheduleTable")
			.html(function(d) {

				var content = "";

				for (i= -1; i < d.events.length; i++) {
					var gold = false,
						silver = false;
						bronze = false;

					if (i >= 0) {
						if (d.events[i].gold === "x") {
							gold = true;
						} else if (d.events[i].silver === "x") {
							silver = true;
						} else if (d.events[i].bronze === "x") {
							bronze = true;
						}
					}

					if (i === -1) {
						content +=  "<tr><th>Event</th><th>Time/Date</th><th>Ch.</th><th>Round/Place</th></tr>";

					} else {

						if (d.events[i].completed !== "yes") {
							content += "<tr><td>" + d.events[i].event + "</td><td>" + d.events[i].nexttime +", " + d.events[i].next_date + "</td><td>" + d.events[i].channel + "</td>";
						} else {
							content += "<tr><td>" + d.events[i].event + "</td><td>Completed</td><td>" + d.events[i].channel + "</td>";
						}

						if (gold === true) {
							content += "<td><span class='medal goldMedal'></span>Gold</td></tr>";
						} else if (silver === true) {
							content += "<td><span class='medal silverMedal'></span>Silver</td></tr>";
						} else if (bronze === true) {
							content += "<td><span class='medal bronzeMedal'></span>Bronze</td></tr>";
						} else {
							content += "<td>" + d.events[i].roundresult +  "</td></tr>";
						}
					}
				}

				return content;

			});

		var athLinks = athContent.append("ul")
			.attr("class", "links")
			.html(function(d) {

				var content = "";

				if (d.link1text !== undefined) {
					content += "<p class='label'>Related content</p>";
					content += "<li><a target='_blank' href='" + d.link1url + "'>" + d.link1text + "</a></li>";
				}

				if (d.link2text !== undefined) {
					content += "<li><a target='_blank' href='" + d.link2url + "'>" + d.link2text + "</a></li>";
				}

				if (d.link3text !== undefined) {
					content += "<li><a target='_blank' href='" + d.link3url + "'>" + d.link3text + "</a></li>";
				}

				return content;

			});

		var moreOverlay = athContent.append("div")
			.attr("class", "moreOverlay")
			.append("button")
			.attr("class", "readMore");

		moreOverlay.html("<i class='fa fa-plus-circle'></i> Read more");


		// ENDS D3 ATHLETE DIV SETUP AND BEGINS ASSIGNING FUNCTIONS AND RUNNING LAYOUTS

		// controlling the expanding/collapsing of athlete divs when
		// the readmore or +/- button is clicked

		$(".readMore, .expander").click(function() {
			var athlete = $(this).closest(".athlete");
			checkExpansion(athlete);
		});


		showAthletes(nVisible);

	}


	/////////////////////////////////////////////
	///// DISPLAYING 12 AT A TIME  //////////////
	/////////////////////////////////////////////



	function showAthletes(n) {
		if (n > $(".athlete").length - 1) {
			n = $(".athlete").length - 1;
			$("#loadMore").addClass("noShow");
		}
		for (i = 0; i <= n; i++) {
			var imagePath = $(".athlete").eq(i).children("img").attr("data-src");
			$(".athlete").eq(i).addClass("visible").children("img").attr("src", imagePath);
		}

		if (n < $(".athlete").length - 1) {
			nVisible = nVisible + 12;
		} else {
			$("#loadMore").remove();
		}

		runIsotope();

	}

	$("#loadMore").click(function() {
		showAthletes(nVisible);
	});


	/////////////////////////////////////////////
	///// CHECKING EXPANSION OR COLLAPSE ////////
	/////////////////////////////////////////////

	function checkExpansion(elem) {
		if (elem.hasClass("expanded") === false) {
			expand(elem, "expand"); //open the athlete clicked
			$grid.isotope("layout"); //rerun the isotope layout
		}
		// if the athlete is open ...
		else {
			expand(elem, "collapse"); // collapse that athlete
			$grid.isotope("layout"); // rerun the isotope layout
		}

		// assign the athlete we're clicking on to the movedAthlete variable
		var movedAthlete = elem;

		// after the animation has finished running, run the checkPosition function
		setTimeout(function() {
			checkPosition(movedAthlete);
		}, 525);
	}


	/////////////////////////////////////////////
	///// CONTROLLING ATHLETE EXPANSION /////////
	/////////////////////////////////////////////

	// the expand function is passed two parameters, the object we clicked on,
	// and the direction ("expand" or "collapse")

	function expand(athlete, direction) {

		// let's see what we're doing: expanding or collapsing?
		if (direction === "expand") {

			// collapse any open athletes, display all hidden read more buttons,
			// and reset all minus circles to plus circles
			$(".athlete").removeClass("expanded");
			$(".athlete").find(".moreOverlay").removeClass("hidden");
			$(".expander").removeClass("fa-minus-circle").addClass("fa-plus-circle");

			// on the expanding athlete, swap the plus circle for the minus circle,
			// hide the read more button, then expand with the expanded class
			athlete.find(".expander").removeClass("fa-plus-circle").addClass("fa-minus-circle");
			athlete.find(".moreOverlay").addClass("hidden");
			athlete.addClass("expanded");

		} else if (direction === "collapse") {

			// swap +/- circle, display the read more button, then collapse by
			// removing the expanded class
			athlete.find(".expander").removeClass("fa-minus-circle").addClass("fa-plus-circle");
			athlete.find(".moreOverlay").removeClass("hidden");
			athlete.removeClass("expanded");
		}
	}


	/////////////////////////////////////////////
	///// CHECKING EXPANDED ATHLETE POSITION ////
	/////////////////////////////////////////////

	// the checkPosition function is passed the athlete div that has changed
	// position. if it falls within 100 pixels of the bottom of the window
	// or above the top of the window, the window scrolls to that athlete's position

	function checkPosition(athlete) {

		// grabs the height and scrolltop of the window, and the offset position
		// of the athlete that has changed layout
		var windowHeight = $(window).height();
		var top = $(window).scrollTop();
		var y = athlete.offset().top;

		// if that athlete falls within 100 pixels of the bottom of the window
		// or above the top, the window scrolls the athlete into view
		if (y > top + (windowHeight - 100) || y < top) {
			$("html, body").animate({
				scrollTop: y - 100
			}, 500);
		}
	}



	/////////////////////////////////////////////
	///// INITIALIZING ISOTOPE //////////////////
	/////////////////////////////////////////////

	var $grid;

	function runIsotope() {
		// setting up the isotope grid. for more info, see: http://isotope.metafizzy.co/
		$grid = $("#olympians").isotope({
			layoutMode: 'packery',
			itemSelector: '.athlete',
			precentPosition: true,
			transitionDuration: 500
		});

		// test code to test the sorting function of isotope, will expand later
		var sport = "basketball";
		sport = "." + "basketball";
		$("#testButton").click(function() {
			$grid.isotope({
				filter: sport
			});
		});

	}


	/////////////////////////////////////////////
	///// CREATING DROPDOWNS ////////////////////
	/////////////////////////////////////////////

	var sports = [];

	var sportSelection = "athlete";
	var medalSelection = "athlete";

	function buildFilters() {

		for (i = 0; i < athletes.length; i++) {
			if ($.inArray(athletes[i].sport, sports) === -1) {
				sports.push(athletes[i].sport);
			}
		}

		for (i = 0; i < sports.length; i++) {
			var sport = sports[i].toLowerCase();
			sport = sport.replace(/ |'|&/g, "");
			var option = "<option data-selection='" + sport + "'>" + sports[i] + "</option>";
			$("#sports").append(option);
		}
	}

	/////////////////////////////////////////////
	///// FILTERING AHTLETES ////////////////////
	/////////////////////////////////////////////


	$("#sports").change(function() {
		$(".athlete").addClass("visible");
		sportsSelection = $(this).find("option:selected").attr("data-selection");
		filterAthletes(sportsSelection, medalSelection);
	});

	$("#medals").change(function() {
		$(".athlete").addClass("visible");
		medalSelection = $(this).find("option:selected").attr("data-selection");
		filterAthletes(sportsSelection, medalSelection);
	});

	// $("#medals").change(function() {
	// 	medalSelection = ($(this).find("option:selected").attr("data-selection"));
	// 	if (medalSelection === "all athletes") {
	// 		medalSelection = "athlete";
	// 	} else if (medalSelection === "any")
	// 	filterAthletes(sportsSelection, medalSelection);
	// });


	function filterAthletes(sport, medal) {

		$("#loadMore").addClass("noShow");


		filterString = "."+sport+"."+medal;
		$grid.isotope({
			filter: filterString
		});

		$.each($(filterString), function(k,v) {
			var imagePath = $(this).children("img").attr("data-src");
			$(this).children("img").attr("src", imagePath);
		});

	}

	$(window).scroll(function() {
		var athletesTop = $("#olympians").offset().top;
		if ($(window).scrollTop() > athletesTop) {
			$("#filters").addClass("fixed");
		} else {
			$("#filters").removeClass("fixed");
		}

	});

});
