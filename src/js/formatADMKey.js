export default function formatADMKey( preaddrnum, streetname, streettype, addrnumsuf, municipality, staccess, roadtype ){
	return ( ( preaddrnum ? preaddrnum + ' ' : '' ) +  streetname + ( streetname ? ' ' : '' ) + ( streettype ? streettype + ' ' : '' ) +
		( addrnumsuf ? addrnumsuf + ' ' : '' ) + ( municipality ? ': ' + municipality : '' ) + ( staccess == 'PVT' ? ' (PVT)' : '' ) 
		+ ( roadtype === 'NamedDriveway' ? '-DWY' : '' ) ).trim( ); 

}