// Copyright 2002-2015, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author PhET Interactive Simulations
 */
define( function( require ) {
  'use strict';

  // modules
  var GravityAndOrbitsModule = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/module/GravityAndOrbitsModule' );
  var GravityAndOrbitsScreenView = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/view/GravityAndOrbitsScreenView' );
  var CartoonModeList = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/module/CartoonModeList' );
  var RealModeList = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/module/RealModeList' );
  var UserComponents = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/UserComponents' );
  var GAOStrings = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/GAOStrings' );
  var GlobalOptionsNode = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/view/GlobalOptionsNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );
  var Screen = require( 'JOIST/Screen' );
  var Property = require( 'AXON/Property' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Color = require( 'SCENERY/util/Color' );

  // images
  var cartoonIcon = require( 'image!GRAVITY_AND_ORBITS/cartoon_icon.png' );
  var toScaleIcon = require( 'image!GRAVITY_AND_ORBITS/to_scale_icon.png' );

  // strings
  var cartoonString = require( 'string!GRAVITY_AND_ORBITS/cartoon' );
  var toScaleString = require( 'string!GRAVITY_AND_ORBITS/toScale' );
  var simTitle = require( 'string!GRAVITY_AND_ORBITS/gravity-and-orbits.name' );

  // these modules are originally from GravityAndOrbitsApplication

  // static class: IntroModule
  function ToScaleModule( phetFrame, whiteBackgroundProperty ) {
    GravityAndOrbitsModule.call( this, UserComponents.toScaleTab, phetFrame, whiteBackgroundProperty, GAOStrings.TO_SCALE, true, function( p ) {
      return new RealModeList( p.playButtonPressed, p.gravityEnabled, p.stepping, p.rewinding, p.timeSpeedScale );
    }, 0, true );
  }

  inherit( GravityAndOrbitsModule, ToScaleModule );

  // static class: CartoonModule
  function CartoonModule( phetFrame, whiteBackgroundProperty ) {
    GravityAndOrbitsModule.call( this, UserComponents.cartoonTab, phetFrame, whiteBackgroundProperty, GAOStrings.CARTOON, false, function( p ) {
        return new CartoonModeList( p.playButtonPressed, p.gravityEnabled, p.stepping, p.rewinding, p.timeSpeedScale );
      }, 0, false );
  }

  inherit( GravityAndOrbitsModule, CartoonModule );

  var whiteBackgroundProperty = new Property( false );

  var simOptions = {
    credits: {
      //TODO fill in proper credits, all of these fields are optional, see joist.AboutDialog
      leadDesign: '',
      softwareDevelopment: '',
      team: '',
      qualityAssurance: '',
      graphicArts: '',
      thanks: ''
    },
    optionsNode: new GlobalOptionsNode( whiteBackgroundProperty )
  };

  var cartoonScreen = new Screen( cartoonString, new Image( cartoonIcon ),
    function() { return new CartoonModule( null, whiteBackgroundProperty ); },
    function( model ) { return new GravityAndOrbitsScreenView( model ); },
    { backgroundColor: '#000' }
  );

  var toScaleScreen = new Screen( toScaleString, new Image( toScaleIcon ),
    function() { return new ToScaleModule( null, whiteBackgroundProperty ); },
    function( model ) { return new GravityAndOrbitsScreenView( model ); },
    { backgroundColor: '#000' }
  );

  whiteBackgroundProperty.link( function( whiteBackground ) {
    var backgroundColor = ( whiteBackground ) ? Color.WHITE : Color.BLACK;
    cartoonScreen.backgroundColor = backgroundColor;
    toScaleScreen.backgroundColor = backgroundColor;
  } );

  SimLauncher.launch( function() {
    // create and start the sim
    new Sim( simTitle, [ cartoonScreen, toScaleScreen ], simOptions ).start();
  } );
} );