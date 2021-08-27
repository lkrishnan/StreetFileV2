import axios from "axios"
import store from "../store"
import JSONToURL from "./jsontourl"

export default async function infoByStCode( stcode ){
	const axios_inst = axios.create( { 
			headers: { 
				"Cache-Control": "max-age=0, no-cache, no-store",
				"Pragma": "no-cache"  
			}
	  	} ),
	  	url = store.getters[ "ws" ].adm + "v1/query/streetfileall",
		getParams = ( stcode, aliaslegalflag ) => {
			return {
				columns: "objectid, countystcode, admkey, preaddrnum, streetname, streettype, standtype, addrnumsuf, municipality, lowerblock, upperblock, oldmunicipality, aliaslegalflag, editedagency, citystcode, directions, staccess, addrnumbers, parcelsattached, stcontinuous, roadtype, comments, reason, created_user, created_date, last_edited_user, last_edited_date, last_edited_agency",
				filter: "countystcode = '" + stcode + "' and aliaslegalflag = '" + aliaslegalflag + "'"
			  }
		
			},
		response = await axios.all( [
			axios_inst.get( `${ url }?${ JSONToURL( getParams( stcode, "L" ) ) }` ),
			axios_inst.get( `${ url }?${ JSONToURL( getParams( stcode, "A" ) ) }` )
	 	] );

	return {  
		legal: response[ 0 ].data, 
		alias: response[ 1 ].data
	}

}