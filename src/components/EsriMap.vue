<template>
    <v-card class="my-5">
        <div id="map">
            <div id="loading">
                <v-card 
                    class="pa-5" 
                    top   
                    right
                    absolute
                >
                fsdfsd
			    </v-card>
            </div>
            <v-progress-linear
                v-show="!hidden"
                indeterminate
                color="primary"
                height="10"
                bottom
                left
                absolute
            ></v-progress-linear>
        </div>
    </v-card>
</template>

<script>
    import Map from "@arcgis/core/Map"
    import MapView from "@arcgis/core/views/MapView"
    import FeatureLayer from "@arcgis/core/layers/FeatureLayer"
    import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer"
    import TileLayer from "@arcgis/core/layers/TileLayer"
    import MapImageLayer from "@arcgis/core/layers/MapImageLayer"
    import Extent from "@arcgis/core/geometry/Extent"
    import esriConfig from "@arcgis/core/config.js"
    import axios from "axios"
    import JSONToURL from "../js/jsontourl"
    //import * as watchUtils from "@arcgis/core/core/watchUtils"

    esriConfig.assetsPath = './assets'

    export default {
        name: "themap",
        mounted: function( ){
            this.initMap( )

        },
        data:  ( ) => ( {
            axios_inst: axios.create( { 
				headers: { 
					"Cache-Control": "max-age=0, no-cache, no-store",
					"Pragma": "no-cache"  
				}
			} ),
            map: null,
            map_view: null,
            popup: null,
            road_layer_view: null,
            basemap: new TileLayer( { 
                    url: "https://maps.mecklenburgcountync.gov/agsadaptor/rest/services/basemap/MapServer" 
                } ),
            road_layer: new FeatureLayer( { 
                    id: "st_lyr",
                    url: "https://maps.mecklenburgcountync.gov/agsadaptor/rest/services/ADM/streetfile_layers/FeatureServer/1", 
                    outFields: [ "e911", "lstreetcode", "rstreetcode" ],
                    visible: false
                } ),
            addr_layer: new FeatureLayer( {
                    id: "addr_lyr", 
                    url: "https://maps.mecklenburgcountync.gov/agsadaptor/rest/services/ADM/streetfile_layers/FeatureServer/0",
                    outFields: [ "num_addr", "county_street_code" ],
                    visible: false 
                } ),
            sel_layer: new GraphicsLayer( { opacity: 0.6 } ),
            addr_map_layer: new MapImageLayer( {
                url: "https://maps.mecklenburgcountync.gov/agsadaptor/rest/services/ADM/streetfile_layers/MapServer",
                sublayers: [
                    {
                        id: 0,
                        visible: true
                    }
                
                ]
            
            } ),
            hidden: true,
            select: { state: 'Florida', abbr: 'FL' },
            items: [
                { state: 'Florida', abbr: 'FL' },
                { state: 'Georgia', abbr: 'GA' },
                { state: 'Nebraska', abbr: 'NE' },
                { state: 'California', abbr: 'CA' },
                { state: 'New York', abbr: 'NY' },
            ]
        
        } ),
        computed: {
            ws( ){
                return this.$store.state.ws
            
            },
            stcode( ){
                return this.$route.params.stcode			

            }
            
        },
        watch: {
            stcode: "highlightFeatures"
        
        },
        methods: {
            initMap( ){
                const _this = this;
                    
                _this.map = new Map( {
                    layers: [ _this.basemap, _this.addr_map_layer, _this.road_layer, _this.addr_layer, _this.sel_layer ] 
                
                } )

                _this.map_view = new MapView( {
                    container: "map",
                    map: _this.map,
                    extent: new Extent( {
		                xmin: 1384251.24585599,
		                ymin: 460978.995855999,
		                xmax: 1537013.50075424,
		                ymax: 660946.333333335,
		                spatialReference: { wkid: 2264 }
	                } ),
                    popup: {
                        defaultPopupTemplateEnabled: false,
                        includeDefaultActions: false,
                        dockEnabled: true,
                        dockOptions: {
                            buttonEnabled: false,
                            breakpoint: false,
                            position: "top-right"
                        }

                    } 
		        
                } )

                _this.popup = _this.map_view.popup
                _this.popup.visibleElements = {
                    closeButton: false
                
                }

                _this.map_view.ui.remove( "attribution" )
                _this.map_view.on( "click", _this.mapSearch )

                // Display the loading indicator when the view is updating
                //watchUtils.whenTrue( _this.map_view, "updating", function( evt ){
                //    _this.hidden = false
                
                //} )

                // Hide the loading indicator when the view stops updating
                //watchUtils.whenFalse( _this.map_view, "updating", function( evt ){
                //    _this.hidden = true
                
                //} )

                if( _this.stcode ){
                    _this.highlightFeatures( )
                
                }

            },

            highlightFeatures( ){
                const _this = this

                axios.all( [ 
					_this.road_layer.when( ( ) => {
                        var query = _this.road_layer.createQuery( )
                        query.where = "lstreetcode = " + _this.stcode + " or rstreetcode = " + _this.stcode
                        return _this.road_layer.queryFeatures( query )
                    } ),
                    _this.addr_layer.when( ( ) => {
                        var query = _this.addr_layer.createQuery( )
                        query.where = "county_street_code = " + _this.stcode
                        return _this.addr_layer.queryFeatures( query )

                    } )

				] )
				.then( axios.spread( ( road_results, addr_results ) => {
                    let features = [ ]

					const road_features = road_results.features.map( function( graphic ){
                            graphic.symbol = {
                                type: "simple-line", // autocasts as new SimpleLineSymbol()
                                color: [ 47, 204, 110 ] , // RGB color values as an array
                                width: 4
                            };
                            return graphic

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
                            return graphic

                        } ); 

                    features.push( ...road_features, ...addr_features )

                    _this.sel_layer.removeAll( )
                    _this.sel_layer.addMany( features )
                    _this.map_view.goTo( features )
                    _this.hidden = true
            
        		} ) )
        		.catch( ex => {
          			console.log( "parsing failed", ex )

        		} )
            
            },

            mapSearch( event ){
                const _this = this,
                    url = _this.ws.gis + "v1/intersect_point/streets_ln/" + event.mapPoint.x + "," + event.mapPoint.y + ",2264",
					params = {
            			columns: "lstreetcode, rstreetcode",
                        geom_column: "shape",
                        distance: "50"
			    	}

                
                _this.hidden = false
                _this.axios_inst.get( `${ url }?${ JSONToURL( params ) }` )
                    .then( function( response ){
                        return response.data

                    } )
                    .then( streets_data => { 
                        if( streets_data.length > 0 ){
                            _this.popup.open( {
                                title: "Popup dock positions",
                                content: "Use the control in the center of the map to change the location where the popup will dock."
                            } )
                            //push URL hash
                            _this.$router.push( { name: "Detail", params: { stcode: streets_data[ 0 ].lstreetcode } } )

                            

                        }
                                        
                    } )
                    .catch( thrown => {
                        console.log( "parsing failed", thrown )
                        _this.hidden = !_this.hidden
                
                    } )


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

    #loading {
        margin: 0;
        position: absolute;
        top: 20px;
        right: 20px;
    }

</style>