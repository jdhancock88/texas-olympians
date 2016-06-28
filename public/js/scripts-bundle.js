$(document).ready(function(){function e(e,a){$.each(e,function(e,t){var n=t;n.events=[],$.each(a,function(){var e=this.nextdate.substring(0,10);if(e=f.parse(e),e=g(e),dateTime=e+", "+this.nexttime,jsDate=Date.parse(dateTime),n.name===this.athlete){var t={jsdate:jsDate,event:this.event,next_date:e,next_time:this.nexttime,channel:this.channel,roundresult:this.roundresult,gold:this.gold,silver:this.silver,bronze:this.bronze,completed:this.completed};n.events.push(t),n.events.sort(function(e,t){var n=new Date(e.jsdate),a=new Date(t.jsdate);return a>n?-1:n>a?1:0});var a;for(i=0;i<n.events.length;i++)n.events[i].jsdate<c&&(a=i);var r=n.events.splice(0,a+1);n.events=n.events.concat(r)}})}),e.sort(function(e,t){var n=new Date(e.events[0].jsdate),a=new Date(t.events[0].jsdate);return a>n?-1:n>a?1:0});var r=c.toString().substring(4,15);for(r=m.parse(r),r=g(r),i=0;i<e.length;i++)for(k=0;k<e[i].events.length;k++)e[i].events[k].next_date===r&&x.push(e[i]);t(x,r);var s;for(i=0;i<e.length;i++)e[i].events[0].jsdate<c&&(s=i);var l=e.splice(0,s+1);e=e.concat(l),n(e),o()}function t(e,t){if(e.length>0){var n=d3.select("#todaysAths").selectAll(".upNext").data(e);n.enter().append("div").attr("class","upNext clearFix").append("img").attr("src",function(e){var t=e.name.toLowerCase();return t=t.replace(/ /g,""),"images/_"+t+"Mug.jpg"}).attr("alt",function(e){return e.name}).attr("class","nextAthlete"),n.append("h6").text(function(e){return e.name}),n.append("p").text(function(e){var n;for(i=0;i<e.events.length;i++)e.events[i].next_date===t&&(n=e.events[i].event);return n}),n.append("p").text(function(e){var n;for(i=0;i<e.events.length;i++)e.events[i].next_date==t&&(n=e.events[i].next_time+", "+e.events[i].channel);return n})}else $("#scheduleDisplay").remove();$(".upNext h6").click(function(){var e,t=$(this).text();$.each($(".athlete"),function(){$(this).attr("data-athlete")===t&&(e=$(this))}),a(e)})}function n(e){var t=d3.select("#olympians").selectAll(".athlete").data(e);t.enter().append("div").attr("class",function(e){var t=e.sport.toLowerCase();return e.bronze>0||e.silver>0||e.gold>0?"athlete medalWinner "+t:"athlete "+t}).classed("bronzeWinner",function(e){return e.bronze>0?!0:void 0}).classed("silverWinner",function(e){return e.silver>0?!0:void 0}).classed("goldWinner",function(e){return e.gold>0?!0:void 0}).attr("data-athlete",function(e){return e.name});var n=(t.append("i").attr("class","fa fa-plus-circle expander"),t.append("img").attr("src",function(e){var t=e.name.toLowerCase();return t=t.replace(/ /g,""),"/images/_"+t+".jpg"}).attr("alt",function(e){return e.name}),t.append("div").attr("class","athContent")),r=n.append("ul").attr("class","medalGroup clearFix");r.append("li").attr("class","gold").text(function(e){return e.gold}),r.append("li").attr("class","silver").text(function(e){return e.silver}),r.append("li").attr("class","bronze").text(function(e){return e.bronze});var s=n.append("div").attr("class","nameBlock clearFix");s.append("img").attr("src",function(e){var t=e.nation.toLowerCase();return t=t.replace(/ /g,""),"images/_"+t+"Flag.jpg"}).attr("alt",function(e){return e.nation}).attr("class","flag"),s.append("h4").html(function(e){return e.name}),s.append("h5").attr("class","country").text(function(e){return e.nation});var o=n.append("div").attr("class","bio");o.append("div").attr("class","info").html(function(e){var t="<p class='label'>Age</p>";return t+="<h6>"+e.age+"</h6>"}),o.append("div").attr("class","info").html(function(e){var t="<p class='label'>Texas tie</p>";return t+="<h6>"+e.hometown+"</h6>"}),o.append("div").attr("class","info").html(function(e){var t="<p class='label'>Sport</p>";return t+="<h6>"+e.sport+"</h6>"}),n.append("p").attr("class","blurb").html(function(e){return e.bio});var d=n.append("div").attr("class","schedule");d.append("p").attr("class","label").text("Schedule and Results"),d.append("table").attr("class","schedule").html(function(e){var t="";for(i=-1;i<e.events.length;i++){var n=!1,a=!1;bronze=!1,i>=0&&("x"===e.events[i].gold?n=!0:"x"===e.events[i].silver?a=!0:"x"===e.events[i].bronze&&(bronze=!0)),-1===i?t+="<tr><th>Event</th><th>Time/Date</th><th>Ch.</th><th>Rd./Pl.</th></tr>":(t+="yes"!==e.events[i].completed?"<tr><td>"+e.events[i].event+"</td><td>"+e.events[i].next_time+", "+e.events[i].next_date+"</td><td>"+e.events[i].channel+"</td>":"<tr><td>"+e.events[i].event+"</td><td>Completed</td><td>"+e.events[i].channel+"</td>",t+=n===!0?"<td><span class='medal goldMedal'></span>Gold</td></tr>":a===!0?"<td><span class='medal silverMedal'></span>Silver</td></tr>":bronze===!0?"<td><span class='medal bronzeMedal'></span>Bronze</td></tr>":"<td>"+e.events[i].roundresult+"</td></tr>")}return t});var c=(n.append("ul").attr("class","links").html(function(e){var t="<p class='label'>Related content</p>";return void 0!==e.link1text&&(t+="<li><a target='_blank' href='"+e.link1url+"'>"+e.link1text+"</a></li>"),void 0!==e.link2text&&(t+="<li><a target='_blank' href='"+e.link2url+"'>"+e.link2text+"</a></li>"),void 0!==e.link3text&&(t+="<li><a target='_blank' href='"+e.link3url+"'>"+e.link3text+"</a></li>"),t}),n.append("div").attr("class","moreOverlay").append("button").attr("class","readMore"));c.html("<i class='fa fa-plus-circle'></i> Read more"),$(".readMore, .expander").click(function(){var e=$(this).closest(".athlete");a(e)}),l()}function a(e){e.hasClass("expanded")===!1?(r(e,"expand"),b.isotope("layout")):(r(e,"collapse"),b.isotope("layout"));var t=e;setTimeout(function(){s(t)},525)}function r(e,t){"expand"===t?($(".athlete").removeClass("expanded"),$(".athlete").find(".moreOverlay").removeClass("hidden"),$(".expander").removeClass("fa-minus-circle").addClass("fa-plus-circle"),e.find(".expander").removeClass("fa-plus-circle").addClass("fa-minus-circle"),e.find(".moreOverlay").addClass("hidden"),e.addClass("expanded")):"collapse"===t&&(e.find(".expander").removeClass("fa-minus-circle").addClass("fa-plus-circle"),e.find(".moreOverlay").removeClass("hidden"),e.removeClass("expanded"))}function s(e){var t=$(window).height(),n=$(window).scrollTop(),a=e.offset().top;(a>n+(t-100)||n>a)&&$("html, body").animate({scrollTop:a-100},500)}function l(){b=$("#olympians").isotope({layoutMode:"packery",itemSelector:".athlete",precentPosition:!0,transitionDuration:500});var e="basketball";e=".basketball",$("#testButton").click(function(){b.isotope({filter:e})})}function o(){for(i=0;i<v.length;i++)-1===$.inArray(v[i].sport,C)&&C.push(v[i].sport);for(i=0;i<C.length;i++){var e="<option data-selection='"+C[i].toLowerCase()+"'>"+C[i]+"</option>";$("#sports").append(e)}}function d(e,t){filterString="."+e+"."+t,b.isotope({filter:filterString})}var c=new Date,p=c.getFullYear();$(".copyright").text(p);var u,v,h=0,f=d3.time.format("%Y-%m-%d"),m=d3.time.format("%b %d %Y"),g=d3.time.format("%b. %d, %Y"),x=[];$.getJSON("http://interactives.dallasnews.com/data-store/2016/062016-texas-olympians-sked.json",function(t){u=t,h++,2===h&&e(v,u)}),$.getJSON("http://interactives.dallasnews.com/data-store/2016/062016-texas-olympians-athletes.json",function(t){v=t,h++,2===h&&e(v,u)});var b,C=[],y="athlete";$("#sports").change(function(){sportsSelection=$(this).find("option:selected").attr("data-selection"),d(sportsSelection,y)}),$("#medals").change(function(){y=$(this).find("option:selected").attr("data-selection"),d(sportsSelection,y)})});
//# sourceMappingURL=scripts-bundle.js.map
