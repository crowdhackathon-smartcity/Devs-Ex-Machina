function response_callback(section, data)
{
    ButtonEXM.response_callback(section, data);
}

var ButtonEXM = new function()
{
	// Index of currently viewed category
	var _cur_cat_key = 1, _cur_site_key;

    // temp
    this.get_data = function()
    {
      return _data;
    };

	//
	// Main data array
	// Fetched data updates this array, then pages used to update their info
	// busy_level: 0-2 (0 least busy)
	//
	var _data = [
		{ category: "ΙΚΑ", sites: [] },
		{
			category: "Υπηρεσίες Δ. Πειραιά",
			sites: [
				{
					name: "owner2",
					in_id: 124,
					out_id: 125,
					title: "Διεύθ. Οικονομικών Υπηρεσιών",
					lat: 37.974783,
					long: 23.735324,
					dist: 3.3,
					wt_time: "",
					people: "",
					least_busy: "Τρίτη",
                    chart_data: [15, 9, 22, 13, 11, 18]
				},
				{
					name: "owner1",
					in_id: 122,
					out_id: 123,
					title: "Ληξιαρχείο",
					lat: 37.957978,
					long: 23.727253,
					dist: 6.1,
					wt_time: "",
					people: "",
					least_busy: "Πέμπτη",
                    chart_data: [15, 12, 25, 7, 11, 18]
				}/*,
				{ title: "Σεπόλια", dist: 1.9, wt_time: 23, people: 7 },
				{ title: "Καλλιθέα", dist: 3.9, wt_time: 26, people: 9 },
				{ title: "Ταύρος", dist: 3.4, wt_time: 29, people: 10 },
				{ title: "Περιστέρι", dist: 2.8, wt_time: 33, people: 13 }
				*/
			]
		},
		{ category: "Ταχυδρομεία", sites: [] },
		{ category: "Τράπεζες", sites: [] }
	];

	/*****************************************************************************************************************
	 * Init
	 *****************************************************************************************************************/
	this.init = function()
	{
        // Remove "hidden" class from all hidden pages to allow anims
		$("[id^=page_].hidden").hide().removeClass("hidden");

		//
		// Back button events
		//
		$(".btn_back").on("click", function()
		{
			// Get current page from closest page parent id and switch
			var cur_page = get_cur_page();

			switch(cur_page)
			{
			case "page_sites":
				switch_to("categories");
				break;
			case "page_details":
				switch_to("sites");
				break;
			}
		})

		//
		// Build categories
		//
		var $list_cats = $("#page_categories .list-group")
		var $tpl = $list_cats.find(".item_tpl");

		populate_list($list_cats, _data);

		//
		// Populate sites and switch on click
		//
		$list_cats.on("click", ".list-group-item", function()
		{
			// Get category key from attr and use to populate
			var k = $(this).data("key");

            retrieve_data(function()
            {
                build_page_sites(k);

                switch_to("sites");

                // Update cur cat key
                _cur_cat_key = k;
            });
		});

		//
		// Build details
		//
		$("#page_sites .list-group").on("click", "a", function()
		{
			var $item = $(this);
			build_page_details($item.data("key"));

			switch_to("details");
		});

		// Set timeout to retrieve data from server on interval
        retrieve_data();
		setInterval(retrieve_data, 3000);
	}

	/*****************************************************************************************************************
	 * Refresh latest data from server and update o_data
	 *****************************************************************************************************************/
	function retrieve_data(callback)
	{
        console.log("Retrieving data (key " + _cur_cat_key + ")");
        if(typeof _cur_cat_key != "undefined")
        {
            $.get({
                url: "http://83.212.123.145:1880/api/counter",
                success: function(data)
                {
                    received_counter(data);
                }
            });

            $.get({
                url: "http://83.212.123.145:1880/api/waiting_time",
                success: function(data)
                {
                    received_waiting_time(data);
                }
            });

            if(typeof callback == "function")
                callback();
        }
	}

    function received_counter(data)
    {
        var owner_counters = [];

        for(i in data)
        {
            var o = data[i];
            owner_counters[o.name] = o.counter;
        }

        for(var i in _data[1].sites)
        {
            var o_site = _data[1].sites[i];

            var prev = o_site.people;

            if(typeof owner_counters[o_site.name] == "undefined")
                continue;

            o_site.people = owner_counters[o_site.name];
        }

        update_views();
    }

    function received_waiting_time(data)
    {
        var owner_counters = [];

        // Map to array, owner=>waiting time
        for(i in data)
        {
            var o = data[i];
            owner_counters[o.owner] = Math.floor(o.waiting_time / 60);
        }

        // Update data array
        for(var i in _data[1].sites)
        {
            var o_site = _data[1].sites[i];

            o_site.wt_time = Math.floor(owner_counters[o_site.name]);
        }

        update_views();
    }

	/*****************************************************************************************************************
	 * Upate visible data
	 *****************************************************************************************************************/
	function update_views()
	{
        if(get_cur_page() == "page_details")
        {
            var o_site = _data[_cur_cat_key].sites[_cur_site_key];
            var $details_people = $("#details_people"),
                $details_people_wrapper = $("#details_people_wrapper"),
                $details_avg_wt_time = $("#details_avg_wt_time"),
                $details_avg_wt_time_wrapper = $("#details_avg_wt_time_wrapper");

            if ($details_people.html() != o_site.people)
            {
                $details_people.html(o_site.people);
                $details_avg_wt_time.html(o_site.wt_time);

                $details_avg_wt_time_wrapper.addClass("indicate_changed");
                $details_people_wrapper.addClass("indicate_changed");

                setTimeout(function () {
                    $details_avg_wt_time_wrapper.removeClass("indicate_changed");
                    $details_people_wrapper.removeClass("indicate_changed");
                }, 1000);

                $("#details_avg_wt_time_wrapper").removeClass("indicator_l0 indicator l1 indicatorl2")
                    .addClass(get_indicator_class(o_site.wt_time));
            }
        }
        else if(get_cur_page == "page_sites")
        {

        }
	}

	/*****************************************************************************************************************
	 * Rebuild sites page from _data
	 *****************************************************************************************************************/
	function build_page_sites(key)
	{
		var o_cat = _data[key];

		// Set title
		get_page("sites").find(".header .title").html(o_cat.category);

		// Populate list
		var $list = get_page("sites").find(".list-group");
		var $tpl = $list.find(".item_tpl");

		// Remove all direct non-tpl children
		$list.find("> :not(.item_tpl)").remove();

		// Build list
		for(i in o_cat.sites)
		{
			var $item = $tpl.clone().removeClass("item_tpl");

			var vals = $.extend({}, o_cat.sites[i], {
				indicator_class: get_indicator_class(o_cat.sites[i].wt_time)
			});

			$item.data("key", i);

			replace_vars($item, vals);

			$list.append($item);
		}
	}

	/*****************************************************************************************************************
	 * Rebuild details page from _data
	 *****************************************************************************************************************/
	function build_page_details(key)
	{
		var o_site = _data[_cur_cat_key].sites[key];
		var $page = get_page("details");

		_cur_site_key = key;

			// Remove old data
		$page.find(".panel-body > span:not(.item_tpl)").remove();

		// Add new template clone and replace vars
		var $tpl = $page.find(".item_tpl").clone().removeClass("item_tpl");
		$page.find(".panel-body").append($tpl);

		var vars = $.extend({}, o_site, {
			indicator_class: get_indicator_class(o_site.wt_time)
		});

		$("#details_avg_wt_time").html(o_site.wt_time);
		$("#details_least_busy").html(o_site.least_busy);
		$("#details_people").html(o_site.people);
		$("#details_avg_wt_time_wrapper").removeClass("indicator_l0 indicator l1 indicatorl2")
										 .addClass(get_indicator_class(o_site.wt_time));


		$page.find(".header .title").html(o_site.title);

		var data = {
			labels: ["ΔΕ", "ΤΡ", "ΤΕ", "ΠΕ", "ΠΑ", "ΣΑ"],
			datasets: [
				{
					label: "Μέση αναμονή (λεπτά)",
					backgroundColor: "rgba(207,229,249,1)",
					borderColor: "#1A86E4",
					borderWidth: 2,
					hoverBackgroundColor: "rgba(207,229,249,0.5)",
					hoverBorderColor: "#1A86E4",
					data: o_site.chart_data,
				}
			]
		};

		var myBarChart = Chart.Bar($("#details_weekly_chart"),{
			data:data,
			options: {
				scales: {
					yAxes:[{
						stacked:true,
						gridLines: {
							display:true,
							color:"rgba(255,99,132,0.2)"
						}
					}],
					xAxes:[{
						gridLines: {
							display:false
						}
					}]
				}
			}
		});
	}

	/*****************************************************************************************************************
	 * Populate list with data from array using tpl as item (each key 1 item)
	 *****************************************************************************************************************/
	function populate_list($list, data)
	{
		var $tpl = $list.find(".item_tpl");

		// Remove all direct non-tpl children
		$list.find("> :not(.item_tpl)").remove();

		for(i in data)
		{
			// Key corresponds to key in data array
			var $item = $tpl.clone().removeClass("item_tpl");
			$item.data("key", i);

			replace_vars($item, data[i]);

			$list.append($item);
		}
	}

	/*****************************************************************************************************************
	 * Replace all obj key names with their vals in $el
	 *****************************************************************************************************************/
	function replace_vars($el, vars)
	{
		var html = $el.html();

		for(i in vars)
		{
			val = typeof vars[i] == "number" ? ("" + vars[i]).replace(".", ",") : vars[i];

			html = html.replace("{{" + i + "}}", val);
		}

		$el.html(html);
	}

	/*****************************************************************************************************************
	 * Switch to page
	 *****************************************************************************************************************/
	function switch_to(name)
	{
		var $new = $("#page_" + name);

		// Hide container, show page, fadeIn container
		$new.find(".container").hide();

		// Hide visible page
		$("[id^=page_]").hide();
		$new.show();
		$new.find(".container").fadeIn("fast");
	}
	/*****************************************************************************************************************
	 * Get page wrapper
	 *****************************************************************************************************************/
	function get_page(name)
	{
		return $("#page_" + name);
	}

	/*****************************************************************************************************************
	 * Get currently visible page
	 *****************************************************************************************************************/
	function get_cur_page()
	{
		return $("[id^=page_]").filter(":visible").attr("id");
	}

	/*****************************************************************************************************************
	 * Get indicator class corresponding to a waiting time
	 *****************************************************************************************************************/
	function get_indicator_class(waiting_time)
	{
		var prefix = "indicator_l"
		if(waiting_time <= 10)
			return prefix + 0;
		else if(waiting_time <= 20)
			return prefix + 1;
		else
			return prefix + 2;
	}

};
