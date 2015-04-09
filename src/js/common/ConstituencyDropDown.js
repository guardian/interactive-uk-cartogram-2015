define([
    'd3',
    'common/edd'
], function(
    d3,
    EDD
) {	

	'use strict';

	function ElectionPollDropdown(constituencies,options) {

        var renderDropdown = new EDD();

		var s3prefix = 'http://interactive.guim.co.uk/2015/general-election/postcodes/';

		renderDropdown.initEdd({
				el: document.querySelector('.edd'), 
				onChange: onChange, 
				onSelect: options.onSelect || function(val){console.log(val)},
				//onSelect: onSelect,
				placeholder: "Enter constituency or postcode"
		});

		function isPostcode(val) { 
			return /[0-9]/.test(val); 
		}

		function idToConstituency(id) {
			var constituency;
			constituencies.some(function(c) {
				if (c.properties.constituency === id) {
					constituency = c;
					return true;
				}
			})
			return constituency;
		}

		function findConstituenciesByName(partialName) {
			var re = new RegExp(partialName, 'i');
			return constituencies
				.filter(function(c) {
					return re.test(c.properties.name);
				})
		}

		var fetchTimeout;
		function onChange(newVal, renderCallback) {
			window.clearTimeout(fetchTimeout); // crude debouce

			// EMPTY
			if (newVal.length < 3) { 
				renderCallback([]);				
			}
			else if (newVal === '') { 
				renderCallback([]);
			}
			// POSTCODE
			else if (isPostcode(newVal)) { 
				
				if(newVal.length<5) {
					renderCallback([[null, 'It looks like a postcode, go on...']]);
					return;
				}

				renderCallback([[null, 'Searching for postcode...']]);
				fetchTimeout = window.setTimeout(function() {

					newVal=newVal.replace(/\s/g, '').toUpperCase();
					d3.xhr(s3prefix + newVal,"text/plain",function(error,data){
						
						if(error) {
							console.log(newVal,"not yet, but quite")
							return;
						}

						console.log(data);
						var c = idToConstituency(data.response);
						renderCallback([[c.properties.constituency, c.properties.name]],0)
					})
				}, 500);
			} 
			// CONSTITUENCY NAME
			else { 
				var matches = findConstituenciesByName(newVal);
				var ret = matches.map(function(c) {
					var boldedName = c.properties.name.replace(new RegExp('('+newVal+')', 'i'), '<strong>$1</strong>');
					return [c.properties.constituency, boldedName];
				})
				renderCallback(ret.slice(0,10));
			}
		}

		function onSelect(val) {
			console.log('selected', val);
			document.querySelector('#selected-val').innerHTML = val;
        }
	}

	return ElectionPollDropdown;

});
