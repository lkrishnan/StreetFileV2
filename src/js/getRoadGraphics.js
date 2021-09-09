import axios from "axios"
import store from "../store"
import JSONToURL from "./jsontourl"
import Graphic from "@arcgis/core/Graphic"

export default async function getRoadGraphics( stcode ){
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
        getPath = ( geomtxt ) => {
            return geomtxt
                    .replace( /multilinestring|linestring|\)|\(/ig, '' )
                    .trim( )
                    .split( ',' )
                    .map( coord => {
                        return coord.split( " " ).map( Number )
        
                    } )
        },
		response = await axios_inst.get( `${ url }?${ JSONToURL( getParams( stcode ) ) }` ),
        paths = response.data.map( raw_path => { 
            return getPath( raw_path.geom )

        } ),
        grph = new Graphic( {
            geometry: {
                type: "polyline",
                paths: paths,
                spatialReference: { wkid: 2264 }

            },
            symbol: {
                type: "simple-line", // autocasts as new SimpleLineSymbol()
                color: [ 47, 204, 110 ] , // RGB color values as an array
                width: 4

            }

        } ) 

    return grph

}