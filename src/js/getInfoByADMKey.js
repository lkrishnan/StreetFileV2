import axios from "axios"
import store from "../store"
import JSONToURL from "./jsontourl"

export default async function infoByADMKey( admkey, aliaslegalflag ){
	const axios_inst = axios.create( { 
			headers: { 
				"Cache-Control": "max-age=0, no-cache, no-store",
				"Pragma": "no-cache"  
			}
	  	} ),
	  	url = store.getters[ "ws" ].adm + "v1/query/streetfileall",
		getParams = ( admkey, aliaslegalflag ) => {
			return {
				columns: "countystcode, lowerblock, upperblock",
				filter: "admkey = '" + admkey + "' and aliaslegalflag = '" + aliaslegalflag + "'"
			  }
		
			},
		response = await axios_inst.get( `${ url }?${ JSONToURL( getParams( admkey, aliaslegalflag ) ) }` );

	return response.data

}