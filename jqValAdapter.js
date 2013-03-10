var jqValAdapter = {
	_getValue: function($el) {
		var isInputField = $el.is('input, select, textarea'),
			isCheckboxOrRadio = $el.is('input[type=checkbox], input[type=radio]');
		
		if (!isInputField) {
			return $el.html();
		} else if (isCheckboxOrRadio) {
			return $el.is(':checked');
		} else {
			return $el.val();
		}
	},
	
	_setValue: function($el, value) {
		var isInputField = $el.is('input, select, textarea'),
			isCheckboxOrRadio = $el.is('input[type=checkbox], input[type=radio]');
		
		if (!isInputField) {
			$el.html(value);
		} else if (isCheckboxOrRadio) {
			$el.attr('checked', value);
		} else {
			$el.val(value);
		}
		
		return $el;
	},
	
	val: function($el, value) {
		if (!$el) {
			throw new Error('Error in jqValAdapter.val: a jQuery element should be defined as 1st argument!');
		}
	
		if (!$el.selector) {
			throw new Error('Error in jqValAdapter.val: 1st argument should be a jQuery element!');
		}
		
		return _.isUndefined(value) ? this._getValue($el) : this._setValue($el, value);
	}
}