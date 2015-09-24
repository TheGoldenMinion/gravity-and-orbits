// Copyright 2002-2015, University of Colorado Boulder

/**
 * Visual representation of speed radio buttons.
 * Three different modes: slow/normal/fast motion.
 *
 * @author Andrey Zelenkov (Mlearner)
 * @author Aaron Davis (PhET)
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var VerticalAquaRadioButtonGroup = require( 'SUN/VerticalAquaRadioButtonGroup' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var GravityAndOrbitsModule = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/module/GravityAndOrbitsModule' );
  var GravityAndOrbitsColors = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/GravityAndOrbitsColors' );

  // constants
  var STARTING_VALUE = GravityAndOrbitsModule.STARTING_SPEED_SCALE;

  // strings
  var normalString = require( 'string!GRAVITY_AND_ORBITS/normal' );
  var slowMotionString = require( 'string!GRAVITY_AND_ORBITS/slowMotion' );
  var fastForwardString = require( 'string!GRAVITY_AND_ORBITS/fastForward' );

  /**
   * @param {Property.<number>} speedProperty - The rate of flow of time.
   * @param [options]
   * @constructor
   */
  function SpeedRadioButtons( speedProperty, options ) {

    options = _.extend( {
      spacing: 1,
      radius: 10
    }, options );

    var textOption = { font: new PhetFont( 22 ), fill: '#fff', pickable: false, y: -7 };
    var fastText = new Text( fastForwardString, textOption );
    var normalText = new Text( normalString, textOption );
    var slowText = new Text( slowMotionString, textOption );

    VerticalAquaRadioButtonGroup.call( this, [
      { property: speedProperty, value: STARTING_VALUE * 1.75, node: fastText },
      { property: speedProperty, value: STARTING_VALUE, node: normalText },
      { property: speedProperty, value: STARTING_VALUE * 0.25, node: slowText }
    ], options );

    GravityAndOrbitsColors.bottomControlTextProperty.link( function( color ) {
      fastText.fill = color;
      normalText.fill = color;
      slowText.fill = color;
    } );
  }

  return inherit( VerticalAquaRadioButtonGroup, SpeedRadioButtons );
} );