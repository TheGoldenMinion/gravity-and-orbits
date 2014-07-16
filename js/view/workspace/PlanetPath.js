// Copyright 2002-2013, University of Colorado Boulder

/**
 * Visual representation of planet's path.
 * Each segment of the path is stored till maximum time for a given mode.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  // constants
  var SINGLE_PATH_SEGMENT_LENGTH = 2;

  function PlanetPath( model ) {
    var planetPath = this;
    Node.call( this );

    // color for space object's paths
    planetPath.color = {
      sun: 'yellow',
      earth: 'gray',
      moon: 'magenta',
      spaceStation: 'gray'
    };

    // max length of paths
    planetPath.totalLengthMax = [
      {
        sun: 0,
        earth: 900
      },
      {
        sun: 0,
        earth: 900,
        moon: 1015
      },
      {
        earth: 0,
        moon: 750
      },
      {
        earth: 0,
        spaceStation: 700
      }
    ];

    // variables for each space object
    planetPath.prevPosition = [];
    planetPath.path = [];

    // prepare component for work
    planetPath.init( model );
    planetPath.clearAll( model );

    model.spaceObjects.forEach( function( el ) {
      var body = model[el];

      // add position property observer
      model[el].positionProperty.link( function() {
        if ( !body.exploded && model.path && model.planetMode === planetPath.num && model.drag !== el && planetPath.totalLengthMax[planetPath.num][el] > 0 ) {
          var newPosition = body.position,
            dr = newPosition.minus( planetPath.prevPosition[planetPath.num][el] ).magnitude();

          // add new piece of path if position was changed significantly
          if ( dr > SINGLE_PATH_SEGMENT_LENGTH ) {
            planetPath.add( model, el, newPosition, dr );
          }
        }
      } );
    } );

    // clear path if visibility changed
    model.pathProperty.link( function() {
      planetPath.clearAll( model );
    } );

    model.planetModeProperty.link( function( num ) {
      // hide previous path
      planetPath.hide( model, planetPath.num );

      // show current path
      planetPath.show( model, planetPath.num = num );
    } );

    // clear path if refresh was called
    model.refreshModeProperty.link( function( trigger ) {
      if ( trigger ) {
        planetPath.clearOne( model, planetPath.num );
      }
    } );

    // clear path if rewind was called
    model.rewindProperty.link( function( isRewind ) {
      if ( isRewind ) {
        planetPath.clearOne( model, planetPath.num );
      }
    } );
  }

  return inherit( Node, PlanetPath, {
    // add new piece of path for given element
    add: function( model, el, newPosition, dr ) {
      var prevPosition = this.prevPosition[this.num][el],
        linesObj = this.path[this.num][el],
        line;

      // move pointer
      linesObj.pointerTail = ((linesObj.pointerTail + 1) % linesObj.paths.length);

      // get line
      line = linesObj.paths[linesObj.pointerTail];

      //line.view.setLine( prevPosition.x, prevPosition.y, newPosition.x, newPosition.y );
      line.view.setRect( 0, 0, newPosition.minus( prevPosition ).magnitude() * 1.5, 3 );
      line.view.rotate( Math.atan2( newPosition.y - prevPosition.y, newPosition.x - prevPosition.x ) );
      line.view.setTranslation( prevPosition );

      line.length = dr;
      this.addChild( line.view );
      this.prevPosition[this.num][el] = newPosition.copy();

      this.checkLength( el );
    },
    // check length of given planet
    checkLength: function( el ) {
      var num = this.num,
        totalLength = 0,
        maxLength = this.totalLengthMax[num][el],
        linesObj = this.path[num][el],
        lines = linesObj.paths,
        line;

      // define current length
      for ( var i = 0; i < lines.length; i++ ) {
        totalLength += lines[i].length;
      }

      while ( totalLength > maxLength ) {
        linesObj.pointerHead = ((linesObj.pointerHead + 1) % lines.length);
        line = lines[linesObj.pointerHead];
        this.removeChild( line.view );
        totalLength -= line.length;
        line.length = 0;
      }
    },
    // remove all path for all modes
    clearAll: function( model ) {
      var planetPath = this;
      planetPath.removeAllChildren();

      planetPath.num = model.planetMode; // save planet mode value
      planetPath.prevPosition = []; // contains previous positions for all modes
      model.planetModes.forEach( function( el, i ) {
        planetPath.prevPosition[i] = {};
        model.spaceObjects.forEach( function( el ) {
          planetPath.prevPosition[i][el] = model[el].position.copy();

          if ( planetPath.path[planetPath.num][el] ) {
            planetPath.path[planetPath.num][el].paths.forEach( function( obj ) {
              obj.length = 0;
            } );
            planetPath.path[planetPath.num][el].pointerHead = 0;
            planetPath.path[planetPath.num][el].pointerTail = 0;
          }
        } );
      } );
    },
    // remove all path for given mode
    clearOne: function( model, mode ) {
      var planetPath = this;
      model.spaceObjects.forEach( function( el ) {
        if ( planetPath.path[mode][el] ) {
          planetPath.path[mode][el].paths.forEach( function( obj ) {
            if ( planetPath.isChild( obj.view ) ) {
              planetPath.removeChild( obj.view );
              obj.length = 0;
            }
          } );

          planetPath.path[mode][el].pointerHead = 0;
          planetPath.path[mode][el].pointerTail = 0;

          planetPath.prevPosition[mode][el] = model[el].position.copy();
        }
      } );
    },
    // hide all path for given mode
    hide: function( model, mode ) {
      var planetPath = this;

      model.spaceObjects.forEach( function( el ) {
        if ( planetPath.path[mode][el] ) {
          for ( var i = 0, paths = planetPath.path[mode][el].paths; i < paths.length; i++ ) {
            paths[i].view.setVisible( false );
          }
        }
      } );
    },
    // init paths for further using
    init: function() {
      var planetPath = this,
        pathLength;

      this.totalLengthMax.forEach( function( planetLength, i ) {
        planetPath.path[i] = {};
        for ( var planet in planetLength ) {
          if ( planetLength.hasOwnProperty( planet ) && planetLength[planet] ) {
            pathLength = planetLength[planet];
            planetPath.path[i][planet] = {
              pointerHead: 0,
              pointerTail: 0,
              paths: []
            };
            for ( var j = 0; j <= pathLength / SINGLE_PATH_SEGMENT_LENGTH; j++ ) {
              planetPath.path[i][planet].paths.push( {
                length: 0,
                //view: new Line( 0, 0, 0, 0, {stroke: self.color[planet], lineWidth: 3, lineCap: 'square'} )
                view: new Rectangle( 0, 0, 0, 0, {fill: planetPath.color[planet]} )
              } );
            }
          }
        }
      } );
    },
    // show all path for given mode
    show: function( model, mode ) {
      var planetPath = this;
      model.spaceObjects.forEach( function( el ) {
        if ( planetPath.path[mode][el] ) {
          // show all path for given mode
          for ( var i = 0, paths = planetPath.path[mode][el].paths; i < paths.length; i++ ) {
            paths[i].view.setVisible( true );
          }

          // set new previous position
          planetPath.prevPosition[mode][el] = model[el].position.copy();
        }
      } );
    }
  } );
} );