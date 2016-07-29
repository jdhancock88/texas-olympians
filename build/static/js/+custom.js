$(document).ready(function() {

	//custom scripting goes here

	// injecting current year into footer
	// DO NOT DELETE

	var currentDate = new Date();
	var year = currentDate.getFullYear();

	currentDate = Date.parse(currentDate);


	$('.copyright').text(year);

	// data counter will keep track if all of our data is loaded before we build the page
	var dataCounter = 0;

	// variables that will ultimately hold our data
	var sked;
	var athletes;

	// date parser to parse the string into a date object
	var dateParser = d3.time.format("%Y-%m-%d");
	var currentDateParser = d3.time.format("%b %d %Y");

	function dateConverter(date, formatter) {
		date = date.substring(0,10);
		date = dateParser.parse(date);
		date = formatter(date);

		return date;
	}

	// date formater turns the date object into the correct Mon. Day, Year format
	var dateFormat = d3.time.format("%B %e, %Y");
	var dateFormatAbb = d3.time.format("%b. %e, %Y");

	// placeholder array for the athletes that are competing on any given day
	var todaysAths = [];

	// number of athlete cards that are visible (0 indexed)
	var nVisible = 11;

	// array that will hold all the competition dates
	var dates = [];


	/////////////////////////////////////////////
	///// GETTING THE DATA //////////////////////
	/////////////////////////////////////////////

	$.getJSON("http://interactives.dallasnews.com/data-store/2016/062016-texas-olympians-sked.json", function(data) {

		// set our sked array equal to the data returned
		sked = data;

		// update our update date in the byline
		var updateDate = dateConverter(sked[0].updated, dateFormat);
		sked.shift();
		$('.update').text(updateDate);


		_.forEach(sked, function(value, key) {
			// cut our date down to just YYYY-MM-DD
			// parse it into a date object
			// then format it into our MMM. DD, YYYY format
			var nextDate = dateConverter(value.nextdate, dateFormatAbb);

			// create a string to get a valid date and time to be parsed into an accurate js date
			dateTime = nextDate + ", " + value.nexttime;
			jsDate = Date.parse(dateTime);
			value.jsDate = jsDate;
			value.next_date = nextDate;
			value.gold = value.gold;
			value.silver = value.silver;
			value.bronze = value.bronze;

		});

		// order the sked by date
		sked = _.orderBy(sked, "jsDate", "asc");

		// populate the dates array with each competition date only once
		// this will be used later to create the competition dates dropdown
		for (i = 0; i < sked.length; i++) {
			if ($.inArray(sked[i].next_date, dates) === -1) {
				dates.push(sked[i].next_date);
			}
		}

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

		_.forEach(athletes, function(value, key) {

			var athlete = value;
			athlete.events = [];

			athlete.events = _.filter(sked, function(e) {
				return e.athlete == athlete.name;
			});

		});


		// sort the athletes alphabetically by last name

		athletes.sort(function(a, b){
			var aName = a.name.trim();
			var bName = b.name.trim();

			var aSplit = aName.split(" ");
			var bSplit = bName.split(" ");

			var aLast = aSplit[aSplit.length - 1];
			var bLast = bSplit[bSplit.length - 1];

			if (aLast < bLast) return -1;
			if (aLast > bLast) return 1;
			return 0;
		});

		// getting the current date in the the same format as the next_date value on
		// our athlete objects
		var targetDate = currentDate.toString().substring(4, 15);
		targetDate = currentDateParser.parse(targetDate);
		targetDate = dateFormatAbb(targetDate);

		// checking over each of our athletes and populating the todaysAths array
		// with each of the athletes that match the current date
		for (i = 0; i < athletes.length; i++) {
			for (k = 0; k < athletes[i].events.length; k++) {
				console.log(athletes[i].events[k].next_date, targetDate);
				if (athletes[i].events[k].next_date === targetDate) {
					todaysAths.push(athletes[i]);
				}
			}
		}

		console.log(todaysAths);

		// passing our todayAths and the targetDate off to the function
		// that builds out our divs of the athletes competing today
		buildTodaysAths(todaysAths, targetDate);

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
							content = d.sport + ", " + d.events[i].event;
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
			// the window to accomodate any movement. It'll also run the showAthletes function
			// with a number large enough to make sure all athletes are displayed

			checkExpansion(athlete);
			showAthletes(1000);

		});

	}


	/////////////////////////////////////////////
	///// BUILDING OUT THE ATHLETE BLOCKS ///////
	/////////////////////////////////////////////

	// below, we're using d3 to build out our divs for each athletes
	// as with most things in d3, it's magical. mostly just creating
	// html elements based off the data for each athlete

	function buildOlympians(athletes, target) {

		console.log(athletes);
		var athDivs = d3.select(target).selectAll(".athlete")
			.data(athletes);

		athDivs.enter().append("div")
			.attr("class", function(d) {
				var sport = d.sport.toLowerCase();
				sport = sport.replace(/ |'|&/g, "");

				var compDates = "";

				for (j = 0; j < d.events.length; j++) {
					thisDate = d.events[j].next_date.toLowerCase();
					thisDate = thisDate.replace(/ |,|\./g, "");
					compDates += (" " + thisDate);
				}


				if (d.bronze > 0 || d.silver > 0 || d.gold > 0) {
					return "athlete medalWinner " + sport + compDates;
				} else {
					return "athlete " + sport + compDates;
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

						var eventDate = d.events[i].next_date;

						eventDate = eventDate.slice(0, -6);

						if (d.events[i].completed !== "yes") {
							content += "<tr><td>" + d.events[i].event + "</td><td>" + d.events[i].nexttime +", " + eventDate + "</td><td>" + d.events[i].channel + "</td>";
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
			$("#moreButtons").addClass("noShow");
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

	$("#loadAll").click(function() {
		showAthletes(1000);
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
		if (y > top + (windowHeight - 200) || y < top) {
			$("html, body").animate({
				scrollTop: y - 150
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

	}


	/////////////////////////////////////////////
	///// CREATING DROPDOWNS ////////////////////
	/////////////////////////////////////////////

	// array that will hold all the sports
	var sports = [];


	// setting the individual dropdown variables to the default "athlete" class
	var sportSelection = "athlete";
	var medalSelection = "athlete";
	var dateSelection = "athlete";


	// building out our dropdown filters based on the data
	function buildFilters() {

		// iterate over the athletes array and gather up each sport listed just once
		for (i = 0; i < athletes.length; i++) {
			if ($.inArray(athletes[i].sport, sports) === -1) {
				sports.push(athletes[i].sport);
			}
		}

		// iterate over the sports array, lowercasing and removing non alphabetical
		// characters, then build out an option element to append to the sports dropdown

		for (i = 0; i < sports.length; i++) {
			var sport = sports[i].toLowerCase();
			sport = sport.replace(/ |'|&/g, "");
			var sportOption = "<option data-selection='" + sport + "'>" + sports[i] + "</option>";
			$("#sports").append(sportOption);
		}


		// iterate over the dates array, creating a dateClass variable that lower cases
		// and removes spaces, commas and periods from each next_date string,
		for (i = 0; i < dates.length; i++) {
			var dateClass = dates[i] = dates[i].toLowerCase();
			dateClass = dateClass.replace(/ |,|\./g, "");

			// use that dateClass variable to build out an option element and append it
			// to the dates dropdown
			var dateOption = "<option data-selection='" + dateClass + "'>" + dates[i][0].toUpperCase() + dates[i].substring(1) + "</option>";
			$("#dates").append(dateOption);
		}

	}

	/////////////////////////////////////////////
	///// FILTERING AHTLETES ////////////////////
	/////////////////////////////////////////////


	// when one of the filter dropdowns is changed, pass off the values for the three
	// dropdown variables to the filterAthletes function

	$("#sports").change(function() {
		$(".athlete").addClass("visible");
		sportSelection = $(this).find("option:selected").attr("data-selection");
		filterAthletes(sportSelection, medalSelection, dateSelection);
	});

	$("#medals").change(function() {
		$(".athlete").addClass("visible");
		medalSelection = $(this).find("option:selected").attr("data-selection");
		filterAthletes(sportSelection, medalSelection, dateSelection);
	});

	$("#dates").change(function() {
		$(".athlete").addClass("visible");
		dateSelection = $(this).find("option:selected").attr("data-selection");
		filterAthletes(sportSelection, medalSelection, dateSelection);
	});




	function filterAthletes(sport, medal, date) {

		// hide the more buttons once someone filters
		$("#moreButtons").addClass("noShow");


		//rerun isotope based on the new filter string that's passed
		filterString = "."+sport+"."+medal+"."+date;
		$grid.isotope({
			filter: filterString
		});

		// lazyload in the images of any athlete that gets shown by filtering
		$.each($(filterString), function(k,v) {
			var imagePath = $(this).children("img").attr("data-src");
			$(this).children("img").attr("src", imagePath);
		});


		// check to see if there are any athletes visible. If there are not,
		// display the messaging that lets users know no athletes matched their criteria
		if ($("#olympians").height() === 0) {
			$("h6.chatterHed").removeClass("noShow");
		} else {
			$("h6.chatterHed").addClass("noShow");
		}

		setTimeout(function() {
			if ($("#olympians").offset().top < $(window).scrollTop()) {
				$("html, body").animate({
					scrollTop: $("#olympians").offset().top - 100
				}, 750);
			}
		}, 600);


	}


	// while scrolling, if the top of the olympians div is above the top of the
	// window, make the filtering div sticky to the top
	$(window).scroll(function() {
		var athletesTop = $("#olympians").offset().top;
		if ($(window).scrollTop() > athletesTop) {
			$("#filters").addClass("fixed");
		} else {
			$("#filters").removeClass("fixed");
		}

	});

});
