import axios from "axios"
import store from "../store"
import JSONToURL from "./jsontourl"
import Graphic from "@arcgis/core/Graphic"

export default async function getLineGeomFromPostGIS( stcode ){
	const axios_inst = axios.create( { 
			headers: { 
				"Cache-Control": "max-age=0, no-cache, no-store",
				"Pragma": "no-cache"  
			
            }
	  	
        } ),
	  	url = store.getters[ "ws" ].gis + "v1/query/streets_ln",
		getParams = ( stcode ) => {
			return {
				columns: "ST_AsText( shape ) as geom",
                filter: "lstreetcode = " + stcode + " or rstreetcode = " + stcode 
			
            }
		
		},
        getPaths = ( geomtxt ) => {
            return geomtxt
                .replace( /multilinestring|linestring|\)|\(/ig, '' )
                .trim( )
                .replace( /,\s|,/g, '!' )
                .replace( /\s/g, ',' )
                .split( '!' )

        },
		response = await axios_inst.get( `${ url }?${ JSONToURL( getParams( stcode ) ) }` );


    let line_features = [ ]

    if( response.data.length > 0 ){
        response.data.forEach( segment => {
            console.log( getPaths( segment.geom ) )
            line_features.push( 
                new Graphic( {
                    geometry: {
                            type: "polyline",
                            paths: getPaths( segment.geom ),
                            spatialReference: { wkid: 2264 }

                        },
                    symbol: {
                            type: "simple-line", // autocasts as new SimpleLineSymbol()
                            color: [ 47, 204, 110 ] , // RGB color values as an array
                            width: 4
                        
                        }

                } )
            
            )

        } )

    }	
    
    return line_features

}