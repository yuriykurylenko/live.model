describe("Test suite for jqValAdapter", function() {
	var $container = $('#test-controls');
	
	$container.append('<input type="checkbox" id="checkbox">')
			  .append('<input type="text" id="text">')
			  .append('<input type="radio" id="radio">')
			  .append('<textarea id="textarea">')
			  .append('<span id="noinput">');

	var $checkbox = $container.find('#checkbox');
	var $text = $container.find('#text');
	var $radio = $container.find('radio');
	var $textarea = $container.find('#textarea');
	var $noinput = $container.find('#noinput');
	
	it("checkbox should be unchecked by default", function() {
		expect(jqValAdapter.val($checkbox)).toBe(false);
	});
	
	it("checkbox checking should work", function() {
		jqValAdapter.val($checkbox, true);
		expect($checkbox.is(':checked')).toBe(true);
	});
	
	it("checkbox unchecking should work", function() {
		jqValAdapter.val($checkbox, false);
		expect($checkbox.is(':checked')).toBe(false);
	});				

	/*it("radio checking works", function() {
		jqValAdapter.val($radio, true);
		expect($radio.is(':checked')).toBe(true);
	});*/
	
	it("radio unchecking should work", function() {
		jqValAdapter.val($radio, false);
		expect($radio.is(':checked')).toBe(false);
	});				
	
	it("should return correct value for text input", function() {
		$text.val('Sausage');
		expect(jqValAdapter.val($text)).toBe('Sausage');
	});
	
	it("should put correct value into text input", function() {
		jqValAdapter.val($text, 'Banana');
		expect($text.val()).toBe('Banana');
	});
	
	it("should return correct value for textarea", function() {
		$textarea.val('Eggs');
		expect(jqValAdapter.val($textarea)).toBe('Eggs');
	});
	
	it("should put correct value into textarea", function() {
		jqValAdapter.val($textarea, 'Kiwis');
		expect($textarea.val()).toBe('Kiwis');
	});
	
	it("should return correct value for HTML container", function() {
		$noinput.html('Onion');
		expect(jqValAdapter.val($noinput)).toBe('Onion');
	});
	
	it("should put correct value into HTML container", function() {
		jqValAdapter.val($noinput, 'Tomatoes');
		expect($noinput.html()).toBe('Tomatoes');
	});
});				