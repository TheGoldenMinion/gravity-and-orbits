// Copyright 2002-2013, University of Colorado Boulder

/**
 * main view
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );

  var SpaceObjects = require( 'view/Workspace/Components/SpaceObjects' );
  var ForceArrows = require( 'view/Workspace/Components/ForceArrows' );
  var VelocityArrows = require( 'view/Workspace/Components/VelocityArrows' );
  var PlanetPath = require( 'view/Workspace/Components/PlanetPath' );
  var Grid = require( 'view/Workspace/Components/Grid' );
  var MeasuringTape = require( 'view/Workspace/Components/MeasuringTape' );

  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );

  var Strings = require( 'Strings' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var FONT = new PhetFont( 12 );

  function Workspace( model ) {
    var self = this;
    this.toScale = new Node();
    Node.call( this );

    // add space objects
    this.toScale.addChild( new SpaceObjects( model ) );

    // add force arrows
    this.toScale.addChild( new ForceArrows( model ) );

    // add velocity arrows
    this.toScale.addChild( new VelocityArrows( model ) );

    // add planet path
    this.toScale.addChild( new PlanetPath( model ) );

    // add grids
    this.toScale.addChild( new Grid( model ) );

    this.addChild( this.toScale );

    // add measuring tape
    this.addChild( new MeasuringTape( model ) );

    // redraw workspace when scale is changing
    model.scaleProperty.link( function( newScale, oldScale ) {
      self.toScale.scale( 1 / (oldScale || 1) );
      self.toScale.scale( newScale );
    } );

    // add scale center observer
    model.scaleCenterProperty.link( function( vect ) {
      self.x = vect.x;
      self.y = vect.y;
    } );

    // add tooltips
    model.spaceObjects.forEach( function( el ) {
      var name = (el === 'spaceStation' ? 'satellite' : el),
        position = model[el + 'Position'],
        scale = model.planetModes[model.planetMode].options.scale;

      model[el + 'Tooltip'] = new Node( {visible: true, children: [
        new Text( Strings["GAO." + name], { font: FONT, fontWeight: 'bold', fill: 'white', pickable: false, x: position.x * scale + 15, y: position.y * scale - 30} ),
        new Path( new Shape().moveTo( position.x * scale + 7, position.y * scale - 7 ).lineTo( position.x * scale + 25, position.y * scale - 25 ), {stroke: 'yellow', lineWidth: 1} )
      ]} );
      self.toScale.addChild( model[el + 'Tooltip'] );

      model.scaleProperty.link( function( newScale, oldScale ) {
        model[el + 'Tooltip'].scale( (oldScale || 1) );
        model[el + 'Tooltip'].scale( 1 / newScale );
      } );
    } );

    model.spaceObjects.forEach( function( el ) {
      // redraw workspace position of object is changing
      model[el + 'PositionProperty'].link( function( vect ) {
        model[el + 'View'].x = vect.x;
        model[el + 'View'].y = vect.y;

        model[el + 'Tooltip'].x = vect.x;
        model[el + 'Tooltip'].y = vect.y;
      } );

      var checkTooltip = function() {
        if ( !isFinite( model[el + 'View'].getWidth() ) ) {
          model[el + 'Tooltip'].setVisible( false );
        }
        else {
          model[el + 'Tooltip'].setVisible( ( model[el + 'View'].getWidth() * model.scale < 10 ) );
        }
      };

      model.scaleProperty.link( function() {
        checkTooltip();
      } );

      model[el + 'ViewProperty'].link( function() {
        checkTooltip();
      } );

      model.viewModeProperty.link( function() {
        checkTooltip();
      } );

      model.planetModeProperty.link( function() {
        checkTooltip();
      } );

      model[el + 'RadiusProperty'].link( function() {
        checkTooltip();
      } );

      model[el + 'RadiusCoeffProperty'].link( function() {
        checkTooltip();
      } );
    } );
  }

  inherit( Node, Workspace );

  return Workspace;
} );