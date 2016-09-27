// Copyright 2013-2015, University of Colorado Boulder

/**
 * Control panel at upper right.
 *
 * @author Aaron Davis
 */

define( function( require ) {
  'use strict';

  // modules
  var Panel = require( 'SUN/Panel' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var ModeControl = require( 'GRAVITY_AND_ORBITS/common/view/ModeControl' );
  var GravityControl = require( 'GRAVITY_AND_ORBITS/common/view/GravityControl' );
  var CheckboxPanel = require( 'GRAVITY_AND_ORBITS/common/view/CheckboxPanel' );
  var GravityAndOrbitsConstants = require( 'GRAVITY_AND_ORBITS/common/GravityAndOrbitsConstants' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );

  // constants
  var MENU_SECTION_OPTIONS = { x: 5 };

  /**
   * @param {GravityAndOrbitsModule} module
   * @param {Object} [options]
   * @constructor
   */
  function UpperRightControlPanel( module, options ) {

    options = _.extend( _.clone( GravityAndOrbitsConstants.CONTROL_PANEL_OPTIONS ), options );

    var makeSeparatorRectangle = function() {
      return new Rectangle( 0, 0, 0, 2, { fill: GravityAndOrbitsConstants.CONTROL_PANEL_STROKE } );
    };

    // menu sections and separators
    var sections = [
      new ModeControl( module.modeProperty, module.getModes(), MENU_SECTION_OPTIONS ),
      makeSeparatorRectangle(),
      new GravityControl( module.gravityEnabledProperty, MENU_SECTION_OPTIONS ),
      makeSeparatorRectangle(),
      new CheckboxPanel( module, MENU_SECTION_OPTIONS )
    ];

    assert && assert( sections.length === 5, 'There should be 5 sections in the UpperRightControlPanel' );

    var vBox = new VBox( { children: sections, spacing: 4, y: 5, resize: false, align: 'left' } );
    Panel.call( this, vBox, options );

    // resize the separators to allow them to go inside the panel margins
    var separatorWidth = vBox.width + 2 * GravityAndOrbitsConstants.PANEL_X_MARGIN;
    for ( var i = 0; i < Math.floor( sections.length / 2 ); i++ ) {
      sections[ i * 2 + 1 ].setRect( -GravityAndOrbitsConstants.PANEL_X_MARGIN, 0, separatorWidth, 2 );
    }
  }

  gravityAndOrbits.register( 'UpperRightControlPanel', UpperRightControlPanel );

  return inherit( Panel, UpperRightControlPanel );
} );
