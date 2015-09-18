// Copyright 2002-2015, University of Colorado

/**
 * ModelState represents an immutable representation of the entire physical state and code for performing the numerical integration which produces the next ModelState.
 * It is used by the GravityAndOrbitsModel to update the physics.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  var BodyState = require( 'GRAVITY_AND_ORBITS/gravity-and-orbits/model/BodyState' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var GRAVITATION_CONSTANT = 6.67428E-11;
  var XI = 0.1786178958448091;
  var LAMBDA = -0.2123418310626054;
  var CHI = -0.06626458266981849;

  /**
   * @param {Array.<BodyState>} bodyStates
   * @constructor
   */
  function ModelState( bodyStates ) {
    this.bodyStates = bodyStates;
  }

  return inherit( Object, ModelState, {

    /**
     * Updates the model, producing the next ModelState
     * @public
     * @param {number} dt
     * @param {number} numSteps
     * @param {Property.<Boolean>} gravityEnabledProperty
     * @returns {ModelState}
     */
    getNextState: function( dt, numSteps, gravityEnabledProperty ) {
      var state = this;

      if ( gravityEnabledProperty.get() ) {
        for ( var i = 0; i < numSteps; i++ ) {
          state = state.getNextInteractingState( dt / numSteps );
        }
      }
      else {
        // gravity is not active, bodies are coasting;
        return this.getNextCoastingState( dt );
      }
      return state;
    },

    /**
     * Finds the positions of the bodies after a time dt
     * @private
     * @param {dt} number
     */
    updatePositions: function( dt ) {
      for ( var i = 0; i < this.bodyStates.length; i++ ) {
        var bodyState = this.bodyStates[ i ];
        if ( !bodyState.exploded ) {
          bodyState.position.add( bodyState.velocity.timesScalar( dt ) );
        }
      }
    },

    /**
     * Finds the velocities of the bodies after a time dt
     * @private
     * @param {number} dt
     */
    updateVelocities: function( dt ) {
      this.updateAccelerations();
      for ( var i = 0; i < this.bodyStates.length; i++ ) {
        var bodyState = this.bodyStates[ i ];
        if ( !bodyState.exploded ) {
          bodyState.velocity.add( bodyState.acceleration.multiplyScalar( dt ) );
        }
      }
    },

    /**
     * Finds the current values of the accelerations
     * @private
     */
    updateAccelerations: function() {
      for ( var i = 0; i < this.bodyStates.length; i++ ) {
        var bodyState = this.bodyStates[ i ];
        if ( !bodyState.exploded ) {
          bodyState.acceleration = this.getNetForce( bodyState ).divideScalar( bodyState.mass );
        }
      }
    },

    /**
     * Sets all the accelerations to zero, useful when gravity is turned off
     * @private
     */
    setAccelerationToZero: function() {
      for ( var i = 0; i < this.bodyStates.length; i++ ) {
        this.bodyStates[ i ].acceleration = Vector2.ZERO;
      }
    },

    /**
     * Gets the net force on the bodyState due to the other bodies
     * @private
     * @param {BodyState} bodyState
     * @returns {Vector2}
     */
    getNetForce: function( bodyState ) {

      // use netForce to keep track of the net force, initialize to zero.
      var netForce = new Vector2();

      for ( var j = 0; j < this.bodyStates.length; j++ ) {

        // an object cannot act on itself
        if ( bodyState !== this.bodyStates[ j ] ) {

          // netForce is a mutable vector
          netForce.add( this.getTwoBodyForce( bodyState, this.bodyStates[ j ] ) );
        }
      }
      return netForce;
    },

    /**
     * Returns the force on the body source due to the body target
     * @private
     * @param {BodyState} source
     * @param {BodyState} target
     * @returns {Vector2}
     */
    getTwoBodyForce: function( source, target ) {
      if ( source.position.equals( target.position ) ) {

        // TODO: limit distance so forces don't become too large, perhaps we could compare it to the radius of the bodies
        // If they are on top of each other, force should be infinite, but ignore it since we want to have semi-realistic behavior
        return Vector2.ZERO;
      }
      else if ( source.exploded ) {

        // ignore in the computation if that body has exploded
        return Vector2.ZERO;
      }
      else {
        var relativePosition = target.position.minus( source.position );
        var multiplicativeFactor = GRAVITATION_CONSTANT * source.mass * target.mass / Math.pow( source.position.distanceSquared( target.position ), 1.5 );
        return relativePosition.multiplyScalar( multiplicativeFactor );
      }
    },

    /**
     * Updates the model, producing the next ModelState when gravity is present
     * @private
     * @param {number} dt
     * @return {ModelState}
     */
    getNextCoastingState: function( dt ) {

      // update Positions
      this.updatePositions( dt );

      // update to Velocities are unnecessary since they stay constant

      // set the acceleration to zero.
      this.setAccelerationToZero();

      // copy our workingCopy to generate a new ModelState
      var newState = [];// {Array.<BodyState>}
      this.bodyStates.forEach( function( bodyState ) {
        newState.push( new BodyState(
          new Vector2( bodyState.position.x, bodyState.position.y ),
          bodyState.velocity,
          bodyState.acceleration,
          bodyState.mass,
          bodyState.exploded
        ) );
      } );

      return new ModelState( newState );
    },


    /**
     * Updates the model, producing the next ModelState when gravity is present
     * @private
     * @param {number} dt
     * @returns {ModelState}
     */
    getNextInteractingState: function( dt ) {

      //-------------
      // Step One
      //--------------

      // update Positions
      this.updatePositions( XI * dt );  // net time: XI dt

      // update Velocities
      this.updateVelocities( (1 - 2 * LAMBDA) * dt / 2 );// net time: (1 - 2 * LAMBDA) * dt / 2

      //-------------
      // Step Two
      //--------------

      // update Positions
      this.updatePositions( CHI * dt ); // net time: (XI+CHI) dt

      // update Velocities
      this.updateVelocities( LAMBDA * dt ); // net time: dt / 2

      //-------------
      // Step Three
      //--------------

      // update Positions
      this.updatePositions( (1 - 2 * (CHI + XI)) * dt ); // net time: (1-(XI+CHI)) dt

      // update Velocities
      this.updateVelocities( LAMBDA * dt ); // net time: (1/2 + LAMBDA) dt

      //-------------
      // Step Four
      //--------------

      // update Positions
      this.updatePositions( CHI * dt ); // net time: (1-(XI)) dt

      // update Velocities
      // no update in velocities // net time: (1/2 + LAMBDA) dt

      //-------------
      // Step Five: last step, these are the final positions and velocities i.e. r(t+dt) and v(t+dt)
      //--------------

      // IMPORTANT: we need to update the velocities first

      // update Velocities
      this.updateVelocities( (1 - 2 * LAMBDA) * dt / 2 ); // net time:  dt;

      // update Positions
      this.updatePositions( XI * dt ); // net time:  dt

      //-------------
      // Update the new acceleration
      //-------------
      this.updateAccelerations();

      // copy our workingCopy to generate a new ModelState
      var newState = [];// {Array.<BodyState>}
      this.bodyStates.forEach( function( bodyState ) {
        newState.push( new BodyState(
          new Vector2( bodyState.position.x, bodyState.position.y ),
          new Vector2( bodyState.velocity.x, bodyState.velocity.y ),
          new Vector2( bodyState.acceleration.x, bodyState.acceleration.y ),
          bodyState.mass,
          bodyState.exploded
        ) );
      } );

      return new ModelState( newState );
    },

    /**
     *  Get the BodyState for the specified index--future work could
     *  change this signature to getState(Body body) since it would be safer.
     *  See usage in GravityAndOrbitsModel constructor.
     * @public
     * @param {number} index
     * @returns {Array.<BodyState>}
     */
    getBodyState: function( index ) {
      return this.bodyStates[ index ];
    }
  } );
} );