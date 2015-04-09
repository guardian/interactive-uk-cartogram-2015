define([
	
], function(

) {	

	'use strict';

	function EDD() {

		var forEach = function (array, callback, scope) {
		  for (var i = 0; i < array.length; i++) {
		    callback.call(scope, i, array[i]); // passes back stuff we need
		  }
		};


		this.initEdd=function(opts) {
			// el - some div to create the input box in
			// onChange - takes the new value and returns a promise that resolves to an array
			// onSelect - once the user selects

			var dropdown, input, focusElement, lastVal = '';

			function renderDropdown(arr,selectIndex) {
				setFocusElement(null);
				if (arr.length > 0) {
					var htmls = arr.map(function(entry,i) { 
						var classes = 'edd__entry' + (entry[0] === null ? ' edd__entry--info' : '');
						return '<div class="'+classes+'" data-val="'+entry[0]+'">'+entry[1]+'</div>';
					})
					dropdown.innerHTML = htmls.join('');
					dropdown.style.display = '';
					if(selectIndex !== undefined) {
						setFocusElement(dropdown.querySelector('*:nth-child('+(selectIndex+1)+')'));
					}
				} else {
					dropdown.style.display = 'none';
				}
			}

			function setFocusElement(el){
				if (focusElement) { 
					focusElement.className = 'edd__entry'; 
				}
				focusElement = null;
				if (el) {
					el.className += ' edd__entry--focus';
					focusElement = el;
				}	
			}

			
			function onInputKeyUp(event) {
				var newVal = event.target.value;
				if (lastVal !== newVal && event.keyCode !== 13) {
					renderDropdown([]);
					opts.onChange(event.target.value, renderDropdown)
					lastVal = newVal;
				}
			}

			function onInputKeyDown(event) {
				var newFocusElement;

				if (event.keyCode === 13) { // RETURN
					if (focusElement) {
						var value = focusElement.getAttribute('data-val');
						if (value !== 'null') {
							//input.value = focusElement.textContent;
							input.value = '';
							opts.onSelect(value);
							renderDropdown([]);
						}					
					}
				} else if (event.keyCode === 40) { // DOWN ARROW
					newFocusElement = focusElement === null ? 
						dropdown.querySelector('*') : 
						focusElement.nextElementSibling || focusElement;

				} else if (event.keyCode === 38) { // UP ARROW
					newFocusElement = focusElement === null ?
						dropdown.querySelector('*') :
						focusElement.previousElementSibling || focusElement;
				}

				if (newFocusElement) {
					setFocusElement(newFocusElement);
				}
			}

			function onDropdownClick(event) {
				var value = event.target.getAttribute('data-val');
				if (value !== 'null') {
					input.value = event.target.textContent;
					renderDropdown([]);
					opts.onSelect(value);
				}
			}
			function onBlur(event) {
				input.value="";
				renderDropdown([]);
			}
			function onDropdownMouseOver(event) {
				//console.log(event);
				var toElement = event.target;
				if (/edd__entry/.test(toElement.className)) {
					setFocusElement(toElement);
				}			
			}

			// create elements
			input = document.createElement('input');
			input.className = 'edd__input';
			input.setAttribute('placeholder', opts.placeholder);
			input.type = 'text';
			dropdown = document.createElement('div');
			dropdown.className = 'edd__dropdown';

			// create listeners
			input.addEventListener('keyup', onInputKeyUp) ;
			input.addEventListener('keydown', onInputKeyDown) ;
			input.addEventListener('blur', onBlur) ;



			dropdown.addEventListener('mousedown', onDropdownClick);
			dropdown.addEventListener('mouseover', onDropdownMouseOver);

			opts.el.appendChild(input);
			opts.el.appendChild(dropdown);

			renderDropdown([]);

		}

		//window.initEdd = initEdd;

	};//)();
	return EDD;
});
