// Copyright 2014-2015, University of Colorado Boulder

/**
 * The GravityAndOrbitsModule has a set of "modes", one mode for each configuration of bodies (eg, Sun + Planet).
 * Each mode has its own model, canvas, clock, etc, which are used in place of this Module's data.
 * The module contains information that is shared across all modes, such as whether certain features are shown (such as
 * showing the gravitational force).
 *
 * @author Sam Reid
 * @author Jon Olson
 * @author Chris Malley
 * @author John Blanco
 * @author Aaron Davis
 * @see GravityAndOrbitsModel
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var ModeListParameterList = require( 'GRAVITY_AND_ORBITS/common/module/ModeListParameterList' );
  var GravityAndOrbitsConstants = require( 'GRAVITY_AND_ORBITS/common/GravityAndOrbitsConstants' );
  var gravityAndOrbits = require( 'GRAVITY_AND_ORBITS/gravityAndOrbits' );

  // constants
  var G = 6.67428E-11;

  /**
   * @param {boolean} showMeasuringTape
   * @param {function.<ModeListParameterList, Array.<GravityAndOrbitsMode>>} createModes
   * @param {number} initialModeIndex
   * @param {boolean} showMassCheckBox
   * @constructor
   */
  function GravityAndOrbitsModule( showMeasuringTape, createModes, initialModeIndex, showMassCheckBox ) {

    // Properties that are common to all "modes" should live here.
    // @public
    PropertySet.call( this, {
      showGravityForce: false,
      showPath: false,
      showGrid: false,
      showVelocity: false,
      showMass: false,
      playButtonPressed: false,
      timeSpeedScale: GravityAndOrbitsConstants.STARTING_SPEED_SCALE,
      measuringTapeVisible: false,
      gravityEnabled: true,
      stepping: false,
      rewinding: false
    } );

    // these two booleans indicate whether or not to show the checkbox for measuring tape and mass.
    // they are false for the cartoon screen and true for the toScale screen
    this.showMassCheckBox = showMassCheckBox; // @public
    this.showMeasuringTape = showMeasuringTape; // @public

    // @private {ModeList}
    this.modeList = createModes( new ModeListParameterList(
      this.playButtonPressedProperty,
      this.gravityEnabledProperty,
      this.steppingProperty,
      this.rewindingProperty,
      this.timeSpeedScaleProperty ) );

    this.addProperty( 'mode', this.modeList.modes[ initialModeIndex ] );
    for ( var i = 0; i < this.modeList.modes.length; i++ ) {
      this.modeList.modes[ i ].init( this );
    }

    this.reset();
  }

  gravityAndOrbits.register( 'GravityAndOrbitsModule', GravityAndOrbitsModule );

  return inherit( PropertySet, GravityAndOrbitsModule, {

    // @public
    step: function( dt ) {

      // limit dt to 1 so there are no large jumps
      dt = Math.min( 1, dt );

      // collision animations should proceed outside of the model step
      var bodies = this.modeProperty.get().model.bodies;
      for ( var i = 0; i < bodies.length; i++ ) {
        var body = bodies[ i ];
        if ( body.collidedProperty.get() ) {
          body.clockTicksSinceExplosionProperty.value += 1;
        }
      }

      if ( this.playButtonPressedProperty.value ) {
        this.modeProperty.get().getClock().step( dt );
      }
    },

    // @public
    getModes: function() {
      return this.modeList.modes.slice( 0 );
    },

    // @private
    updateActiveModule: function() {
      for ( var i = 0; i < this.modeList.modes.length; i++ ) {
        this.modeList.modes[ i ].activeProperty.set( this.modeList.modes[ i ] === this.modeProperty.get() );
      }
    },

    /**
     * @public
     * @override
     */
    reset: function() {
      PropertySet.prototype.reset.call( this );
      for ( var i = 0; i < this.modeList.modes.length; i++ ) {
        this.modeList.modes[ i ].reset();
      }
    }

  }, {
    G: G
  } );
} );
