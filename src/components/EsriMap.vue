<template>
    <v-card class="my-5">
        <div id="map">
            <div id="top_right" v-show="!top_right_hidden">
                
                        <v-card 
                            class="pa-5 ml-5" 
                            top   
                            right
                            absolute
                        >
                            <v-select
                                v-model="stcode_selection"
                                :items="streetcodes"
                                menu-props="auto"
                                label="Select Street Name"
                                single-line>
                            </v-select>
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
    import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer"
    import TileLayer from "@arcgis/core/layers/TileLayer"
    import MapImageLayer from "@arcgis/core/layers/MapImageLayer"
    import Extent from "@arcgis/core/geometry/Extent"
    import esriConfig from "@arcgis/core/config"
    import axios from "axios"
    import JSONToURL from "../js/jsontourl"
    import GetAddrGraphics from "../js/getAddrGraphics"
    import GetRoadGraphics from "../js/getRoadGraphics"
    
    export default {
        name: "themap",
        mounted: function( ){
            //set the assets path. very important for ESRI JSAPI to load controls properly
            esriConfig.assetsPath = ( process.env.NODE_ENV == "development" ? "/assets" : "./assets" )
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
            top_right_hidden: true,
            select: { state: 'Florida', abbr: 'FL' },
            items: [
                { state: 'Florida', abbr: 'FL' },
                { state: 'Georgia', abbr: 'GA' },
                { state: 'Nebraska', abbr: 'NE' },
                { state: 'California', abbr: 'CA' },
                { state: 'New York', abbr: 'NY' },
            ],
            streetcodes: [ ]
        
        } ),
        computed: {
            ws( ){
                return this.$store.state.ws
            
            },
            stcode( ){
                return this.$route.params.stcode			

            },
            stcode_selection: {
				set( stcode_selection ){
                    console.log( "here" )
					this.$router.push( { name: "Detail", params: { stcode: stcode_selection } } )
					
				},
      			get( ){
					return this.$route.params.stcode
      			
				}

			}
            
        },
        watch: {
            stcode: "highlightFeatures"
        
        },
        methods: {
            initMap( ){
                const _this = this;
                    
                _this.map = new Map( {
                    layers: [ _this.basemap, _this.addr_map_layer, _this.sel_layer ] 
                    
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
	                } )
                    		        
                } )

                _this.map_view.ui.remove( "attribution" )
                _this.map_view.on( "click", _this.mapSearch )

                if( _this.stcode ){
                    _this.highlightFeatures( )
                
                }

            },

            async highlightFeatures( ){
                const _this = this,
                    grphs = [ ...await GetAddrGraphics( _this.stcode ), await GetRoadGraphics( _this.stcode ) ]

                _this.sel_layer.removeAll( )
                _this.sel_layer.addMany( grphs )
                
                _this.map_view.goTo( grphs )
                
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
                        _this.hidden = true

                        if( streets_data.length > 0 ){
                            if( streets_data[ 0 ].lstreetcode != streets_data[ 0 ].rstreetcode ){
                                const streetfile_url = _this.ws.gis + "v1/query/streetfile_tb",
					                streetfile_params = {
            			                columns: "admkey, countystcode",
                                        filter: "countystcode in ('" + streets_data[ 0 ].lstreetcode + "', '" + streets_data[ 0 ].rstreetcode + "' )"
			    	                }

                                _this.axios_inst.get( `${ streetfile_url }?${ JSONToURL( streetfile_params ) }` )
                                    .then( function( response ){
                                        return response.data

                                    } )
                                    .then( streetfile_data => {
                                        _this.streetcodes = streetfile_data.map( row => {
                                            return { value: row.countystcode, text: row.admkey }

                                        } )
                                        
                                        _this.top_right_hidden = false

                                    } )
                                    .catch( thrown => {
                                        console.log( "parsing failed", thrown )
                                        _this.hidden = !_this.hidden
                
                                    } ) 
                                
                            }else{
                                _this.top_right_hidden = true

                                //push URL hash
                                _this.$router.push( { name: "Detail", params: { stcode: streets_data[ 0 ].lstreetcode } } )

                            }

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

    #top_right {
        margin: 0;
        position: absolute;
        top: 20px;
        right: 20px;
    }

</style>