Drop Down Browser is a jQuery 1.9 Widget Factory plugin with Themeroller support.

### Example:
    $('#dropdownbrowser3').dropdownbrowser({
      data: data,
      next_ui: false,
      selected: 'option 17',
    });

### Options
 * **height**: **Default: 200** Height of jQuery Menu Widget
 * **width**: **Default: 250**, Width of the button element
 * **next_ui**: **Default: true**, Show the next button
 * **previous_ui**: **Default: true**, Show the previous button
 * **selected**: **Default: 0**, Set default selected value
 * **data**: **Default: null**, Array of strings for Drop Down values

### Methods
 * **previous**: Select the previous element in the data array, using indices
 * **next**: Select the next element in the data array, using indices

### Events
 * **onSelect**
 * **beforeNext**
 * **afterNext**
 * **beforePrevious**
 * **afterPrevious** 

Demo located [here](http://htmlpreview.github.com/?https://raw.github.com/bubasti/jQuery-Drop-Down-Browser/master/example.html)
