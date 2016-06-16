$(document).ready(function() {

	//custom scripting goes here

	// injecting current year into footer
	// DO NOT DELETE

	var d = new Date();
	var year = d.getFullYear();

	$('.copyright').text(year);

	// data counter will keep track if all of our data is loaded before we build the page
	var dataCounter = 0;

	// variables that will ultimately hold our data
	var sked;
	var athletes;

	// date parser to parse the string into a date object
	var dateParser = d3.time.format("%Y-%m-%d");

	// date formater turns the date object into the correct Mon. Day, Year format
	var dateFormat = d3.time.format("%b. %d, %Y");

	/////////////////////////////////////////////
	///// GETTING THE DATA //////////////////////
	/////////////////////////////////////////////

	$.getJSON("http://interactives.dallasnews.com/data-store/2016/062016-texas-olympians-sked.json", function(data) {
		sked = data;
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

		$.each(athletes, function(k,v) {

			var athlete = v;
			athlete.events = [];

			$.each(sked, function() {

				// cut our date down to just YYYY-MM-DD
				// parse it into a date object
				// then format it into our MMM. DD, YYYY format
				var nextDate = this.nextdate.substring(0,10);
				nextDate = dateParser.parse(nextDate);
				nextDate = dateFormat(nextDate);

				// add each event into our events key
				if (athlete.name === this.athlete) {
					var event = {
						"event": this.event,
						"next_date": nextDate,
						"next_time": this.nexttime,
						"channel": this.channel,
						"roundresult": this.roundresult,
						"gold": this.gold,
						"silver": this.silver,
						"bronze": this.bronze,
					};
					athlete.events.push(event);
				}
			});

		});

		// pass the data off to our olympian drawing function
		buildOlympians(athletes);
	}


	/////////////////////////////////////////////
	///// BUILDING OUT THE PAGE /////////////////
	/////////////////////////////////////////////

	function buildOlympians(athletes) {

		console.log(athletes);

		var athDivs = d3.select("#olympians").selectAll(".athlete")
			.data(athletes);

		athDivs.enter().append("div")
			.attr("class", "athlete grid-item");

		var expander = athDivs.append("i")
			.attr("class", "fa fa-plus-circle expander");

		var athImage = athDivs.append("img")
			.attr("src", function(d) {
				var name = d.name.toLowerCase();
				name = name.replace(/ /g, "");
				return "/images/_" + name +".jpg";
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


		athContent.append("h4")
			.html(function(d){return d.name;});

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
					var bioContent = "<p class='label'>Hometown</p>";
					bioContent += "<h6>" + d.hometown + "</h6>";
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

		var athTable = athContent.append("table")
			.attr("class", "schedule")
			.html(function(d) {

				var content = "";

				content += "<p class='label'>Schedule and Results</p>";

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

					console.log(gold, silver, bronze);

					if (i === -1) {
						content +=  "<tr><th>Event</th><th>Time/Date</th><th>Ch.</th><th>Round/Result</th></tr>";
					} else {
						content += "<tr><td>" + d.events[i].event + "</td><td>" + d.events[i].next_time +", " + d.events[i].next_date + "</td><td>" + d.events[i].channel + "</td>";

						if (gold === true) {
							content += "<td><span class'medal goldMedal'</td></tr>";
						} else if (silver === true) {
							content += "<td><span class'medal silverMedal'</td></tr>";
						} else if (bronze === true) {
							content += "<td><span class'medal bronzeMedal'</td></tr>";
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


		$(".readMore").click(function() {
			if ($(this).closest(".athlete").hasClass("expanded") === false) {
				expand($(this), "expand");
			} else {
				expand($(this), "collapse");
			}
		});

		$(".expander").click(function() {
			if ($(this).closest(".athlete").hasClass("expanded") === false) {
				expand($(this), "expand");
			} else {
				expand($(this), "collapse");
			}
		});

	}

	function expand(thisObj, direction) {

		var target = thisObj.closest(".athlete");
		console.log(target);

		target.find(".expander").toggleClass("fa-plus-circle").toggleClass("fa-minus-circle");

		if (direction === "expand") {
			target.find(".moreOverlay").addClass("hidden");
			target.addClass("expanded");
		} else if (direction === "collapse") {
			target.find(".moreOverlay").removeClass("hidden");
			target.removeClass("expanded");
		}

	}


});
