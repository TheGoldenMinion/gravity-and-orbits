// Copyright 2002-2013, University of Colorado Boulder

/**
 * main Model container.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  var PropertySet = require( 'AXON/PropertySet' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var SpaceObjectModel = require( 'model/SpaceObjectModel' );
  var thousandEarthMassesString = require( 'string!GRAVITY_AND_ORBITS/thousandEarthMasses' );
  var earthMassesString = require( 'string!GRAVITY_AND_ORBITS/earthMasses' );
  var billionBillionSatelliteMassesString = require( 'string!GRAVITY_AND_ORBITS/billionBillionSatelliteMasses' );
  var satelliteMassesString = require( 'string!GRAVITY_AND_ORBITS/satelliteMasses' );
  var cartoonString = require( 'string!GRAVITY_AND_ORBITS/cartoon' );
  var toScaleString = require( 'string!GRAVITY_AND_ORBITS/toScale' );

  var Vector2 = require( 'DOT/Vector2' );

  var CONSTANTS = {
    G: 6.67384E-11, // gravitational constant
    SUN_RADIUS: 6.955E8,
    SUN_MASS: 1.989E30,
    EARTH_RADIUS: 6.371E6,
    EARTH_MASS: 5.9736E24,
    EARTH_PERIHELION: 147098290E3,
    EARTH_ORBITAL_SPEED_AT_PERIHELION: 30300,
    MOON_MASS: 7.3477E22,
    MOON_RADIUS: 1737.1E3,
    MOON_EARTH_SPEED: -1.01E3,
    MOON_SPEED: -1.01E3,
    MOON_PERIGEE: 391370E3,
    MOON_X: 147098290E3,
    MOON_Y: 391370E3,
    SPACE_STATION_RADIUS: 109,
    SPACE_STATION_MASS: 369914,
    SPACE_STATION_SPEED: 7706,
    SPACE_STATION_PERIGEE: 347000,
    METERS_PER_MILE: 0.000621371192
  };

  var fps = 60, timeModes = ['days', 'minutes'];

  var planetModes = [
    {
      sun: {
        fixed: true,
        x: 0,
        y: 0,
        radius: CONSTANTS.SUN_RADIUS * 50,
        radiusScaleMode: 0.025,
        mass: CONSTANTS.SUN_MASS,
        massTooltip: {
          defaultValue: 333,
          text: thousandEarthMassesString
        }
      },
      earth: {
        x: CONSTANTS.EARTH_PERIHELION,
        y: 0,
        radius: CONSTANTS.EARTH_RADIUS * 800,
        radiusScaleMode: 0.15,
        velocity: {x: 0, y: -CONSTANTS.EARTH_ORBITAL_SPEED_AT_PERIHELION},
        mass: CONSTANTS.EARTH_MASS * 10200,
        massTooltip: {
          defaultValue: 1,
          text: earthMassesString,
          precision: 2
        }
      },
      options: {
        forceScale: 1.017, // ratio of the gravitational and centripetal forces
        timeScale: 365.0 / 26.0, // days per seconds
        timeMode: timeModes[0],
        scale: 1.15E-9,
        centerX: 275,
        centerY: 235
      }
    },
    {
      sun: {
        fixed: true,
        x: 0,
        y: 0,
        radius: CONSTANTS.SUN_RADIUS * 50,
        radiusScaleMode: 0.025,
        mass: CONSTANTS.SUN_MASS,
        massTooltip: {
          defaultValue: 333,
          text: thousandEarthMassesString
        }
      },
      earth: {
        x: CONSTANTS.EARTH_PERIHELION,
        y: 0,
        radius: CONSTANTS.EARTH_RADIUS * 800,
        radiusScaleMode: 0.15,
        velocity: {x: 0, y: -CONSTANTS.EARTH_ORBITAL_SPEED_AT_PERIHELION},
        mass: CONSTANTS.EARTH_MASS * 10200,
        massTooltip: {
          defaultValue: 1,
          text: earthMassesString,
          precision: 2
        }
      },
      moon: {
        x: CONSTANTS.MOON_X,
        y: -CONSTANTS.EARTH_RADIUS * 800 * 1.7,
        radius: CONSTANTS.MOON_RADIUS * 800,
        radiusScaleMode: 0.3,
        velocity: {x: CONSTANTS.MOON_SPEED * 21, y: -CONSTANTS.EARTH_ORBITAL_SPEED_AT_PERIHELION},
        mass: CONSTANTS.MOON_MASS,
        massTooltip: {
          defaultValue: 0.01,
          text: earthMassesString,
          precision: 2
        }
      },
      options: {
        forceScale: 1.017, // ratio of the gravitational and centripetal forces
        timeScale: 365.0 / 26.0, // days per seconds
        timeMode: timeModes[0],
        scale: 1.15E-9,
        centerX: 275,
        centerY: 235
      }
    },
    {
      earth: {
        x: 0,
        y: 0,
        radius: CONSTANTS.EARTH_RADIUS * 15,
        radiusScaleMode: 0.05,
        velocity: {x: -CONSTANTS.MOON_SPEED * CONSTANTS.MOON_MASS / CONSTANTS.EARTH_MASS, y: 0}, // -vx for fulfill the law of conservation of momentum
        mass: CONSTANTS.EARTH_MASS,
        massTooltip: {
          defaultValue: 1,
          text: earthMassesString,
          precision: 2
        }
      },
      moon: {
        x: 0,
        y: -CONSTANTS.MOON_Y,
        radius: CONSTANTS.MOON_RADIUS * 15,
        radiusScaleMode: 0.1,
        velocity: {x: CONSTANTS.MOON_SPEED, y: 0},
        mass: CONSTANTS.MOON_MASS,
        massTooltip: {
          defaultValue: 0.01,
          text: earthMassesString,
          precision: 2
        }
      },
      options: {
        forceScale: 1.001,
        timeScale: 365.0 / 96.0, // days per seconds
        timeMode: timeModes[0],
        scale: 3.7E-7,
        centerX: 295,
        centerY: 235
      }
    },
    {
      earth: {
        x: 0,
        y: 0,
        radius: CONSTANTS.EARTH_RADIUS * 0.8,
        radiusScaleMode: 1.25,
        velocity: {x: 0, y: 0},
        mass: CONSTANTS.EARTH_MASS,
        massTooltip: {
          defaultValue: 16,
          text: billionBillionSatelliteMassesString
        }
      },
      spaceStation: {
        x: CONSTANTS.SPACE_STATION_PERIGEE + CONSTANTS.EARTH_RADIUS + CONSTANTS.SPACE_STATION_RADIUS,
        y: 0,
        radius: CONSTANTS.SPACE_STATION_RADIUS * 8000,
        radiusScaleMode: 0.1,
        velocity: {x: 0, y: -CONSTANTS.SPACE_STATION_SPEED},
        mass: CONSTANTS.SPACE_STATION_MASS,
        massTooltip: {
          defaultValue: 1,
          text: satelliteMassesString,
          precision: 2
        }
      },
      options: {
        forceScale: 1,
        timeScale: 365.0 / 31855.0, // days per seconds
        timeMode: timeModes[1],
        scale: 2E-5,
        centerX: 280,
        centerY: 230
      }
    }
  ];

  function GravityAndOrbitsModel( width, height, viewMode ) {
    var self = this;
    this.viewModes = [cartoonString, toScaleString];
    this.viewMode = viewMode; // 'cartoon', 'to scale'
    this.timeModes = timeModes;
    this.CONSTANTS = CONSTANTS;
    this.isTapeUnitsMiles = true; // use in measuring tape miles or meters metric system

    this.spaceObjects = ['sun', 'earth', 'moon', 'spaceStation'];

    // possible planet modes
    this.planetModes = planetModes;

    // dimensions of the model's space
    this.width = width;
    this.height = height;

    PropertySet.call( this, {
      planetMode: 0, // planet mode
      timeMode: timeModes[0], // time counter format
      gravity: true, // switch gravity
      forceArrow: false, // visible force arrows
      velocityArrow: false, // visible velocity arrows
      path: false, // visible path
      grid: false, // visible grid
      tape: false, // visible tape
      mass: false, // visible mass
      play: false, // play/pause state
      speed: 1, // 1.75, 1, 0.25
      drag: '', // current dragging object
      refreshMode: false, // refresh current planetMode
      showExplosion: true, // check explosion flag
      day: 0, // current day
      dayOffset: 0, // offset from zero day
      scale: 1, // scale coefficient
      scaleCenter: new Vector2( 0, 0 ), // scale center
      rewind: false // rewind trigger
    } );

    // add property for space objects
    this.spaceObjects.forEach( function( el ) {
      self[el] = new SpaceObjectModel();
    } );

    // update view for every new time tick
    this.dayProperty.link( function( newDay, prevDay ) {
      updateView.call( self, newDay - prevDay );
    } );

    this.spaceObjects.forEach( function( el ) {
      var body = self[el];

      // add observers for mass sliders
      body.massCoeffProperty.link( function( newValue, oldValue ) {
        body.mass *= 1 / (oldValue || 1);
        body.mass *= newValue;

        // change radius
        body.radiusCoeff = Math.pow( newValue, 1 / 3 );
      } );

      // resize view if radius changed
      body.radiusCoeffProperty.link( function( newValue, oldValue ) {
        body.view.scale( 1 / (oldValue || 1) );
        body.view.scale( newValue );
      } );
    } );

    // force planet mode reset function
    this.planetModeReset = function() {
      // notify observers
      self.planetModeProperty._notifyObservers();

      // set initial value
      self.planetModeProperty.reset();
    };

    this.reset();
  }

  inherit( PropertySet, GravityAndOrbitsModel, {
    step: function( dt ) {
      if ( this.play ) {
        this.stepManual( dt );
      }
    },
    reset: function() {
      var self = this;
      this.showExplosion = false;
      this.gravityProperty.reset();
      this.forceArrowProperty.reset();
      this.velocityArrowProperty.reset();
      this.pathProperty.reset();
      this.gridProperty.reset();
      this.tapeProperty.reset();
      this.massProperty.reset();
      this.playProperty.reset();
      this.speedProperty.reset();
      this.dayProperty.reset();
      this.scaleProperty.reset();
      this.rewindProperty.reset();

      // reset all modes
      this.planetModes.forEach( function( mode, i ) {
        self.planetMode = i;
        self.refreshMode = true;
      } );

      this.planetModeReset();
      this.showExplosion = true;
    },
    stepManual: function( dt ) {
      dt = dt || 1 / fps;
      this.day += dt * this.speed * this.planetModes[this.planetMode].options.timeScale;
    }
  } );

  var updateView = function( t ) {
    var model = this,
      mode = model.planetModes[model.planetMode],
      scale = mode.options.scale,
      forceScale = mode.options.forceScale,
      timeScale = 24 * 60 * 60 * 0.967,
      STEPS = 10,
      dt = t * timeScale / STEPS,
      i, j,
      currentObj, body;

    for ( j = 0; j < STEPS; j++ ) {
      for ( i = 0; i < model.spaceObjects.length; i++ ) {
        currentObj = model.spaceObjects[i];

        // change position of not fixed or dragging objects
        if ( mode[currentObj] && !mode[currentObj].fixed && currentObj !== model.drag ) {
          body = model[currentObj];
          body.position = body.position.timesScalar( 1.0 / scale ).plus( body.velocity.timesScalar( dt ).plus( body.acceleration.timesScalar( dt * dt / 2.0 ) ) ).timesScalar( scale );
          body.velocityHalf = body.velocity.plus( body.acceleration.timesScalar( dt / 2.0 ) );
          body.acceleration = getForce.call( model, currentObj ).timesScalar( -forceScale / body.mass );
          body.velocity = body.velocityHalf.plus( body.acceleration.timesScalar( dt / 2.0 ) );
        }
      }
    }
  };

  var getForce = function( target ) {
    var F = new Vector2( 0, 0 ),
      currentObj,
      sourceBody,
      sourcePos,
      model = this,
      targetBody = model[target],
      mode = model.planetModes[model.planetMode],
      scale = mode.options.scale,
      targetPos = targetBody.position.timesScalar( 1 / scale );

    // zero vector, for no gravity
    if ( model.gravity ) {
      for ( var i = 0; i < model.spaceObjects.length; i++ ) {
        currentObj = model.spaceObjects[i];
        sourceBody = model[currentObj];
        sourcePos = sourceBody.position.timesScalar( 1 / scale );

        // ignore computation if that body has exploded,
        // or if they are on top of each other, force should be infinite, but ignore it since we want to have semi-realistic behavior
        if ( mode[currentObj] && currentObj !== target && !sourceBody.exploded && !targetPos.equals( sourcePos ) ) {
          F = F.plus( getUnitVector( sourcePos, targetPos ).timesScalar( CONSTANTS.G * sourceBody.mass * targetBody.mass / (targetPos.distanceSquared( sourcePos )) ) );
        }
      }
    }
    return F;
  };

  var getUnitVector = function( source, target ) {
    return target.minus( source ).normalized();
  };

  return GravityAndOrbitsModel;
} );
