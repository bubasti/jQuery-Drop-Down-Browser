// the widget definition, where 'custom' is the namespace,
// 'dropdownbrowser' the widget name
$.widget( 'custom.dropdownbrowser', {
  // default options
  options: {
    height: 200,
    width: 250,
    next_ui: true,
    previous_ui: true,
    selected: 0,
    data: null,

    // callbacks
    onSelect: null,
    beforeNext: null,
    afterNext: null,
    beforePrevious: null,
    afterPrevious: null,
  },

  // the constructor
  _create: function() {
    var this_element = this;

    if (typeof(this.options.selected) === 'number') {
      if (this.options.data && this.options.data[this.options.selected]) {
        this.options.selected = this.options.data[this.options.selected];
      } else {
        this.options.selected = '';
      }
    } else {
      if (this.options.data && this.options.data.indexOf(this.options.selected) === -1) {
        this.options.selected = '';
      }
    }

    this.wrapper = $( '<div>', {
      class: 'custom-dropdownbrowser-wrapper',
    });

    this.element
      // add a class for theming
      .addClass( 'custom-dropdownbrowser' )
      .wrap(this.wrapper);

    this.wrapper = this.element.parent();

    if (this.options.previous_ui) {
      this.prev_changer = $( '<button>', {
        text: 'Previous',
        'class': 'custom-dropdownbrowser-changer-prev'
      })
      .appendTo( this.element )
      .button({
        icons: {
          primary: 'ui-icon-carat-1-w'
        },
        text: false
      });

      // bind click events on the changer button to the randomize method
      this._on( this.prev_changer, {
        // _on won't call randomize when widget is disabled
        click: 'previous'
      });
    }

    this.this_button = $( '<button>', {
      text: this.options.selected,
      'class': 'custom-dropdownbrowser-button'
    });

    this.keep_focus = false;

    this.this_button.button({
      icons: {
        secondary: 'ui-icon-triangle-1-s'
      },
    });

    this._on( this.this_button, {
      click: function( event ) {
        var this_pos = this.this_button.position();
        var this_height = this.this_button.outerHeight();

        this.this_menu
          .css({
            top: this_pos.top + this_height,
            left: this_pos.left,
          })
          .show();
      }
    });

    this.this_button
      .css('width', this.options.width)
      .appendTo( this.element );

    this.this_menu = $( '<ul />' )
      .addClass('dropdownbrowser-menu')
      .css({
        width: this.options.width,
        height: this.options.height,
        overflow: 'auto',
        position: 'absolute',
        'z-index': 1,
      });

    for (ii in this.options.data) {
      $( '<a />', {
        text: this.options.data[ii],
        href: '#',
      })
      .appendTo( $( '<li />' )
        .appendTo(this.this_menu)
      );
    }

    this.this_menu
      .menu()
      .hide()
      .appendTo( this.wrapper );

    this._on(this.this_menu, {
      menublur: function(e) {
        var hide_menu = function(widget) {
          if (!widget.keep_focus) {
            widget.this_menu.hide();
          }
        };
        this.keep_focus = false;
        var this_element = this;
        setTimeout(function() { hide_menu(this_element) }, 200);
      },
      menuselect: function(e, u) {
        this._trigger( 'onSelect', e, u );

        this._setOption('selected', u.item.find('a').text());
        this._refresh();
        this.this_menu.hide();
      },
      menufocus: function(e) {
        this.keep_focus = true;
      },
    });

    if (this.options.next_ui) {
      this.next_changer = $( '<button>', {
        text: 'Next',
        'class': 'custom-dropdownbrowser-changer-next'
      })
      .appendTo( this.element )
      .button({
        icons: {
          primary: 'ui-icon-carat-1-e'
        },
        text: false
      });

      this._on( this.next_changer, {
        // _on won't call random when widget is disabled
        click: 'next'
      });
    }

    this.element.buttonset();

    // Clicks outside of a menu collapse any open menus
    this._on( this.document, {
      click: function( event ) {
        if ( !$( event.target ).closest('.ui-menu').length 
             && this.this_menu
             && $(event.target).get(0) != this.this_button.get(0) ) {
          this.this_menu.hide();
        }
      }
    });
  },

  // called when created, and later when changing options
  _refresh: function() {
  },

  previous: function( event ) {
    this._trigger( 'beforePrevious', event );

    var this_selected = this.options.selected;
    var this_ndx = this.options.data.indexOf(this_selected) - 1;

    if (this_ndx < 0) {
      this_ndx = this.options.data.length - 1;
    }

    var this_selection = this.options.data[this_ndx];

    this.option( 'selected', this_selection );

    this._trigger( 'afterPrevious', event );
  },

  next: function( event ) {
    this._trigger( 'beforeNext', event );

    var this_selected = this.options.selected;
    var this_ndx = this.options.data.indexOf(this_selected);

    if (this_ndx === this.options.data.length - 1) {
      this_ndx = -1;
    }

    var this_selection = this.options.data[this_ndx + 1];

    this.option( 'selected', this_selection );

    this._trigger( 'afterNext', event );
  },

  // events bound via _on are removed automatically
  // revert other modifications here
  _destroy: function() {
    // remove generated elements
    this.this_button.remove();
    this.prev_changer.remove();
    this.next_changer.remove();

    this
      .removeClass( 'custom-dropdownbrowser' )
      .enableSelection();

    $(this.options.apply_to)
      .css( 'background-image', 'none' );
  },

  // _setOptions is called with a hash of all options that are changing
  // always refresh when changing options
  _setOptions: function() {
    // _super and _superApply handle keeping the right this-context
    this._superApply( arguments );
    this._refresh();
  },

  // _setOption is called for each individual option that is changing
  _setOption: function( key, value ) {
    // prevent invalid color values
    //if ( /red|green|blue/.test(key) && (value < 0 || value > 255) ) {
    //  return;
    //}
    if (key === 'selected') {
      this.this_button.button('option', 'label', value);
    }

    this._super( key, value );
  }
});
