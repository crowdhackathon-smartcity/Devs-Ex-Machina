function response_callback(section, data)
{
    ButtonEXM.response_callback(section, data);
}

var ButtonEXM = new function()
{
	//
	// Main data array
	// Fetched data updates this array, then pages used to update their info
	// busy_level: 0-2 (0 least busy)
	//
	var _data = [];

	/*****************************************************************************************************************
	 * Init
	 *****************************************************************************************************************/
	this.init = function()
	{
        // Remove "hidden" class from all hidden pages to allow anims
		$("[id^=page_].hidden").hide().removeClass("hidden");
	};
};
