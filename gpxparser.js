///////////////////////////////////////////////////////////////////////////////
// loadgpx.4.js
//
// Javascript object to load GPX-format GPS data into Google Maps.
//
// Copyright (C) 2006 Kaz Okuda (http://notions.okuda.ca)
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation; either version 2
// of the License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
//
// If you use this script or have any questions please leave a comment
// at http://notions.okuda.ca/geotagging/projects-im-working-on/gpx-viewer/
// A link to the GPL license can also be found there.
//
///////////////////////////////////////////////////////////////////////////////
//
// History:
//    revision 1 - Initial implementation
//    revision 2 - Removed LoadGPXFileIntoGoogleMap and made it the callers
//                 responsibility.  Added more options (colour, width, delta).
//    revision 3 - Waypoint parsing now compatible with Firefox.
//    revision 4 - Upgraded to Google Maps API version 2.  Tried changing the way
//               that the map calculated the way the center and zoom level, but
//               GMAP API 2 requires that you center and zoom the map first.
//               I have left the bounding box calculations commented out in case
//               they might come in handy in the future.
//
//    5/28/2010 - Upgraded to Google Maps API v3 and refactored the file a bit.
//                          (Chris Peplin)
//    6/14/2012 - Changed library to ony return the parsed gpx file. Removed
//                dependency on Google Maps API
//                          (Arne Eirik Nielsen)
//
//
// Author: Kaz Okuda
// URI: http://notions.okuda.ca/geotagging/projects-im-working-on/gpx-viewer/
//
// Updated for Google Maps API v3 by Chris Peplin
// Fork moved to GitHub: https://github.com/peplin/gpxviewer
//
///////////////////////////////////////////////////////////////////////////////

function GPXParser(xmlDoc, map) {
    this.xmlDoc = xmlDoc;
    this.map = map;
}

GPXParser.prototype.getTrackSegment = function(trackSegmentElement) {
    var trackpointElements = trackSegmentElement.getElementsByTagName("trkpt");
    var trackPoints = [];

    for(var i = 0; i < trackpointElements.length; i++) {
        var trackpointElement = trackpointElements[i];
        var lng = parseFloat(trackpointElement.getAttribute("lon"));
        var lat = parseFloat(trackpointElement.getAttribute("lat"));
        var point = {latlon: {lat: lat, lng: lng}};

        var elevationElements = trackpointElement.getElementsByTagName("ele");
        if (elevationElements.length > 0) {
            point.elevation = parseFloat(elevationElements[0].childNodes[0].nodeValue);
        }
        trackPoints.push(point);
    }

    return {trackPoints: trackPoints};
}

GPXParser.prototype.getTrack = function(trackElement) {
    var segmentElements = trackElement.getElementsByTagName("trkseg");
    var segments = [];
    for(var i = 0; i < segmentElements.length; i++) {
        var segment = this.getTrackSegment(segmentElements[i]);
        segments.push(segment);
    }
    return {segments: segments };
}


GPXParser.prototype.getTracks = function() {
    var trackElements = this.xmlDoc.documentElement.getElementsByTagName("trk");
    var tracks = [];
    for(var i = 0; i < trackElements.length; i++) {
        var track = this.getTrack(trackElements[i]);
        tracks.push(track);
    }
    return tracks;
}
