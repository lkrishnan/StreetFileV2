import axios from "axios"
import store from "../store"
import JSONToURL from "./jsontourl"

export default async function infoByStCode( oid ){
	const axios_inst = axios.create( { 
			headers: { 
				"Cache-Control": "max-age=0, no-cache, no-store",
				"Pragma": "no-cache"  
			}
	  	} ),
	  	url = store.getters[ "ws" ].adm + "v1/query/streetfileall",
		params = {
				columns: "objectid, countystcode, admkey, preaddrnum, streetname, streettype, standtype, addrnumsuf, municipality, lowerblock, upperblock, oldmunicipality, aliaslegalflag, editedagency, citystcode, directions, staccess, addrnumbers, parcelsattached, stcontinuous, roadtype, comments, reason",
				filter: "objectid = " + oid
			  
			},
		response = await axios_inst.get( `${ url }?${ JSONToURL( params ) }` );

	return response.data

}