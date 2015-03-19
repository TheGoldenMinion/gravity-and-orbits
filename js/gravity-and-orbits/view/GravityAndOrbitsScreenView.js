//  Copyright 2002-2014, University of Colorado Boulder

/**
 *
 * @author PhET Interactive Simulations
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var GravityAndOrbitsCanvas = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/view/GravityAndOrbitsCanvas' );
  var GravityAndOrbitsMode = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/module/GravityAndOrbitsMode' );
  var GravityAndOrbitsModule = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/module/GravityAndOrbitsModule' );
  var RightControlPanel = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/controlpanel/right-control-panel/RightControlPanel' );
  var TimeControlPanel = require( 'GRAVITY_AND_ORBITS/view/bottom-control-panel/TimeControlPanel' );


  /**
   * @param {GravityAndOrbitsModule} module
   * @constructor
   */
  function GravityAndOrbitsScreenView( module ) {

    ScreenView.call( this );
    this.module = module;

    var modes = module.getModes();
    for ( var i = 0; i < modes.length; i++ ) {
      var gaoCanvas = modes[i].getCanvas();
      gaoCanvas.visible = false;
      this.addChild( gaoCanvas );
    }

    module.modeProperty.link( function( mode ) {
      for ( var i = 0; i < modes.length; i++ ) {
        modes[i].getCanvas().visible = false;
      }
      mode.getCanvas().visible = true;
    } );

    var controlPanelNode = new RightControlPanel( module, { right: this.layoutBounds.maxX } );
    this.addChild( controlPanelNode );

    var timeControlPanel = new TimeControlPanel( module, {bottom: this.layoutBounds.bottom, centerX: this.layoutBounds.centerX} );
    this.addChild( timeControlPanel );

    // Create and add the Reset All Button in the bottom right, which resets the model
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        module.reset();
      },
      right: this.layoutBounds.maxX - 10,
      bottom: this.layoutBounds.maxY - 10
    } );
    this.addChild( resetAllButton );
  }

  return inherit( ScreenView, GravityAndOrbitsScreenView, {

    step: function( dt ) {
      var paths = this.module.getMode().getCanvas().paths;
      for ( var i = 0; i < paths.length; i ++ ) {
        paths[ i ].step();
      }
    }
  } );
} );