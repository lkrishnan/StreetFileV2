<template>
    <v-card class="my-5">
        <div id="map"></div>
    </v-card>
</template>

<script>
    import Map from "@arcgis/core/Map";
    import MapView from '@arcgis/core/views/MapView';
    import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
    import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
    import TileLayer from "@arcgis/core/layers/TileLayer";
    import Extent from "@arcgis/core/geometry/Extent";
    import esriConfig from '@arcgis/core/config.js';
    import axios from "axios";

    esriConfig.assetsPath = './assets';

    export default {
        name: "themap",
        mounted: function( ){
            this.initMap( );

        },
        data:  ( ) => ( {
            map: null,
            map_view: null,
            road_layer_view: null,
            basemap: new TileLayer( { 
                    url: "https://maps.mecklenburgcountync.gov/agsadaptor/rest/services/basemap/MapServer" 
                } ),
            road_layer: new FeatureLayer( { 
                    url: "https://maps.mecklenburgcountync.gov/agsadaptor/rest/services/ADM/streetfile_layers/FeatureServer/1", 
                    outFields: [ "e911", "lstreetcode", "rstreetcode" ],
                    visible: false
                } ),
            addr_layer: new FeatureLayer( { 
                    url: "https://maps.mecklenburgcountync.gov/agsadaptor/rest/services/ADM/streetfile_layers/FeatureServer/0",
                    outFields: [ "num_addr", "county_street_code" ],
                    visible: false 
                } ),
            sel_layer: new GraphicsLayer( { opacity: 0.6 } )
        } ),
        computed: {
            ws( ){
                return this.$store.state.ws;
            },
            stcode( ){
                return this.$store.state.stcode;
            }
            
        },
        watch: {
            stcode: "selectFeatures"
        
        },
        methods: {
            initMap( ){
                const _this = this;
                    
                _this.map = new Map( {
                    layers: [ _this.basemap, _this.road_layer, _this.addr_layer, _this.sel_layer ] 
                } );

                _this.map_view = new MapView( {
                    container: "map",
                    map: _this.map,
                    extent: new Extent( {
		                xmin: 1384251.24585599,
		                ymin: 460978.995855999,
		                xmax: 1537013.50075424,
		                ymax: 660946.333333335,
		                spatialReference: { wkid: 2264 }
	                } ) 
		        } );

                if( _this.stcode ){
                    _this.selectFeatures( );
                }

            },
            selectFeatures( ){
                const _this = this;

                axios.all( [ 
					_this.road_layer.when( ( ) => {
                        var query = _this.road_layer.createQuery( );
                        query.where = "lstreetcode = " + _this.stcode + " or rstreetcode = " + _this.stcode;
                        return _this.road_layer.queryFeatures( query );
                    } ),
                    _this.addr_layer.when( ( ) => {
                        var query = _this.addr_layer.createQuery( );
                        query.where = "county_street_code = " + _this.stcode;
                        return _this.addr_layer.queryFeatures( query );
                    } )
				] )
				.then( axios.spread( ( road_results, addr_results ) => {
                    let features = [ ];

					const road_features = road_results.features.map( function( graphic ){
                            graphic.symbol = {
                                type: "simple-line", // autocasts as new SimpleLineSymbol()
                                color: [ 47, 204, 110 ] , // RGB color values as an array
                                width: 4
                            };
                            return graphic;

                        } ),
                        addr_features = addr_results.features.map( function( graphic ){
                            graphic.symbol = {
                                type: "simple-marker", // autocasts as new SimpleLineSymbol()
                                color: [ 47, 204, 110 ], // RGB color values as an array
                                size: 5,
                                outline: {  // autocasts as new SimpleLineSymbol()
                                    width: 1,
                                    color: [ 47, 204, 110 ]
                                }
                            };
                            return graphic;

                        } ); 

                    features.push( ...road_features, ...addr_features );

                    _this.sel_layer.removeAll( );
                    _this.sel_layer.addMany( features );
                    _this.map_view.goTo( features );
            
        		} ) )
        		.catch( ex => {
          			console.log( "parsing failed", ex );

        		} );
            
            }
		    
	    }
    
    }
</script>

<style>
    #map {
        padding: 0;
        margin: 0;
        height: 600px;
    }

</style>