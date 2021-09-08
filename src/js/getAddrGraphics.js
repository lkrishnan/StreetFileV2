import axios from "axios"
import store from "../store"
import JSONToURL from "./jsontourl"
import Graphic from "@arcgis/core/Graphic"

export default async function getAddrGraphics( stcode ){
	const axios_inst = axios.create( { 
			headers: { 
				"Cache-Control": "max-age=0, no-cache, no-store",
				"Pragma": "no-cache"  
			
            }
	  	
        } ),
	  	url = store.getters[ "ws" ].gis + "v1/query/masteraddress_pt",
		getParams = ( stcode ) => {
			return {
				columns: "ST_X( shape ) as x, ST_Y( shape ) as y",
                filter: "county_street_code = " + stcode 
			
            }
		
		},
		response = await axios_inst.get( `${ url }?${ JSONToURL( getParams( stcode ) ) }` ),
        grphs = response.data.map( pt => {
            return new Graphic( {
                geometry: {
                    type: "point",
                    x: pt.x, 
                    y: pt.y,
                    spatialReference: { wkid: 2264 }

                },
                symbol: {
                    type: "simple-marker", // autocasts as new SimpleLineSymbol()
                    color: [ 47, 204, 110 ], // RGB color values as an array
                    size: 5,
                    outline: {  // autocasts as new SimpleLineSymbol()
                        width: 1,
                        color: [ 47, 204, 110 ]
                    }
                    
                }

            } )

        } )

    return grphs

}