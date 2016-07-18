$(document).ready(function(){function e(e,n){console.time("marrying"),_.forEach(e,function(e,t){var a=e;a.events=[];a.events=_.filter(n,function(e){return e.athlete==a.name})}),console.timeEnd("marrying"),e.sort(function(e,t){var a=new Date(e.events[0].jsDate),n=new Date(t.events[0].jsDate);return n>a?-1:a>n?1:0});var r=c.toString().substring(4,15);for(r=m.parse(r),r=g(r),i=0;i<e.length;i++)for(k=0;k<e[i].events.length;k++)e[i].events[k].next_date===r&&x.push(e[i]);t(x,r);var s;for(i=0;i<e.length;i++)e[i].events[0].jsDate<c&&(s=i);console.log(s);var l=e.splice(0,s+1);e=e.concat(l),a(e,"#olympians"),o()}function t(e,t){if(e.length>0){var a=d3.select("#todaysAths").selectAll(".upNext").data(e);a.enter().append("div").attr("class","upNext clearFix").append("img").attr("src",function(e){var t=e.name.toLowerCase();return t=t.replace(/ /g,""),"images/_"+t+"Mug.jpg"}).attr("alt",function(e){return e.name}).attr("class","nextAthlete"),a.append("h6").text(function(e){return e.name}),a.append("p").text(function(e){var a;for(i=0;i<e.events.length;i++)e.events[i].next_date===t&&(a=e.events[i].event);return a}),a.append("p").text(function(e){var a;for(i=0;i<e.events.length;i++)e.events[i].next_date==t&&(a=e.events[i].next_time+", "+e.events[i].channel);return a})}else $("#scheduleDisplay").remove();$(".upNext h6").click(function(){var e,t=$(this).text();$.each($(".athlete"),function(){$(this).attr("data-athlete")===t&&(e=$(this))}),n(e)})}function a(e,t){var a=d3.select(t).selectAll(".athlete").data(e);a.enter().append("div").attr("class",function(e){var t=e.sport.toLowerCase();return t=t.replace(/ |'|&/g,""),e.bronze>0||e.silver>0||e.gold>0?"athlete medalWinner "+t:"athlete "+t}).classed("bronzeWinner",function(e){return e.bronze>0?!0:void 0}).classed("silverWinner",function(e){return e.silver>0?!0:void 0}).classed("goldWinner",function(e){return e.gold>0?!0:void 0}).attr("data-athlete",function(e){return e.name});var r=(a.append("i").attr("class","fa fa-plus-circle expander"),a.append("img").attr("src","images/_defaultImage.jpg"));r.attr("src",function(e){var t=e.name.toLowerCase();return t=t.replace(/ /g,""),"images/_"+t+".jpg"}).attr("alt",function(e){return e.name});var s=a.append("div").attr("class","athContent"),o=s.append("ul").attr("class","medalGroup clearFix");o.append("li").attr("class","gold").text(function(e){return e.gold}),o.append("li").attr("class","silver").text(function(e){return e.silver}),o.append("li").attr("class","bronze").text(function(e){return e.bronze});var d=s.append("div").attr("class","nameBlock clearFix");d.append("img").attr("src",function(e){var t=e.nation.toLowerCase();return t=t.replace(/ /g,""),"images/_"+t+"Flag.jpg"}).attr("alt",function(e){return e.nation}).attr("class","flag"),d.append("h4").html(function(e){return e.name}),d.append("h5").attr("class","country").text(function(e){return e.nation});var c=s.append("div").attr("class","bio");c.append("div").attr("class","info").html(function(e){var t="<p class='label'>Age</p>";return t+="<h6>"+e.age+"</h6>"}),c.append("div").attr("class","info").html(function(e){var t="<p class='label'>Texas tie</p>";return t+="<h6>"+e.texastie+"</h6>"}),c.append("div").attr("class","info").html(function(e){var t="<p class='label'>Sport</p>";return t+="<h6>"+e.sport+"</h6>"}),s.append("p").attr("class","blurb").html(function(e){return e.bio});var p=s.append("div").attr("class","schedule");p.append("p").attr("class","label").text("Schedule and Results"),p.append("table").attr("class","scheduleTable").html(function(e){var t="";for(i=-1;i<e.events.length;i++){var a=!1,n=!1;bronze=!1,i>=0&&("x"===e.events[i].gold?a=!0:"x"===e.events[i].silver?n=!0:"x"===e.events[i].bronze&&(bronze=!0)),-1===i?t+="<tr><th>Event</th><th>Time/Date</th><th>Ch.</th><th>Round/Place</th></tr>":(t+="yes"!==e.events[i].completed?"<tr><td>"+e.events[i].event+"</td><td>"+e.events[i].nexttime+", "+e.events[i].next_date+"</td><td>"+e.events[i].channel+"</td>":"<tr><td>"+e.events[i].event+"</td><td>Completed</td><td>"+e.events[i].channel+"</td>",t+=a===!0?"<td><span class='medal goldMedal'></span>Gold</td></tr>":n===!0?"<td><span class='medal silverMedal'></span>Silver</td></tr>":bronze===!0?"<td><span class='medal bronzeMedal'></span>Bronze</td></tr>":"<td>"+e.events[i].roundresult+"</td></tr>")}return t});var u=(s.append("ul").attr("class","links").html(function(e){var t="<p class='label'>Related content</p>";return void 0!==e.link1text&&(t+="<li><a target='_blank' href='"+e.link1url+"'>"+e.link1text+"</a></li>"),void 0!==e.link2text&&(t+="<li><a target='_blank' href='"+e.link2url+"'>"+e.link2text+"</a></li>"),void 0!==e.link3text&&(t+="<li><a target='_blank' href='"+e.link3url+"'>"+e.link3text+"</a></li>"),t}),s.append("div").attr("class","moreOverlay").append("button").attr("class","readMore"));u.html("<i class='fa fa-plus-circle'></i> Read more"),$(".readMore, .expander").click(function(){var e=$(this).closest(".athlete");n(e)}),l()}function n(e){e.hasClass("expanded")===!1?(r(e,"expand"),b.isotope("layout")):(r(e,"collapse"),b.isotope("layout"));var t=e;setTimeout(function(){s(t)},525)}function r(e,t){"expand"===t?($(".athlete").removeClass("expanded"),$(".athlete").find(".moreOverlay").removeClass("hidden"),$(".expander").removeClass("fa-minus-circle").addClass("fa-plus-circle"),e.find(".expander").removeClass("fa-plus-circle").addClass("fa-minus-circle"),e.find(".moreOverlay").addClass("hidden"),e.addClass("expanded")):"collapse"===t&&(e.find(".expander").removeClass("fa-minus-circle").addClass("fa-plus-circle"),e.find(".moreOverlay").removeClass("hidden"),e.removeClass("expanded"))}function s(e){var t=$(window).height(),a=$(window).scrollTop(),n=e.offset().top;(n>a+(t-100)||a>n)&&$("html, body").animate({scrollTop:n-100},500)}function l(){b=$("#olympians").isotope({layoutMode:"packery",itemSelector:".athlete",precentPosition:!0,transitionDuration:500});var e="basketball";e=".basketball",$("#testButton").click(function(){b.isotope({filter:e})})}function o(){for(i=0;i<v.length;i++)-1===$.inArray(v[i].sport,y)&&y.push(v[i].sport);for(i=0;i<y.length;i++){var e=y[i].toLowerCase();e=e.replace(/ |'|&/g,"");var t="<option data-selection='"+e+"'>"+y[i]+"</option>";$("#sports").append(t)}}function d(e,t){filterString="."+e+"."+t,b.isotope({filter:filterString})}var c=new Date,p=c.getFullYear();c=Date.parse(c),console.log(Date.parse("today")),$(".copyright").text(p);var u,v,f=0,h=d3.time.format("%Y-%m-%d"),m=d3.time.format("%b %d %Y"),g=d3.time.format("%b. %d, %Y"),x=[];$.getJSON("http://interactives.dallasnews.com/data-store/2016/062016-texas-olympians-sked.json",function(t){u=t,_.forEach(u,function(e,t){var a=e.nextdate.substring(0,10);a=h.parse(a),a=g(a),dateTime=a+", "+e.nexttime,jsDate=Date.parse(dateTime),e.jsDate=jsDate,e.next_date=a,e.gold=e.gold,e.silver=e.silver,e.bronze=e.bronze}),u=_.orderBy(u,"jsDate","asc");var a;for(i=0;i<u.length;i++)u[i].jsDate<c&&(a=i);var n=u.splice(0,a);u=u.concat(n),f++,2===f&&e(v,u)}),$.getJSON("http://interactives.dallasnews.com/data-store/2016/062016-texas-olympians-athletes.json",function(t){v=t,f++,2===f&&e(v,u)});var b,y=[],C="athlete";$("#sports").change(function(){sportsSelection=$(this).find("option:selected").attr("data-selection"),d(sportsSelection,C)}),$("#medals").change(function(){C=$(this).find("option:selected").attr("data-selection"),d(sportsSelection,C)})});
//# sourceMappingURL=scripts-bundle.js.map
