// Copyright 2002-2011, University of Colorado
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
  var Property = require( 'AXON/Property' );
  var PropertySet = require( 'AXON/PropertySet' );
  var ModeListParameterList = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/module/ModeListParameterList' );


  var G = 6.67428E-11;

  /**
   * //    public GravityAndOrbitsModule( IUserComponent tabUserComponent, final PhetFrame phetFrame, Property<Boolean> whiteBackgroundProperty, final String name, boolean showMeasuringTape, Function1<ModeListParameterList, ArrayList<GravityAndOrbitsMode>> createModes, int initialModeIndex, boolean showMassCheckBox ) {
   * @param tabUserComponent
   * @param phetFrame
   * @param {Property<boolean>} whiteBackgroundProperty
   * @param {string} name
   * @param {boolean} showMeasuringTape
   * @param {function<ModeListParameterList, Array<GravityAndOrbitsMode>>} createModes
   * @param {number} initialModeIndex
   * @param {boolean} showMassCheckBox
   * @constructor
   */
  function GravityAndOrbitsModule( tabUserComponent, phetFrame, whiteBackgroundProperty, name, showMeasuringTape, createModes, initialModeIndex, showMassCheckBox ) {
    //Properties that are common to all "modes" should live here.

    PropertySet.call( this, {
      showGravityForce: false,
      showPath: false,
      showGrid: false,
      showVelocity: false,
      showMass: false,
      playButtonPressed: false,
      //one quarter of the way up between 1/10 and 2 scale factors
      timeSpeedScale: (0.1 + 2) / 4,
      measuringTapeVisible: false,
      gravityEnabled: true,
      stepping: false,
      rewinding: false,
      mode: 0, // TODO this was blank
      whiteBackground: false, // was blank
      showMeasuringTape: false // was blank
    } );


    //TODO: I don't think this clock is used since each mode has its own clock; perhaps this just runs the active tab?
//    SimSharingPiccoloModule.call( this, tabUserComponent, name, new ConstantDtClock( 30, 1 ) );
    this.showMassCheckBox = showMassCheckBox;

    //private
    this.modes = createModes( new ModeListParameterList(
      this.playButtonPressedProperty,
      this.gravityEnabledProperty,
      this.steppingProperty,
      this.rewindingProperty,
      this.timeSpeedScaleProperty) );

//    console.log(this.modes.modes[0]);

    this.modeProperty = new Property( this.modes.modes[initialModeIndex] );
    this.whiteBackground = whiteBackgroundProperty;
    this.showMeasuringTape = showMeasuringTape;

    // TODO: look at java for this
//    getModulePanel().setLogoPanel( null );

    for ( var i = 0; i < this.modes.modes.length; i++ ) {
      this.modes.modes[i].init( this );
    }
//    setSimulationPanel( getMode().getCanvas() );
    // Switch the entire canvas on mode switches
//    modeProperty.addObserver( new SimpleObserver().withAnonymousClassBody( {
//      update: function() {
//        SwingUtilities.invokeLater( new Runnable().withAnonymousClassBody( {
//          run: function() {
//            setSimulationPanel( getMode().getCanvas() );
//          }
//        } ) );
//        updateActiveModule();
//      }
//    } ) );
//    //clock panel appears in the canvas
//    setClockControlPanel( null );
    this.reset();
  }

  return inherit( PropertySet, GravityAndOrbitsModule, {
      getModeIndex: function() {
        return modes.indexOf( this.getMode() );
      },

      //private
      getMode: function() {
        return this.modeProperty.get();
      },

      getModes: function() {
        return this.modes.slice( 0 );
      },

      //private
      updateActiveModule: function() {
        for ( var i = 0; i < this.modes.length; i++ ) {
          this.modes[i].active.set( this.modes[i] === this.getMode() );
        }
      },
      reset: function() {
        for ( var i = 0; i < this.modes.length; i++ ) {
          this.modes[i].reset();
        }
        this.showGravityForceProperty.reset();
        this.showPathProperty.reset();
        this.showGridProperty.reset();
        this.showVelocityProperty.reset();
        this.showMassProperty.reset();
        this.playButtonPressedProperty.reset();
        this.timeSpeedScaleProperty.reset();
        this.measuringTapeVisibleProperty.reset();
        this.gravityEnabledProperty.reset();
        this.steppingProperty.reset();
        this.rewindingProperty.reset();
        this.modeProperty.reset();
      },
      setTeacherMode: function( b ) {
        for ( var i = 0; i < this.modes.length; i++ ) {
          this.modes[i].getModel().teacherMode = b;
        }
      },
      addModelSteppedListener: function( simpleObserver ) {
        for ( var i = 0; i < this.modes.length; i++ ) {
          this.modes[i].getModel().addModelSteppedListener( simpleObserver );
        }
      },
      setModeIndex: function( selectedMode ) {
        this.modeProperty.set( this.modes.get( selectedMode ) );
      }
    },
//statics
    {
      G: G
    } );
} );
