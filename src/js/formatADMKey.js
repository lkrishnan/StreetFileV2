export default function formatADMKey( preaddrnum, streetname, streettype, addrnumsuf, municipality, staccess, roadtype, aliaslegalflag ){
	return ( ( preaddrnum ? preaddrnum + ' ' : '' ) +  streetname + ( streetname ? ' ' : '' ) + ( streettype ? streettype + ' ' : '' ) +
		( addrnumsuf ? addrnumsuf + ' ' : '' ) + ( municipality ? ': ' + municipality : '' ) + ( staccess == 'PVT' ? ' (PVT)' : '' ) 
		+ ( roadtype === 'NamedDriveway' ? '-DWY' : '' ) + ( aliaslegalflag === 'A' ? '-A' : '' ) ).trim( ); 

}